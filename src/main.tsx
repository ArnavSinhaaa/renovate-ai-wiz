/**
 * Main entry point for the React application
 * This file initializes the React app and mounts it to the DOM
 */

import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Get the root DOM element and create a React root
// The non-null assertion (!) is safe here as we know the root element exists in index.html
const rootElement = document.getElementById("root")!;
const root = createRoot(rootElement);

// Render the main App component to the DOM
root.render(<App />);
