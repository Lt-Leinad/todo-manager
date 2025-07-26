import { readTextFile, writeTextFile, exists, create, BaseDirectory } from "@tauri-apps/plugin-fs";

const FILE_PATH = "tasks.json";

async function ensureFileExists() {
  const fileExists = await exists(FILE_PATH, { baseDir: BaseDirectory.LocalData });
  if (!fileExists) {
    console.log("Creating tasks.json file...");
    await create(FILE_PATH, { baseDir: BaseDirectory.LocalData });
    await writeTextFile(FILE_PATH, "[]", { baseDir: BaseDirectory.LocalData });
  }
}

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

export async function saveTasks(tasks: any[]) {
  try {
    await ensureFileExists();
    await writeTextFile(FILE_PATH, JSON.stringify(tasks, null, 2), { baseDir: BaseDirectory.LocalData });
    console.log("Tasks saved successfully!");
  } catch (error) {
    console.error("Error saving tasks:", error);
  }
}
