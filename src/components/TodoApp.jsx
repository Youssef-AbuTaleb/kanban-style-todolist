import Column from "./Column";
import { COLUMNS } from "../helpers/todolist-columns";
import classes from "./TodoApp.module.css";
import { DragDropContext } from "@hello-pangea/dnd";
import { reorder, move, toInfiniteData } from "../helpers/drag-drop";
import { useQueryClient } from "@tanstack/react-query";
import { updateTask } from "../services/tasksApi";
import { PAGE_SIZE, tasksQueryKey } from "../hooks/useTasksQuery";

function TodoApp({ search }) {
  const queryClient = useQueryClient(); // ✅ get it from context
  const handleDragEnd = async (result) => {
    const { source, destination } = result;
    if (!destination) return;

    const sourceColumn = source.droppableId;
    const destColumn = destination.droppableId;
    if (sourceColumn === destColumn && source.index === destination.index) {
      return;
    }

    // The indexes from the drag refer to the lists on screen, so read exactly
    // the queries the columns render: same column, page size and search term.
    const sourceKey = tasksQueryKey(sourceColumn, PAGE_SIZE, search);
    const destKey = tasksQueryKey(destColumn, PAGE_SIZE, search);

    const sourceData = queryClient.getQueryData(sourceKey);
    const destData = queryClient.getQueryData(destKey);

    const sourceTasks = sourceData?.pages.flat() ?? [];
    const destTasks = destData?.pages.flat() ?? [];

    const movedTask = sourceTasks[source.index];
    if (!movedTask) {
      console.error("Task not found at index:", source.index);
      return;
    }

    if (sourceColumn === destColumn) {
      const reordered = reorder(sourceTasks, source.index, destination.index);
      queryClient.setQueryData(sourceKey, toInfiniteData(sourceData, reordered));
      return;
    }

    // Stop in-flight fetches from overwriting the optimistic update. Not
    // awaited: the cache must change synchronously or the card snaps back.
    queryClient.cancelQueries({ queryKey: sourceKey, exact: true });
    queryClient.cancelQueries({ queryKey: destKey, exact: true });

    const moved = move(sourceTasks, destTasks, source, destination);
    queryClient.setQueryData(sourceKey, toInfiniteData(sourceData, moved.source));
    if (destData) {
      queryClient.setQueryData(
        destKey,
        toInfiniteData(destData, moved.destination),
      );
    }

    try {
      await updateTask(movedTask.id, { column: destColumn });
    } catch (error) {
      console.error(error);
      queryClient.setQueryData(sourceKey, sourceData);
      queryClient.setQueryData(destKey, destData);
    } finally {
      // Also refreshes the cached results for other search terms.
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
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
