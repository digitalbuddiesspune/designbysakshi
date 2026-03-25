import { Outlet, useLocation } from 'react-router-dom'
import Footer from './components/Footer'
import Header from './components/Header'
import { useEffect } from 'react'

const App = () => {
  const location = useLocation();
  // Hide header/footer for all admin routes including admin/login
  const isAdminRoute = location.pathname.startsWith('/admin');
  



  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth" // optional
    });
  }, [location]);
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {!isAdminRoute && <Header />}
      <main style={{ flex: 1 }} className="pb-20 md:pb-0">
        <Outlet />
      </main>
      {!isAdminRoute && <Footer />}
    </div>
  )
}

export default App