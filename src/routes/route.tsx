import { createBrowserRouter, createHashRouter } from "react-router-dom";
import About from "../pages/About.tsx";
import Home from "../pages/chat/Main.tsx";
import NotFound from "../pages/NotFound.tsx";
import RootLayout from "../layouts/RootLayout.tsx";
import SignUp from "../pages/signup/SignUp.tsx";
import Login from "../pages/login/Login.tsx";
import NftMapPage from "../pages/map/MapPage.tsx";
import NftDetailPage from "../pages/shop/ShopDetailPage.tsx";
import NftCollectionPage from "../pages/shop/ShopPage.tsx";
import DailyQPage from "../pages/DailyQPage.tsx";
import ProfilePage from "../pages/ProfilePage.tsx";
import { ProtectedRoute, PublicOnlyRoute } from "./protectedRoute.tsx";

const routes = [
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        element: <PublicOnlyRoute />,
        children: [
          { path: "auth/signup", element: <SignUp /> },
          { path: "auth/login", element: <Login /> },
        ],
      },
      {
        element: <ProtectedRoute />,
        children: [
          { index: true, element: <Home /> },
          { path: "daily-q", element: <DailyQPage /> },
          { path: "campus", element: <NftMapPage /> },
          { path: "campus/collection", element: <NftCollectionPage /> },
          { path: "campus/:index", element: <NftDetailPage /> },
          { path: "profile", element: <ProfilePage /> },
        ],
      },
      { path: "about", element: <About /> },
      { path: "*", element: <NotFound /> },
    ],
  },
];

const router = import.meta.env.PROD
  ? createHashRouter(routes)
  : createBrowserRouter(routes);

export default router;
