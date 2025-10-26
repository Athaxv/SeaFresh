export function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem("token")
}

export function getAuthHeaders() {
  const token = getAuthToken()
  return token ? { Authorization: `Bearer ${token}` } : {}
}

export function isAuthenticated(): boolean {
  return !!getAuthToken()
}

export function logout() {
  if (typeof window === 'undefined') return
  localStorage.removeItem("token")
  sessionStorage.removeItem("user")
  window.location.href = "/login"
}

export function getUserFromStorage() {
  if (typeof window === 'undefined') return null
  try {
    const userStr = sessionStorage.getItem("user")
    return userStr ? JSON.parse(userStr) : null
  } catch {
    return null
  }
}




