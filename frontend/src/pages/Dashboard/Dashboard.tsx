
import { useEffect, useState } from 'react'
import axios from 'axios'

interface Application {
  id: number
  company: string
  role: string
  status: string
  appliedDate: string
  matchScore: number | null
}

interface CVAnalysisResult {
  match_score: number
  strengths: string[]
  gaps: string[]
  summary: string
}

interface DashboardProps {
  cvText: string
  setCvText: (val: string) => void
  jobDescription: string
  setJobDescription: (val: string) => void
}

function Dashboard({ cvText, setCvText, jobDescription, setJobDescription }: DashboardProps) {
  const [applications, setApplications] = useState<Application[]>([])
  const [analysisResult, setAnalysisResult] = useState<CVAnalysisResult | null>(null)
  const [analyzing, setAnalyzing] = useState(false)
  
  useEffect(() => {
    axios.get('http://localhost:8081/api/applications')
      .then(res => setApplications(res.data))
      .catch(err => console.error(err))
  }, [])

  const handleAnalyze = async () => {
    if (!cvText || !jobDescription) return
    setAnalyzing(true)
    try {
      const res = await axios.post('http://localhost:8000/analyze-cv', {
        cv_text: cvText,
        job_description: jobDescription,
      })
      const parsed = JSON.parse(res.data.result)
      setAnalysisResult(parsed)
    } catch (err) {
      console.error(err)
    } finally {
      setAnalyzing(false)
    }
  }

  const total = applications.length
  const interviews = applications.filter(a => a.status === 'INTERVIEW').length
  const offers = applications.filter(a => a.status === 'OFFER').length
  const rejected = applications.filter(a => a.status === 'REJECTED').length

  const stats = [
    { label: 'Total Applied', value: total },
    { label: 'Interviews', value: interviews },
    { label: 'Offers', value: offers },
    { label: 'Rejected', value: rejected },
  ]

  return (
    <div style={{ padding: '40px 32px', maxWidth: '1100px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '8px' }}>
        Dashboard
      </h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>
        Track your job search progress
      </p>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '16px',
        marginBottom: '40px'
      }}>
        {stats.map(({ label, value }) => (
          <div key={label} className="glass-card" style={{ textAlign: 'center' }}>
            <div style={{
              fontSize: '36px',
              fontWeight: '700',
              color: 'var(--accent)',
              marginBottom: '8px'
            }}>
              {value}
            </div>
            <div style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
              {label}
            </div>
          </div>
        ))}
      </div>

      <div className="glass-card" style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '6px' }}>
          CV Analyzer
        </h2>
        <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '20px' }}>
          Paste your CV and a job description to get an AI match score and gap analysis
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
          <div>
            <label style={{ fontSize: '13px', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
              Your CV
            </label>
            <textarea
              value={cvText}
              onChange={e => setCvText(e.target.value)}
              rows={6}
              placeholder="Paste your CV text here..."
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
          <div>
            <label style={{ fontSize: '13px', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
              Job Description
            </label>
            <textarea
              value={jobDescription}
              onChange={e => setJobDescription(e.target.value)}
              rows={6}
              placeholder="Paste the job description here..."
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
        </div>

        <button className="btn-primary" onClick={handleAnalyze} disabled={analyzing}>
          {analyzing ? 'Analyzing...' : 'Analyze CV'}
        </button>

        {analysisResult && (
          <div style={{ marginTop: '24px' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              marginBottom: '20px'
            }}>
              <div style={{
                fontSize: '48px',
                fontWeight: '700',
                color: analysisResult.match_score >= 60 ? '#16a34a' :
                       analysisResult.match_score >= 40 ? 'var(--accent)' : '#dc2626'
              }}>
                {analysisResult.match_score}%
              </div>
              <div>
                <div style={{ fontWeight: '600', marginBottom: '4px' }}>Match Score</div>
                <div style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                  {analysisResult.summary}
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div style={{
                padding: '16px',
                borderRadius: '12px',
                background: '#16a34a11',
                border: '1px solid #16a34a33'
              }}>
                <div style={{ fontWeight: '600', color: '#16a34a', marginBottom: '10px' }}>
                  Strengths
                </div>
                {analysisResult.strengths.map((s, i) => (
                  <div key={i} style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                    + {s}
                  </div>
                ))}
              </div>
              <div style={{
                padding: '16px',
                borderRadius: '12px',
                background: '#dc262611',
                border: '1px solid #dc262633'
              }}>
                <div style={{ fontWeight: '600', color: '#dc2626', marginBottom: '10px' }}>
                  Gaps
                </div>
                {analysisResult.gaps.map((g, i) => (
                  <div key={i} style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                    - {g}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="glass-card">
        <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>
          Recent Applications
        </h2>
        {applications.length === 0 ? (
          <p style={{ color: 'var(--text-secondary)' }}>
            No applications yet. Add your first one in the Applications tab.
          </p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--glass-border)' }}>
                {['Company', 'Role', 'Status', 'Date', 'Match Score'].map(h => (
                  <th key={h} style={{
                    textAlign: 'left',
                    padding: '8px 12px',
                    fontSize: '13px',
                    color: 'var(--text-secondary)',
                    fontWeight: '500'
                  }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {applications.map(app => (
                <tr key={app.id} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                  <td style={{ padding: '12px' }}>{app.company}</td>
                  <td style={{ padding: '12px' }}>{app.role}</td>
                  <td style={{ padding: '12px' }}>
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
                             app.status === 'INTERVIEW' ? '#2563eb' : 'var(--text-secondary)'
                    }}>
                      {app.status}
                    </span>
                  </td>
                  <td style={{ padding: '12px', color: 'var(--text-secondary)', fontSize: '13px' }}>
                    {app.appliedDate}
                  </td>
                  <td style={{ padding: '12px', color: 'var(--accent)', fontWeight: '600' }}>
                    {app.matchScore ? `${app.matchScore}%` : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

export default Dashboard