import { createHashRouter } from "react-router-dom";
import About from "../pages/About.tsx";
import HomePage from "../pages/home/homePage.tsx";
import NotFound from "../pages/NotFound.tsx";
import RootLayout from "../layouts/RootLayout.tsx";
import SignUp from "../pages/signup/SignUp.tsx";
import Login from "../pages/login/Login.tsx";
import NftMapPage from "../pages/nft/NftMapPage.tsx";
import NftDetailPage from "../pages/nft/NftDetailPage.tsx";
import NftCollectionPage from "../pages/nft/NftCollectionPage.tsx";

const router = createHashRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "about", element: <About /> },
      { path: "auth/signup", element: <SignUp /> },
      { path: "auth/login", element: <Login /> },
      { path: "campus", element: <NftMapPage /> },
      { path: "campus/collection", element: <NftCollectionPage /> },
      { path: "campus/:index", element: <NftDetailPage /> },
      { path: "*", element: <NotFound /> },
    ],
  },
]);

export default router;
