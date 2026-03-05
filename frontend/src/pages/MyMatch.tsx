import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { swissPoints, type Player } from '../mockData'
import Rules from '../components/Rules'
import './MyMatch.css'

// ── Mock data ────────────────────────────────────

const ME = { name: 'Alex K.', rank: 1 }

const OPPONENT: Player & { rank: number } = {
  id: '4',
  name: 'Sarah L.',
  rank: 4,
  wins: 3,
  losses: 2,
  draws: 1,
  pointsScored: 148,
  pointsConceded: 142,
}

type MatchStatus =
  | 'not_submitted'
  | 'i_submitted'
  | 'they_submitted'
  | 'confirmed'
  | 'disputed'

interface Score { me: number; opponent: number }

interface Message {
  id: number
  sender: 'me' | 'them'
  text: string
  time: string
}

const INITIAL_MESSAGES: Message[] = [
  { id: 1, sender: 'them', text: 'Hey! When are you free to play?',          time: '10:32' },
  { id: 2, sender: 'me',   text: 'How about Thursday after 5pm?',            time: '10:45' },
  { id: 3, sender: 'them', text: 'Works for me! Library table tennis room?', time: '10:47' },
  { id: 4, sender: 'me',   text: 'Perfect, see you there 🏓',                 time: '10:48' },
  { id: 5, sender: 'them', text: 'I submitted our score. Please confirm!',    time: '18:23' },
]

type Tab = 'match' | 'chat'
type Modal = 'confirm' | 'dispute' | null

type PublishStatus = 'not_proposed' | 'i_proposed' | 'they_proposed' | 'published'
interface MatchDetails { date: string; location: string }

// ── Page ─────────────────────────────────────────

export default function MyMatch() {
  const navigate = useNavigate()
  const [tab, setTab]               = useState<Tab>('match')
  const [status, setStatus]         = useState<MatchStatus>('they_submitted')
  const [submittedScore, setSubmittedScore] = useState<Score>({ me: 9, opponent: 11 })
  const [showForm, setShowForm]     = useState(false)
  const [modal, setModal]           = useState<Modal>(null)
  const [messages, setMessages]     = useState<Message[]>(INITIAL_MESSAGES)
  const [publishStatus, setPublishStatus] = useState<PublishStatus>('they_proposed')
  const [matchDetails, setMatchDetails]   = useState<MatchDetails>({ date: 'Thu 12 Mar, 17:00', location: 'Library Table Tennis Room' })

  function sendMessage(text: string) {
    setMessages(m => [...m, {
      id: Date.now(),
      sender: 'me',
      text,
      time: new Date().toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' }),
    }])
  }

  return (
    <div className="match-page">
      <MatchHeader onBack={() => navigate('/tournament')} tab={tab} setTab={setTab} />

      {tab === 'match' && (
        <div className="match-body">
          <RoundBadge />
          <OpponentCard opponent={OPPONENT} />
          <ScoreSection
            status={status}
            score={submittedScore}
            showForm={showForm}
            setShowForm={setShowForm}
            onSubmit={(score) => { setSubmittedScore(score); setStatus('i_submitted'); setShowForm(false) }}
            onConfirm={() => setModal('confirm')}
            onDispute={() => setModal('dispute')}
            onResubmit={() => { setStatus('not_submitted'); setShowForm(true) }}
          />
          <PublishSection
            status={publishStatus}
            details={matchDetails}
            onPropose={(d) => { setMatchDetails(d); setPublishStatus('i_proposed') }}
            onConfirm={() => setPublishStatus('published')}
            onDecline={() => setPublishStatus('not_proposed')}
            onRetract={() => setPublishStatus('not_proposed')}
          />
          <Rules />
        </div>
      )}

      {modal && (
        <ConfirmModal
          type={modal}
          score={submittedScore}
          onConfirm={() => { setStatus(modal === 'confirm' ? 'confirmed' : 'disputed'); setModal(null) }}
          onCancel={() => setModal(null)}
        />
      )}

      {tab === 'chat' && (
        <Chat messages={messages} onSend={sendMessage} />
      )}
    </div>
  )
}

// ── Header ───────────────────────────────────────

