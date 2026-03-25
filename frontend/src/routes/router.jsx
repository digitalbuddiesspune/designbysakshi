import {
  createBrowserRouter,
  createRoutesFromElements,
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
import Cart from "../pages/Cart.jsx";
import Wishlist from "../pages/Wishlist.jsx";
import ProductDetail from "../pages/ProductDetail.jsx";
import CategoryPage from "../pages/CategoryPage.jsx";
import Checkout from "../pages/Checkout.jsx";
import WeddingCollection from "../pages/WeddingCollection.jsx";
import FestiveCollection from "../pages/FestiveCollection.jsx";
import PartywearCollection from "../pages/PartywearCollection.jsx";
import DailywearCollection from "../pages/DailywearCollection.jsx";
import OfficewearCollection from "../pages/OfficewearCollection.jsx";
import LuxuryAdCollection from "../pages/LuxuryAdCollection.jsx";
import PrivacyPolicy from "../pages/PrivacyPolicy.jsx";
import RefundPolicy from "../pages/RefundPolicy.jsx";
import ShippingPolicy from "../pages/ShippingPolicy.jsx";
import TermsConditions from "../pages/TermsConditions.jsx";
import Blog from "../pages/Blog.jsx";
import BlogDetail from "../pages/BlogDetail.jsx";
import AddBlog from "../pages/admin/AddBlog.jsx";

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
      <Route path="cart" element={<Cart />} />
      <Route path="checkout" element={<Checkout />} />
      <Route path="wishlist" element={<Wishlist />} />
      <Route path="admin/login" element={<AdminLogin />} />
      <Route path="admin" element={<AdminLayout />}>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="add-product" element={<AdminAddProduct />} />
        <Route path="products" element={<MyProducts />} />
        <Route path="categories" element={<MyCategories />} />
        <Route path="add-category" element={<AddCategory />} />
        <Route path="edit-category/:id" element={<EditCategory />} />
        <Route path="testimonials" element={<AdminTestimonials />} />
        <Route path="add-blog" element={<AddBlog />} />
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
      <Route path="wedding-collection" element={<WeddingCollection />} />
      <Route path="festive-collection" element={<FestiveCollection />} />
      <Route path="partywear-collection" element={<PartywearCollection />} />
      <Route path="dailywear-collection" element={<DailywearCollection />} />
      <Route path="officewear-collection" element={<OfficewearCollection />} />
      <Route path="luxuryad-collection" element={<LuxuryAdCollection />} />
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