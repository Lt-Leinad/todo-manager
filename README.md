---
# **Todo Manager (React + Tauri + TypeScript)**

A lightweight cross-platform desktop task manager built with **React**, **TypeScript**, and **Tauri**.
The app supports **CRUD operations, filters, data persistence**, and a **modern responsive UI**.
---

## **Features**

- **Clean & responsive design** for desktop, tablet, and mobile.
- **Two views/screens** – Add Task & Task List.
- **Loading states** for async operations.
- **Error handling** with user-friendly messages.
- **CRUD operations** (Create, Read, Update, Delete) for tasks.
- **Data persistence** using Tauri's `@tauri-apps/plugin-fs` in local storage.
- **Unit tests** for core logic (e.g., adding tasks).
- **Cross-platform build** (macOS, Windows, Linux).

---

## **Setup Instructions**

### **1. Install Tauri CLI**

```bash
sudo npm install -g @tauri-apps/cli
```

### **2. Clone the Repository**

```bash
git clone https://github.com/dfed714/todo-manager.git
cd todo-manager
```

### **3. Install Dependencies**

```bash
npm install
```

### **4. Run in Development**

```bash
npm run tauri dev
```

This starts the Vite dev server and launches the desktop app.

---

## **Build Instructions**

To create a production-ready desktop app:

```bash
npm run tauri build
```

This will generate the app bundle:

- **macOS:** `src-tauri/target/release/bundle/macos/TodoManager.app`
- **Windows:** `src-tauri/target/release/bundle/msi/TodoManager.msi`
- **Linux:** `src-tauri/target/release/bundle/deb/todo-manager.deb`

---

## **Installation Steps**

### **macOS:**

1. After the build, open `src-tauri/target/release/bundle/macos/`.
2. Double-click `TodoManager.app` to launch.
3. If you get a **“App is from an unidentified developer”** warning:

   - Go to **System Preferences > Security & Privacy > Open Anyway**.

### **Windows:**

1. Locate `src-tauri/target/release/bundle/msi/TodoManager.msi`.
2. Double-click to run the installer.

### **Linux:**

1. Locate `src-tauri/target/release/bundle/deb/todo-manager.deb`.
2. Install with:

   ```bash
   sudo dpkg -i todo-manager.deb
   ```

---

## **Running Unit Tests**

We use **Jest** with **ts-jest**.

### **Run Tests**

```bash
npm test
```

### **Test Files**

All test files are located in `src/__tests__/`.
We have included tests for CRUD operations (e.g., `addTask`).

---

## **API Documentation**

### **1. storage.ts**

Handles **data persistence** for tasks.

- **`loadTasks(): Promise<Task[]>`**
  Loads tasks from `tasks.json` using `@tauri-apps/plugin-fs`.
  Creates the file if it doesn’t exist.

- **`saveTasks(tasks: Task[]): Promise<void>`**
  Saves an array of tasks to `tasks.json` (overwrites previous content).

---

### **2. App.tsx**

Main React component for **UI & CRUD logic**.

- **State Hooks:**

  - `tasks` – The task list (loaded from storage).
  - `errorMessage` – Validation and persistence errors.
  - `loading` – Displays loading spinner while tasks are loading.
  - `currentView` – Switches between **Task List** and **Add Task** views.

- **Key Functions:**

  - `addTask()` – Adds a new task after validation.
  - `deleteTask(id: string)` – Removes a task.
  - `startEditing(task: Task)` – Puts a task in edit mode.
  - `saveEdit(id: string)` – Saves edits made to a task.
  - `cancelEdit()` – Cancels editing mode.

---

## **Architecture Decisions**

- **Tauri** chosen for lightweight desktop builds using system WebView.
- **React + TypeScript** for component-based, strongly-typed UI.
- **@tauri-apps/plugin-fs** for data persistence via JSON (`tasks.json`).
- **CSS** (no frameworks) for full control over responsive design.

---

## **Known Limitations**

- Tasks are stored **locally only** (no cloud sync).
- No multi-user support.
- Simple filters (priority & due date).

---

## **License**

This project is for **educational purposes**.

---
