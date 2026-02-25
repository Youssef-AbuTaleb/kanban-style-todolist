import { Droppable } from "@hello-pangea/dnd";
import { useTasksQuery } from "../hooks/useTasksQuery";
import classes from "./Column.module.css";
import TaskCard from "./task/TaskCard";
import NewTask from "./task/NewTask";

const PAGE_SIZE = 10;

function Column({ columnKey, columnTitle, search }) {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useTasksQuery(columnKey, PAGE_SIZE, search);

  const tasks = data?.pages?.flatMap((page) => page) ?? [];

  return (
    <Droppable droppableId={columnKey}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.droppableProps}
          className={classes["todo-column"]}
        >
          <h2 className={`${classes["column-title"]} ${classes[columnKey]}`}>
            {columnTitle}
          </h2>
          <ul className="p-0 d-flex flex-column gap-3">
            {tasks.map((task, index) => (
              <TaskCard key={task.id} task={task} index={index} />
            ))}
            {provided.placeholder}
          </ul>

          <NewTask columnKey={columnKey} />

          {/* See more button */}
          {hasNextPage && (
            <button
              type="button"
              className="btn btn-link p-0 mt-2"
              disabled={isFetchingNextPage}
              onClick={() => fetchNextPage()}
            >
              {isFetchingNextPage ? "Loading..." : "See more"}
            </button>
          )}
        </div>
      )}
    </Droppable>
  );
}

export default Column;
