import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Rules from '../components/Rules'
import './Landing.css'

const TOURNAMENT_START = new Date('2026-04-01T10:00:00')
const REGISTERED_PLAYERS = 14

const VALID_DOMAINS = ['@tu-berlin.de', '@campus.tu-berlin.de']

function isUniversityEmail(email: string) {
  return VALID_DOMAINS.some(d => email.toLowerCase().endsWith(d))
}

type AuthTab = 'signin' | 'signup'

export default function Landing() {
  const [tab, setTab] = useState<AuthTab>('signup')

  return (
    <div className="landing">
      <LandingHeader />
      <Hero />
      <Countdown />
      <HowItWorks />
      <AuthSection tab={tab} setTab={setTab} />
      <Rules />
      <LandingFooter />
    </div>
  )
}

function Countdown() {
  const [timeLeft, setTimeLeft] = useState(getTimeLeft())

  function getTimeLeft() {
    const diff = TOURNAMENT_START.getTime() - Date.now()
    if (diff <= 0) return null
    return {
      days:    Math.floor(diff / 86400000),
      hours:   Math.floor((diff % 86400000) / 3600000),
      minutes: Math.floor((diff % 3600000)  / 60000),
      seconds: Math.floor((diff % 60000)    / 1000),
    }
  }

  useEffect(() => {
    const id = setInterval(() => setTimeLeft(getTimeLeft()), 1000)
    return () => clearInterval(id)
  }, [])

  const startStr = TOURNAMENT_START.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })

  return (
    <section className="countdown pixel-box">
      <p className="countdown-label">TOURNAMENT STARTS</p>
      <p className="countdown-date">{startStr.toUpperCase()}</p>
      {timeLeft ? (
        <div className="countdown-units">
          <CountUnit value={timeLeft.days}    label="DAYS" />
          <span className="countdown-sep">:</span>
          <CountUnit value={timeLeft.hours}   label="HRS" />
          <span className="countdown-sep">:</span>
          <CountUnit value={timeLeft.minutes} label="MIN" />
          <span className="countdown-sep">:</span>
          <CountUnit value={timeLeft.seconds} label="SEC" />
        </div>
      ) : (
        <p className="countdown-started">TOURNAMENT IN PROGRESS</p>
      )}
    </section>
  )
}

function CountUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="count-unit">
      <span className="count-val">{String(value).padStart(2, '0')}</span>
      <span className="count-label">{label}</span>
    </div>
  )
}

function LandingHeader() {
  const navigate = useNavigate()
  return (
    <header className="l-header pixel-box">
      <span className="l-logo-icon">🏓</span>
      <h1 className="l-logo-title">TUBNAMENT</h1>
      <span className="l-logo-season">SS 2026</span>
      <button className="l-view-btn pixel-box" onClick={() => navigate('/tournament')}>
        <span className="l-view-badge">PREVIEW</span>
        VIEW TOURNAMENT &gt;
      </button>
    </header>
  )
}

function Hero() {
  return (
    <section className="hero pixel-box">
      <p className="hero-eyebrow">TU BERLIN · TABLE TENNIS CUP</p>
      <h2 className="hero-title">SERVE.<br />SCORE.<br />CONQUER.</h2>
      <p className="hero-desc">
        The async table tennis tournament for TU Berlin students and staff.
        Play on your schedule — submit scores at your own pace — climb the rankings.
      </p>
      <div className="hero-badges">
        <span className="h-badge"><span className="sym">🏆</span> SWISS SYSTEM</span>
        <span className="h-badge"><span className="sym">📱</span> ASYNC PLAY</span>
        <span className="h-badge"><span className="sym">🎓</span> TU BERLIN ONLY</span>
        <span className="h-badge h-badge-prize"><span className="sym">💶</span> 30 EUR PRIZE</span>
      </div>
      <div className="hero-players">
        <span className="hero-players-num">{REGISTERED_PLAYERS}</span>
        <div className="hero-players-info">
          <span className="hero-players-label">PLAYERS REGISTERED</span>
          <span className="hero-players-rounds">{Math.ceil(Math.log2(REGISTERED_PLAYERS))} WEEKS OF FUN</span>
          <span className="hero-players-hint">MORE PLAYERS = MORE ROUNDS</span>
        </div>
      </div>
    </section>
  )
}

const STEPS = [
  { num: '01', title: 'SIGN UP',     desc: 'Register with your TU Berlin email and pick a display name.' },
  { num: '02', title: 'GET PAIRED',  desc: 'Each round the system matches you with someone at your level.' },
  { num: '03', title: 'PLAY',        desc: 'Arrange a game whenever it suits you both. Any table works.' },
  { num: '04', title: 'REPORT',      desc: 'Submit the score. Your opponent confirms. Rankings update.' },
]

