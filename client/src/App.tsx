import { BrowserRouter, Route, Routes } from "react-router-dom";
import Main from "./pages/Main";

function App() {
  return (
    <>
      <BrowserRouter basename="/">
        <Routes>
          <Route path="/" element={<Main />}>
            <Route path="/dashboard" element={<div>helo</div>} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
