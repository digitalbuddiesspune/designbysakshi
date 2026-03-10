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

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route index element={<HomePage />} />
      <Route path="shop" element={<Shop />} />
      <Route path="about" element={<About />} />
      <Route path="collections" element={<Collection />} />
      <Route path="contact" element={<Contact />} />
    </Route>,
  ),
);
export default router;