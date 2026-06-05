export const APPLICATIONS = [
  {
    id: 'VZF-29382',
    applicantName: 'Rajesh Kumar',
    phone: '+91 98765 43210',
    email: 'rajesh.kumar@email.com',
    businessName: 'Kumar Enterprises',
    status: 'under_review',
    date: '5 h',
    assignTo: 'Rahul Kumar',
  },
  {
    id: 'VZF-29381',
    applicantName: 'Priya Sharma',
    phone: '+91 87654 32109',
    email: 'priya.sharma@email.com',
    businessName: 'Sharma Textiles',
    status: 'approved',
    date: '1 d',
    assignTo: 'Vishal Kumar',
  },
  {
    id: 'VZF-29380',
    applicantName: 'Amit Patel',
    phone: '+91 76543 21098',
    email: 'amit.patel@email.com',
    businessName: 'Patel Logistics',
    status: 'financial_upload',
    date: '2 d',
    assignTo: 'Rahul Kumar',
  },
  {
    id: 'VZF-29379',
    applicantName: 'Sneha Reddy',
    phone: '+91 65432 10987',
    email: 'sneha.reddy@email.com',
    businessName: 'Reddy Foods',
    status: 'rejected',
    date: '3 d',
    assignTo: 'Vishal Kumar',
  },
  {
    id: 'VZF-29378',
    applicantName: 'Vikram Singh',
    phone: '+91 54321 09876',
    email: 'vikram.singh@email.com',
    businessName: 'Singh Motors',
    status: 'kyc',
    date: '4 d',
    assignTo: 'Rahul Kumar',
  },
  {
    id: 'VZF-29377',
    applicantName: 'Anita Desai',
    phone: '+91 43210 98765',
    email: 'anita.desai@email.com',
    businessName: 'Desai Pharma',
    status: 'under_review',
    date: '5 d',
    assignTo: 'Vishal Kumar',
  },
]

export const APPLICATION_STATUS = {
  under_review: {
    label: 'Under Review',
    className: 'bg-amber-50 text-amber-800 ring-1 ring-inset ring-amber-200/70',
    icon: 'clock',
  },
  in_progress: {
    label: 'In Progress',
    className: 'bg-amber-50 text-amber-800 ring-1 ring-inset ring-amber-200/70',
    icon: 'clock',
  },
  approved: {
    label: 'Approved',
    className: 'bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-200/70',
    icon: 'check',
  },
  created: {
    label: 'Created',
    className: 'bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-200/70',
    icon: 'check',
  },
  financial_upload: {
    label: 'Financial Upload',
    className: 'bg-orange-500 text-white',
    icon: 'upload',
  },
  rejected: {
    label: 'Rejected',
    className: 'bg-red-600 text-white',
    icon: 'x',
  },
  kyc: {
    label: 'KYC',
    className: 'bg-red-500 text-white',
    icon: 'clock',
  },
}

export const STATUS_FILTER_OPTIONS = [
  { value: 'all', label: 'All Status' },
  ...Object.entries(APPLICATION_STATUS).map(([value, { label }]) => ({ value, label })),
]

