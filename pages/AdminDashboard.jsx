import { useEffect, useState } from 'react'
import StatCard from '../components/StatCard.jsx'
import { DASHBOARD_STATS } from '../data/dashboardStats.js'
import { getAuthToken } from '../config/auth.js'

const SUMMARY_URL = 'http://168.144.70.172:8000/api/admin/dashboard/summary'

function mapResponseToStats(resp) {
  return [
    {
      id: 'total-applications',
      label: 'Total Applications',
      value: resp.totalApplications ?? DASHBOARD_STATS[0].value,
      icon: 'document',
      iconBg: 'bg-blue-600',
      iconColor: 'text-white',
    },
    {
      id: 'in-progress',
      label: 'In Progress',
      value: resp.inProgressApplications ?? DASHBOARD_STATS[1].value,
      icon: 'clock',
      iconBg: 'bg-orange-500',
      iconColor: 'text-white',
    },
    {
      id: 'approved',
      label: 'Approved',
      value: resp.approvedApplications ?? DASHBOARD_STATS[2].value,
      icon: 'check',
      iconBg: 'bg-emerald-500',
      iconColor: 'text-white',
    },
    {
      id: 'rejected',
      label: 'Rejected',
      value: resp.rejectedApplications ?? DASHBOARD_STATS[3].value,
      icon: 'x',
      iconBg: 'bg-red-500',
      iconColor: 'text-white',
    },
    {
      id: 'total-leads',
      label: 'Total Leads',
      value: resp.totalLeads ?? DASHBOARD_STATS[4].value,
      icon: 'users',
      iconBg: 'bg-violet-600',
      iconColor: 'text-white',
    },
    {
      id: 'leads-approved',
      label: 'Leads Approved',
      value: resp.approvedLeads ?? resp.convertedLeads ?? DASHBOARD_STATS[5]?.value ?? 0,
      icon: 'trend',
      iconBg: 'bg-teal-500',
      iconColor: 'text-white',
    },
  ]
}

export default function AdminDashboard() {
  const [stats, setStats] = useState(DASHBOARD_STATS)

  useEffect(() => {
    let mounted = true

    async function loadSummary() {
      try {
        const token = await getAuthToken()
        const res = await fetch(SUMMARY_URL, {
          method: 'GET',
          headers: {
            accept: 'application/json',
            Authorization: `Bearer ${token}`,
          },
        })
        if (!res.ok) throw new Error('Network response was not ok')
        const data = await res.json()
        if (mounted) setStats(mapResponseToStats(data))
      } catch (err) {
        // keep default stats on error
        // console.error('Failed to load dashboard summary', err)
      }
    }

    loadSummary()
    return () => {
      mounted = false
    }
  }, [])

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-3">
      {stats.map((stat) => (
        <StatCard key={stat.id} {...stat} />
      ))}
    </div>
  )
}
