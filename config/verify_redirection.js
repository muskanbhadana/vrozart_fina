import assert from 'assert'
import { determineCreditRoute } from './routing.js'

console.log('Running routing verification test cases...')

// Test case 1: User is CREDIT_ANALYST
{
  const result = determineCreditRoute(null, '/', { role: 'CREDIT_ANALYST' })
  assert.strictEqual(result, true, 'CREDIT_ANALYST role should redirect to Credit Dashboard')
}

// Test case 2: User is Credit Analyst (case check)
{
  const result = determineCreditRoute(null, '/', { role: 'Credit Analyst' })
  assert.strictEqual(result, true, 'Credit Analyst role should redirect to Credit Dashboard')
}

// Test case 2a: User is CREDIT_MANAGER
{
  const result = determineCreditRoute(null, '/', { role: 'CREDIT_MANAGER' })
  assert.strictEqual(result, true, 'CREDIT_MANAGER role should redirect to Credit Dashboard')
}

// Test case 2b: User is Credit Manager
{
  const result = determineCreditRoute(null, '/', { role: 'Credit Manager' })
  assert.strictEqual(result, true, 'Credit Manager role should redirect to Credit Dashboard')
}

// Test case 3: User is ADMIN
{
  const result = determineCreditRoute(null, '/', { role: 'ADMIN' })
  assert.strictEqual(result, false, 'ADMIN role should not redirect to Credit Dashboard')
}

// Test case 4: dashboardType is credit
{
  const result = determineCreditRoute('credit', '/', null)
  assert.strictEqual(result, true, 'dashboardType "credit" should redirect to Credit Dashboard')
}

// Test case 5: path contains /credit
{
  const result = determineCreditRoute(null, '/credit/dashboard', null)
  assert.strictEqual(result, true, 'path containing /credit should redirect to Credit Dashboard')
}

// Test case 6: default fallback (no role, default path)
{
  const result = determineCreditRoute(null, '/', null)
  assert.strictEqual(result, false, 'Default route should fallback to Admin Dashboard')
}

console.log('✓ All dashboard redirection verification tests passed successfully!')
