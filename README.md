# Kanban Style Todo List

A modern, drag-and-drop enabled Kanban board built with React and TanStack Query. Features real-time search, infinite scrolling, and persistent state management.

![React](https://img.shields.io/badge/React-19-61DAFB)
![TanStack Query](https://img.shields.io/badge/TanStack_Query-5-FF4154)
![Vite](https://img.shields.io/badge/Vite-6-646CFF)

## ✨ Features

- 🎯 **Drag & Drop** - Seamless task movement between columns
- 🔍 **Real-time Search** - Filter tasks across all columns instantly
- ♾️ **Infinite Scroll** - Paginated loading with "See More" buttons
- 📱 **Responsive Design** - Works on desktop and mobile
- ⚡ **Optimistic Updates** - Instant UI feedback with automatic rollback
- 🎨 **Clean UI** - Modern, minimal design with CSS variables

## 🚀 Tech Stack

- **React 19** - Latest React with hooks
- **TanStack Query** - Server state management & caching
- **@hello-pangea/dnd** - Beautiful drag-and-drop
- **Axios** - API requests
- **Vite** - Fast development & building
- **Bootstrap 5** - Utility classes & layout
- **CSS Modules** - Scoped styling

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/kanban-todolist.git
   cd kanban-todolist
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start JSON Server** (mock backend)
   ```bash
   npm run server
   # Runs on http://localhost:4000
   ```

4. **Start the development server**
   ```bash
   npm run dev
   # Runs on http://localhost:5173
   ```

## 🏗️ Project Structure

```
src/
├── assets/              # Images and static files
├── components/
│   ├── task/
│   │   ├── NewTask.jsx     # Create new task form
│   │   └── TaskCard.jsx    # Individual task card
│   ├── Column.jsx          # Kanban column (droppable)
│   ├── SearchBar.jsx       # Global search
│   ├── TodoApp.jsx         # Main board (DragDropContext)
│   └── TodoApp.module.css  # Component styles
├── helpers/
│   ├── drag-drop.js        # Drag reorder/move utilities
│   └── todolist-columns.js # Column configuration
├── hooks/
│   └── useTasksQuery.js    # Infinite query hook
├── services/
│   └── tasksApi.js         # API layer
├── App.jsx                  # Root component
├── App.css                   # Global styles
└── main.jsx                  # Entry point
```

## 🎯 Key Features Deep Dive

### Drag & Drop Logic
```jsx
// Optimistic updates with rollback on error
const handleDragEnd = (result) => {
  // Guard clauses for invalid drops
  if (!destination) return;
  
  // Update cache immediately
  queryClient.setQueryData(queryKey, reordered);
  
  // Persist to server
  updateTask(movedTask.id, { column: destKey })
    .catch(() => {
      // Rollback on failure
      queryClient.setQueryData(queryKey, previousData);
    });
};
```

### Infinite Query Pattern
```jsx
export const useTasksQuery = (column, limit, keyword) => {
  return useInfiniteQuery({
    queryKey: ["tasks", { column, limit, keyword }],
    queryFn: ({ pageParam = 1 }) => 
      getTasks(column, pageParam, limit, keyword),
    getNextPageParam: (lastPage, allPages) =>
      lastPage.length < limit ? undefined : allPages.length + 1,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
```

## 🔄 API Reference

The app expects a JSON Server running on `http://localhost:4000` with the following endpoints:

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/tasks` | Get all tasks (supports `_page`, `_limit`, `q`) |
| GET | `/tasks?column=todo` | Filter by column |
| POST | `/tasks` | Create new task |
| PATCH | `/tasks/:id` | Update task |
| DELETE | `/tasks/:id` | Delete task |

## 🎨 Theming

CSS variables for easy customization:

```css
:root {
  --color-primary: #4F6EF7;
  --status-todo: #4F6EF7;
  --status-in-progress: #E38B29;
  --status-review: #8E59FF;
  --status-done: #48A461;
  --app-bg: #F1F5F5;
  --column-bg: #E9EFEE;
  --card-bg: #FFFFFF;
}
```

## 🧪 Testing the App

1. **Create tasks** - Click "Add Task" in any column
2. **Drag tasks** - Move cards between columns
3. **Search** - Type in search bar to filter globally
4. **Load more** - Click "See More" at column bottom
5. **Delete** - Click X on any task card

## 📱 Responsive Breakpoints

- **Desktop** (>1024px): 4 columns
- **Tablet** (640px-1024px): 2 columns
- **Mobile** (<640px): 1 column

## 🤔 Challenges & Solutions

| Challenge | Solution |
|-----------|----------|
| Multiple column queries | Object-style query keys for partial invalidation |
| Drag between columns | Optimistic updates with rollback |
| Search across columns | Single search state passed to all columns |
| Pagination per column | useInfiniteQuery with page params |

## 🚦 Performance Optimizations

- ✅ **Debounced search** (500ms) - Reduces API calls
- ✅ **staleTime: 5 minutes** - Prevents unnecessary refetches
- ✅ **placeholderData** - Smooth pagination transitions
- ✅ **CSS Modules** - Scoped styling, no conflicts

## 📄 License

MIT © [Your Name]

## 🙏 Acknowledgments

- [@hello-pangea/dnd](https://github.com/hello-pangea/dnd) for the drag-drop system
- [TanStack Query](https://tanstack.com/query) for data synchronization
- [JSON Server](https://github.com/typicode/json-server) for the mock backend