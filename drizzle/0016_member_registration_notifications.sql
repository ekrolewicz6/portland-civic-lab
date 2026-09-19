-- Email the Lab inbox each time a new member registers.
-- Reuses the durable intake_notifications queue from 0015: the trigger enqueues
-- in the same transaction as the members insert, the auth callback attempts
-- delivery right away, and /api/cron/retry-notifications retries anything left.
-- Requires 0015.

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
  IF TG_TABLE_NAME = 'members' THEN
    -- Identity provider ids and avatar URLs are not useful in an inbox.
    notification_payload := notification_payload - 'workos_user_id' - 'avatar_url' - 'last_seen_at';
  END IF;
  INSERT INTO intake_notifications (source, source_id, payload)
  VALUES (TG_TABLE_NAME, NEW.id::text, notification_payload)
  ON CONFLICT (source, source_id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS member_registration_notification ON members;
CREATE TRIGGER member_registration_notification AFTER INSERT ON members
FOR EACH ROW EXECUTE FUNCTION enqueue_intake_notification();
