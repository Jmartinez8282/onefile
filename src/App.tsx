import{ useState, useEffect } from "react";

interface eTask {
  eid: number;
  etext: string;
  ecomplete: boolean;
}

const storagekey = "bananaTasks";

const App = () => {
  // State for managing tasks, input, and edit mode
  const [etasks, esetTasks] = useState<eTask[]>(() => {
    const storedTask = localStorage.getItem(storagekey);
    return storedTask ? JSON.parse(storedTask) : [];
  });
  
  const [einput, esetInput] = useState<string>("");
  const [editingId, setEditingId] = useState<number | null>(null);

  // Load tasks from localStorage on mount
  useEffect(() => {
    const storedTasks = localStorage.getItem(storagekey);
    if (storedTasks) {
      esetTasks(JSON.parse(storedTasks));
    }
  }, []);

  // Save tasks to localStorage whenever tasks change
  useEffect(() => {
    localStorage.setItem(storagekey, JSON.stringify(etasks));
  }, [etasks]);

  // Function to add or update a task
  const eaddTask = () => {
    if (einput === "") return;

    if (editingId !== null) {
      const updatedTasks = etasks.map((task) =>
        task.eid === editingId ? { ...task, etext: einput } : task
      );
      esetTasks(updatedTasks);
      setEditingId(null);
      esetInput("");
    } else {
      const newTask: eTask = {
        eid: Date.now(),
        etext: einput,
        ecomplete: false,
      };
      esetTasks([...etasks, newTask]);
      esetInput("");
    }
  };

  // Function to start editing a task
  const estartEditTask = (eid: number, etext: string) => {
    setEditingId(eid);
    esetInput(etext);
  };

  // Function to cancel editing
  const ecancelEdit = () => {
    setEditingId(null);
    esetInput("");
  };

  // Function to delete a task
  const edeleteTask = (eid: number) => {
    const deleted = etasks.filter((etask) => etask.eid !== eid)
    esetTasks(deleted);
  };

  // Function to toggle task completion status
  const etoggleComplete = (eid: number) => {
    const updatedTasks = etasks.map((task) =>
      task.eid === eid ? { ...task, ecomplete: !task.ecomplete } : task
    );
    esetTasks(updatedTasks);
  };

  return (
    <div className="container">
      <h1>My Tasks</h1>
      <div className="row">
        <div className="col">
          <input
            type="text"
            className="form-control"
            value={einput}
            onChange={(e) => esetInput(e.target.value)}
            placeholder="Add a banana task"
          />
        </div>
        <div className="col">
          <button className="btn btn-primary" onClick={eaddTask}>
            {editingId !== null ? "Update Task" : "Add Task"}
          </button>
        </div>
        {editingId !== null && (
          <div className="col">
            <button className="btn btn-secondary" onClick={ecancelEdit}>
              Cancel Edit
            </button>
          </div>
        )}
      </div>

      <ul className="list-group mt-4" data-bs-theme="dark">
        {etasks.map((task) => (
          <li
            className={`list-group-item d-flex justify-content-between ${
              task.ecomplete ? "completed" : ""
            }`}
            key={task.eid}
          >
            <div>
              <input
                type="checkbox"
                checked={task.ecomplete}
                onChange={() => etoggleComplete(task.eid)}
                className="form-check-input me-2"
              />
              <span
                style={{
                  textDecoration: task.ecomplete ? "line-through" : "none",
                  color: task.ecomplete ? "gray" : "black",
                }}
              >
                {task.etext}
              </span>
            </div>
            <div>
              <button
                className="btn btn-info mx-2"
                onClick={() => estartEditTask(task.eid, task.etext)}
              >
                Edit
              </button>
              <button
                className="btn btn-danger mx-3"
                onClick={() => edeleteTask(task.eid)}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;