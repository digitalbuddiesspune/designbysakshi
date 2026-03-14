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
import AdminLogin from "../pages/admin/AdminLogin.jsx";
import Login from "../pages/Login.jsx";
import Signup from "../pages/Signup.jsx";
import Profile from "../pages/Profile.jsx";
import Orders from "../pages/Orders.jsx";
import CategoryPage from "../pages/CategoryPage.jsx";

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
      <Route path="admin/login" element={<AdminLogin />} />
      <Route path="admin" element={<AdminLayout />}>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="add-product" element={<AdminAddProduct />} />
        <Route path="products" element={<MyProducts />} />
        <Route path="categories" element={<MyCategories />} />
        <Route path="add-category" element={<AddCategory />} />
        <Route path="edit-category/:id" element={<EditCategory />} />
      </Route>
      <Route path="necklace-sets" element={<CategoryPage />} />
      <Route path="earrings" element={<CategoryPage />} />
      <Route path="rings" element={<CategoryPage />} />
      <Route path="ring" element={<CategoryPage />} />
      <Route path="bangles-bracelets" element={<CategoryPage />} />
      <Route path="pendants" element={<CategoryPage />} />
      <Route path="bridal-jewellery" element={<CategoryPage />} />
      <Route path="anklets" element={<CategoryPage />} />
    </Route>,
  ),
);
export default router;