import { useState, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Dashboard from './pages/Dashboard/Dashboard'
import Applications from './pages/Applications/Applications'
import InterviewPrep from './pages/InterviewPrep/InterviewPrep'

function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark')
  const [cvText, setCvText] = useState('')
  const [jobDescription, setJobDescription] = useState('')

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark')
  }

  return (
    <div>
      <Navbar theme={theme} toggleTheme={toggleTheme} />
      <Routes>
        <Route path="/" element={
          <Dashboard
            cvText={cvText}
            setCvText={setCvText}
            jobDescription={jobDescription}
            setJobDescription={setJobDescription}
          />
        } />
        <Route path="/applications" element={<Applications />} />
        <Route path="/interview-prep" element={
          <InterviewPrep
            cvText={cvText}
            setCvText={setCvText}
            jobDescription={jobDescription}
            setJobDescription={setJobDescription}
          />
        } />
      </Routes>
    </div>
  )
}

export default App