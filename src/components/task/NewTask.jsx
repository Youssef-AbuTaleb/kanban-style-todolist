import { useState } from "react";
import classes from "./NewTask.module.css";
import { createTask } from "../../services/tasksApi";
import { useQueryClient } from "@tanstack/react-query";

function NewTask({ columnKey }) {
  const queryClient = useQueryClient();
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");

  const onSaveTask = async () => {
    if (!title.trim()) return setError("Title is required");
    if (!description.trim()) return setError("Description is required");

    await createTask({ title, description, column: columnKey });
    await queryClient.invalidateQueries({ queryKey: ["tasks"] });
    onResetTask();
  };

  const onResetTask = () => {
    setTitle("");
    setDescription("");
    setError("");
    setIsAddingTask(false);
  };

  return (
    <div className="d-flex flex-column gap-3 border border-dashed border-gray-300 rounded p-2">
      {!isAddingTask && (
        <button
          className={classes["new-task-btn"]}
          onClick={() => setIsAddingTask(true)}
        >
          <span>+</span>
          <span>Add Task</span>
        </button>
      )}
      {isAddingTask && (
        <form action="" className="d-flex flex-column gap-3">
          <input
            type="text"
            placeholder="Task Title"
            className={classes["input"]}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <textarea
            placeholder="Task Description"
            className={classes["input"]}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
          {error && <p className="text-danger">{error}</p>}
          <div className="d-flex justify-content-center gap-3">
            <button
              type="button"
              className={classes["new-task-btn"]}
              onClick={onSaveTask}
            >
              Add
            </button>
            <button
              type="button"
              className={classes["new-task-btn"]}
              onClick={onResetTask}
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

export default NewTask;
