import { useState } from "react";
import { API } from "../api";

export default function Register() {
  const [data, setData] = useState({
    name: "",
    email: "",
    password: ""
  });

  const handleSubmit = async () => {
    try {
      await API.post("/auth/register", data);
      alert("Registered ✅");

      // redirect to login
      window.location.href = "/login";
    } catch (err) {
      const errorMsg = err.response?.data?.error || "Registration failed ❌";
      alert(errorMsg);
    }
  };

  return (
    <div className="container">
      <h2>Register</h2>

      <input
        placeholder="Name"
        onChange={(e) => setData({ ...data, name: e.target.value })}
      />

      <input
        placeholder="Email"
        onChange={(e) => setData({ ...data, email: e.target.value })}
      />

      <input
        type="password"
        placeholder="Password"
        onChange={(e) => setData({ ...data, password: e.target.value })}
      />

      <button onClick={handleSubmit}>Register</button>

      {/* Login link */}
      <p style={{ marginTop: "15px" }}>
        Already have an account?{" "}
        <span
          style={{
            color: "blue",
            cursor: "pointer",
            textDecoration: "underline"
          }}
          onClick={() => (window.location.href = "/login")}
        >
          Login
        </span>
      </p>
    </div>
  );
}