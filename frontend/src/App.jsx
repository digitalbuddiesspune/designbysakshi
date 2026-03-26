import { Outlet, useLocation } from 'react-router-dom'
import Footer from './components/Footer'
import Header from './components/Header'
import { useEffect } from 'react'

const App = () => {
  const location = useLocation();
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";
  // Hide header/footer for all admin routes including admin/login
  const isAdminRoute = location.pathname.startsWith('/admin');
  



  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth" // optional
    });
  }, [location]);

  useEffect(() => {
    const protectedPaths = ["/profile", "/orders", "/cart", "/wishlist", "/checkout"];
    const isProtectedPath =
      protectedPaths.some((p) => location.pathname.startsWith(p)) || location.pathname.startsWith("/orders/");

    const checkAuthUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;
      try {
        const res = await fetch(`${API_URL}/users/auth-check`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          if (isProtectedPath) window.location.href = "/login";
        }
      } catch (e) {
        // ignore transient network errors
      }
    };

    checkAuthUser();
    const timer = setInterval(checkAuthUser, 15000);
    return () => clearInterval(timer);
  }, [API_URL, location.pathname]);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {!isAdminRoute && <Header />}
      <main style={{ flex: 1 }} className="pb-20 md:pb-0">
        <Outlet />
      </main>
      <div className="-mt-16 sm:-mt-6 lg:-mt-6">
      {!isAdminRoute && <Footer />}
      </div>
    </div>
  )
}

export default App