import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { BrowserRouter, Routes, Route, Switch } from "react-router-dom";
import { Link, useHistory } from "react-router-dom";
import App from "./App";

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
      <BrowserRouter>
        <App />
    </BrowserRouter>
  </React.StrictMode>
);


