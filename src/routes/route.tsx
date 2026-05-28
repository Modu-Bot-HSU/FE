import { createBrowserRouter } from "react-router-dom";
import About from "../pages/About.tsx";
import Home from "../pages/chat/Main.tsx";
import NotFound from "../pages/NotFound.tsx";
import RootLayout from "../layouts/RootLayout.tsx";
import SignUp from "../pages/signup/SignUp.tsx";
import Login from "../pages/login/Login.tsx";
import NftMapPage from "../pages/map/MapPage.tsx";
import NftCollectionPage from "../pages/shop/ShopPage.tsx";
import DailyQPage from "../pages/DailyQPage.tsx";
import ProfilePage from "../pages/profile/ProfilePage.tsx";
import Splash from "../pages/chat/Splash.tsx";
import AdminPage from "../pages/admin/AdminPage.tsx";
import DailyQHistoryPage from "../pages/daily-q/DailyQHistoryPage.tsx";
import { ProtectedRoute, PublicOnlyRoute } from "./protectedRoute.tsx";

const routes = [
  {
    path: "/",
    element: <Splash />,
  },
  {
    element: <PublicOnlyRoute />,
    children: [
      { path: "auth/signup", element: <SignUp /> },
      { path: "auth/login", element: <Login /> },
    ],
  },
  {
    element: <RootLayout />,
    children: [
      {
        element: <ProtectedRoute />,
        children: [
          { path: "chat", element: <Home /> },
          { path: "daily-q", element: <DailyQPage /> },
          { path: "daily-q/history", element: <DailyQHistoryPage /> },
          { path: "campus", element: <NftMapPage /> },
          { path: "campus/collection", element: <NftCollectionPage /> },
          { path: "profile", element: <ProfilePage /> },
          { path: "admin", element: <AdminPage /> },
        ],
      },
      { path: "about", element: <About /> },
      { path: "*", element: <NotFound /> },
    ],
  },
];

const router = createBrowserRouter(routes);

export default router;
