const AUTH_STORAGE_KEY = 'vrozart_admin_access_token'
const ADMIN_USER_KEY = 'vrozart_admin_user'
const LOGIN_URL = 'http://168.144.70.172:8000/api/admin/auth/login'

export async function login(email, password) {
  const res = await fetch(LOGIN_URL, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  })

  if (!res.ok) {
    let errorMsg = 'Login failed'
    try {
      const errorData = await res.json()
      if (errorData && typeof errorData === 'object') {
        if (errorData.error) {
          if (typeof errorData.error === 'object') {
            errorMsg = errorData.error.message || errorData.error.code || JSON.stringify(errorData.error)
          } else {
            errorMsg = errorData.error
          }
        } else if (errorData.detail) {
          if (Array.isArray(errorData.detail)) {
            errorMsg = errorData.detail.map(d => {
              if (d && typeof d === 'object') {
                const field = d.loc ? d.loc[d.loc.length - 1] : ''
                return field ? `${field}: ${d.msg}` : (d.msg || JSON.stringify(d))
              }
              return String(d)
            }).join(', ')
          } else if (typeof errorData.detail === 'object') {
            errorMsg = errorData.detail.message || JSON.stringify(errorData.detail)
          } else {
            errorMsg = errorData.detail
          }
        } else {
          errorMsg = errorData.message || errorMsg
        }
      }
    } catch (e) {
      try {
        const text = await res.text()
        errorMsg = text || errorMsg
      } catch (textErr) {}
    }
    throw new Error(errorMsg)
  }

  const data = await res.json()
  if (!data.access_token) {
    throw new Error('Login response missing access_token')
  }

  localStorage.setItem(AUTH_STORAGE_KEY, data.access_token)
  if (data.admin) {
    localStorage.setItem(ADMIN_USER_KEY, JSON.stringify(data.admin))
  }
  if (data.dashboardType) {
    localStorage.setItem('vrozart_dashboard_type', data.dashboardType)
  }
  
  return data
}

export async function getAuthToken() {
  const stored = localStorage.getItem(AUTH_STORAGE_KEY)
  if (stored) return stored
  
  // If no token is found, return null or throw depending on how the app handles it.
  // We'll throw an error which will be caught by the API callers and can trigger a logout/redirect if needed.
  throw new Error('No auth token found. Please log in.')
}

export function clearAuthToken() {
  localStorage.removeItem(AUTH_STORAGE_KEY)
  localStorage.removeItem(ADMIN_USER_KEY)
  localStorage.removeItem('vrozart_dashboard_type')
}

export function getAdminUser() {
  try {
    const user = localStorage.getItem(ADMIN_USER_KEY)
    return user ? JSON.parse(user) : null
  } catch {
    return null
  }
}
