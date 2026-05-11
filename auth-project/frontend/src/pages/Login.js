import { useState, useContext } from "react";
import { API } from "../api";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const [data, setData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async () => {
    try {
      const res = await API.post("/auth/login", data);

      // Backend response ko inspect karo
      console.log("Login Response:", res.data);

      // Different possible token locations
      const token =
        res.data.token ||
        res.data.data?.token ||
        res.data.user?.token;

      if (!token) {
        alert("Token not received from server ❌");
        return;
      }

      // Save token using AuthContext
      login(token);

      console.log("Saved Token:", token);

      alert("Login Success ✅");

      // Redirect to dashboard
      navigate("/dashboard", { replace: true });
    } catch (err) {
      console.error(err);
      const errorMsg =
        err.response?.data?.error ||
        err.response?.data?.message ||
        "Invalid Credentials ❌";

      alert(errorMsg);
    }
  };

  return (
    <div className="container">
      <h2>Login</h2>

      <input
        type="email"
        placeholder="Email"
        value={data.email}
        onChange={(e) =>
          setData({ ...data, email: e.target.value })
        }
      />

      <input
        type="password"
        placeholder="Password"
        value={data.password}
        onChange={(e) =>
          setData({ ...data, password: e.target.value })
        }
      />

      <button onClick={handleSubmit}>Login</button>

      <p style={{ marginTop: "15px" }}>
        Don't have an account?{" "}
        <span
          style={{
            color: "blue",
            cursor: "pointer",
            textDecoration: "underline",
          }}
          onClick={() => navigate("/register")}
        >
          Register
        </span>
      </p>
    </div>
  );
}