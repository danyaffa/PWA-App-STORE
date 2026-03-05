import { Routes, Route } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import ManagementRoute from './components/ManagementRoute.jsx'
import InstallButton from './components/InstallButton.jsx'
import IOSInstallGuide from './components/IOSInstallGuide.jsx'
import { usePWAInstall } from './hooks/usePWAInstall.js'

import Home         from './pages/Home.jsx'
import Store        from './pages/Store.jsx'
import Publish      from './pages/Publish.jsx'
import Safety       from './pages/Safety.jsx'
import Pricing      from './pages/Pricing.jsx'
import AppDetail    from './pages/AppDetail.jsx'
import Dashboard    from './pages/Dashboard.jsx'
import SignIn       from './pages/SignIn.jsx'
import TrustOps     from './pages/TrustOps.jsx'
import ScanReport   from './pages/ScanReport.jsx'
import InstallGuide from './pages/InstallGuide.jsx'
import Privacy      from './pages/Privacy.jsx'
import Terms        from './pages/Terms.jsx'
import Support      from './pages/Support.jsx'
import DeveloperAgreement from './pages/DeveloperAgreement.jsx'
import DMCA         from './pages/DMCA.jsx'
import HowSafetyWorks from './pages/HowSafetyWorks.jsx'
import Promote      from './pages/Promote.jsx'
import Tutorial     from './pages/Tutorial.jsx'
import Management   from './pages/Management.jsx'
import ManagementLogin from './pages/ManagementLogin.jsx'
import Diagnostics  from './pages/Diagnostics.jsx'
import PayPalSetup  from './pages/PayPalSetup.jsx'
import NotFound     from './pages/NotFound.jsx'

export default function App() {
  const { showIOSGuide, dismissIOSGuide } = usePWAInstall()

  return (
    <>
    <InstallButton />
    {showIOSGuide && <IOSInstallGuide onDismiss={dismissIOSGuide} />}
    <Routes>
      <Route path="/"             element={<Home />} />
      <Route path="/store"        element={<ProtectedRoute><Store /></ProtectedRoute>} />
      <Route path="/publish"      element={<ProtectedRoute><Publish /></ProtectedRoute>} />
      <Route path="/safety"       element={<ProtectedRoute><Safety /></ProtectedRoute>} />
      <Route path="/pricing"      element={<ProtectedRoute><Pricing /></ProtectedRoute>} />
      <Route path="/app/:id"      element={<ProtectedRoute><AppDetail /></ProtectedRoute>} />
      <Route path="/dashboard"    element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/signin"       element={<SignIn />} />
      <Route path="/trust-ops"    element={<ProtectedRoute><TrustOps /></ProtectedRoute>} />
      <Route path="/management-login" element={<ManagementLogin />} />
      <Route path="/management"   element={<ManagementRoute><Management /></ManagementRoute>} />
      <Route path="/report/:id"   element={<ProtectedRoute><ScanReport /></ProtectedRoute>} />
      <Route path="/app-store"    element={<InstallGuide />} />
      <Route path="/privacy"      element={<Privacy />} />
      <Route path="/terms"        element={<Terms />} />
      <Route path="/support"      element={<Support />} />
      <Route path="/developer-agreement" element={<ProtectedRoute><DeveloperAgreement /></ProtectedRoute>} />
      <Route path="/dmca"         element={<DMCA />} />
      <Route path="/how-safety-works" element={<HowSafetyWorks />} />
      <Route path="/app/:id/promote"  element={<ProtectedRoute><Promote /></ProtectedRoute>} />
      <Route path="/tutorial"     element={<ProtectedRoute><Tutorial /></ProtectedRoute>} />
      <Route path="/diagnostics"  element={<ProtectedRoute><Diagnostics /></ProtectedRoute>} />
      <Route path="/paypal/setup" element={<ProtectedRoute><PayPalSetup /></ProtectedRoute>} />
      <Route path="*"             element={<NotFound />} />
    </Routes>
    </>
  )
}
