<<<<<<< HEAD
import HomePageContent from "../../components/home/HomePage";

export default function HomePage() {
  return <HomePageContent />;
=======
import { useEffect, useState } from "react";
import HomeMain from "./HomeMain";
import HomeSplash from "./HomeSplash";
import HomeWelcome from "./HomeWelcome";

const WELCOME_SEEN_KEY = "homeWelcomeSeen";

function hasAccessToken() {
  return typeof localStorage !== "undefined" && !!localStorage.getItem("accessToken");
}

export default function HomePage() {
  const loggedIn = hasAccessToken();

  const [phase, setPhase] = useState<"splash" | "welcome">(() =>
    typeof sessionStorage !== "undefined" && sessionStorage.getItem(WELCOME_SEEN_KEY) === "1"
      ? "welcome"
      : "splash",
  );

  useEffect(() => {
    if (loggedIn) return;
    if (phase !== "splash") return;
    const id = window.setTimeout(() => {
      sessionStorage.setItem(WELCOME_SEEN_KEY, "1");
      setPhase("welcome");
    }, 2200);
    return () => window.clearTimeout(id);
  }, [phase, loggedIn]);

  if (loggedIn) return <HomeMain />;
  if (phase === "splash") return <HomeSplash />;
  return <HomeWelcome />;
>>>>>>> 3bf92e6d74f1984582c49fbca0db99401cb9ad44
}
