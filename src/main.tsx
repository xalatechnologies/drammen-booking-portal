
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

console.log("main.tsx loaded");
console.log("App component:", App);

const rootElement = document.getElementById("root");
console.log("Root element:", rootElement);

if (rootElement) {
  const root = createRoot(rootElement);
  console.log("Creating root and rendering App");
  root.render(<App />);
} else {
  console.error("Root element not found!");
}
