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
      alert("Invalid Credentials ❌");
    }
  };

  return (
    <div>
      <h2>Login</h2>

      <input
        placeholder="Email"
        onChange={(e) => setData({ ...data, email: e.target.value })}
      />

      <br /><br />

      <input
        type="password"
        placeholder="Password"
        onChange={(e) => setData({ ...data, password: e.target.value })}
      />

      <br /><br />

      <button onClick={handleSubmit}>Login</button>
    </div>
  );
}