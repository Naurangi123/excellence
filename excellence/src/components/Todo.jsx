import React, { useState, useEffect } from "react";
import { getTodos,updateTodo,deleteTodo,createTodo } from "../services/apiServices";

export default function TodoApp() {
  const initialForm = {
    title: "",
    description: "",
    due_date: "",
    category: "Urgent",
  };

  const [todos, setTodos] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const data = await getTodos();
      console.log("1", data.data);
      setTodos(data.data);
    } catch (err) {
      console.error("Fetch error:", err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { ...form, completed: false };

    try {
      if (editId !== null) {
        await updateTodo(editId, form);
      } else {
        await createTodo(payload);
      }
      await fetchTodos();
      setForm(initialForm);
      setEditId(null);
    } catch (err) {
      console.error("Submit error:", err.message);
    }
  };

  const handleEdit = (todo) => {
    setForm({
      title: todo.title,
      description: todo.description,
      due_date: todo.due_date,
      category: todo.category,
    });
    setEditId(todo.id);
  };

  const handleDelete = async (id) => {
    try {
      await deleteTodo(id);
      await fetchTodos();
    } catch (err) {
      console.error("Delete error:", err.message);
    }
  };

  const handleToggleComplete = async (id, current) => {
    try {
      await updateTodo(id, { completed: !current });
      await fetchTodos();
    } catch (err) {
      console.error("Toggle error:", err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center pt-10 px-4">
      <h1 className="text-3xl font-bold mb-6">Todo Manager</h1>

      <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-lg bg-gray-800 p-6 rounded-lg">
        <input
          type="text"
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Title"
          required
          className="w-full px-4 py-2 bg-gray-700 rounded"
        />
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Description"
          rows={3}
          className="w-full px-4 py-2 bg-gray-700 rounded"
        />
        <input
          type="date"
          name="due_date"
          value={form.due_date}
          onChange={handleChange}
          className="w-full px-4 py-2 bg-gray-700 rounded"
        />
        <select
          name="category"
          value={form.category}
          onChange={handleChange}
          className="w-full px-4 py-2 bg-gray-700 rounded"
        >
          <option>Urgent</option>
          <option>Non-Urgent</option>
        </select>
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 py-2 rounded"
        >
          {editId ? "Update Todo" : "Add Todo"}
        </button>
      </form>

      <div className="mt-10 w-full max-w-3xl">
        {loading ? (
          <p className="text-gray-400">Loading...</p>
        ) : todos?.length === 0 ? (
          <p className="text-gray-400 text-center">No todos yet.</p>
        ) : (
          todos.map((todo) => (
            <div
              key={todo.id}
              className="bg-gray-800 p-4 my-2 rounded flex flex-col gap-2"
            >
              <div className="flex justify-between items-center">
                <h2 className={`text-lg font-semibold ${todo.completed ? "line-through text-gray-400" : ""}`}>
                  {todo.title}
                </h2>
                <button
                  onClick={() => handleToggleComplete(todo.id, todo.completed)}
                  className={`px-3 py-1 rounded text-sm ${todo.completed ? "bg-green-700" : "bg-gray-600"} hover:bg-green-600`}
                >
                  {todo.completed ? "Completed" : "Mark Done"}
                </button>
              </div>
              <p className="text-gray-400">{todo.description}</p>
              <p className="text-sm text-gray-500">
                Due: {todo.due_date} | Category: {todo.category}
              </p>
              <div className="flex gap-3 mt-2">
                <button
                  onClick={() => handleEdit(todo)}
                  className="text-yellow-400 hover:underline"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(todo.id)}
                  className="text-red-400 hover:underline"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
