export const fetchSessions = async () => {
  const response = await fetch('/api/admin-dashboad/sessions')
  const data = await response.json()
  return data
}
