import axios from "axios";
let ABS_URL = "http://localhost:4000/tasks";

export const getTasks = async (column, page, limit, keyword) => {
  try {
    let url = new URL(ABS_URL);
    if (column) url.searchParams.append("column", column);
    if (page) url.searchParams.append("_page", page);
    if (limit) url.searchParams.append("_limit", limit);
    if (keyword) url.searchParams.append("q", keyword);

    const response = await axios.get(url.toString());
    const data = response.data;
    return data;
  } catch (error) {
    throw new Error(`Error fetching tasks:  ${error.message || error}`);
  }
};

export const createTask = async ({ title, description, column }) => {
  try {
    let url = new URL(ABS_URL);
    const response = await axios.post(url.toString(), {
      title,
      description,
      column,
    });
    return response.data;
  } catch (error) {
    throw new Error(`Error creating task:  ${error.message || error}`);
  }
};

export const updateTask = async (id, updatedFields) => {
  try {
    const response = await axios.patch(`${ABS_URL}/${id}`, updatedFields);
    return response.data;
  } catch (error) {
    throw new Error(`Error updating task:   ${error.message || error}`);
  }
};

export const deleteTask = async (id) => {
  try {
    await axios.delete(`${ABS_URL}/${id}`);
    return true;
  } catch (error) {
    throw new Error(`Error deleting task:  ${error.message || error}`);
  }
};
