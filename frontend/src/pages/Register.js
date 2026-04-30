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
    } catch (err) {
      alert("Error ❌");
    }
  };

  return (
    <div>
      <h2>Register</h2>

      <input
        placeholder="Name"
        onChange={(e) => setData({ ...data, name: e.target.value })}
      />

      <br /><br />

      <input
        placeholder="Email"
        onChange={(e) => setData({ ...data, email: e.target.value })}
      />

      <br /><br />

      <input
        placeholder="Password"
        type="password"
        onChange={(e) => setData({ ...data, password: e.target.value })}
      />

      <br /><br />

      <button onClick={handleSubmit}>Register</button>
    </div>
  );
}