function MatchHeader({ onBack, tab, setTab }: { onBack: () => void; tab: Tab; setTab: (t: Tab) => void }) {
  return (
    <header className="match-header pixel-box">
      <button className="back-btn" onClick={onBack}>&lt; BACK</button>
      <div className="match-tabs">
        <button className={`match-tab-btn ${tab === 'match' ? 'active' : ''}`} onClick={() => setTab('match')}>
          MATCH
        </button>
        <button className={`match-tab-btn ${tab === 'chat' ? 'active' : ''}`} onClick={() => setTab('chat')}>
          CHAT
        </button>
      </div>
      <span className="match-header-season">SS 2026</span>
    </header>
  )
}

// ── Round badge ──────────────────────────────────

function RoundBadge() {
  return (
    <div className="round-badge pixel-box-inset">
      <span className="round-badge-label">ROUND</span>
      <span className="round-badge-num">4 / 7</span>
    </div>
  )
}

// ── Opponent card ────────────────────────────────

function OpponentCard({ opponent: o }: { opponent: Player & { rank: number } }) {
  const pts = swissPoints(o)
  const initials = o.name.split(' ').map(w => w[0]).join('')

  return (
    <div className="opp-card pixel-box">
      <div className="opp-card-label">YOUR OPPONENT</div>
      <div className="opp-card-body">
        <div className="opp-avatar">{initials}</div>
        <div className="opp-info">
          <div className="opp-name">{o.name}</div>
          <div className="opp-meta">
            <span className="opp-rank">RANK #{o.rank}</span>
            <span className="opp-sep">·</span>
            <span className="opp-pts">{pts} PTS</span>
          </div>
          <div className="opp-record">
            <span className="rec-w">{o.wins}W</span>
            <span className="rec-sep"> · </span>
            <span className="rec-d">{o.draws}D</span>
            <span className="rec-sep"> · </span>
            <span className="rec-l">{o.losses}L</span>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Publish section ───────────────────────────────

interface PublishSectionProps {
  status: PublishStatus
  details: MatchDetails
  onPropose: (d: MatchDetails) => void
  onConfirm: () => void
  onDecline: () => void
  onRetract: () => void
}

function PublishSection(p: PublishSectionProps) {
  const [open, setOpen]         = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [date, setDate]         = useState('')
  const [location, setLocation] = useState('')
  const [err, setErr]           = useState('')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!date.trim() || !location.trim()) { setErr('Please fill in both fields.'); return }
    p.onPropose({ date: date.trim(), location: location.trim() })
    setShowForm(false)
  }

  return (
    <div className="publish-section pixel-box">
      <button className="publish-toggle" onClick={() => setOpen(o => !o)}>
        <span className="publish-label">SPECTATOR INVITE</span>
        <span className="rule-chevron">{open ? '−' : '+'}</span>
      </button>

      {open && p.status === 'not_proposed' && (
        <div className="publish-state">
          <p className="score-hint">Share your match date and location so others can come watch.</p>
          {!showForm
            ? <button className="btn-primary" onClick={() => setShowForm(true)}>PROPOSE DETAILS &gt;</button>
            : (
              <form className="publish-form pixel-box-inset" onSubmit={handleSubmit}>
                <div className="publish-field">
                  <label className="publish-field-label">DATE & TIME</label>
                  <input className="publish-input pixel-box-inset" placeholder="e.g. Thu 12 Mar, 17:00"
                    value={date} onChange={e => setDate(e.target.value)} />
                </div>
                <div className="publish-field">
                  <label className="publish-field-label">LOCATION</label>
                  <input className="publish-input pixel-box-inset" placeholder="e.g. Library TT Room"
                    value={location} onChange={e => setLocation(e.target.value)} />
                </div>
                {err && <p className="score-form-err"><span className="sym">⚠</span> {err}</p>}
                <div className="score-form-actions">
                  <button type="submit" className="btn-primary">SEND &gt;</button>
                  <button type="button" className="btn-secondary" onClick={() => { setShowForm(false); setErr('') }}>CANCEL</button>
                </div>
              </form>
            )
          }
        </div>
      )}

      {open && p.status === 'i_proposed' && (
        <div className="publish-state">
          <div className="score-submitted-label">PROPOSED BY YOU — AWAITING CONFIRMATION</div>
          <PublishDetails details={p.details} />
          <button className="btn-secondary" onClick={p.onRetract}>RETRACT</button>
        </div>
      )}

      {open && p.status === 'they_proposed' && (
        <div className="publish-state">
          <div className="score-submitted-label">PROPOSED BY {OPPONENT.name.toUpperCase()}</div>
          <PublishDetails details={p.details} />
          <div className="score-actions">
            <button className="btn-confirm" onClick={p.onConfirm}>PUBLISH</button>
            <button className="btn-dispute" onClick={p.onDecline}>DECLINE</button>
          </div>
        </div>
      )}

      {open && p.status === 'published' && (
        <div className="publish-state">
          <div className="score-confirmed-label">✓ PUBLICLY LISTED</div>
          <PublishDetails details={p.details} />
        </div>
      )}
    </div>
  )
}

