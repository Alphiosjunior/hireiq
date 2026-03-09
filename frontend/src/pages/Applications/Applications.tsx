import { useEffect, useState } from 'react'
import axios from 'axios'

interface Application {
  id: number
  company: string
  role: string
  status: string
  appliedDate: string
  jobDescription: string
  notes: string
  matchScore: number | null
}

const emptyForm = {
  company: '',
  role: '',
  status: 'APPLIED',
  appliedDate: '',
  jobDescription: '',
  notes: '',
}

function Applications() {
  const [applications, setApplications] = useState<Application[]>([])
  const [form, setForm] = useState(emptyForm)
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(false)

  const fetchApplications = () => {
    axios.get('http://localhost:8081/api/applications')
      .then(res => setApplications(res.data))
      .catch(err => console.error(err))
  }

  useEffect(() => {
    fetchApplications()
  }, [])

  const handleSubmit = async () => {
    if (!form.company || !form.role) return
    setLoading(true)
    try {
      await axios.post('http://localhost:8081/api/applications', form)
      setForm(emptyForm)
      setShowForm(false)
      fetchApplications()
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    await axios.delete(`http://localhost:8081/api/applications/${id}`)
    fetchApplications()
  }

  return (
    <div style={{ padding: '40px 32px', maxWidth: '1100px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '8px' }}>
            Applications
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            Manage all your job applications
          </p>
        </div>
        <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : 'Add Application'}
        </button>
      </div>

      {showForm && (
        <div className="glass-card" style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '20px' }}>
            New Application
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            {[
              { label: 'Company', key: 'company', type: 'text' },
              { label: 'Role', key: 'role', type: 'text' },
              { label: 'Date Applied', key: 'appliedDate', type: 'date' },
            ].map(({ label, key, type }) => (
              <div key={key}>
                <label style={{ fontSize: '13px', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                  {label}
                </label>
                <input
                  type={type}
                  value={form[key as keyof typeof form]}
                  onChange={e => setForm({ ...form, [key]: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    border: '1px solid var(--glass-border)',
                    background: 'var(--glass-bg)',
                    color: 'var(--text-primary)',
                    fontSize: '14px',
                  }}
                />
              </div>
            ))}
            <div>
              <label style={{ fontSize: '13px', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                Status
              </label>
              <select
                value={form.status}
                onChange={e => setForm({ ...form, status: e.target.value })}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  border: '1px solid var(--glass-border)',
                  background: 'var(--bg-secondary)',
                  color: 'var(--text-primary)',
                  fontSize: '14px',
                }}
              >
                {['APPLIED', 'INTERVIEW', 'OFFER', 'REJECTED'].map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ marginTop: '16px' }}>
            <label style={{ fontSize: '13px', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
              Job Description
            </label>
            <textarea
              value={form.jobDescription}
              onChange={e => setForm({ ...form, jobDescription: e.target.value })}
              rows={4}
              placeholder="Paste the job description here for AI analysis..."
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: '8px',
                border: '1px solid var(--glass-border)',
                background: 'var(--glass-bg)',
                color: 'var(--text-primary)',
                fontSize: '14px',
                resize: 'vertical',
              }}
            />
          </div>

          <div style={{ marginTop: '16px' }}>
            <label style={{ fontSize: '13px', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
              Notes
            </label>
            <textarea
              value={form.notes}
              onChange={e => setForm({ ...form, notes: e.target.value })}
              rows={2}
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: '8px',
                border: '1px solid var(--glass-border)',
                background: 'var(--glass-bg)',
                color: 'var(--text-primary)',
                fontSize: '14px',
                resize: 'vertical',
              }}
            />
          </div>

          <div style={{ marginTop: '20px' }}>
            <button className="btn-primary" onClick={handleSubmit} disabled={loading}>
              {loading ? 'Saving...' : 'Save Application'}
            </button>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {applications.length === 0 ? (
          <div className="glass-card">
            <p style={{ color: 'var(--text-secondary)' }}>No applications yet. Add your first one above.</p>
          </div>
        ) : (
          applications.map(app => (
            <div key={app.id} className="glass-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontWeight: '600', marginBottom: '4px' }}>{app.company}</div>
                <div style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>{app.role}</div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>{app.appliedDate}</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                {app.matchScore && (
                  <span style={{ color: 'var(--accent)', fontWeight: '600', fontSize: '14px' }}>
                    {app.matchScore}% match
                  </span>
                )}
                <span style={{
                  padding: '4px 10px',
                  borderRadius: '20px',
                  fontSize: '12px',
                  fontWeight: '500',
                  background: app.status === 'OFFER' ? '#16a34a22' :
                              app.status === 'REJECTED' ? '#dc262622' :
                              app.status === 'INTERVIEW' ? '#2563eb22' : '#55555522',
                  color: app.status === 'OFFER' ? '#16a34a' :
                         app.status === 'REJECTED' ? '#dc2626' :
                         app.status === 'INTERVIEW' ? 'var(--accent)' : 'var(--text-secondary)'
                }}>
                  {app.status}
                </span>
                <button
                  onClick={() => handleDelete(app.id)}
                  className="btn-ghost"
                  style={{ fontSize: '12px', padding: '6px 12px', color: '#dc2626' }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default Applications