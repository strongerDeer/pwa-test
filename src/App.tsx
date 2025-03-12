import { useState } from "react";
import "./App.css";
import ReloadPrompt from "./components/ReloadPrompt";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <ReloadPrompt />
      Vite + React
      <button onClick={() => setCount((count) => count + 1)}>
        count is {count}
      </button>
      Edit src/App.jsx and save to test HMR <br />
      Click on the Vite and React logos to learn more
    </>
  );
}

export default App;
