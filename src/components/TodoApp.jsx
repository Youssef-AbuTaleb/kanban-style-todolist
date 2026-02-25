import Column from "./Column";
import { COLUMNS } from "../helpers/todolist-columns";
import classes from "./TodoApp.module.css";
import { DragDropContext } from "@hello-pangea/dnd";
import { reorder, move } from "../helpers/drag-drop";
import { useQueryClient } from "@tanstack/react-query";
import { updateTask } from "../services/tasksApi";

function TodoApp({ search }) {
  const queryClient = useQueryClient(); // ✅ get it from context
  const handleDragEnd = (result) => {
    const { source, destination } = result;
    if (!destination) return;

    const sourceKey = source.droppableId;
    const destKey = destination.droppableId;

    // 🔥 FIX: Find the query with matching column
    const allQueries = queryClient.getQueryCache().findAll({
      queryKey: ["tasks"], // Find all tasks queries
    });

    // Find the specific queries for source and destination columns
    const sourceQuery = allQueries.find(
      (query) => query.queryKey[1]?.column === sourceKey,
    );

    const destQuery = allQueries.find(
      (query) => query.queryKey[1]?.column === destKey,
    );

    const sourceData = sourceQuery?.state.data || [];
    const destData = destQuery?.state.data || [];

    // Get the moved task
    const movedTask = sourceData[source.index];
    console.log("Moved Task:", movedTask);

    if (!movedTask) {
      console.error("Task not found at index:", source.index);
      return;
    }

    // Rest of your logic...
    if (sourceKey === destKey) {
      const reordered = reorder(sourceData, source.index, destination.index);
      queryClient.setQueryData(sourceQuery.queryKey, reordered);
    } else {
      const resultMove = move(sourceData, destData, source, destination);

      queryClient.setQueryData(sourceQuery.queryKey, resultMove.source);
      queryClient.setQueryData(destQuery.queryKey, resultMove.destination);

      // Persist column change
      updateTask(movedTask.id, { column: destKey }).then(() => {
        queryClient.invalidateQueries({ queryKey: ["tasks"] });
      });
    }
  };
  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className={`${classes["todo-app"]} p-4`}>
        {COLUMNS.map((column) => (
          <Column
            key={column.key}
            columnKey={column.key}
            columnTitle={column.title}
            search={search}
          />
        ))}
      </div>
    </DragDropContext>
  );
}

export default TodoApp;
