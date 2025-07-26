export interface Task {
    id: string;
    title: string;
    dueDate: string;
    priority: "low" | "medium" | "high";
  }
  
  /**
   * Adds a new task to the list.
   * @param tasks Current list of tasks
   * @param title Task title
   * @param dueDate Due date in YYYY-MM-DD format
   * @param priority Task priority (low, medium, high)
   * @returns Updated tasks array with the new task
   */
  export function addTask(
    tasks: Task[],
    title: string,
    dueDate: string,
    priority: Task["priority"]
  ): Task[] {
    if (!title.trim()) {
      throw new Error("Title cannot be empty");
    }
    const newTask: Task = {
      id: Date.now().toString(),
      title: title.trim(),
      dueDate,
      priority,
    };
    return [...tasks, newTask];
  }
  