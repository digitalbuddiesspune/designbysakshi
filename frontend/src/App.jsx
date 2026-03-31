import { Outlet, useLocation } from 'react-router-dom'
import Footer from './components/Footer'
import Header from './components/Header'
import { useEffect, useState } from 'react'
import Login from './pages/Login'
import Signup from './pages/Signup'

const App = () => {
  const location = useLocation();
  const API_URL = import.meta.env.VITE_API_URL;
  const [authModal, setAuthModal] = useState(null);
  // Hide header/footer for all admin routes including admin/login
  const isAdminRoute = location.pathname.startsWith('/admin');
  const isAuthPage = location.pathname === "/login" || location.pathname === "/signup";
  



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
          if (isProtectedPath) {
            window.dispatchEvent(
              new CustomEvent("open-auth-modal", {
                detail: { type: "login" },
              }),
            );
          }
        }
      } catch (e) {
        // ignore transient network errors
      }
    };

    checkAuthUser();
    const timer = setInterval(checkAuthUser, 15000);
    return () => clearInterval(timer);
  }, [API_URL, location.pathname]);

  useEffect(() => {
    const openAuthModal = (event) => {
      const modalType = event?.detail?.type === "signup" ? "signup" : "login";
      setAuthModal(modalType);
    };
    window.addEventListener("open-auth-modal", openAuthModal);
    return () => window.removeEventListener("open-auth-modal", openAuthModal);
  }, []);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {!isAdminRoute && <Header />}
      <main
        style={{ flex: 1 }}
        className={
          isAdminRoute
            ? "pb-20 md:pb-0"
            : "pt-16 md:pt-[112px] lg:pt-[144px] pb-20 md:pb-0"
        }
      >
        <Outlet />
      </main>
      <div className={isAuthPage ? "mt-6 sm:mt-8 lg:mt-10" : "-mt-16 sm:-mt-6 lg:-mt-6"}>
      {!isAdminRoute && <Footer />}
      </div>
      {authModal === "login" && (
        <Login
          isModal
          onClose={() => setAuthModal(null)}
          onSwitchSignup={() => setAuthModal("signup")}
        />
      )}
      {authModal === "signup" && (
        <Signup
          isModal
          onClose={() => setAuthModal(null)}
          onSwitchLogin={() => setAuthModal("login")}
        />
      )}
    </div>
  )
}

export default App