import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const ProtectedRoute = ({ children, role }) => {
  const navigate = useNavigate();
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
      navigate("/auth", { replace: true });
      return;
    }

    if (role && user.role !== role) {
      navigate("/reject", { replace: true });
      return;
    }

    setAllowed(true);
  }, [navigate, role]);

  if (!allowed) return null;
  return children;
};

export default ProtectedRoute;
