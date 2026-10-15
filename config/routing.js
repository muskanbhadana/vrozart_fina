/**
 * Determines whether the user should be routed/redirected to the Credit Analyst Dashboard.
 * 
 * @param {string|null} dashboardType - The dashboard type saved in local storage.
 * @param {string|null} path - The window location pathname.
 * @param {object|null} user - The user profile object containing the role.
 * @returns {boolean} True if the user should see the Credit Analyst Dashboard, false for Admin Dashboard.
 */
export function determineCreditRoute(dashboardType, path, user) {
  if (dashboardType === 'credit') return true
  if (path && path.includes('/credit')) return true
  if (user && typeof user.role === 'string') {
    const role = user.role.toLowerCase()
    if (role.includes('credit')) {
      return true
    }
  }
  return false
}
