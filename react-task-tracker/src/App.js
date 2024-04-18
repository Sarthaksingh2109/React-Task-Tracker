import React, { useState, useEffect } from "react";
import "./App.css";
import { AiOutlineDelete, AiOutlineEdit } from "react-icons/ai";
import { BsCheckLg } from "react-icons/bs";

function App() {
  const [isCompleteScreen, setIsCompleteScreen] = useState(false);
  const [allTasks, setTasks] = useState([]);
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [completedTasks, setCompletedTasks] = useState([]);
  const [currentEdit, setCurrentEdit] = useState("");
  const [currentEditedItem, setCurrentEditedItem] = useState("");

  const handleAddTask = () => {
    if (newTitle.trim() === "") {
      return;
    }

    const newTaskItem = {
      title: newTitle,
      description: newDescription,
    };

    setTasks((prevTasks) => [...prevTasks, newTaskItem]);
    localStorage.setItem("tasklist", JSON.stringify([...allTasks, newTaskItem]));
    setNewTitle("");
    setNewDescription("");
  };

  const handleDeleteTask = (index) => {
    const updatedTasks = allTasks.filter((_, i) => i !== index);
    setTasks(updatedTasks);
    localStorage.setItem("tasklist", JSON.stringify(updatedTasks));
  };

  const handleComplete = (index) => {
    const now = new Date();
    const completedOn = `${now.toLocaleDateString()} at ${now.toLocaleTimeString()}`;

    const updatedTasks = [...allTasks];
    updatedTasks[index].completed = true;
    updatedTasks[index].completedOn = completedOn;

    setTasks(updatedTasks);
    setCompletedTasks((prevCompletedTasks) => [...prevCompletedTasks, updatedTasks[index]]);
    handleDeleteTask(index);
    localStorage.setItem("tasklist", JSON.stringify(updatedTasks));
    localStorage.setItem("completedTasks", JSON.stringify([...completedTasks, updatedTasks[index]]));
  };

  const handleDeleteCompletedTask = (index) => {
    const reducedTask = completedTasks.filter((_, i) => i !== index);
    setCompletedTasks(reducedTask);
    localStorage.setItem("completedTasks", JSON.stringify(reducedTask));
  };

  useEffect(() => {
    const savedTask = JSON.parse(localStorage.getItem("tasklist"));
    const savedCompletedTask = JSON.parse(localStorage.getItem("completedTasks"));
    if (savedTask) {
      setTasks(savedTask);
    }

    if (savedCompletedTask) {
      setCompletedTasks(savedCompletedTask);
    }
  }, []);

  const handleEdit = (ind, item) => {
    setCurrentEdit(ind);
    setCurrentEditedItem(item);
  };

  const handleUpdateTitle = (value) => {
    setCurrentEditedItem((prev) => {
      return { ...prev, title: value };
    });
  };

  const handleUpdateDescription = (value) => {
    setCurrentEditedItem((prev) => {
      return { ...prev, description: value };
    });
  };

  const handleUpdateTask = () => {
    const updatedTaskArr = [...allTasks];
    updatedTaskArr[currentEdit] = currentEditedItem;
    setTasks(updatedTaskArr);
    localStorage.setItem("tasklist", JSON.stringify(updatedTaskArr));
    setCurrentEdit("");
    setCurrentEditedItem("");
  };

  return (
    <>
      <div className="App">
        <h1>My Task</h1>
        <div className="task-wrapper">
          <div className="task-input">
            <div className="task-input-item">
              <label>Title</label>
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="What's the task title?"
              />
            </div>
            <div className="task-input-item">
              <label>Description</label>
              <input
                type="text"
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                placeholder="What's the task description?"
              />
            </div>
            <div className="task-input-item">
              <button
                type="button"
                onClick={handleAddTask}
                className="primaryBtn"
              >
                Add
              </button>
            </div>
          </div>

          <div className="btn-area">
            <button
              className={`secondaryBtn ${
                isCompleteScreen === false && "active"
              }`}
              onClick={() => setIsCompleteScreen(false)}
            >
              Task
            </button>
            <button
              className={`secondaryBtn ${
                isCompleteScreen === true && "active"
              }`}
              onClick={() => setIsCompleteScreen(true)}
            >
              Completed
            </button>
          </div>

          <div className="task-list">
            {isCompleteScreen === false &&
              allTasks.map((item, index) => {
                if (currentEdit === index) {
                  return (
                    <div className="edit__wrapper" key={index}>
                      <input
                        placeholder="Updated Title"
                        onChange={(e) => handleUpdateTitle(e.target.value)}
                        value={currentEditedItem.title}
                      />
                      <textarea
                        placeholder="Updated Description"
                        rows={4}
                        onChange={(e) =>
                          handleUpdateDescription(e.target.value)
                        }
                        value={currentEditedItem.description}
                      />
                      <button
                        type="button"
                        onClick={handleUpdateTask}
                        className="primaryBtn"
                      >
                        Update
                      </button>
                    </div>
                  );
                } else {
                  return (
                    <div className="task-list-item" key={index}>
                      <div>
                        <h3>{item.title}</h3>
                        <p>{item.description}</p>
                      </div>
                      <AiOutlineDelete
                        className="icon"
                        onClick={() => handleDeleteTask(index)}
                      />
                      {!item.completed && (
                        <BsCheckLg
                          className="check-icon"
                          onClick={() => handleComplete(index)}
                        />
                      )}
                      <AiOutlineEdit
                        className="check-icon"
                        onClick={() => handleEdit(index, item)}
                      />
                    </div>
                  );
                }
              })}
          </div>

          <div className="task-list">
            {isCompleteScreen === true &&
              completedTasks.map((item, index) => {
                return (
                  <div className="task-list-item" key={index}>
                    <div>
                      <h3>{item.title}</h3>
                      <p>{item.description}</p>
                      <p>
                        <small>Completed on: {item.completedOn}</small>
                      </p>
                    </div>
                    <AiOutlineDelete
                      className="icon"
                      onClick={() => handleDeleteCompletedTask(index)}
                    />
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
