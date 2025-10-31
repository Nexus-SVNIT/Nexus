import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { apiFetch } from '../../utils/api'

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

      const res = await apiFetch(`/study-material/subjects?${params.toString()}`)
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
    <div className="p-6">
      <h2 className="text-2xl font-semibold">Study Material</h2>

      <div className="flex flex-wrap gap-4 items-center mt-4">
        <div className="flex flex-col">
          <label className="text-sm mb-1">Category</label>
          <select
            value={category}
            onChange={e => setCategory(e.target.value)}
            className="px-3 py-2 rounded border"
          >
            {categories.map(c => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col">
          <label className="text-sm mb-1">Department</label>
          <select
            value={department}
            onChange={e => setDepartment(e.target.value)}
            disabled={category === 'Placements/Internships'}
            className="px-3 py-2 rounded border disabled:opacity-50"
          >
            {departments.map(d => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-6">
        {loading && <div className="text-sm text-gray-600">Loading subjects…</div>}
        {error && <div className="text-sm text-red-600">{error}</div>}

        {!loading && !error && (
          <div>
            {subjects.length === 0 ? (
              <div className="text-sm text-gray-600">No subjects found.</div>
            ) : (
              <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 list-none p-0">
                {subjects.map(s => (
                  <li
                    key={s._id}
                    className="p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow bg-white"
                  >
                    <Link to={`/study-material/${s._id}`} className="no-underline text-gray-900">
                      <strong className="text-lg">{s.subjectName}</strong>
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
