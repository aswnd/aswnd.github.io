export interface Player {
  id: string
  name: string
  wins: number
  losses: number
  draws: number
  pointsScored: number
  pointsConceded: number
}

export interface Match {
  id: string
  player1: string
  player2: string
  score1: number | null
  score2: number | null
  status: 'confirmed' | 'pending' | 'upcoming'
}

export interface Round {
  round: number
  matches: Match[]
}

export function swissPoints(p: Player) {
  return p.wins * 2 + p.draws
}

export function pointDiff(p: Player) {
  return p.pointsScored - p.pointsConceded
}

export const players: Player[] = [
  { id: '1',  name: 'Alex K.',  wins: 5, losses: 0, draws: 1, pointsScored: 176, pointsConceded: 121 },
  { id: '2',  name: 'Mia T.',   wins: 4, losses: 1, draws: 1, pointsScored: 163, pointsConceded: 130 },
  { id: '3',  name: 'Jonas B.', wins: 4, losses: 2, draws: 0, pointsScored: 154, pointsConceded: 138 },
  { id: '4',  name: 'Sarah L.', wins: 3, losses: 2, draws: 1, pointsScored: 148, pointsConceded: 142 },
  { id: '5',  name: 'Felix M.', wins: 3, losses: 3, draws: 0, pointsScored: 141, pointsConceded: 147 },
  { id: '6',  name: 'Lena W.',  wins: 2, losses: 3, draws: 1, pointsScored: 133, pointsConceded: 149 },
  { id: '7',  name: 'Tom R.',   wins: 2, losses: 4, draws: 0, pointsScored: 128, pointsConceded: 156 },
  { id: '8',  name: 'Nina S.',  wins: 1, losses: 4, draws: 1, pointsScored: 119, pointsConceded: 163 },
  { id: '9',  name: 'Paul H.',  wins: 1, losses: 5, draws: 0, pointsScored: 112, pointsConceded: 171 },
  { id: '10', name: 'Clara F.', wins: 0, losses: 5, draws: 1, pointsScored: 105, pointsConceded: 166 },
]

export const sortedPlayers = [...players].sort((a, b) => {
  const pts = swissPoints(b) - swissPoints(a)
  if (pts !== 0) return pts
  return pointDiff(b) - pointDiff(a)
})

