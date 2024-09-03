import axios from "axios";
import { useEffect, useState } from "react";

const API_URL = "http://localhost:3001";

interface Issue {
  id: number;
  title: string;
  description: string;
}

export const App: React.FC = () => {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [newIssue, setNewIssue] = useState<Omit<Issue, "id">>({
    title: "",
    description: "",
  });
  const [updateIssue, setUpdateIssue] = useState<Issue>({
    id: 0,
    title: "",
    description: "",
  });

  useEffect(() => {
    fetchIssues();
  }, []);

  const fetchIssues = async () => {
    const response = await axios.get<Issue>(`${API_URL}/issues/1`);
    setIssues([response.data]);
  };

  const createIssue = async () => {
    await axios.post(`${API_URL}/issues`, newIssue);
    setNewIssue({ title: "", description: "" });
    fetchIssues();
  };

  const updateIssueHandler = async () => {
    await axios.put(`${API_URL}/issues/${updateIssue.id}`, updateIssue);
    setUpdateIssue({ id: 0, title: "", description: "" });
    fetchIssues();
  };

  const deleteIssue = async (id: number) => {
    await axios.delete(`${API_URL}/issues/${id}`);
    fetchIssues();
  };

  return (
    <div className="app">
      <h1 className="app__title">Issue Tracker</h1>

      <div className="app__section">
        <h2 className="app__section-title">Create Issue</h2>
        <input
          className="app__input"
          type="text"
          placeholder="Title"
          value={newIssue.title}
          onChange={(e) => setNewIssue({ ...newIssue, title: e.target.value })}
        />
        <input
          className="app__input"
          type="text"
          placeholder="Description"
          value={newIssue.description}
          onChange={(e) =>
            setNewIssue({ ...newIssue, description: e.target.value })
          }
        />
        <button className="app__button" onClick={createIssue}>
          Create
        </button>
      </div>

      <div className="app__section">
        <h2 className="app__section-title">Update Issue</h2>
        <input
          className="app__input"
          type="number"
          placeholder="ID"
          value={updateIssue.id || ""}
          onChange={(e) =>
            setUpdateIssue({ ...updateIssue, id: parseInt(e.target.value) })
          }
        />
        <input
          className="app__input"
          type="text"
          placeholder="Title"
          value={updateIssue.title}
          onChange={(e) =>
            setUpdateIssue({ ...updateIssue, title: e.target.value })
          }
        />
        <input
          className="app__input"
          type="text"
          placeholder="Description"
          value={updateIssue.description}
          onChange={(e) =>
            setUpdateIssue({ ...updateIssue, description: e.target.value })
          }
        />
        <button className="app__button" onClick={updateIssueHandler}>
          Update
        </button>
      </div>

      <div className="app__section">
        <h2 className="app__section-title">Issues</h2>
        {issues.map((issue) => (
          <div key={issue.id} className="issue">
            <h3 className="issue__title">{issue.title}</h3>
            <p className="issue__description">{issue.description}</p>
            <button
              className="issue__button"
              onClick={() => deleteIssue(issue.id)}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
