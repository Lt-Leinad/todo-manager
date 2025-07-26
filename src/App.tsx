import React, { useState, useEffect } from "react";
import { loadTasks, saveTasks } from "./storage";
import "./App.css";

interface Task {
  id: string;
  title: string;
  dueDate: string;
  priority: "low" | "medium" | "high";
}

function App() {
  const today = new Date().toISOString().split("T")[0];
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState(today);
  const [priority, setPriority] = useState<"low" | "medium" | "high">("low");
  const [filterPriority, setFilterPriority] = useState<"all" | "low" | "medium" | "high">("all");
  const [filterDueDate, setFilterDueDate] = useState("");

  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editValues, setEditValues] = useState({
    title: "",
    dueDate: today,
    priority: "low" as Task["priority"],
  });

  const [hasLoaded, setHasLoaded] = useState(false);

  // Load tasks when the app starts
  useEffect(() => {
    (async () => {
      try {
        const saved = await loadTasks();
        if (Array.isArray(saved)) {
          setTasks(saved);
        } else {
          console.error("Invalid tasks data:", saved);
          setTasks([]);
        }
      } catch (err) {
        console.error("Failed to load tasks:", err);
        setTasks([]);
      } finally {
        setHasLoaded(true);
      }
    })();
  }, []);

  // Save tasks only after initial load is complete
  useEffect(() => {
    if (hasLoaded) {
      saveTasks(tasks);
    }
  }, [tasks, hasLoaded]);

  const addTask = () => {
    if (!title.trim()) return alert("Please enter a task title.");
    const newTask: Task = {
      id: Date.now().toString(),
      title,
      dueDate,
      priority,
    };
    setTasks((prev) => [...prev, newTask]);
    setTitle("");
    setDueDate(today);
    setPriority("low");
  };

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  };

  const startEditing = (task: Task) => {
    setEditingTaskId(task.id);
    setEditValues({
      title: task.title,
      dueDate: task.dueDate,
      priority: task.priority,
    });
  };

  const saveEdit = (id: string) => {
    setTasks((prev) =>
      prev.map((task) => (task.id === id ? { ...task, ...editValues } : task))
    );
    setEditingTaskId(null);
  };

  const cancelEdit = () => {
    setEditingTaskId(null);
  };

  const formatDate = (dateString: string) => {
    const [year, month, day] = dateString.split("-");
    return `${day}/${month}/${year.slice(-2)}`;
  };

  const filteredTasks = tasks.filter((task) => {
    if (filterPriority !== "all" && task.priority !== filterPriority) return false;
    if (filterDueDate && task.dueDate !== filterDueDate) return false;
    return true;
  });

  return (
    <div className="app-container">
      <h1 className="app-title">Todo Manager</h1>

      {/* Add Task */}
      <div className="task-form">
        <input
          type="text"
          placeholder="Task title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value as Task["priority"])}
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
        <button className="add-task" onClick={addTask}>
          Add Task
        </button>
      </div>

      {/* Filters */}
      <div className="filters">
        <label>Filter by Priority:</label>
        <select
          value={filterPriority}
          onChange={(e) => setFilterPriority(e.target.value as any)}
        >
          <option value="all">All</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>

        <label>Filter by Due Date:</label>
        <div className="date-filter-row">
          <input
            type="date"
            value={filterDueDate}
            onChange={(e) => setFilterDueDate(e.target.value)}
          />
          {filterDueDate && (
            <button
              className="clear-date"
              onClick={() => setFilterDueDate("")}
              aria-label="Clear date filter"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Task List */}
      <ul className="task-list">
        {filteredTasks.length === 0 && <li className="empty">No tasks found.</li>}
        {filteredTasks.map((task) => (
          <li key={task.id} className={`task-item priority-${task.priority}`}>
            {editingTaskId === task.id ? (
              <div className="task-editing">
                <input
                  type="text"
                  value={editValues.title}
                  onChange={(e) => setEditValues({ ...editValues, title: e.target.value })}
                />
                <input
                  type="date"
                  value={editValues.dueDate}
                  onChange={(e) => setEditValues({ ...editValues, dueDate: e.target.value })}
                />
                <select
                  value={editValues.priority}
                  onChange={(e) =>
                    setEditValues({ ...editValues, priority: e.target.value as Task["priority"] })
                  }
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
                <div className="edit-buttons">
                  <button className="save" onClick={() => saveEdit(task.id)}>
                    Save
                  </button>
                  <button className="cancel" onClick={cancelEdit}>
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="task-display">
                <div className="task-info">
                  <p className="task-title">{task.title}</p>
                  <p className="task-meta">
                    {formatDate(task.dueDate)} • {task.priority}
                  </p>
                </div>
                <div className="task-actions">
                  <button className="edit" onClick={() => startEditing(task)}>
                    Edit
                  </button>
                  <button className="delete" onClick={() => deleteTask(task.id)}>
                    Delete
                  </button>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
