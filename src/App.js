import { useState } from "react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import DB from "./data/db";
import AuthPage      from "./pages/AuthPage";
import HomePage      from "./pages/HomePage";
import CareerLayout  from "./components/CareerLayout";

function AppInner() {
  const { user, logout } = useAuth();
  const [page,   setPage]   = useState("home");
  const [career, setCareer] = useState(null);

  const navigate = (p, c = null) => {
    setPage(p);
    if (c && c !== career) { setCareer(c); if (user) DB.logSession(user.id, c); }
    else if (c) setCareer(c);
    window.scrollTo(0, 0);
  };

  const handleLogout = () => { logout(); setPage("home"); setCareer(null); };

  if (!user) return <AuthPage />;

  if (career && page !== "home") {
    return <CareerLayout career={career} page={page} navigate={navigate} user={user} onLogout={handleLogout} />;
  }

  return <HomePage navigate={navigate} user={user} onLogout={handleLogout} />;
}

export default function App() {
  return <AuthProvider><AppInner /></AuthProvider>;
}
