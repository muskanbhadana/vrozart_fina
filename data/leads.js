export const LEADS = [
  {
    id: 'VRF-001',
    applicantName: 'Rahul Sharma',
    phone: '+91 99999-99999',
    email: 'rahul@godrejtraders.com',
    businessName: '', // empty to show placeholder 'Enter the company name'
    submittedBy: 'Admin (Ankit Kumar)',
    status: 'new',
    date: '5 May, 2026',
    loanRequirement: '₹ 25000000',
    businessType: '', // empty to show placeholder 'Enter your business type'
  },
  {
    id: 'VRF-002',
    applicantName: 'Vikarant Singh Bala',
    phone: '+91 98765 43220',
    email: 'vikarant@godrejtraders.com',
    businessName: 'Godrej Traders Pvt Ltd',
    submittedBy: 'Admin (Veer Kumar)',
    status: 'contacted',
    date: '5 May, 2026',
    loanRequirement: '₹ 25000000',
    businessType: 'Retail',
  },
  {
    id: 'VRF-003',
    applicantName: 'Rahul Sharma',
    phone: '+91 99999-99999',
    email: 'rahul@godrejtraders.com',
    businessName: 'Sharma Traders',
    submittedBy: 'Admin (Ankit Kumar)',
    status: 'converted',
    date: '5 May, 2026',
    loanRequirement: '₹ 25000000',
    businessType: 'Wholesale',
  },
  {
    id: 'VRF-004',
    applicantName: 'Vikarant Singh Bala',
    phone: '+91 98765 43220',
    email: 'vikarant@godrejtraders.com',
    businessName: 'Godrej Traders Pvt Ltd',
    submittedBy: 'Admin (Ankit Kumar)',
    status: 'new',
    date: '5 May, 2026',
    loanRequirement: '₹ 25000000',
    businessType: 'Retail',
  },
]

export const LEAD_STATUS = {
  new: {
    label: 'New',
    className: 'bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-200/70',
    iconName: 'new',
  },
  contacted: {
    label: 'Contacted',
    className: 'bg-amber-50 text-amber-800 ring-1 ring-inset ring-amber-200/70',
    iconName: 'contacted',
  },
  converted: {
    label: 'Converted',
    className: 'bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-200/70',
    iconName: 'converted',
  },
}

export const LEAD_STATUS_FILTER_OPTIONS = [
  { value: 'all', label: 'All Status' },
  ...Object.entries(LEAD_STATUS).map(([value, { label }]) => ({ value, label })),
]
