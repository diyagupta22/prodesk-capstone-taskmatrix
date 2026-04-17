import { useState, useEffect } from "react";

function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [data, setData] = useState("");

  // ✅ AUTO LOGIN
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  // ✅ LOGIN
  const handleLogin = async () => {
    try {
      const res = await fetch("https://prodesk-capstone-taskmatrix-hu9b.onrender.com/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
      });

      const result = await res.json();

      if (result.token) {
        localStorage.setItem("token", result.token);
        setIsLoggedIn(true);
        alert("Login successful 🔥");
      } else {
        alert("Login failed ❌");
      }
    } catch (err) {
      console.log(err);
      alert("Error connecting to server ❌");
    }
  };

  // ✅ GET PROTECTED DATA
  const getDashboard = async () => {
    const token = localStorage.getItem("token");

    const res = await fetch("https://prodesk-capstone-taskmatrix-hu9b.onrender.com/api/dashboard", {
      headers: {
        Authorization: token
      }
    });

    const text = await res.text();
    setData(text);
  };

  // ✅ LOGOUT
  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setData("");
  };

  // 🔐 DASHBOARD UI
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

  // 🔓 LOGIN UI
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
