import React from "react";
import ReactDOM from "react-dom";
import App from "./components/App";

// styles
import './scss/index.scss';

// Global API Host.
window.api_host = process.env.API;

// render 
ReactDOM.render(<App />, document.getElementById("app"));