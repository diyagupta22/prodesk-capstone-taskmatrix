import { useState, useEffect } from "react";

function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [data, setData] = useState("");

  // 🔥 AUTO LOGIN (page refresh pe bhi)
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogin = async () => {
    const res = await fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, password })
    });

    const result = await res.json();

    localStorage.setItem("token", result.token);
    setIsLoggedIn(true);
  };

  const getDashboard = async () => {
    const token = localStorage.getItem("token");

    const res = await fetch("http://localhost:5000/api/dashboard", {
      headers: {
        Authorization: token
      }
    });

    const text = await res.text();
    setData(text);
  };

  // 🔥 LOGOUT FUNCTION
  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setData("");
  };

  // 🔐 DASHBOARD
  if (isLoggedIn) {
    return (
      <div style={{ padding: "50px" }}>
        <h2>Dashboard 🔐</h2>

        <button onClick={getDashboard}>Get Protected Data</button>

        <br /><br />

        <button onClick={handleLogout}>Logout</button>

        <p>{data}</p>
      </div>
    );
  }

  // 🔓 LOGIN PAGE
  return (
    <div style={{ padding: "50px" }}>
      <h2>Login</h2>

      <input
        type="email"
        placeholder="Enter email"
        onChange={(e) => setEmail(e.target.value)}
      />

      <br /><br />

      <input
        type="password"
        placeholder="Enter password"
        onChange={(e) => setPassword(e.target.value)}
      />

      <br /><br />

      <button onClick={handleLogin}>Login</button>
    </div>
  );
}

export default App;