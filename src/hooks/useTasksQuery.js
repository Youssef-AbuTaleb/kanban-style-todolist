import { useInfiniteQuery } from "@tanstack/react-query";
import { getTasks } from "../services/tasksApi";

export const PAGE_SIZE = 10;

export const tasksQueryKey = (column, limit, keyword) => [
  "tasks",
  { column, limit, keyword },
];

// Infinite tasks per column (and keyword),  paginated on the server.
export const useTasksQuery = (column, limit, keyword) => {
  return useInfiniteQuery({
    queryKey: tasksQueryKey(column, limit, keyword),
    queryFn: ({ pageParam = 1 }) =>
      getTasks(column, pageParam, limit, keyword),
    getNextPageParam: (lastPage, allPages) =>
      // If we got fewer than 'limit' items, no more pages.
      lastPage.length < limit ? undefined : allPages.length + 1,
    retry: 1,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
