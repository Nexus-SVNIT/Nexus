import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { apiFetch } from '../../utils/api'

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
      const res = await apiFetch(`/study-material/subjects/${id}`)
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

  if (loading) return <div className="p-6">Loading subject…</div>
  if (error) return <div className="p-6 text-red-600">{error}</div>
  if (!subject) return <div className="p-6">No subject found.</div>

  const tabs = Object.keys(subject.resources || {})

  return (
    <div className="p-6">
      <div className="mb-3">
        <Link to="/study-material" className="text-blue-600">← Back to browse</Link>
      </div>

      <h2 className="text-2xl font-semibold">{subject.subjectName}</h2>

      <section className="mt-4">
        <h3 className="font-medium">Tips</h3>
        {subject.tips && subject.tips.length ? (
          <ul className="list-disc ml-6 mt-2">
            {subject.tips.map((t, i) => (
              <li key={i} className="text-sm text-gray-800">{t}</li>
            ))}
          </ul>
        ) : (
          <div className="text-sm text-gray-600">No tips available.</div>
        )}
      </section>

      <section className="mt-6">
        <h3 className="font-medium">Resources</h3>
        <div className="flex flex-wrap gap-3 mt-3 mb-4">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1 rounded ${activeTab === tab ? 'border-2 border-blue-600 bg-blue-50' : 'border'} text-sm`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div>
          {activeTab ? (
            (subject.resources[activeTab] && subject.resources[activeTab].length) ? (
              <ul className="list-disc ml-6">
                {subject.resources[activeTab].map(r => (
                  <li key={r._id || r.link} className="mb-2">
                    <a href={r.link} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">
                      {r.title}
                    </a>
                    {r.resourceType ? <span className="ml-2 text-sm text-gray-600">({r.resourceType})</span> : null}
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-sm text-gray-600">No resources under “{activeTab}”.</div>
            )
          ) : (
            <div className="text-sm text-gray-600">No resource categories available.</div>
          )}
        </div>
      </section>
    </div>
  )
}
