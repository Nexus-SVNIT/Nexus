import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'

export default function SubjectDetailPage() {
  const { id } = useParams()
  const [subject, setSubject] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState(null)

  useEffect(() => {
    if (!id) return
    fetchDetail()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  async function fetchDetail() {
    try {
      setLoading(true)
      setError(null)
      const res = await fetch(`/study-material/subjects/${id}`)
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.message || 'Failed to fetch subject details')
      }
      const data = await res.json()
      setSubject(data.data)
      const keys = Object.keys(data.data.resources || {})
      setActiveTab(keys.length ? keys[0] : null)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div style={{ padding: 20 }}>Loading subject…</div>
  if (error) return <div style={{ padding: 20, color: 'red' }}>{error}</div>
  if (!subject) return <div style={{ padding: 20 }}>No subject found.</div>

  const tabs = Object.keys(subject.resources || {})

  return (
    <div style={{ padding: 20 }}>
      <div style={{ marginBottom: 12 }}>
        <Link to="/study-material">← Back to browse</Link>
      </div>

      <h2>{subject.subjectName}</h2>

      <section style={{ marginTop: 12 }}>
        <h3>Tips</h3>
        {subject.tips && subject.tips.length ? (
          <ul>
            {subject.tips.map((t, i) => (
              <li key={i}>{t}</li>
            ))}
          </ul>
        ) : (
          <div>No tips available.</div>
        )}
      </section>

      <section style={{ marginTop: 18 }}>
        <h3>Resources</h3>
        <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: '6px 10px',
                borderRadius: 6,
                border: activeTab === tab ? '2px solid #2b6cb0' : '1px solid #ddd',
                background: activeTab === tab ? '#e6f2ff' : '#fff',
                cursor: 'pointer'
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        <div>
          {activeTab ? (
            (subject.resources[activeTab] && subject.resources[activeTab].length) ? (
              <ul>
                {subject.resources[activeTab].map(r => (
                  <li key={r._id || r.link} style={{ marginBottom: 8 }}>
                    <a href={r.link} target="_blank" rel="noreferrer">
                      {r.title}
                    </a>
                    {r.resourceType ? <span style={{ marginLeft: 8, color: '#555' }}>({r.resourceType})</span> : null}
                  </li>
                ))}
              </ul>
            ) : (
              <div>No resources under “{activeTab}”.</div>
            )
          ) : (
            <div>No resource categories available.</div>
          )}
        </div>
      </section>
    </div>
  )
}
