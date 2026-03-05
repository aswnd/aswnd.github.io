import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { players, sortedPlayers, swissPoints, pointDiff } from '../mockData'
import './Profile.css'

const ME = players.find(p => p.id === '1')!
const MY_RANK = sortedPlayers.indexOf(ME) + 1

export default function Profile() {
  const navigate = useNavigate()
  const [name, setName]         = useState(ME.name)
  const [editing, setEditing]   = useState(false)
  const [draft, setDraft]       = useState(ME.name)
  const [saved, setSaved]       = useState(false)
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const pts  = swissPoints(ME)
  const diff = pointDiff(ME)
  const initials = name.split(' ').map(w => w[0]).join('')

  function handleAvatarClick() {
    fileInputRef.current?.click()
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) return

    setUploading(true)
    // TODO: replace with Supabase Storage upload
    // const { data } = await supabase.storage.from('avatars').upload(`${userId}.jpg`, file, { upsert: true })
    // const url = supabase.storage.from('avatars').getPublicUrl(`${userId}.jpg`).data.publicUrl
    // await supabase.from('players').update({ avatar_url: url }).eq('id', userId)
    setTimeout(() => {
      setAvatarUrl(URL.createObjectURL(file))
      setUploading(false)
    }, 800)

    e.target.value = ''
  }

  function handleSave() {
    if (draft.trim().length < 2) return
    setName(draft.trim())
    setEditing(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="profile-page">
      <header className="profile-header pixel-box">
        <button className="back-btn" onClick={() => navigate('/tournament')}>&lt; BACK</button>
        <span className="profile-header-title">MY PROFILE</span>
        <span className="profile-header-season">SS 2026</span>
      </header>

      <div className="profile-body">

        {/* Avatar + name */}
        <div className="profile-card pixel-box">
          <div className="profile-avatar-wrap">
            <button className="profile-avatar-btn" onClick={handleAvatarClick} title="Change photo">
              {avatarUrl
                ? <img className="profile-avatar-img" src={avatarUrl} alt="avatar" />
                : <div className="profile-avatar-lg">{uploading ? '...' : initials}</div>
              }
              <span className="profile-avatar-overlay">{uploading ? 'UPLOADING' : 'CHANGE'}</span>
            </button>
            <input ref={fileInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFileChange} />
            <div className="profile-rank-badge pixel-box-inset">RANK #{MY_RANK}</div>
          </div>

          <div className="profile-name-section">
            <div className="profile-field-label">DISPLAY NAME</div>
            {editing ? (
              <div className="profile-name-edit">
                <input
                  className="profile-name-input pixel-box-inset"
                  value={draft}
                  onChange={e => setDraft(e.target.value)}
                  autoFocus
                  maxLength={20}
                />
                <div className="profile-edit-actions">
                  <button className="btn-confirm-sm" onClick={handleSave}>SAVE</button>
                  <button className="btn-secondary-sm" onClick={() => { setEditing(false); setDraft(name) }}>CANCEL</button>
                </div>
              </div>
            ) : (
              <div className="profile-name-row">
                <span className="profile-name-val">{name}</span>
                <button className="profile-edit-btn" onClick={() => { setEditing(true); setDraft(name) }}>EDIT</button>
              </div>
            )}
            {saved && <span className="profile-saved">SAVED</span>}
          </div>
        </div>

        {/* Email — read only */}
        <div className="profile-card pixel-box">
          <div className="profile-field-label">EMAIL</div>
          <span className="profile-email">alex.kowalski@tu-berlin.de</span>
          <span className="profile-email-note">Email cannot be changed.</span>
        </div>

        {/* Stats */}
        <div className="profile-card pixel-box">
          <div className="profile-field-label">TOURNAMENT STATS</div>
          <div className="profile-stats-grid">
            <div className="profile-stat-cell">
              <span className="profile-stat-big">{pts}</span>
              <span className="profile-stat-lbl">PTS</span>
            </div>
            <div className="profile-stat-cell">
              <span className="profile-stat-big w">{ME.wins}</span>
              <span className="profile-stat-lbl">WINS</span>
            </div>
            <div className="profile-stat-cell">
              <span className="profile-stat-big d">{ME.draws}</span>
              <span className="profile-stat-lbl">DRAWS</span>
            </div>
            <div className="profile-stat-cell">
              <span className="profile-stat-big l">{ME.losses}</span>
              <span className="profile-stat-lbl">LOSSES</span>
            </div>
            <div className="profile-stat-cell">
              <span className={`profile-stat-big ${diff > 0 ? 'pos' : diff < 0 ? 'neg' : ''}`}>
                {diff > 0 ? '+' : ''}{diff}
              </span>
              <span className="profile-stat-lbl">+/-</span>
            </div>
            <div className="profile-stat-cell">
              <span className="profile-stat-big">{ME.pointsScored}:{ME.pointsConceded}</span>
              <span className="profile-stat-lbl">SCORE</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
