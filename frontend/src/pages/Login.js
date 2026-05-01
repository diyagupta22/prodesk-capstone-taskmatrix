import { useState } from "react";
import { API } from "../api";

export default function Login() {
  const [data, setData] = useState({
    email: "",
    password: ""
  });

  const handleSubmit = async () => {
    try {
      const res = await API.post("/auth/login", data);

      // token save
      localStorage.setItem("token", res.data.token);

      alert("Login Success ✅");
      window.location.href = "/";
    } catch (err) {
      const errorMsg = err.response?.data?.error || "Invalid Credentials ❌";
      alert(errorMsg);
    }
  };

  return (
    <div className="container">
      <h2>Login</h2>

      <input
        placeholder="Email"
        onChange={(e) => setData({ ...data, email: e.target.value })}
      />

      <input
        type="password"
        placeholder="Password"
        onChange={(e) => setData({ ...data, password: e.target.value })}
      />

      <button onClick={handleSubmit}>Login</button>

      {/* Register link */}
      <p style={{ marginTop: "15px" }}>
        Don't have an account?{" "}
        <span
          style={{
            color: "blue",
            cursor: "pointer",
            textDecoration: "underline"
          }}
          onClick={() => (window.location.href = "/register")}
        >
          Register
        </span>
      </p>
    </div>
  );
}