import { Outlet, useLocation } from 'react-router-dom'
import Footer from './components/Footer'
import Header from './components/Header'

const App = () => {
  const location = useLocation();
  // Hide header/footer for all admin routes including admin/login
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {!isAdminRoute && <Header />}
      <main style={{ flex: 1 }}>
        <Outlet />
      </main>
      {!isAdminRoute && <Footer />}
    </div>
  )
}

export default App