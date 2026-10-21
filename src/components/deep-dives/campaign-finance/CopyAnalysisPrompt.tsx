'use client';
import { useRef, useState } from 'react';
import s from './downloads.module.css';

export default function CopyAnalysisPrompt({ prompt }: { prompt: string }) {
  const field = useRef<HTMLTextAreaElement>(null);
  const [message, setMessage] = useState('');
  return <div className={s.prompt}>
    <label htmlFor="finance-analysis-prompt">Copy this into your AI tool, then add your question</label>
    <textarea id="finance-analysis-prompt" ref={field} readOnly value={prompt} rows={7} />
    <button type="button" onClick={async () => {
      try { await navigator.clipboard.writeText(prompt); setMessage('Prompt copied.'); }
      catch { field.current?.focus(); field.current?.select(); setMessage('Prompt selected. Copy it with your keyboard or device menu.'); }
    }}>Copy analysis prompt</button>
    <span role="status" aria-live="polite">{message}</span>
  </div>;
}
