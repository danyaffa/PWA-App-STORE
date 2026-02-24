import { Routes, Route } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute.jsx'
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
import NotFound     from './pages/NotFound.jsx'

export default function App() {
  return (
    <Routes>
      <Route path="/"             element={<Home />} />
      <Route path="/store"        element={<Store />} />
      <Route path="/publish"      element={<Publish />} />
      <Route path="/safety"       element={<Safety />} />
      <Route path="/pricing"      element={<Pricing />} />
      <Route path="/app/:id"      element={<AppDetail />} />
      <Route path="/dashboard"    element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/signin"       element={<SignIn />} />
      <Route path="/trust-ops"    element={<ProtectedRoute><TrustOps /></ProtectedRoute>} />
      <Route path="/report/:id"   element={<ScanReport />} />
      <Route path="/app-store"    element={<InstallGuide />} />
      <Route path="/privacy"      element={<Privacy />} />
      <Route path="/terms"        element={<Terms />} />
      <Route path="/support"      element={<Support />} />
      <Route path="/developer-agreement" element={<DeveloperAgreement />} />
      <Route path="/dmca"         element={<DMCA />} />
      <Route path="/how-safety-works" element={<HowSafetyWorks />} />
      <Route path="/app/:id/promote"  element={<Promote />} />
      <Route path="/tutorial"     element={<Tutorial />} />
      <Route path="*"             element={<NotFound />} />
    </Routes>
  )
}
