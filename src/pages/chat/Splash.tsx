import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logoUrl from "../../assets/logo.svg";

export default function HomeSplash() {
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuthAndRedirect = () => {
      const token = localStorage.getItem("accessToken");
      let isValid = false;
      if (typeof token === "string" && token.length > 0) {
        try {
          const payload = JSON.parse(atob(token.split(".")[1]));
          const exp = payload.exp as number | undefined;
          isValid = exp == null || Date.now() / 1000 < exp;
        } catch {
          isValid = false;
        }
      }

      setTimeout(() => {
        if (isValid) {
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
