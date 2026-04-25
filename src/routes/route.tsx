import { createBrowserRouter } from "react-router-dom";
import About from "../pages/About.tsx";
import Home from "../pages/home/homePage.tsx";
import NotFound from "../pages/NotFound.tsx";
import RootLayout from "../layouts/RootLayout.tsx";
import ApiTestPage from "../pages/ApiTestPage.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: "about", element: <About /> },
      { path: "api-test", element: <ApiTestPage /> },
      { path: "*", element: <NotFound /> },
    ],
  },
]);

export default router;
