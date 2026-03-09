import { useState } from 'react'
import axios from 'axios'

interface Question {
  question: string
  model_answer: string
}

interface InterviewPrepResult {
  technical_questions: Question[]
  behavioural_questions: Question[]
  questions_to_ask_interviewer: string[]
}

interface InterviewPrepProps {
  cvText: string
  setCvText: (val: string) => void
  jobDescription: string
  setJobDescription: (val: string) => void
}

function InterviewPrep({ cvText, setCvText, jobDescription, setJobDescription }: InterviewPrepProps) {
  const [result, setResult] = useState<InterviewPrepResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [expandedQuestion, setExpandedQuestion] = useState<string | null>(null)
  
  const handleGenerate = async () => {
    if (!cvText || !jobDescription) return
    setLoading(true)
    try {
      const res = await axios.post('http://localhost:8000/interview-prep', {
        cv_text: cvText,
        job_description: jobDescription,
      })
      const parsed = JSON.parse(res.data.result)
      setResult(parsed)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ padding: '40px 32px', maxWidth: '900px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '8px' }}>
        Interview Prep
      </h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>
        Paste your CV and a job description to get personalized interview questions
      </p>

      <div className="glass-card" style={{ marginBottom: '24px' }}>
        <div style={{ marginBottom: '16px' }}>
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

        <div style={{ marginBottom: '20px' }}>
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

        <button className="btn-primary" onClick={handleGenerate} disabled={loading}>
          {loading ? 'Generating questions...' : 'Generate Interview Questions'}
        </button>
      </div>

      {result && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

          <div className="glass-card">
            <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>
              Technical Questions
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {result.technical_questions.map((q, i) => (
                <div key={i} style={{ borderBottom: '1px solid var(--glass-border)', paddingBottom: '12px' }}>
                  <div
                    onClick={() => setExpandedQuestion(expandedQuestion === `t${i}` ? null : `t${i}`)}
                    style={{ cursor: 'pointer', fontWeight: '500', marginBottom: '8px', display: 'flex', justifyContent: 'space-between' }}
                  >
                    <span>{q.question}</span>
                    <span style={{ color: 'var(--accent)' }}>{expandedQuestion === `t${i}` ? '▲' : '▼'}</span>
                  </div>
                  {expandedQuestion === `t${i}` && (
                    <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                      {q.model_answer}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card">
            <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>
              Behavioural Questions
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {result.behavioural_questions.map((q, i) => (
                <div key={i} style={{ borderBottom: '1px solid var(--glass-border)', paddingBottom: '12px' }}>
                  <div
                    onClick={() => setExpandedQuestion(expandedQuestion === `b${i}` ? null : `b${i}`)}
                    style={{ cursor: 'pointer', fontWeight: '500', marginBottom: '8px', display: 'flex', justifyContent: 'space-between' }}
                  >
                    <span>{q.question}</span>
                    <span style={{ color: 'var(--accent)' }}>{expandedQuestion === `b${i}` ? '▲' : '▼'}</span>
                  </div>
                  {expandedQuestion === `b${i}` && (
                    <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                      {q.model_answer}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card">
            <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>
              Questions to Ask the Interviewer
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {result.questions_to_ask_interviewer.map((q, i) => (
                <div key={i} style={{
                  padding: '12px',
                  borderRadius: '8px',
                  background: 'var(--glass-bg)',
                  border: '1px solid var(--glass-border)',
                  fontSize: '14px',
                }}>
                  {q}
                </div>
              ))}
            </div>
          </div>

        </div>
      )}
    </div>
  )
}

export default InterviewPrep