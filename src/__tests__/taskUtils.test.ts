import { addTask, Task } from "../taskUtils";

describe("addTask", () => {
  it("should add a task to an empty list", () => {
    const result = addTask([], "New Task", "2025-07-26", "low");
    expect(result).toHaveLength(1);
    expect(result[0].title).toBe("New Task");
  });

  it("should trim whitespace in the title", () => {
    const result = addTask([], "   Trimmed   ", "2025-07-26", "medium");
    expect(result[0].title).toBe("Trimmed");
  });

  it("should throw an error if title is empty", () => {
    expect(() => addTask([], "   ", "2025-07-26", "high")).toThrow("Title cannot be empty");
  });

  it("should keep existing tasks and add a new one", () => {
    const tasks: Task[] = [
      { id: "1", title: "Existing", dueDate: "2025-07-25", priority: "medium" },
    ];
    const result = addTask(tasks, "Another", "2025-07-27", "low");
    expect(result).toHaveLength(2);
    expect(result[1].title).toBe("Another");
  });
});
