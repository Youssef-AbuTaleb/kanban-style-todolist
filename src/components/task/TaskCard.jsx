import { Draggable } from "@hello-pangea/dnd";
import classes from "./TaskCard.module.css";
import { deleteTask } from "../../services/tasksApi";
import { useQueryClient } from "@tanstack/react-query";

function TaskCard({ task, index }) {
  const queryClient = useQueryClient();
  const onDeleteTask = async () => {
    await deleteTask(task.id);
    await queryClient.invalidateQueries({ queryKey: ["tasks"] });
  };
  return (
    <Draggable draggableId={String(task.id)} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`${classes["task-card"]} list-unstyled p-2 pe-5 text-break`}
        >
          <p className={classes["task-title"]}>{task.title}</p>
          <p className={classes["task-description"]}>{task.description}</p>
          <button className={classes["task-delete-btn"]} onClick={onDeleteTask}>
            X
          </button>
        </div>
      )}
    </Draggable>
  );
}

export default TaskCard;
