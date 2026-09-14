-- Durable private notifications for all submissions to the Lab.
-- Triggers enqueue in the same transaction as the original submission.
CREATE TABLE IF NOT EXISTS intake_notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  source text NOT NULL,
  source_id text NOT NULL,
  payload jsonb NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','sending','sent','failed')),
  attempts integer NOT NULL DEFAULT 0,
  next_attempt_at timestamptz NOT NULL DEFAULT now(),
  first_attempt_at timestamptz,
  request_payload jsonb,
  provider text,
  provider_id text,
  accepted_at timestamptz,
  last_error text,
  UNIQUE (source, source_id)
);
ALTER TABLE intake_notifications ENABLE ROW LEVEL SECURITY;
CREATE INDEX IF NOT EXISTS intake_notifications_pending_idx ON intake_notifications (next_attempt_at) WHERE status IN ('pending','sending');

CREATE OR REPLACE FUNCTION enqueue_intake_notification() RETURNS trigger
LANGUAGE plpgsql AS $$
DECLARE
  notification_payload jsonb;
  sender_email text;
BEGIN
  notification_payload := to_jsonb(NEW) - 'client_ip' - 'user_agent' - 'raw_payload';
  IF TG_TABLE_NAME = 'topic_proposals' THEN
    SELECT email INTO sender_email FROM members WHERE id = NEW.member_id;
    notification_payload := notification_payload || jsonb_build_object('email', sender_email);
  END IF;
  INSERT INTO intake_notifications (source, source_id, payload)
  VALUES (TG_TABLE_NAME, NEW.id::text, notification_payload)
  ON CONFLICT (source, source_id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS contact_notification ON contact_submissions;
CREATE TRIGGER contact_notification AFTER INSERT ON contact_submissions
FOR EACH ROW EXECUTE FUNCTION enqueue_intake_notification();
DROP TRIGGER IF EXISTS flag_notification ON data_flags;
CREATE TRIGGER flag_notification AFTER INSERT ON data_flags
FOR EACH ROW EXECUTE FUNCTION enqueue_intake_notification();
DROP TRIGGER IF EXISTS proposal_notification ON topic_proposals;
CREATE TRIGGER proposal_notification AFTER INSERT ON topic_proposals
FOR EACH ROW EXECUTE FUNCTION enqueue_intake_notification();
DROP TRIGGER IF EXISTS application_notification ON pcb_applications;
CREATE TRIGGER application_notification AFTER INSERT ON pcb_applications
FOR EACH ROW EXECUTE FUNCTION enqueue_intake_notification();
