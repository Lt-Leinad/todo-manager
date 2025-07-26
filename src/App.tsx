import { useState, useEffect } from "react";
import { loadTasks, saveTasks } from "./storage";
import "./App.css";

/**
 * Represents a single task in the application.
 * Each task has:
 * - id: A unique identifier.
 * - title: The task description.
 * - dueDate: Due date in YYYY-MM-DD format.
 * - priority: The importance level (low, medium, high).
 */
interface Task {
  id: string;
  title: string;
  dueDate: string;
  priority: "low" | "medium" | "high";
}

function App() {
  /** Today's date (used as default value for new tasks). */
  const today = new Date().toISOString().split("T")[0];

  // -------------------- State Variables --------------------

  /** Loading state for async operations (initial data load). */
  const [loading, setLoading] = useState(true);

  /** Current view: 'list' (Task List) or 'add' (Add Task). */
  const [currentView, setCurrentView] = useState<"list" | "add">("list");

  /** Error message displayed for validation or persistence issues. */
  const [errorMessage, setErrorMessage] = useState("");

  /** Array of all tasks currently in the list. */
  const [tasks, setTasks] = useState<Task[]>([]);

  /** Form input states for creating a new task. */
  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState(today);
  const [priority, setPriority] = useState<"low" | "medium" | "high">("low");

  /** Filters for task list (priority and due date). */
  const [filterPriority, setFilterPriority] = useState<"all" | "low" | "medium" | "high">("all");
  const [filterDueDate, setFilterDueDate] = useState("");

  /** Editing states: which task is being edited and its temporary values. */
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editValues, setEditValues] = useState({
    title: "",
    dueDate: today,
    priority: "low" as Task["priority"],
  });

  /** Indicates whether tasks have been loaded from storage. */
  const [hasLoaded, setHasLoaded] = useState(false);

  // -------------------- Side Effects --------------------

  /**
   * Load tasks from persistent storage when the app starts.
   * If loading fails, defaults to an empty array.
   */
  useEffect(() => {
    (async () => {
      try {
        const saved = await loadTasks();
        setTasks(Array.isArray(saved) ? saved : []);
      } catch (err) {
        console.error("Failed to load tasks:", err);
        setTasks([]);
      } finally {
        setHasLoaded(true);
        setLoading(false);
      }
    })();
  }, []);

  /**
   * Save tasks to persistent storage whenever they change.
   * Runs only after the initial load is complete.
   */
  useEffect(() => {
    if (hasLoaded) {
      saveTasks(tasks).catch((err) => {
        console.error("Save failed:", err);
        setErrorMessage("Failed to save tasks! Changes may not persist.");
      });
    }
  }, [tasks, hasLoaded]);

  /**
   * Automatically clears error messages after 3 seconds.
   */
  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => setErrorMessage(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [errorMessage]);

  // -------------------- CRUD Operations --------------------

  /** Add a new task to the list. */
  const addTask = () => {
    if (!title.trim()) {
      setErrorMessage("Please enter a task title.");
      return;
    }
    const newTask: Task = {
      id: Date.now().toString(),
      title: title.trim(),
      dueDate,
      priority,
    };
    setTasks((prev) => [...prev, newTask]);
    setTitle("");
    setDueDate(today);
    setPriority("low");
    setCurrentView("list");
  };

  /** Delete a task by ID. */
  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  };

  /** Start editing a task. */
  const startEditing = (task: Task) => {
    setEditingTaskId(task.id);
    setEditValues({
      title: task.title,
      dueDate: task.dueDate,
      priority: task.priority,
    });
  };

  /** Save changes to a task being edited. */
  const saveEdit = (id: string) => {
    if (!editValues.title.trim()) {
      setErrorMessage("Please enter a task title.");
      return;
    }
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, ...editValues, title: editValues.title.trim() } : task
      )
    );
    setEditingTaskId(null);
  };

  /** Cancel edit mode. */
  const cancelEdit = () => {
    setEditingTaskId(null);
  };

  /** Format date to DD/MM/YY. */
  const formatDate = (dateString: string) => {
    const [year, month, day] = dateString.split("-");
    return `${day}/${month}/${year.slice(-2)}`;
  };

  /** Filter tasks by priority and due date. */
  const filteredTasks = tasks.filter((task) => {
    if (filterPriority !== "all" && task.priority !== filterPriority) return false;
    if (filterDueDate && task.dueDate !== filterDueDate) return false;
    return true;
  });

  // -------------------- UI Rendering --------------------

  if (loading) {
    return <div className="loading">Loading tasks...</div>;
  }

  return (
    <div className="app-container">
      <h1 className="app-title">Todo Manager</h1>

      {/* Navigation between screens */}
      <div className="nav-buttons" style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        <button onClick={() => setCurrentView("list")}>View Tasks</button>
        <button onClick={() => setCurrentView("add")}>Add Task</button>
      </div>

      {/* Display error messages */}
      {errorMessage && <p className="error-message">{errorMessage}</p>}

      {currentView === "add" ? (
        /* Add Task View */
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
      ) : (
        /* Task List View */
        <>
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
        </>
      )}
    </div>
  );
}

export default App;
