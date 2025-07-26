import { readTextFile, writeTextFile, exists, create, BaseDirectory } from "@tauri-apps/plugin-fs";

/**
 * The path to the JSON file where tasks are stored.
 * This file is saved in the LocalData directory for persistence.
 */
const FILE_PATH = "tasks.json";

/**
 * ensureFileExists()
 * -------------------
 * Checks if `tasks.json` exists in the LocalData directory.
 * If it doesn't, the file is created and initialized with an empty JSON array (`[]`).
 */
async function ensureFileExists() {
  const fileExists = await exists(FILE_PATH, { baseDir: BaseDirectory.LocalData });
  if (!fileExists) {
    console.log("Creating tasks.json file...");
    await create(FILE_PATH, { baseDir: BaseDirectory.LocalData });
    await writeTextFile(FILE_PATH, "[]", { baseDir: BaseDirectory.LocalData });
  }
}

/**
 * loadTasks()
 * -----------
 * Reads the tasks from `tasks.json`.
 * Ensures the file exists before attempting to read it.
 * Returns the parsed tasks as an array, or an empty array if an error occurs.
 */
export async function loadTasks() {
  try {
    await ensureFileExists();
    const content = await readTextFile(FILE_PATH, { baseDir: BaseDirectory.LocalData });
    console.log("Loaded tasks:", content);
    return JSON.parse(content);
  } catch (error) {
    console.error("Error loading tasks:", error);
    return [];
  }
}

/**
 * saveTasks()
 * -----------
 * Writes the current tasks array to `tasks.json`.
 * Ensures the file exists before writing.
 * Tasks are saved with indentation for readability.
 */
export async function saveTasks(tasks: any[]) {
  try {
    await ensureFileExists();
    await writeTextFile(FILE_PATH, JSON.stringify(tasks, null, 2), { baseDir: BaseDirectory.LocalData });
    console.log("Tasks saved successfully!");
  } catch (error) {
    console.error("Error saving tasks:", error);
  }
}
