import React, { useEffect, useState } from 'react';
import { AdminPage } from '../ui/AdminUI';
import API_BASE from '../../../utils/api';

/* Contact-form enquiries. Before this page existed the messages were written and never
   read by anyone. Reads the API when it is up, otherwise the browser copy the contact
   form saved (cb_demo_messages), so the flow is visible either way. */

const DEMO_KEY = 'cb_demo_messages';

const readDemo = () => {
  try { return JSON.parse(localStorage.getItem(DEMO_KEY) || '[]'); } catch (e) { return []; }
};
const writeDemo = (list) => {
  try { localStorage.setItem(DEMO_KEY, JSON.stringify(list)); } catch (e) {}
};

const TOPIC_LABEL = { buy: 'Buy a car', sell: 'Sell my car', testdrive: 'Test drive', support: 'Support' };

const Messages = () => {
  const [messages, setMessages] = useState([]);
  const [open, setOpen] = useState(null);   // the message being replied to
  const [reply, setReply] = useState('');

  const load = () => {
    fetch(`${API_BASE}/messages`)
      .then((r) => { if (!r.ok) throw new Error('api'); return r.json(); })
      .then((d) => setMessages(Array.isArray(d) ? d : []))
      .catch(() => setMessages(readDemo().slice().reverse()));   // newest first
  };

  useEffect(load, []);

  const setStatus = (m, status, replyText) => {
    fetch(`${API_BASE}/messages/${m._id}`, {
      method: 'PUT', headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ status, reply: replyText }),
    })
      .then((r) => { if (!r.ok) throw new Error('api'); return r.json(); })
      .catch(() => {                                   // demo: update the local copy
        const all = readDemo().map((x) => (x.at === m.at ? { ...x, status, reply: replyText } : x));
        writeDemo(all);
      })
      .finally(() => {
        setMessages((list) => list.map((x) => (x === m ? { ...x, status, reply: replyText } : x)));
        setOpen(null); setReply('');
      });
  };

  const remove = (m) => {
    if (!window.confirm('Delete this message?')) return;
    fetch(`${API_BASE}/messages/${m._id}`, { method: 'DELETE' })
      .then((r) => { if (!r.ok) throw new Error('api'); return r.json(); })
      .catch(() => writeDemo(readDemo().filter((x) => x.at !== m.at)))
      .finally(() => setMessages((list) => list.filter((x) => x !== m)));
  };

  const mailto = (m) => {
    const subject = `Re: your enquiry to Car Bazar (${TOPIC_LABEL[m.topic] || 'general'})`;
    const body = `Hi ${(m.name || '').split(' ')[0] || 'there'},\n\n${reply}\n\n—\nCar Bazar · +01 345 97637`;
    return `mailto:${m.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const openCount = messages.filter((m) => (m.status || 'new') === 'new').length;

  return (
    <AdminPage title="Messages" subtitle={`${messages.length} enquiry${messages.length === 1 ? '' : 's'} · ${openCount} unanswered`}>
      <div className="ad-table-wrap">
        <table className="ad-table">
          <thead><tr><th>From</th><th>Topic</th><th>Message</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>
            {messages.length === 0 ? (
              <tr><td colSpan="5"><div className="ad-empty"><span className="ic">✉️</span>No messages yet.</div></td></tr>
            ) : messages.map((m, i) => (
              <tr key={m._id || m.at || i}>
                <td>
                  <b>{m.name}</b><br />
                  <a href={`mailto:${m.email}`} style={{ fontSize: '.8rem' }}>{m.email}</a>
                  {m.phone ? <><br /><span style={{ color: '#8b93a3', fontSize: '.78rem' }}>{m.phone}</span></> : null}
                </td>
                <td><span className="ad-pill">{TOPIC_LABEL[m.topic] || m.topic || '—'}</span></td>
                <td style={{ maxWidth: 380 }}>
                  <span style={{ fontSize: '.84rem', lineHeight: 1.5 }}>{m.message}</span>
                  <br /><span style={{ color: '#8b93a3', fontSize: '.75rem' }}>
                    {(m.createdAt || m.at || '').slice(0, 16).replace('T', ' ')}
                  </span>
                  {m.reply && (
                    <div className="ad-reply"><b>Replied:</b> {m.reply}</div>
                  )}
                </td>
                <td>
                  <span className={`ad-pill ${(m.status || 'new') === 'new' ? 'pending' : 'approved'}`}>
                    {(m.status || 'new') === 'new' ? 'New' : 'Replied'}
                  </span>
                </td>
                <td style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  <button className="cb-btn cb-btn-amber" style={{ padding: '7px 14px', fontSize: '.8rem' }}
                    onClick={() => { setOpen(m); setReply(''); }}>Reply</button>
                  <button className="cb-btn cb-btn-dark" style={{ padding: '7px 14px', fontSize: '.8rem' }}
                    onClick={() => remove(m)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {open && (
        <div className="ad-modal" role="dialog" aria-modal="true" onClick={(e) => { if (e.target === e.currentTarget) setOpen(null); }}>
          <div className="ad-modal-card">
            <h3>Reply to {open.name}</h3>
            <p className="ad-modal-sub">{open.email} · {TOPIC_LABEL[open.topic] || open.topic}</p>
            <blockquote className="ad-quote">{open.message}</blockquote>
            <textarea rows="5" value={reply} onChange={(e) => setReply(e.target.value)}
              placeholder="Type your answer — it opens in your email app, and the enquiry is marked as replied." />
            <div className="ad-modal-actions">
              <a className="cb-btn cb-btn-amber" href={mailto(open)} target="_blank" rel="noreferrer"
                onClick={() => setStatus(open, 'replied', reply)}>
                <i className="fas fa-paper-plane" /> Send by email
              </a>
              <button type="button" className="cb-btn cb-btn-dark" onClick={() => setStatus(open, 'replied', reply)}>
                Mark as replied
              </button>
              <button type="button" className="ad-linkbtn" onClick={() => setOpen(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </AdminPage>
  );
};

export default Messages;