function PublishDetails({ details }: { details: MatchDetails }) {
  return (
    <div className="publish-details pixel-box-inset">
      <div className="publish-detail-row">
        <span className="publish-detail-label">WHEN</span>
        <span className="publish-detail-val">{details.date}</span>
      </div>
      <div className="publish-detail-row">
        <span className="publish-detail-label">WHERE</span>
        <span className="publish-detail-val">{details.location}</span>
      </div>
    </div>
  )
}

// ── Score section ────────────────────────────────

interface ScoreSectionProps {
  status: MatchStatus
  score: Score
  showForm: boolean
  setShowForm: (v: boolean) => void
  onSubmit: (s: Score) => void
  onConfirm: () => void
  onDispute: () => void
  onResubmit: () => void
}

function ScoreSection(p: ScoreSectionProps) {
  return (
    <div className="score-section pixel-box">
      <div className="score-section-label">MATCH RESULT</div>

      {p.status === 'not_submitted' && (
        <div className="score-state">
          <p className="score-hint">No score submitted yet.</p>
          <button className="btn-primary" onClick={() => p.setShowForm(true)}>SUBMIT RESULT &gt;</button>
        </div>
      )}

      {p.status === 'i_submitted' && (
        <div className="score-state">
          <div className="score-submitted-label">SUBMITTED BY YOU — AWAITING CONFIRMATION</div>
          <ScoreDisplay score={p.score} />
          <p className="score-hint">Waiting for {OPPONENT.name} to confirm.</p>
        </div>
      )}

      {p.status === 'they_submitted' && (
        <div className="score-state">
          <div className="score-submitted-label">SUBMITTED BY {OPPONENT.name.toUpperCase()}</div>
          <ScoreDisplay score={p.score} />
          <div className="score-actions">
            <button className="btn-confirm" onClick={p.onConfirm}>CONFIRM</button>
            <button className="btn-dispute" onClick={p.onDispute}>DISPUTE</button>
          </div>
        </div>
      )}

      {p.status === 'confirmed' && (
        <div className="score-state">
          <div className="score-confirmed-label">✓ RESULT CONFIRMED</div>
          <ScoreDisplay score={p.score} />
        </div>
      )}

      {p.status === 'disputed' && (
        <div className="score-state">
          <div className="score-disputed-label">✗ RESULT DISPUTED</div>
          <p className="score-hint">You disputed the score. Discuss in the chat and resubmit.</p>
          <button className="btn-primary" onClick={p.onResubmit}>RESUBMIT RESULT &gt;</button>
        </div>
      )}

      {p.showForm && <ScoreForm onSubmit={p.onSubmit} onCancel={() => p.setShowForm(false)} />}
    </div>
  )
}

function ScoreDisplay({ score }: { score: Score }) {
  const iWon = score.me > score.opponent
  return (
    <div className="score-display">
      <div className={`score-player ${iWon ? 'score-winner' : 'score-loser'}`}>
        <span className="score-pname">{ME.name}</span>
        <span className="score-num">{score.me}</span>
      </div>
      <span className="score-colon">:</span>
      <div className={`score-player right ${!iWon ? 'score-winner' : 'score-loser'}`}>
        <span className="score-num">{score.opponent}</span>
        <span className="score-pname">{OPPONENT.name}</span>
      </div>
    </div>
  )
}