export const rounds: Round[] = [
  {
    round: 1,
    matches: [
      { id: 'r1m1', player1: 'Alex K.',  player2: 'Clara F.', score1: 11, score2: 5,  status: 'confirmed' },
      { id: 'r1m2', player1: 'Mia T.',   player2: 'Paul H.',  score1: 11, score2: 5,  status: 'confirmed' },
      { id: 'r1m3', player1: 'Jonas B.', player2: 'Nina S.',  score1: 9,  score2: 11, status: 'confirmed' },
      { id: 'r1m4', player1: 'Sarah L.', player2: 'Tom R.',   score1: 11, score2: 6,  status: 'confirmed' },
      { id: 'r1m5', player1: 'Felix M.', player2: 'Lena W.',  score1: 8,  score2: 11, status: 'confirmed' },
    ],
  },
  {
    round: 2,
    matches: [
      { id: 'r2m1', player1: 'Alex K.',  player2: 'Paul H.',  score1: 11, score2: 8,  status: 'confirmed' },
      { id: 'r2m2', player1: 'Mia T.',   player2: 'Lena W.',  score1: 11, score2: 9,  status: 'confirmed' },
      { id: 'r2m3', player1: 'Jonas B.', player2: 'Clara F.', score1: 11, score2: 6,  status: 'confirmed' },
      { id: 'r2m4', player1: 'Sarah L.', player2: 'Nina S.',  score1: 11, score2: 9,  status: 'confirmed' },
      { id: 'r2m5', player1: 'Felix M.', player2: 'Tom R.',   score1: 7,  score2: 11, status: 'confirmed' },
    ],
  },
  {
    round: 3,
    matches: [
      { id: 'r3m1', player1: 'Alex K.',  player2: 'Lena W.',  score1: 11, score2: 6,  status: 'confirmed' },
      { id: 'r3m2', player1: 'Mia T.',   player2: 'Jonas B.', score1: 9,  score2: 11, status: 'confirmed' },
      { id: 'r3m3', player1: 'Felix M.', player2: 'Nina S.',  score1: 11, score2: 8,  status: 'confirmed' },
      { id: 'r3m4', player1: 'Tom R.',   player2: 'Paul H.',  score1: 11, score2: 9,  status: 'confirmed' },
      { id: 'r3m5', player1: 'Sarah L.', player2: 'Clara F.', score1: 11, score2: 7,  status: 'confirmed' },
    ],
  },
  {
    round: 4,
    matches: [
      { id: 'r4m1', player1: 'Alex K.',  player2: 'Sarah L.', score1: null, score2: null, status: 'pending' },
      { id: 'r4m2', player1: 'Mia T.',   player2: 'Felix M.', score1: 11,   score2: 8,    status: 'confirmed' },
      { id: 'r4m3', player1: 'Jonas B.', player2: 'Tom R.',   score1: null, score2: null, status: 'pending' },
      { id: 'r4m4', player1: 'Nina S.',  player2: 'Clara F.', score1: 11,   score2: 9,    status: 'confirmed' },
      { id: 'r4m5', player1: 'Lena W.',  player2: 'Paul H.',  score1: null, score2: null, status: 'pending' },
    ],
  },
  {
    round: 5,
    matches: [
      { id: 'r5m1', player1: 'TBD', player2: 'TBD', score1: null, score2: null, status: 'upcoming' },
      { id: 'r5m2', player1: 'TBD', player2: 'TBD', score1: null, score2: null, status: 'upcoming' },
      { id: 'r5m3', player1: 'TBD', player2: 'TBD', score1: null, score2: null, status: 'upcoming' },
      { id: 'r5m4', player1: 'TBD', player2: 'TBD', score1: null, score2: null, status: 'upcoming' },
      { id: 'r5m5', player1: 'TBD', player2: 'TBD', score1: null, score2: null, status: 'upcoming' },
    ],
  },
  {
    round: 6,
    matches: [
      { id: 'r6m1', player1: 'TBD', player2: 'TBD', score1: null, score2: null, status: 'upcoming' },
      { id: 'r6m2', player1: 'TBD', player2: 'TBD', score1: null, score2: null, status: 'upcoming' },
      { id: 'r6m3', player1: 'TBD', player2: 'TBD', score1: null, score2: null, status: 'upcoming' },
      { id: 'r6m4', player1: 'TBD', player2: 'TBD', score1: null, score2: null, status: 'upcoming' },
      { id: 'r6m5', player1: 'TBD', player2: 'TBD', score1: null, score2: null, status: 'upcoming' },
    ],
  },
  {
    round: 7,
    matches: [
      { id: 'r7m1', player1: 'TBD', player2: 'TBD', score1: null, score2: null, status: 'upcoming' },
      { id: 'r7m2', player1: 'TBD', player2: 'TBD', score1: null, score2: null, status: 'upcoming' },
      { id: 'r7m3', player1: 'TBD', player2: 'TBD', score1: null, score2: null, status: 'upcoming' },
      { id: 'r7m4', player1: 'TBD', player2: 'TBD', score1: null, score2: null, status: 'upcoming' },
      { id: 'r7m5', player1: 'TBD', player2: 'TBD', score1: null, score2: null, status: 'upcoming' },
    ],
  },
]

// ── Elimination bracket ──────────────────────────

export type EliminationStatus = 'confirmed' | 'pending' | 'upcoming'

export interface EliminationMatch {
  id: string
  player1: string   // 'TBD' if not yet determined
  player2: string
  score1: number | null
  score2: number | null
  status: EliminationStatus
}

export interface EliminationRound {
  label: string
  matches: EliminationMatch[]
}

export const eliminationBracket: EliminationRound[] = [
  {
    label: 'QUARTERFINALS',
    matches: [
      { id: 'qf1', player1: 'Alex K.',  player2: 'Clara F.', score1: 11, score2: 5,    status: 'confirmed' },
      { id: 'qf2', player1: 'Felix M.', player2: 'Sarah L.', score1: null, score2: null, status: 'pending'  },
      { id: 'qf3', player1: 'Jonas B.', player2: 'Lena W.',  score1: null, score2: null, status: 'pending'  },
      { id: 'qf4', player1: 'Mia T.',   player2: 'Tom R.',   score1: 11, score2: 8,    status: 'confirmed' },
    ],
  },
  {
    label: 'SEMIFINALS',
    matches: [
      { id: 'sf1', player1: 'Alex K.', player2: 'TBD', score1: null, score2: null, status: 'upcoming' },
      { id: 'sf2', player1: 'TBD',     player2: 'Mia T.', score1: null, score2: null, status: 'upcoming' },
    ],
  },
  {
    label: 'FINAL',
    matches: [
      { id: 'f1', player1: 'TBD', player2: 'TBD', score1: null, score2: null, status: 'upcoming' },
    ],
  },
]

export const tournamentInfo = {
  name: 'TU Berlin Table Tennis Cup',
  round: 4,
  totalRounds: 7,
  season: 'SS 2026',
  roundDeadline: '2026-03-10',
}
