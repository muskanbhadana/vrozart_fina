import { useEffect, useState } from 'react'
import AdminLayout from './components/AdminLayout.jsx'
import { getAuthToken, clearAuthToken } from './config/auth.js'
import AdminDashboard from './pages/AdminDashboard.jsx'
import ApplicationsPage from './pages/ApplicationsPage.jsx'
import SelectApplicationPage from './pages/SelectApplicationPage.jsx'
import SelectEmployeePage from './pages/SelectEmployeePage.jsx'
import LeadsPage from './pages/LeadsPage.jsx'
import ApplicationDetailsPage from './pages/ApplicationDetailsPage.jsx'
import VaultPage from './pages/VaultPage.jsx'
import EmployeesPage from './pages/EmployeesPage.jsx'
import LeadDetailsPage from './pages/LeadDetailsPage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import ChatTimelinePage from './pages/ChatTimelinePage.jsx'

// Credit Portal pages
import CreditDashboard from './pages/CreditDashboard.jsx'
import AssignedApplicationsPage from './pages/AssignedApplicationsPage.jsx'
import DocumentsPage from './pages/DocumentsPage.jsx'
import CreditApplicationDetailsPage from './pages/CreditApplicationDetailsPage.jsx'

export default function AdminApp() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return !!localStorage.getItem('vrozart_admin_access_token')
  })
  
  const isCreditRoute = (() => {
    if (typeof window === 'undefined') return false
    
    // Check explicitly saved dashboard type
    if (localStorage.getItem('vrozart_dashboard_type') === 'credit') return true
    
    // Check URL
    if (window.location.pathname.includes('/credit')) return true
    
    // Check role as fallback
    try {
      const userStr = localStorage.getItem('vrozart_admin_user')
      if (userStr) {
        const user = JSON.parse(userStr)
        if (user.role === 'CREDIT_ANALYST' || user.role === 'Credit Analyst') {
          return true
        }
      }
    } catch(e) {}
    
    return false
  })()
    
  const [activePage, setActivePage] = useState('dashboard')
  const [selectedApplication, setSelectedApplication] = useState(null)
  const [assignSourcePage, setAssignSourcePage] = useState('applications')

  useEffect(() => {
    document.body.classList.add('admin-shell')
    return () => document.body.classList.remove('admin-shell')
  }, [])

  const handleNavigate = (page) => {
    setActivePage(page)
    setSelectedApplication(null)
  }

  const handleLogout = () => {
    clearAuthToken()
    setIsAuthenticated(false)
  }

  if (!isAuthenticated) {
    return <LoginPage onLogin={() => setIsAuthenticated(true)} />
  }

  return (
    <AdminLayout activePage={activePage} onNavigate={handleNavigate} onLogout={handleLogout}>
      {activePage === 'dashboard' && (isCreditRoute ? <CreditDashboard /> : <AdminDashboard />)}
      
      {/* Credit specific pages */}
      {activePage === 'assigned-applications' && (
        <AssignedApplicationsPage
          onViewDetails={(app) => {
            setSelectedApplication(app)
            setActivePage('application-details')
          }}
        />
      )}
      {activePage === 'documents' && (
        <DocumentsPage
          application={selectedApplication}
          onBack={() => {
            setActivePage('application-details')
          }}
        />
      )}
      {activePage === 'application-details' && isCreditRoute && (
        <CreditApplicationDetailsPage
          application={selectedApplication}
          onBack={() => {
            setActivePage('assigned-applications')
            setSelectedApplication(null)
          }}
          onViewDocuments={() => {
            setActivePage('documents')
          }}
        />
      )}
      {activePage === 'applications' && (
        <ApplicationsPage
          onViewDetails={(app) => {
            setSelectedApplication(app)
            setActivePage('application-details')
          }}
          onAssignClick={() => {
            setAssignSourcePage('applications')
            setActivePage('select-application')
          }}
          onAssignApplication={(app) => {
            setSelectedApplication(app)
            setAssignSourcePage('applications')
            setActivePage('select-employee')
          }}
        />
      )}
      {activePage === 'select-application' && (
        <SelectApplicationPage
          onBack={() => setActivePage('applications')}
          onContinue={(app) => {
            console.log('Selected app:', app)
            setSelectedApplication(app)
            setAssignSourcePage('select-application')
            setActivePage('select-employee')
          }}
        />
      )}
      {activePage === 'select-employee' && (
        <SelectEmployeePage
          onBack={() => setActivePage(assignSourcePage)}
          onAssign={(emp) => {
            ; (async () => {
              try {
                const token = await getAuthToken()
                const appId = selectedApplication && (selectedApplication.id || selectedApplication.applicationId)
                if (!appId) {
                  alert('No application selected')
                  setSelectedApplication(null)
                  setActivePage('applications')
                  return
                }

                const resp = await fetch(`http://168.144.70.172:8000/api/admin/applications/${encodeURIComponent(appId)}/assign`, {
                  method: 'PATCH',
                  headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                  },
                  body: JSON.stringify({ analystId: emp.id }),
                })

                if (!resp.ok) {
                  const txt = await resp.text()
                  throw new Error(txt || 'Assign failed')
                }

                const json = await resp.json()
                alert('Application assigned successfully')
                console.log('Assign response:', json)
                // Always navigate to applications list as requested
                setSelectedApplication(null)
                setActivePage('applications')
              } catch (err) {
                // eslint-disable-next-line no-console
                console.error('Assign failed', err)
                alert('Failed to assign application')
                setSelectedApplication(null)
                setActivePage('applications')
              }
            })()
          }}
        />
      )}
      {activePage === 'leads' && (
        <LeadsPage
          onViewDetails={(lead) => {
            setSelectedApplication(lead)
            setActivePage('lead-details')
          }}
          onAddLead={() => {
            setSelectedApplication(null)
            setActivePage('lead-details')
          }}
        />
      )}
      {activePage === 'employees' && <EmployeesPage />}
      {activePage === 'application-details' && !isCreditRoute && (
        <ApplicationDetailsPage
          application={selectedApplication}
          onBack={() => {
            setActivePage('applications')
            setSelectedApplication(null)
          }}
          onViewVault={() => {
            setActivePage('vault')
          }}
          onAssignApplication={() => {
            setAssignSourcePage('application-details')
            setActivePage('select-employee')
          }}
          onReviewChat={() => {
            setActivePage('chat-timeline')
          }}
        />
      )}
      {activePage === 'lead-details' && (
        <LeadDetailsPage
          lead={selectedApplication}
          onBack={() => {
            setActivePage('leads')
            setSelectedApplication(null)
          }}
        />
      )}
      {activePage === 'vault' && (
        <VaultPage
          application={selectedApplication}
          onBack={() => {
            setActivePage('application-details')
          }}
        />
      )}
      {activePage === 'chat-timeline' && (
        <ChatTimelinePage
          application={selectedApplication}
          onBack={() => {
            setActivePage('application-details')
          }}
        />
      )}
    </AdminLayout>
  )
}
