import axios, { AxiosInstance } from "axios";
import React, { useEffect, useState } from "react";
import { useSnackbar } from "notistack";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";
const API_KEY = import.meta.env.VITE_API_KEY || "secret-api-key";

const api: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    "X-API-Key": API_KEY,
  },
});

interface Issue {
  id: number;
  title: string;
  description: string;
  createdAt: string;
}

export const App: React.FC = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [issues, setIssues] = useState<Issue[]>([]);
  const [newIssue, setNewIssue] = useState<Omit<Issue, "id" | "createdAt">>({
    title: "",
    description: "",
  });
  const [updateIssue, setUpdateIssue] = useState<Omit<Issue, "createdAt">>({
    id: 0,
    title: "",
    description: "",
  });

  useEffect(() => {
    fetchIssues();
  }, []);

  const fetchIssues = async () => {
    const response = await api.get<Issue[]>(`${API_URL}/issues`);
    setIssues(response.data);
  };

  const createIssue = async () => {
    try {
      const response = await api.post<Issue>(`${API_URL}/issues`, newIssue);
      setIssues((prevIssues) => [...prevIssues, response.data]);
      setNewIssue({ title: "", description: "" });
      enqueueSnackbar("Issue created", { variant: "success" });
    } catch (error) {
      enqueueSnackbar(
        "Error creating issue. Please contact support if the error persists.",
        { variant: "error" }
      );
    }
  };

  const updateIssueHandler = async () => {
    try {
      const response = await api.put<Issue>(
        `${API_URL}/issues/${updateIssue.id}`,
        updateIssue
      );
      setIssues((prevIssues) =>
        prevIssues.map((issue) =>
          issue.id === updateIssue.id ? response.data : issue
        )
      );
      setUpdateIssue({ id: 0, title: "", description: "" });
      enqueueSnackbar("Issue updated", { variant: "success" });
    } catch (error) {
      enqueueSnackbar(
        "Error updating issue. Please contact support if the error persists.",
        { variant: "error" }
      );
    }
  };

  const deleteIssue = async (id: number) => {
    try {
      await api.delete(`${API_URL}/issues/${id}`);
      setIssues((prevIssues) => prevIssues.filter((issue) => issue.id !== id));
      enqueueSnackbar("Issue deleted", {
        variant: "success",
      });
    } catch (error) {
      enqueueSnackbar(
        "Error deleting issue. Please contact support if the error persists.",
        { variant: "error" }
      );
    }
  };

  const formatCreatedAt = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });
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
            <h3 className="issue__title">
              <span className="issue__id">#{issue.id}</span> {issue.title}
            </h3>
            <p className="issue__description">{issue.description}</p>
            <div className="issue__footer">
              <p className="issue__created-at">
                Created on {formatCreatedAt(issue.createdAt)}
              </p>
              <button
                className="issue__button"
                onClick={() => deleteIssue(issue.id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
