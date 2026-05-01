import { useEffect, useState } from "react";
import { API } from "../api";

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");

  // 🔐 Auth check
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      window.location.href = "/login";
    } else {
      fetchTasks();
    }
  }, []);

  // 📥 Fetch tasks
  const fetchTasks = async () => {
    try {
      const res = await API.get("/tasks");
      setTasks(res.data);
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        window.location.href = "/login";
      } else {
        alert("Error fetching tasks ❌");
      }
    }
  };

  // ➕ Add task
  const addTask = async () => {
    if (!title.trim()) return;

    try {
      const res = await API.post("/tasks", { title });
      setTasks([...tasks, res.data]);
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

  // ❌ Delete task
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

  // 💳 Stripe Payment
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

  // 🚪 Logout
  const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Dashboard 🔐</h1>

      <button onClick={logout}>Logout</button>

      {/* 💳 Payment Button */}
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

      {tasks.map((t) => (
        <div key={t._id} style={{ marginTop: "10px" }}>
          {t.title}
          <button
            onClick={() => deleteTask(t._id)}
            style={{ marginLeft: "10px" }}
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}