import { useEffect, useState, useContext } from "react";
import { API } from "../api";
import { AuthContext } from "../AuthContext";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();
  const { logout: authLogout } = useContext(AuthContext);
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login", { replace: true });
    } else {
      fetchTasks();
    }
  }, [navigate]);

  const fetchTasks = async () => {
    try {
      const res = await API.get("/tasks");

      // Handle both possible response formats:
      // 1. res.data = [...]
      // 2. res.data.tasks = [...]
      const fetchedTasks = Array.isArray(res.data)
        ? res.data
        : Array.isArray(res.data.tasks)
        ? res.data.tasks
        : [];

      setTasks(fetchedTasks);
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        window.location.href = "/login";
      } else {
        console.error("Fetch tasks error:", err);
        alert("Error fetching tasks ❌");
        setTasks([]);
      }
    }
  };

  const addTask = async () => {
    if (!title.trim()) return;

    try {
      const res = await API.post("/tasks", { title });

      const newTask = res.data.task || res.data;
      setTasks([...tasks, newTask]);
      setTitle("");
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        window.location.href = "/login";
      } else {
        alert("Error adding task ❌");
      }
    }
  };

  const deleteTask = async (id) => {
    try {
      await API.delete(`/tasks/${id}`);
      setTasks(tasks.filter((t) => t._id !== id));
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        window.location.href = "/login";
      } else {
        alert("Error deleting task ❌");
      }
    }
  };

  const handlePayment = async () => {
    try {
      const res = await API.post("/payment/checkout");
      window.location.href = res.data.url;
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        window.location.href = "/login";
      } else {
        alert("Payment error ❌");
      }
    }
  };

  const logout = () => {
    authLogout();
    navigate("/login", { replace: true });
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Dashboard 🔐</h1>

      <button onClick={logout}>Logout</button>

      <br /><br />

      <button onClick={handlePayment}>
        Upgrade to Pro 💳
      </button>

      <h2>Tasks</h2>

      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Enter task"
      />
      <button onClick={addTask}>Add</button>

      {tasks.length === 0 ? (
        <p style={{ marginTop: "10px" }}>No tasks yet.</p>
      ) : (
        tasks.map((t, index) => (
          <div key={t._id || index} style={{ marginTop: "10px" }}>
            {t.title || "Untitled Task"}
            <button
              onClick={() => deleteTask(t._id)}
              style={{ marginLeft: "10px" }}
            >
              Delete
            </button>
          </div>
        ))
      )}
    </div>
  );
}