function HowItWorks() {
  return (
    <section className="hiw">
      <h2 className="hiw-title">HOW IT WORKS</h2>
      <div className="hiw-steps">
        {STEPS.map(s => (
          <div key={s.num} className="hiw-step pixel-box">
            <span className="step-num">{s.num}</span>
            <h3 className="step-title">{s.title}</h3>
            <p className="step-desc">{s.desc}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

function AuthSection({ tab, setTab }: { tab: AuthTab; setTab: (t: AuthTab) => void }) {
  return (
    <section className="auth-section">
      <div className="auth-card pixel-box">
        <div className="auth-tabs">
          <button
            className={`auth-tab-btn ${tab === 'signup' ? 'active' : ''}`}
            onClick={() => setTab('signup')}
          >
            SIGN UP
          </button>
          <button
            className={`auth-tab-btn ${tab === 'signin' ? 'active' : ''}`}
            onClick={() => setTab('signin')}
          >
            SIGN IN
          </button>
        </div>
        {tab === 'signup' ? <SignUpForm /> : <SignInForm />}
      </div>
    </section>
  )
}

function SignUpForm() {
  const navigate = useNavigate()
  const [fields, setFields] = useState({ username: '', email: '', password: '', confirm: '' })
  const [errors, setErrors] = useState<Partial<typeof fields>>({})
  const [submitted, setSubmitted] = useState(false)

  function validate() {
    const e: Partial<typeof fields> = {}
    if (!fields.username.trim()) e.username = 'Display name is required.'
    else if (fields.username.trim().length < 2) e.username = 'At least 2 characters.'

    if (!fields.email) e.email = 'Email is required.'
    else if (!isUniversityEmail(fields.email))
      e.email = 'Must be a TU Berlin email (@tu-berlin.de or @campus.tu-berlin.de).'

    if (!fields.password) e.password = 'Password is required.'
    else if (fields.password.length < 8) e.password = 'At least 8 characters.'

    if (!fields.confirm) e.confirm = 'Please confirm your password.'
    else if (fields.confirm !== fields.password) e.confirm = 'Passwords do not match.'

    return e
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    // TODO: replace with Supabase auth.signUp()
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="auth-success">
        <p className="success-icon"><span className="sym">📧</span></p>
        <p className="success-title">CHECK YOUR EMAIL</p>
        <p className="success-desc">
          We sent a confirmation link to <strong>{fields.email}</strong>.
          Verify your address to activate your account.
        </p>
        <button className="btn-primary" onClick={() => navigate('/tournament')}>
          VIEW TOURNAMENT &gt;
        </button>
      </div>
    )
  }

  return (
    <form className="auth-form" onSubmit={handleSubmit} noValidate>
      <Field
        label="DISPLAY NAME"
        type="text"
        placeholder="e.g. Alex K."
        value={fields.username}
        error={errors.username}
        onChange={v => setFields(f => ({ ...f, username: v }))}
      />
      <Field
        label="UNIVERSITY EMAIL"
        type="email"
        placeholder="you@tu-berlin.de"
        value={fields.email}
        error={errors.email}
        onChange={v => setFields(f => ({ ...f, email: v }))}
      />
      <Field
        label="PASSWORD"
        type="password"
        placeholder="min. 8 characters"
        value={fields.password}
        error={errors.password}
        onChange={v => setFields(f => ({ ...f, password: v }))}
      />
      <Field
        label="CONFIRM PASSWORD"
        type="password"
        placeholder="repeat password"
        value={fields.confirm}
        error={errors.confirm}
        onChange={v => setFields(f => ({ ...f, confirm: v }))}
      />
      <button type="submit" className="btn-primary">CREATE ACCOUNT &gt;</button>
    </form>
  )
}

function SignInForm() {
  const navigate = useNavigate()
  const [fields, setFields] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState<Partial<typeof fields>>({})

  function validate() {
    const e: Partial<typeof fields> = {}
    if (!fields.email) e.email = 'Email is required.'
    else if (!isUniversityEmail(fields.email))
      e.email = 'Must be a TU Berlin email.'
    if (!fields.password) e.password = 'Password is required.'
    return e
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    // TODO: replace with Supabase auth.signInWithPassword()
    navigate('/tournament')
  }

  return (
    <form className="auth-form" onSubmit={handleSubmit} noValidate>
      <Field
        label="UNIVERSITY EMAIL"
        type="email"
        placeholder="you@tu-berlin.de"
        value={fields.email}
        error={errors.email}
        onChange={v => setFields(f => ({ ...f, email: v }))}
      />
      <Field
        label="PASSWORD"
        type="password"
        placeholder="your password"
        value={fields.password}
        error={errors.password}
        onChange={v => setFields(f => ({ ...f, password: v }))}
      />
      <button type="submit" className="btn-primary">SIGN IN &gt;</button>
    </form>
  )
}

function Field({
  label, type, placeholder, value, error, onChange,
}: {
  label: string
  type: string
  placeholder: string
  value: string
  error?: string
  onChange: (v: string) => void
}) {
  return (
    <div className={`field ${error ? 'has-error' : ''}`}>
      <label className="field-label">{label}</label>
      <input
        className="field-input pixel-box-inset"
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={e => onChange(e.target.value)}
        autoComplete={type === 'password' ? 'current-password' : undefined}
      />
      {error && <span className="field-error"><span className="sym">⚠</span> {error}</span>}
    </div>
  )
}

function LandingFooter() {
  return (
    <footer className="l-footer pixel-box">
      <span>TUBNAMENT &copy; 2026</span>
    </footer>
  )
}
