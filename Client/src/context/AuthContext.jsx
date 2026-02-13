import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

axios.defaults.withCredentials = true;

const AuthContext = createContext();

/* ---------- PROVIDER ---------- */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // fetch /me
const fetchMe = async () => {
  try {
    const res = await axios.get("http://localhost:5000/auth/me", {
      withCredentials: true,
    });
    setUser(res.data);
  } catch (err) {
    setUser(null);
  }
};


  // run once on app load
  useEffect(() => {
    const init = async () => {
      try {
        await fetchMe();
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  const logout = async () => {
    await axios.post("http://localhost:5000/auth/logout");
    setUser(null);
  };

  return (
<AuthContext.Provider value={{ user, loading, logout, fetchMe }}>
    {!loading && children}
  </AuthContext.Provider>
  );
};

/* ---------- CUSTOM HOOK (THIS WAS MISSING) ---------- */
export const useAuth = () => {
  return useContext(AuthContext);
};
