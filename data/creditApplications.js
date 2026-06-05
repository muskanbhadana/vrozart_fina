export const ASSIGNED_APPLICATIONS = [
  {
    id: 'VZF-28382',
    applicantName: 'Rahul Sharma',
    phone: '+91 98765 43210',
    email: 'vrozart@gmail.com',
    businessName: 'Godrej Traders Pvt Ltd',
    status: 'pending_review',
    stage: 'under_review',
    date: '5 May,2026',
  },
  {
    id: 'VZF-28382',
    applicantName: 'Vikrant Singh Bais',
    phone: '+91 98765 43210',
    email: 'vrozart@gmail.com',
    businessName: 'Sharma Traders',
    status: 'approved',
    stage: 'approved',
    date: '5 May,2026',
  },
  {
    id: 'VZF-28382',
    applicantName: 'Rahul Sharma',
    phone: '+91 98765 43210',
    email: 'vrozart@gmail.com',
    businessName: 'Godrej Traders Pvt Ltd',
    status: 'issue_raised',
    stage: 'financial_upload',
    date: '5 May,2026',
  },
  {
    id: 'VZF-28382',
    applicantName: 'Vikrant Singh Bais',
    phone: '+91 98765 43210',
    email: 'vrozart@gmail.com',
    businessName: 'Sharma Traders',
    status: 'rejected',
    stage: 'rejected',
    date: '5 May,2026',
  },
  {
    id: 'VZF-28382',
    applicantName: 'Rahul Sharma',
    phone: '+91 98765 43210',
    email: 'vrozart@gmail.com',
    businessName: 'Godrej Traders Pvt Ltd',
    status: 'pending_review',
    stage: 'under_review',
    date: '5 May,2026',
  },
  {
    id: 'VZF-28382',
    applicantName: 'Vikrant Singh Bais',
    phone: '+91 98765 43210',
    email: 'vrozart@gmail.com',
    businessName: 'Sharma Traders',
    status: 'approved',
    stage: 'approved',
    date: '5 May,2026',
  },
  {
    id: 'VZF-28382',
    applicantName: 'Rahul Sharma',
    phone: '+91 98765 43210',
    email: 'vrozart@gmail.com',
    businessName: 'Godrej Traders Pvt Ltd',
    status: 'issue_raised',
    stage: 'financial_upload',
    date: '5 May,2026',
  },
  {
    id: 'VZF-28382',
    applicantName: 'Vikrant Singh Bais',
    phone: '+91 98765 43210',
    email: 'vrozart@gmail.com',
    businessName: 'Sharma Traders',
    status: 'rejected',
    stage: 'rejected',
    date: '5 May,2026',
  },
]

export const APPLICATION_STATUS = {
  pending_review: {
    label: 'Pending Review',
    className: 'bg-[#FFF6D8] text-[#B78822]',
    icon: 'clock',
  },
  approved: {
    label: 'Approved',
    className: 'bg-[#D6F7E5] text-[#139757]',
    icon: 'checkCircle',
  },
  issue_raised: {
    label: 'Issue Raised',
    className: 'bg-[#B33B4D] text-white',
    icon: 'checkCircle',
  },
  rejected: {
    label: 'Rejected',
    className: 'bg-[#B33B4D] text-white',
    icon: 'checkCircle',
  },
}

export const APPLICATION_STAGE = {
  under_review: {
    label: 'Under Review',
    className: 'bg-[#FFF6D8] text-[#B78822]',
    icon: 'clock',
  },
  approved: {
    label: 'Approved',
    className: 'bg-[#D6F7E5] text-[#139757]',
    icon: 'checkCircle',
  },
  financial_upload: {
    label: 'Financial Upload',
    className: 'bg-[#DE8239] text-white',
    icon: 'clock',
  },
  rejected: {
    label: 'Rejected',
    className: 'bg-[#B33B4D] text-white',
    icon: 'checkCircle',
  },
}

export const STATUS_FILTER_OPTIONS = [
  { value: 'all', label: 'All Status' },
  ...Object.entries(APPLICATION_STATUS).map(([value, { label }]) => ({ value, label })),
]
