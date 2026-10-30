import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import UserProvider from "./components/User/UserProvider.jsx";
import axios from "axios";

axios.interceptors.request.use((config) => {
  const token = sessionStorage.getItem("token");
  const serverUrl = import.meta.env.VITE_SERVER;
  const isSparklRequest = serverUrl && config.url?.startsWith(serverUrl);

  if (token && isSparklRequest) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <UserProvider>
        <App />
      </UserProvider>
    </BrowserRouter>
  </React.StrictMode>
);
