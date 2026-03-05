import type { EliminationMatch, EliminationRound } from '../mockData'

// ── Layout constants ─────────────────────────────
const BRACKET_H = 480   // total bracket height (px) — all columns share this
const CARD_W    = 190   // match card width (px)
const CONN_W    = 32    // connector SVG width (px)
const WINNER_W  = 130   // winner display width (px)

// ── Main component ───────────────────────────────

interface Props {
  rounds: EliminationRound[]
  onPlayerClick: (name: string) => void
}

export default function EliminationBracket({ rounds, onPlayerClick }: Props) {
  const finalMatch = rounds[rounds.length - 1].matches[0]
  const winner = getWinner(finalMatch)

  return (
    <div className="elim-scroll">
      {/* Column header labels */}
      <div className="elim-headers">
        {rounds.map((r, i) => (
          <div key={r.label} style={{ display: 'contents' }}>
            {i > 0 && <div style={{ width: CONN_W }} />}
            <div className="elim-col-label" style={{ width: CARD_W }}>{r.label}</div>
          </div>
        ))}
        <div style={{ width: CONN_W + WINNER_W }} />
      </div>

      {/* Bracket body */}
      <div className="elim-body">
        {rounds.map((r, i) => (
          <div key={r.label} style={{ display: 'contents' }}>
            {i > 0 && (
              <BracketConnector
                fromCount={rounds[i - 1].matches.length}
                toCount={r.matches.length}
              />
            )}
            <RoundColumn round={r} onPlayerClick={onPlayerClick} />
          </div>
        ))}

        {/* Winner connector: straight line at vertical center */}
        <svg width={CONN_W} height={BRACKET_H} className="elim-conn-svg">
          <line
            x1={0} y1={BRACKET_H / 2}
            x2={CONN_W} y2={BRACKET_H / 2}
            stroke="var(--border2)" strokeWidth="2"
          />
        </svg>

        {/* Winner display */}
        <WinnerDisplay name={winner} onPlayerClick={onPlayerClick} />
      </div>
    </div>
  )
}

// ── Round column ─────────────────────────────────

function RoundColumn({ round, onPlayerClick }: { round: EliminationRound; onPlayerClick: (name: string) => void }) {
  return (
    <div className="elim-round-col" style={{ height: BRACKET_H, width: CARD_W }}>
      {round.matches.map(m => (
        <div key={m.id} className="elim-slot">
          <MatchCard match={m} onPlayerClick={onPlayerClick} />
        </div>
      ))}
    </div>
  )
}

// ── Match card ───────────────────────────────────

function MatchCard({ match: m, onPlayerClick }: { match: EliminationMatch; onPlayerClick: (name: string) => void }) {
  const hasScore = m.score1 !== null && m.score2 !== null
  const p1wins   = hasScore && m.score1! > m.score2!
  const p2wins   = hasScore && m.score2! > m.score1!
  const p1tbd    = m.player1 === 'TBD'
  const p2tbd    = m.player2 === 'TBD'

  return (
    <div className={`elim-card pixel-box ${m.status}`}>
      {/* Player 1 row */}
      <div className="elim-row">
        <button
          className={`elim-name bracket-name-btn ${p1wins ? 'winner' : p2wins ? 'loser' : ''} ${p1tbd ? 'tbd' : ''}`}
          onClick={() => !p1tbd && onPlayerClick(m.player1)}
          disabled={p1tbd}
        >
          {m.player1}
          {p1wins && <span className="winner-star">★</span>}
        </button>
        <span className={`elim-score ${p1wins ? 'score-hi' : p2wins ? 'score-lo' : 'score-pending'}`}>
          {m.score1 ?? '—'}
        </span>
      </div>

      <div className="elim-divider" />

      {/* Player 2 row */}
      <div className="elim-row">
        <button
          className={`elim-name bracket-name-btn ${p2wins ? 'winner' : p1wins ? 'loser' : ''} ${p2tbd ? 'tbd' : ''}`}
          onClick={() => !p2tbd && onPlayerClick(m.player2)}
          disabled={p2tbd}
        >
          {m.player2}
          {p2wins && <span className="winner-star">★</span>}
        </button>
        <span className={`elim-score ${p2wins ? 'score-hi' : p1wins ? 'score-lo' : 'score-pending'}`}>
          {m.score2 ?? '—'}
        </span>
      </div>

      {/* Status tag — always rendered to keep card height equal */}
      <div className={`elim-tag ${m.status === 'confirmed' ? '' : m.status === 'pending' ? 'tag-pending' : 'tag-upcoming'} ${m.status === 'confirmed' ? 'invisible' : ''}`}>
        {m.status === 'pending' ? 'PENDING' : 'UPCOMING'}
      </div>
    </div>
  )
}

// ── SVG bracket connector ─────────────────────────
// Connects `fromCount` match centers on the left to `toCount` centers on the right.
// Uses the same space-around spacing math as the flex columns.

function BracketConnector({ fromCount, toCount }: { fromCount: number; toCount: number }) {
  const groupSize  = fromCount / toCount
  const fromSlotH  = BRACKET_H / fromCount

  const d = Array.from({ length: toCount }, (_, i) => {
    const firstCenter = (i * groupSize + 0.5) * fromSlotH
    const lastCenter  = ((i + 1) * groupSize - 0.5) * fromSlotH
    const midY        = (firstCenter + lastCenter) / 2
    const mx          = CONN_W / 2

    return [
      `M 0 ${firstCenter} H ${mx}`,           // left arm top
      `M 0 ${lastCenter}  H ${mx}`,           // left arm bottom
      `M ${mx} ${firstCenter} V ${lastCenter}`, // vertical bridge
      `M ${mx} ${midY} H ${CONN_W}`,           // right arm out
    ].join(' ')
  }).join(' ')

  return (
    <svg width={CONN_W} height={BRACKET_H} className="elim-conn-svg">
      <path d={d} stroke="var(--border2)" strokeWidth="2" fill="none" strokeLinecap="square" />
    </svg>
  )
}

// ── Winner display ───────────────────────────────

function WinnerDisplay({ name, onPlayerClick }: { name: string | null; onPlayerClick: (name: string) => void }) {
  return (
    <div className="elim-winner-wrap" style={{ height: BRACKET_H, width: WINNER_W }}>
      <div className="elim-winner pixel-box">
        <span className="sym" style={{ fontSize: '1.8rem', lineHeight: 1 }}>🏆</span>
        {name
          ? <button className="elim-winner-name bracket-name-btn" onClick={() => onPlayerClick(name)}>{name}</button>
          : <span className="elim-winner-name">TBD</span>
        }
      </div>
    </div>
  )
}

// ── Helpers ──────────────────────────────────────

function getWinner(m: EliminationMatch): string | null {
  if (m.score1 === null || m.score2 === null) return null
  if (m.score1 > m.score2) return m.player1
  if (m.score2 > m.score1) return m.player2
  return null
}
