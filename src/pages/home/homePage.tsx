import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import HomeMain from "./HomeMain";
import HomeSplash from "./HomeSplash";

function hasAccessToken() {
  return typeof localStorage !== "undefined" && !!localStorage.getItem("accessToken");
}

export default function HomePage() {
  const navigate = useNavigate();
  const loggedIn = hasAccessToken();

  useEffect(() => {
    if (loggedIn) return undefined;
    const id = window.setTimeout(() => {
      navigate("/auth/login");
    }, 1000);
    return () => window.clearTimeout(id);
  }, [loggedIn, navigate]);

  if (loggedIn) return <HomeMain />;
  return <HomeSplash />;
}