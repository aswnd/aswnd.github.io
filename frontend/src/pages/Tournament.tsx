import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { players, sortedPlayers, swissPoints, pointDiff, rounds, eliminationBracket, tournamentInfo } from '../mockData'
import type { Match, Player } from '../mockData'
import EliminationBracket from '../components/EliminationBracket'
import './Tournament.css'

type Tab = 'rounds' | 'elimination' | 'standings'

export default function Tournament() {
  const [tab, setTab] = useState<Tab>('rounds')
  const [selectedName, setSelectedName] = useState<string | null>(null)
  const selectedPlayer = selectedName ? players.find(p => p.name === selectedName) ?? null : null

  return (
    <div className="page">
      <Header />
      <div className="tabs pixel-box">
        <button className={`tab-btn ${tab === 'rounds' ? 'active' : ''}`} onClick={() => setTab('rounds')}>
          ROUNDS
        </button>
        <button className={`tab-btn ${tab === 'elimination' ? 'active' : ''}`} onClick={() => setTab('elimination')}>
          ELIMINATION
        </button>
        <button className={`tab-btn ${tab === 'standings' ? 'active' : ''}`} onClick={() => setTab('standings')}>
          STANDINGS
        </button>
      </div>
      <main className="main">
        {tab === 'rounds'       && <BracketView onPlayerClick={setSelectedName} />}
        {tab === 'elimination'  && (
          <>
            <div className="elim-locked pixel-box">
              <span className="elim-locked-icon">🔒</span>
              <span>SWISS PHASE IN PROGRESS — ELIMINATION BRACKET UNLOCKS AFTER ROUND {tournamentInfo.totalRounds}</span>
            </div>
            <EliminationBracket rounds={eliminationBracket} onPlayerClick={setSelectedName} />
          </>
        )}
        {tab === 'standings'    && <StandingsView onPlayerClick={setSelectedName} />}
      </main>

      {selectedPlayer && (
        <PlayerModal
          player={selectedPlayer}
          rank={sortedPlayers.indexOf(selectedPlayer) + 1}
          onClose={() => setSelectedName(null)}
        />
      )}
    </div>
  )
}

function Header() {
  const { name, round, totalRounds, season, roundDeadline } = tournamentInfo
  const navigate = useNavigate()
  const ROUND_DAYS = 7
  const deadlineDate = new Date(roundDeadline)
  const startDate = new Date(deadlineDate)
  startDate.setDate(startDate.getDate() - ROUND_DAYS)
  const today = new Date()
  const daysElapsed = Math.max(0, Math.min(ROUND_DAYS, Math.floor((today.getTime() - startDate.getTime()) / 86400000)))
  const daysLeft = Math.max(0, ROUND_DAYS - daysElapsed)
  const weekPct = Math.round((daysElapsed / ROUND_DAYS) * 100)

  return (
    <header className="header pixel-box">
      <div className="header-logo">
        <span className="logo-icon">🏓</span>
        <div>
          <h1 className="logo-title">TUBNAMENT</h1>
          <p className="logo-sub">{name}</p>
        </div>
      </div>
      <div className="header-badges">
        <div className="meta-badge pixel-box-inset">
          <span className="meta-label">SEASON</span>
          <span className="meta-val">{season}</span>
        </div>
        <div className="meta-badge pixel-box-inset">
          <span className="meta-label">ROUND</span>
          <span className="meta-val">{round}/{totalRounds}</span>
        </div>
      </div>
      <div className="header-actions">
        <button className="my-match-btn pixel-box" onClick={() => navigate('/match')}>
          MY MATCH &gt;
        </button>
        <button className="profile-btn pixel-box" onClick={() => navigate('/profile')}>
          MY PROFILE
        </button>
      </div>
      <div className="deadline-wrap">
        <div className="deadline-top">
          <span className="deadline-label">ROUND {round} DEADLINE</span>
          <span className="deadline-date">{deadlineDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }).toUpperCase()}</span>
        </div>
        <div className="progress-track pixel-box-inset">
          <div className="deadline-fill" style={{ width: `${weekPct}%` }} />
          {Array.from({ length: ROUND_DAYS }).map((_, i) => (
            <div
              key={i}
              className={`progress-tick ${i < daysElapsed ? 'done' : ''}`}
              style={{ left: `${((i + 1) / ROUND_DAYS) * 100}%` }}
            />
          ))}
        </div>
        <span className="deadline-days-left">
          {daysLeft === 0 ? 'DUE TODAY' : `${daysLeft} DAYS LEFT`}
        </span>
      </div>
    </header>
  )
}