function ScoreForm({ onSubmit, onCancel }: { onSubmit: (s: Score) => void; onCancel: () => void }) {
  const [me, setMe]               = useState('')
  const [opponent, setOpponent]   = useState('')
  const [err, setErr]             = useState('')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const s1 = parseInt(me), s2 = parseInt(opponent)
    if (isNaN(s1) || isNaN(s2) || s1 < 0 || s2 < 0) { setErr('Enter valid scores.'); return }
    if (s1 === s2) { setErr('Scores cannot be equal.'); return }
    onSubmit({ me: s1, opponent: s2 })
  }

  return (
    <form className="score-form pixel-box-inset" onSubmit={handleSubmit}>
      <div className="score-form-label">ENTER SCORE</div>
      <div className="score-inputs">
        <div className="score-input-group">
          <label className="score-input-label">{ME.name}</label>
          <input className="score-input pixel-box-inset" type="number" min="0" max="99"
            value={me} onChange={e => setMe(e.target.value)} placeholder="0" />
        </div>
        <span className="score-input-sep">:</span>
        <div className="score-input-group">
          <label className="score-input-label">{OPPONENT.name}</label>
          <input className="score-input pixel-box-inset" type="number" min="0" max="99"
            value={opponent} onChange={e => setOpponent(e.target.value)} placeholder="0" />
        </div>
      </div>
      {err && <p className="score-form-err"><span className="sym">⚠</span> {err}</p>}
      <div className="score-form-actions">
        <button type="submit" className="btn-primary">SUBMIT &gt;</button>
        <button type="button" className="btn-secondary" onClick={onCancel}>CANCEL</button>
      </div>
    </form>
  )
}

// ── Confirm / Dispute modal ───────────────────────

function ConfirmModal({ type, score, onConfirm, onCancel }: {
  type: 'confirm' | 'dispute'
  score: Score
  onConfirm: () => void
  onCancel: () => void
}) {
  const isConfirm = type === 'confirm'
  return (
    <div className="modal-backdrop" onClick={onCancel}>
      <div className="modal pixel-box" onClick={e => e.stopPropagation()}>
        <div className={`modal-icon ${isConfirm ? 'icon-confirm' : 'icon-dispute'}`}>
          {isConfirm ? '✓' : '✗'}
        </div>
        <div className="modal-title">
          {isConfirm ? 'CONFIRM RESULT?' : 'DISPUTE RESULT?'}
        </div>
        <div className="modal-score">
          <span className={score.me > score.opponent ? 'modal-score-hi' : 'modal-score-lo'}>{score.me}</span>
          <span className="modal-score-sep">:</span>
          <span className={score.opponent > score.me ? 'modal-score-hi' : 'modal-score-lo'}>{score.opponent}</span>
        </div>
        <p className="modal-desc">
          {isConfirm
            ? 'This will lock in the result. You cannot undo this.'
            : 'This will flag the result as disputed. Use the chat to agree on the correct score.'}
        </p>
        <div className="modal-actions">
          <button className="btn-secondary" onClick={onCancel}>CANCEL</button>
          <button className={isConfirm ? 'btn-confirm' : 'btn-dispute'} onClick={onConfirm}>
            {isConfirm ? 'CONFIRM' : 'DISPUTE'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Chat (full-height, no outer scroll) ──────────

function Chat({ messages, onSend }: { messages: Message[]; onSend: (t: string) => void }) {
  const [input, setInput] = useState('')
  const bottomRef         = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'instant' })
  }, [messages])

  function handleSend(e: React.FormEvent) {
    e.preventDefault()
    if (!input.trim()) return
    onSend(input.trim())
    setInput('')
  }

  return (
    <div className="chat-view">
      <div className="chat-messages">
        {messages.map(m => (
          <div key={m.id} className={`chat-msg ${m.sender === 'me' ? 'msg-me' : 'msg-them'}`}>
            <div className="msg-bubble pixel-box">
              <span className="msg-text">{m.text}</span>
            </div>
            <span className="msg-time">{m.time}</span>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
      <form className="chat-input-row pixel-box" onSubmit={handleSend}>
        <input
          className="chat-input pixel-box-inset"
          type="text"
          placeholder="TYPE A MESSAGE..."
          value={input}
          onChange={e => setInput(e.target.value)}
        />
        <button type="submit" className="chat-send-btn btn-primary">&gt;</button>
      </form>
    </div>
  )
}
