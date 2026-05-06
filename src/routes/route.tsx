import { createBrowserRouter } from "react-router-dom";
import About from "../pages/About.tsx";
import Home from "../pages/home/homePage.tsx";
import NotFound from "../pages/NotFound.tsx";
import RootLayout from "../layouts/RootLayout.tsx";
import SignUp from "../pages/signup/SignUp.tsx";
import Login from "../pages/login/Login.tsx";
import MapPage from "../pages/map/MapPage.tsx";
import ShopDetailPage from "../pages/shop/ShopDetailPage.tsx";
import ShopPage from "../pages/shop/ShopPage.tsx";
import ProfilePage from "../pages/profile/ProfilePage.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: "about", element: <About /> },
      { path: "auth/signup", element: <SignUp /> },
      { path: "auth/login", element: <Login /> },
      { path: "profile", element: <ProfilePage /> },
      { path: "campus", element: <MapPage /> },
      { path: "campus/collection", element: <ShopPage /> },
      { path: "campus/:index", element: <ShopDetailPage /> },
      { path: "*", element: <NotFound /> },
    ],
  },
]);

export default router;