function BracketView({ onPlayerClick }: { onPlayerClick: (name: string) => void }) {
  const scrollRef    = useRef<HTMLDivElement>(null)
  const activeColRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current && activeColRef.current) {
      const col = activeColRef.current
      const container = scrollRef.current
      container.scrollLeft = col.offsetLeft - container.offsetWidth / 2 + col.offsetWidth / 2
    }
  }, [])

  return (
    <div className="bracket-scroll" ref={scrollRef}>
      <div className="bracket">
        {rounds.map(r => {
          const isCurrent = r.round === tournamentInfo.round
          return (
            <div
              key={r.round}
              ref={isCurrent ? activeColRef : null}
              className={`bracket-col ${isCurrent ? 'current-round' : ''}`}
            >
              <div className={`round-label ${isCurrent ? 'current' : ''}`}>
                {isCurrent ? '> ' : ''}ROUND {r.round}
              </div>
              <div className="round-matches">
                {r.matches.map(m => (
                  <MatchCard key={m.id} match={m} onPlayerClick={onPlayerClick} />
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function MatchCard({ match: m, onPlayerClick }: { match: Match; onPlayerClick: (name: string) => void }) {
  const hasScore  = m.score1 !== null && m.score2 !== null
  const p1wins    = hasScore && m.score1! > m.score2!
  const p2wins    = hasScore && m.score2! > m.score1!
  const isUpcoming = m.status === 'upcoming'

  function nameBtn(name: string, winClass: string) {
    if (isUpcoming) return <span className="match-name tbd">{name}</span>
    return (
      <button className={`match-name bracket-name-btn ${winClass}`} onClick={() => onPlayerClick(name)}>
        {name}{winClass === 'winner' && <span className="winner-star">★</span>}
      </button>
    )
  }

  return (
    <div className={`match-card pixel-box ${m.status}`}>
      <div className="match-row">
        {nameBtn(m.player1, p1wins ? 'winner' : p2wins ? 'loser' : '')}
        <span className={`match-score-val ${p1wins ? 'score-hi' : hasScore ? 'score-lo' : 'score-pending'}`}>
          {m.score1 ?? '—'}
        </span>
      </div>
      <div className="match-divider" />
      <div className="match-row">
        {nameBtn(m.player2, p2wins ? 'winner' : p1wins ? 'loser' : '')}
        <span className={`match-score-val ${p2wins ? 'score-hi' : hasScore ? 'score-lo' : 'score-pending'}`}>
          {m.score2 ?? '—'}
        </span>
      </div>
      <div className={`pending-tag ${m.status === 'pending' ? '' : 'invisible'}`}>PENDING</div>
    </div>
  )
}

function StandingsView({ onPlayerClick }: { onPlayerClick: (name: string) => void }) {
  return (
    <div className="section">
      <div className="table-wrap pixel-box">
        <table className="standings-table">
          <thead>
            <tr>
              <th className="col-rank">#</th>
              <th className="col-name">PLAYER</th>
              <th className="col-pts">PTS</th>
              <th className="col-record">W-D-L</th>
              <th className="col-diff">+/-</th>
              <th className="col-scored">SCORE</th>
            </tr>
          </thead>
          <tbody>
            {sortedPlayers.map((player, idx) => {
              const rank = idx + 1
              const pts = swissPoints(player)
              const diff = pointDiff(player)
              const rankClass = rank === 1 ? 'rank-gold' : rank === 2 ? 'rank-silver' : rank === 3 ? 'rank-bronze' : ''
              return (
                <tr key={player.id} className={`row ${rankClass} ${idx % 2 === 1 ? 'row-alt' : ''}`}>
                  <td className="col-rank">
                    <span className={`rank-badge ${rankClass}`}>{rank}</span>
                  </td>
                  <td className="col-name">
                    <button className="player-name-btn" onClick={() => onPlayerClick(player.name)}>
                      {player.name}
                    </button>
                  </td>
                  <td className="col-pts">
                    <span className="pts-badge">{pts}</span>
                  </td>
                  <td className="col-record">
                    <span className="record">
                      <span className="w">{player.wins}</span>
                      <span className="rec-sep">-</span>
                      <span className="d">{player.draws}</span>
                      <span className="rec-sep">-</span>
                      <span className="l">{player.losses}</span>
                    </span>
                  </td>
                  <td className="col-diff">
                    <span className={`diff ${diff > 0 ? 'pos' : diff < 0 ? 'neg' : ''}`}>
                      {diff > 0 ? '+' : ''}{diff}
                    </span>
                  </td>
                  <td className="col-scored">
                    {player.pointsScored}:{player.pointsConceded}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      <div className="table-legend">
        <span>PTS = WINS×2 + DRAWS×1</span>
        <span className="legend-sep">|</span>
        <span>+/- = POINT DIFF</span>
      </div>
    </div>
  )
}

function PlayerModal({ player, rank, onClose }: { player: Player; rank: number; onClose: () => void }) {
  const pts = swissPoints(player)
  const diff = pointDiff(player)
  const initials = player.name.split(' ').map(w => w[0]).join('')
  const rankClass = rank === 1 ? 'rank-gold' : rank === 2 ? 'rank-silver' : rank === 3 ? 'rank-bronze' : ''

  const wonMatches = rounds.flatMap(r => r.matches).filter(m => {
    if (m.status !== 'confirmed') return false
    if (m.player1 === player.name && m.score1! > m.score2!) return true
    if (m.player2 === player.name && m.score2! > m.score1!) return true
    return false
  })

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal pixel-box profile-modal" onClick={e => e.stopPropagation()}>
        <button className="profile-close" onClick={onClose}>X</button>

        <div className="profile-avatar">{initials}</div>
        <div className="profile-name">{player.name}</div>
        <div className="profile-rank">
          <span className={`rank-badge ${rankClass}`}>{rank}</span>
        </div>

        <div className="profile-stats">
          <div className="profile-stat">
            <span className="profile-stat-val">{pts}</span>
            <span className="profile-stat-label">PTS</span>
          </div>
          <div className="profile-stat">
            <span className="profile-stat-val w">{player.wins}</span>
            <span className="profile-stat-label">WINS</span>
          </div>
          <div className="profile-stat">
            <span className="profile-stat-val d">{player.draws}</span>
            <span className="profile-stat-label">DRAWS</span>
          </div>
          <div className="profile-stat">
            <span className="profile-stat-val l">{player.losses}</span>
            <span className="profile-stat-label">LOSSES</span>
          </div>
          <div className="profile-stat">
            <span className={`profile-stat-val ${diff > 0 ? 'pos' : diff < 0 ? 'neg' : ''}`}>
              {diff > 0 ? '+' : ''}{diff}
            </span>
            <span className="profile-stat-label">+/-</span>
          </div>
        </div>

        {wonMatches.length > 0 && (
          <div className="profile-wins">
            <div className="profile-wins-label">WON MATCHES</div>
            {wonMatches.map(m => {
              const isP1 = m.player1 === player.name
              const opponent = isP1 ? m.player2 : m.player1
              const myScore = isP1 ? m.score1 : m.score2
              const oppScore = isP1 ? m.score2 : m.score1
              return (
                <div key={m.id} className="profile-win-row">
                  <span className="profile-win-opp">vs {opponent}</span>
                  <span className="profile-win-score">
                    <span className="score-hi">{myScore}</span>
                    <span className="profile-win-sep">:</span>
                    <span className="score-lo">{oppScore}</span>
                  </span>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

