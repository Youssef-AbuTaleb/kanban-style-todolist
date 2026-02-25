import { useState } from "react";
import TodoApp from "./components/TodoApp";
import "./App.css";
import SearchBar from "./components/SearchBar";

function App() {
  const [search, setSearch] = useState("");

  return (
    <div className="p-4">
      <SearchBar search={search} setSearch={setSearch} />
      <TodoApp search={search} />
    </div>
  );
}

export default App;
