import classes from "./SearchBar.module.css";
import todoListLogo from "../assets/logo.jfif";

function SearchBar({ search, setSearch }) {
  return (
    <div
      className={`${classes["search-bar"]} d-flex justify-content-between align-items-center`}
    >
      <img
        src={todoListLogo}
        alt="todolist logo"
        height="30"
        className="rounded"
      />

      {/* we need to filter all the tasks column as each column has its own requests when this input is searched */}
      <input
        type="text"
        className={classes["search-input"]}
        placeholder="Search tasks..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
    </div>
  );
}

export default SearchBar;
