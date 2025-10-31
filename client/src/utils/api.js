// Simple API fetch helper. Uses REACT_APP_API_BASE if provided, otherwise uses same-origin.
export function apiFetch(path, options) {
  const base = process.env.REACT_APP_API_BASE || ''
  return fetch(base + path, options)
}
