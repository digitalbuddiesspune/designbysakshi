import {
  createBrowserRouter,
  createRoutesFromElements,
  Navigate,
  Route,
} from "react-router-dom";
import App from "../App.jsx";
import HomePage from "../pages/Homepage.jsx";
import Shop from "../pages/Shop.jsx";
import About from "../pages/About.jsx";
import Collection from "../pages/Collection.jsx";
import Contact from "../pages/Contact.jsx";
import AdminLayout from "../components/AdminLayout.jsx";
import Dashboard from "../pages/admin/Dashboard.jsx";
import AdminAddProduct from "../pages/AdminAddProduct.jsx";
import MyProducts from "../pages/admin/MyProducts.jsx";
import MyCategories from "../pages/admin/MyCategories.jsx";
import AddCategory from "../pages/admin/AddCategory.jsx";
import EditCategory from "../pages/admin/EditCategory.jsx";
import AdminTestimonials from "../pages/admin/AdminTestimonials.jsx";
import AdminLogin from "../pages/admin/AdminLogin.jsx";
import Login from "../pages/Login.jsx";
import Signup from "../pages/Signup.jsx";
import Profile from "../pages/Profile.jsx";
import Orders from "../pages/Orders.jsx";
import OrderDetail from "../pages/OrderDetail.jsx";
import Cart from "../pages/Cart.jsx";
import Wishlist from "../pages/Wishlist.jsx";
import ProductDetail from "../pages/ProductDetail.jsx";
import CategoryPage from "../pages/CategoryPage.jsx";
import Checkout from "../pages/Checkout.jsx";
import LatestCollectionSlugRedirect from "../pages/LatestCollectionSlugRedirect.jsx";
import PrivacyPolicy from "../pages/PrivacyPolicy.jsx";
import RefundPolicy from "../pages/RefundPolicy.jsx";
import ShippingPolicy from "../pages/ShippingPolicy.jsx";
import TermsConditions from "../pages/TermsConditions.jsx";
import Blog from "../pages/Blog.jsx";
import BlogDetail from "../pages/BlogDetail.jsx";
import AddBlog from "../pages/admin/AddBlog.jsx";
import MyOrders from "../pages/admin/MyOrders.jsx";
import AdminOrderDetails from "../pages/admin/OrderDetails.jsx";
import Users from "../pages/admin/Users.jsx";
import AdminProfile from "../pages/admin/AdminProfile.jsx";
import AdminBanners from "../pages/admin/AdminBanners.jsx";
import AdminCollections from "../pages/admin/AdminCollections.jsx";
import AdminPayments from "../pages/admin/Payments.jsx";
import AdminCoupons from "../pages/admin/Coupons.jsx";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route index element={<HomePage />} />
      <Route path="shop" element={<Shop />} />
      <Route path="about" element={<About />} />
      <Route path="collections" element={<Collection />} />
      <Route path="contact" element={<Contact />} />
      <Route path="login" element={<Login />} />
      <Route path="signup" element={<Signup />} />
      <Route path="profile" element={<Profile />} />
      <Route path="orders" element={<Orders />} />
      <Route path="orders/:id" element={<OrderDetail />} />
      <Route path="cart" element={<Cart />} />
      <Route path="checkout" element={<Checkout />} />
      <Route path="wishlist" element={<Wishlist />} />
      <Route path="admin/login" element={<AdminLogin />} />
      <Route path="admin" element={<AdminLayout />}>
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="orders" element={<MyOrders />} />
        <Route path="payments" element={<AdminPayments />} />
        <Route path="coupons" element={<AdminCoupons />} />
        <Route path="users" element={<Users />} />
        <Route path="profile" element={<AdminProfile />} />
        <Route path="order-details/:id" element={<AdminOrderDetails />} />
        <Route path="add-product" element={<AdminAddProduct />} />
        <Route path="products" element={<MyProducts />} />
        <Route path="categories" element={<MyCategories />} />
        <Route path="add-category" element={<AddCategory />} />
        <Route path="edit-category/:id" element={<EditCategory />} />
        <Route path="testimonials" element={<AdminTestimonials />} />
        <Route path="blogs" element={<AddBlog />} />
        <Route path="banners" element={<AdminBanners />} />
        <Route path="collections-showcase" element={<AdminCollections />} />
      </Route>
      <Route path="necklace-sets" element={<CategoryPage />} />
      <Route path="earrings" element={<CategoryPage />} />
      <Route path="rings" element={<CategoryPage />} />
      <Route path="ring" element={<CategoryPage />} />
      <Route path="bangles-bracelets" element={<CategoryPage />} />
      <Route path="pendants" element={<CategoryPage />} />
      <Route path="bridal-jewellery" element={<CategoryPage />} />
      <Route path="anklets" element={<CategoryPage />} />
      <Route path="latest-collection" element={<CategoryPage />} />
      <Route path="bestseller" element={<CategoryPage />} />
      <Route path="new-arrival" element={<CategoryPage />} />
      <Route path="product/:id" element={<ProductDetail />} />
      <Route path="latest-collection/:slug" element={<LatestCollectionSlugRedirect />} />
      {/* Backward-compat redirects from old routes */}
      <Route path="wedding-collection" element={<Navigate to="/latest-collection?subcategory=wedding-collection" replace />} />
      <Route path="festive-collection" element={<Navigate to="/latest-collection?subcategory=festive-collection" replace />} />
      <Route path="partywear-collection" element={<Navigate to="/latest-collection?subcategory=partywear-collection" replace />} />
      <Route path="dailywear-collection" element={<Navigate to="/latest-collection?subcategory=dailywear-collection" replace />} />
      <Route path="officewear-collection" element={<Navigate to="/latest-collection?subcategory=officewear-collection" replace />} />
      <Route path="luxuryad-collection" element={<Navigate to="/latest-collection?subcategory=luxuryad-collection" replace />} />
      <Route path="privacy-policy" element={<PrivacyPolicy />} />
      <Route path="refund-policy" element={<RefundPolicy />} />
      <Route path="shipping-policy" element={<ShippingPolicy />} />
      <Route path="terms-conditions" element={<TermsConditions />} />
      <Route path="blog" element={<Blog />} />
      <Route path="blog/:id" element={<BlogDetail />} />
    </Route>,
  ),
);
export default router;