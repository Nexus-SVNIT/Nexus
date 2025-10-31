import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

const categories = ['Semester Exams', 'Placements/Internships']
const departments = ['CSE', 'AI', 'ECE', 'ME']

export default function StudyMaterialPage() {
  const [category, setCategory] = useState('Semester Exams')
  const [department, setDepartment] = useState('CSE')
  const [subjects, setSubjects] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchSubjects()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category, department])

  async function fetchSubjects() {
    try {
      setLoading(true)
      setError(null)
      const params = new URLSearchParams()
      params.append('category', category)
      if (category === 'Semester Exams') params.append('department', department)

      const res = await fetch(`/study-material/subjects?${params.toString()}`)
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.message || 'Failed to fetch subjects')
      }
      const data = await res.json()
      setSubjects(data.data || [])
    } catch (err) {
      setError(err.message)
      setSubjects([])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>Study Material</h2>

      <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginTop: 12 }}>
        <div>
          <label style={{ display: 'block', fontSize: 12 }}>Category</label>
          <select value={category} onChange={e => setCategory(e.target.value)}>
            {categories.map(c => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: 12 }}>Department</label>
          <select
            value={department}
            onChange={e => setDepartment(e.target.value)}
            disabled={category === 'Placements/Internships'}
          >
            {departments.map(d => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div style={{ marginTop: 20 }}>
        {loading && <div>Loading subjects…</div>}
        {error && <div style={{ color: 'red' }}>{error}</div>}

        {!loading && !error && (
          <div>
            {subjects.length === 0 ? (
              <div>No subjects found.</div>
            ) : (
              <ul style={{ listStyle: 'none', padding: 0 }}>
                {subjects.map(s => (
                  <li
                    key={s._id}
                    style={{ padding: 12, border: '1px solid #eee', marginBottom: 8, borderRadius: 6 }}
                  >
                    <Link to={`/study-material/${s._id}`} style={{ textDecoration: 'none' }}>
                      <strong>{s.subjectName}</strong>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
