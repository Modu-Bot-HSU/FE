import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logoUrl from "../../assets/logo.svg";

export default function HomeSplash() {
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuthAndRedirect = () => {
      const accessToken = localStorage.getItem("accessToken");
      const hasToken = typeof accessToken === "string" && accessToken.length > 0;

      setTimeout(() => {
        if (hasToken) {
          navigate("/chat", { replace: true });
        } else {
          navigate("/auth/login", { replace: true });
        }
      }, 1500);
    };

    checkAuthAndRedirect();
  }, [navigate]);

  return (
    <div className="min-h-[calc(100vh-0px)] flex items-center justify-center bg-[#F5F5F5]">
      <img src={logoUrl} alt="ModuBot" className="w-[min(72vw,260px)] h-auto select-none" />
    </div>
  );
}
