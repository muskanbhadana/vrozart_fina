import { useEffect, useState } from 'react'
import StatCard from '../components/StatCard.jsx'
import { getAuthToken } from '../config/auth.js'

const VARIANT_MAP = {
  blue: { icon: 'document', iconBg: 'bg-blue-500', iconColor: 'text-white' },
  orange: { icon: 'clock', iconBg: 'bg-orange-500', iconColor: 'text-white' },
  green: { icon: 'check', iconBg: 'bg-emerald-500', iconColor: 'text-white' },
  red: { icon: 'x', iconBg: 'bg-red-500', iconColor: 'text-white' },
  maroon: { icon: 'document', iconBg: 'bg-rose-500', iconColor: 'text-white' },
}

export default function CreditDashboard() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    async function fetchData() {
      try {
        const token = await getAuthToken()
        const res = await fetch('http://168.144.70.172:8000/api/credit-analyst/dashboard', {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${token}`
          }
        })
        if (!res.ok) throw new Error('Failed to fetch')
        const json = await res.json()
        if (!cancelled) {
          setData(json)
          setLoading(false)
        }
      } catch (err) {
        console.error(err)
        if (!cancelled) setLoading(false)
      }
    }
    fetchData()
    return () => { cancelled = true }
  }, [])

  if (loading) {
    return <div className="p-4 text-sm text-slate-500">Loading dashboard...</div>
  }

  const cards = data?.cards || []

  return (
    <div className="flex min-h-0 flex-col gap-5">
      <div>
        <h2 className="credit-heading text-lg">Dashboard</h2>
        <p className="credit-subtitle mt-0.5 text-sm">Overview of your assigned applications</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {cards.map((card) => {
          const mapping = VARIANT_MAP[card.variant] || VARIANT_MAP.blue
          return (
            <StatCard 
              key={card.key}
              label={card.label}
              value={card.count}
              icon={mapping.icon}
              iconBg={mapping.iconBg}
              iconColor={mapping.iconColor}
            />
          )
        })}
      </div>
    </div>
  )
}
