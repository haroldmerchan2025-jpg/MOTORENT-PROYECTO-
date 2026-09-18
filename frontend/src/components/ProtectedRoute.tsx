import { useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";

function ProtectedRoute() {
  const token = localStorage.getItem("token");
  const tieneSesionValida = token && token !== "undefined" && token !== "null";

  useEffect(() => {
    function bloquearRetroceso() {
      if (!localStorage.getItem("token")) {
        window.history.pushState(null, "", "/login");
        window.location.replace("/login");
      }
    }

    window.addEventListener("popstate", bloquearRetroceso);
    return () => window.removeEventListener("popstate", bloquearRetroceso);
  }, []);

  if (!tieneSesionValida) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;