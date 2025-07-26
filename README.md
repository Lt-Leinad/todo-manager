````markdown
# Todo Manager (Tauri + React + TypeScript)

A lightweight, cross-platform **desktop Todo Manager** built using **Tauri**, **React**, and **TypeScript**.  
The application allows users to **add, edit, delete, and filter tasks** by due date and priority.  
All tasks are stored locally in a `tasks.json` file using the Tauri filesystem API for persistence.

---

## **1. Application Description**

The **Todo Manager** is designed to showcase:

- A clean, responsive UI for managing tasks.
- Core **CRUD functionality** (Create, Read, Update, Delete).
- Data persistence across app restarts.
- A modern, lightweight desktop app using **Tauri** (smaller and faster than Electron).

---

## **2. Setup Instructions**

### **Prerequisites**

Make sure you have the following installed:

- **Node.js** (v18 or higher recommended)
- **npm** (comes with Node)
- **Rust** (Tauri requires Rust for building the backend)
  ```bash
  curl https://sh.rustup.rs -sSf | sh
  ```
````

- **Tauri CLI**

  ```bash
  sudo npm install -g @tauri-apps/cli
  ```

---

### **Clone the Repository**

```bash
git clone https://github.com/<your-username>/todo-manager.git
cd todo-manager
```

---

### **Install Dependencies**

```bash
npm install
```

---

### **Run in Development**

```bash
npm run tauri dev
```

This will start the Vite dev server and open the desktop application.

---

## **3. Build Instructions**

To build a production-ready executable for your platform:

```bash
npm run tauri build
```

- For **macOS**, the `.app` file will be created under `src-tauri/target/release/bundle/macos/`.
- For **Windows**, an `.exe` will be generated under `src-tauri/target/release/bundle/msi/`.
- For **Linux**, the `.AppImage` or `.deb` files will be under `src-tauri/target/release/bundle/linux/`.

---

## **4. Architecture Decisions**

### **Frontend (React + TypeScript)**

- **React** is used for building a modular, component-based UI.
- **TypeScript** ensures type safety and prevents runtime errors.
- **Vite** is used as a fast bundler and dev server.

### **Backend (Tauri + Rust)**

- Tauri manages the native desktop window and OS-level APIs (file system).
- We use `@tauri-apps/plugin-fs` to read and write the `tasks.json` file inside the **LocalData** directory.

### **Data Flow**

- **`App.tsx`** manages tasks with React state (`useState` + `useEffect`).
- **`storage.ts`** abstracts all file operations:

  - `loadTasks()` → Reads `tasks.json`.
  - `saveTasks()` → Writes to `tasks.json`.

- The frontend interacts with the filesystem via Tauri APIs.

---

## **5. Known Limitations**

- Tasks are stored **locally** only (no cloud sync).
- Deleting `tasks.json` will remove all tasks permanently.
- The UI is optimized for basic desktop and mobile responsiveness but could be improved with a dedicated design system.

---

## **6. API Documentation**

### **Main Modules**

#### **`storage.ts`**

- **`loadTasks(): Promise<Task[]>`**
  Reads tasks from the `tasks.json` file (creates an empty file if it doesn't exist).

- **`saveTasks(tasks: Task[]): Promise<void>`**
  Saves the given array of tasks into the `tasks.json` file.

---

## **7. Executable**

### **Building the App**

Run:

```bash
npm run tauri build
```

- The executable (for your OS) will appear under:

  ```
  src-tauri/target/release/bundle/
  ```

### **Installation Instructions**

- **macOS:** Open the `.dmg` or `.app` file in Finder and drag it to Applications.
- **Windows:** Run the `.exe` or `.msi` installer.
- **Linux:** Run the `.AppImage` file or install the `.deb`/`.rpm` package.

---

## **8. Environment File (if needed)**

No environment variables are required for this application.
All data is stored locally in `tasks.json` using Tauri's LocalData directory.

---

## **License**

This project is for educational purposes.

```

---
```
