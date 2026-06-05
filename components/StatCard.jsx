import { StatIcon } from './AdminIcons.jsx'

export default function StatCard({ label, value, icon, iconBg, iconColor }) {
  return (
    <article className="admin-surface rounded-xl border border-slate-200/70 p-5 shadow-sm">
      <div className={`mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg ${iconBg} ${iconColor}`}>
        <StatIcon name={icon} className="h-5 w-5" />
      </div>
      <p className="admin-subtitle text-sm">{label}</p>
      <p className="admin-value mt-1 text-3xl tracking-tight">{value}</p>
    </article>
  )
}
