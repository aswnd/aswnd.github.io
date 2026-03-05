import { useState } from 'react'

const RULES = [
  {
    q: 'HOW DOES THE TOURNAMENT WORK?',
    a: 'We use a Swiss-system format. Every round you are paired against a player with a similar record. After all Swiss rounds, the top 8 advance to a single-elimination bracket. The winner receives 50 EUR in cash.',
  },
  {
    q: 'HOW MANY GAMES DO I PLAY PER ROUND?',
    a: 'One official game per round — best of 1. You are welcome to warm up or play extra games for fun, but you must agree with your opponent which single game counts as the official result before you play it.',
  },
  {
    q: 'WHAT ARE THE SCORING RULES?',
    a: 'Standard table tennis rules apply: first to 11 points wins, with a 2-point lead required. No draws — one player must win.',
  },
  {
    q: 'HOW DO I SUBMIT A RESULT?',
    a: 'Go to MY MATCH, enter the final score, and submit. Your opponent then confirms or disputes the result. Both players must agree before the result is locked in.',
  },
  {
    q: 'WHAT HAPPENS IF WE DISAGREE ON THE SCORE?',
    a: 'Either player can dispute a submitted result. Use the in-app chat to discuss and agree on the correct score, then resubmit. Unresolved disputes are escalated to the tournament organiser.',
  },
  {
    q: 'WHAT IS THE DEADLINE FOR EACH ROUND?',
    a: 'Each round lasts 7 days. Both players must submit and confirm a result before the deadline. Failure to play without notifying the organiser may result in a walkover for your opponent.',
  },
  {
    q: 'WHERE CAN I PLAY?',
    a: 'Anywhere with a table tennis table — the library table tennis room, the sports hall, or any other venue you both agree on. You arrange the time and place between yourselves via the chat.',
  },
  {
    q: 'WHAT INFORMATION IS SHARED WITH OTHER PLAYERS?',
    a: 'Only your display name and optional profile picture are visible to other players. Your email address and any other personal details remain private. Chat is only available between players who are paired against each other in the current round — you cannot message anyone else.',
  },
]

export default function Rules() {
  const [open, setOpen] = useState<number | null>(null)

  return (
    <div className="rules pixel-box">
      <h2 className="rules-title">RULES & FAQ</h2>
      <div className="rules-list">
        {RULES.map((r, i) => (
          <div key={i} className={`rule-item ${open === i ? 'open' : ''}`}>
            <button className="rule-q" onClick={() => setOpen(open === i ? null : i)}>
              <span className="rule-q-text">{r.q}</span>
              <span className="rule-chevron">{open === i ? '−' : '+'}</span>
            </button>
            {open === i && <p className="rule-a">{r.a}</p>}
          </div>
        ))}
      </div>
    </div>
  )
}
