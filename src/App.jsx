import "./App.css";
import React, { useState } from "react";
import moment from "moment";
import { FaTrash, FaEdit, FaPlus, FaClipboardList } from "react-icons/fa";
import Swal from "sweetalert2";

const App = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [todos, setTodos] = useState([]);

  const showToast = (icon, message) => {
    Swal.mixin({
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 2500,
      timerProgressBar: true,
      background: "#141414",
      color: "#fff",
      iconColor: icon === "success" ? "#ff7b00" : "#d33",
      didOpen: (toast) => {
        toast.addEventListener("mouseenter", Swal.stopTimer);
        toast.addEventListener("mouseleave", Swal.resumeTimer);
      },
    }).fire({
      icon: icon,
      title: message,
    });
  };

  const create_todo = (e) => {
    e.preventDefault();

    if (!title.trim() || !description.trim()) {
      showToast("error", "Title and description are required");
      return;
    }

    const newTodo = {
      title: title,
      description: description,
      createdAt: new Date().getTime(),
    };

    setTodos([newTodo, ...todos]);
    setTitle("");
    setDescription("");

    showToast("success", "Task added successfully!");
  };

  const delete_todo = (time) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Aap is task ko wapis nahi la sakenge!",
      icon: "warning",
      background: "#141414",
      color: "#fff",
      showCancelButton: true,
      confirmButtonColor: "#ff5a5a",
      cancelButtonColor: "#252525",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
      iconColor: "#ff5a5a",
    }).then((result) => {
      if (result.isConfirmed) {
        const filteredTodos = todos.filter((todo) => todo.createdAt !== time);
        setTodos(filteredTodos);
        showToast("success", "Task has been deleted.");
      }
    });
  };

  const edit_todo = (time) => {
    const oldTodo = todos.find((todo) => todo.createdAt === time);
    if (!oldTodo) return;

    Swal.fire({
      title: "Update Task Details",
      background: "#141414",
      color: "#fff",
      confirmButtonColor: "#ff7b00",
      confirmButtonText: "Save Changes",
      showCancelButton: true,
      cancelButtonColor: "#252525",
      html: `
        <form id="swal-edit-form" style="overflow: hidden; width: 100%; display: flex; flex-direction: column; align-items: center; gap: 15px; margin: 0; padding: 0;">
          <input id="swal-title" class="swal2-input" placeholder="Update Title" value="${oldTodo.title}" style="background: #1d1d1d; color: #fff; border: 1px solid #333; border-radius: 10px; width: 85%; margin: 0;" required>
          <textarea id="swal-desc" class="swal2-textarea" placeholder="Update Description" style="background: #1d1d1d; color: #fff; border: 1px solid #333; border-radius: 10px; width: 85%; min-height: 100px; resize: none; margin: 0;" required>${oldTodo.description}</textarea>
          <button type="submit" style="display: none;"></button>
        </form>
      `,
      focusConfirm: false,
      didOpen: () => {
        const editForm = document.getElementById("swal-edit-form");
        const titleInput = document.getElementById("swal-title");
        const descInput = document.getElementById("swal-desc");

        editForm.addEventListener("submit", (e) => {
          e.preventDefault();
          Swal.clickConfirm();
        });

        const keydownHandler = (e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            editForm.requestSubmit();
          }
        };

        titleInput.addEventListener("keydown", keydownHandler);
        descInput.addEventListener("keydown", keydownHandler);
      },
      preConfirm: () => {
        const updatedTitle = document.getElementById("swal-title").value;
        const updatedDesc = document.getElementById("swal-desc").value;

        if (!updatedTitle.trim() || !updatedDesc.trim()) {
          Swal.showValidationMessage("Both fields are required!");
          return false;
        }
        return { updatedTitle, updatedDesc };
      },
    }).then((result) => {
      if (result.isConfirmed) {
        const { updatedTitle, updatedDesc } = result.value;
        const updatedTodos = todos.map((todo) => {
          return todo.createdAt === time
            ? { ...todo, title: updatedTitle, description: updatedDesc }
            : todo;
        });
        setTodos(updatedTodos);
        showToast("success", "Task updated successfully!");
      }
    });
  };

  return (
    <div className="app-container">
      <div className="workspace-board">
        <header className="app-header">
          <div className="header-content-wrapper">
            <h1 style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "12px" }}>
              <FaClipboardList style={{ fontSize: "2.2rem" }} /> TaskFlow
            </h1>
            <p>Track your day</p>
          </div>
        </header>

        <div className="app-body">
          <form onSubmit={create_todo} className="todo-form">
            <input
              type="text"
              placeholder="Task Title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
            <textarea
              placeholder="Describe your task here..."
              value={description}
              required
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
            <button type="submit" className="submit-btn">
              <FaPlus /> Add Task
            </button>
          </form>

          <div className="result">
            {todos.length === 0 ? (
              <p className="empty-state">No tasks for today. Relax!</p>
            ) : (
              todos.map((singleTodo) => {
                return (
                  <div key={singleTodo.createdAt} className="post animate-slide-up">
                    <div className="post-content">
                      <h2>{singleTodo.title}</h2>
                      <p>{singleTodo.description}</p>
                      <span className="timestamp">
                        {moment(singleTodo.createdAt).fromNow()}
                      </span>
                    </div>
                    <div className="button-container">
                      <button
                        className="action-btn edit"
                        onClick={() => edit_todo(singleTodo.createdAt)}
                        title="Edit Task"
                      >
                        <FaEdit />
                      </button>
                      <button
                        className="action-btn delete"
                        onClick={() => delete_todo(singleTodo.createdAt)}
                        title="Delete Task"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;