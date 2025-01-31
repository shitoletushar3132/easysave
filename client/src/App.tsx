import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import { lazy, Suspense, useEffect } from "react";
import Body from "./pages/Body"; // Import the Body component
import { RecoilRoot } from "recoil";

const Login = lazy(() => import("./pages/Login"));
const Signup = lazy(() => import("./pages/Signup"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Folder = lazy(() => import("./pages/Folder"));
const Setting = lazy(() => import("./pages/Settings"));

function App() {
  useEffect(() => {
    document.documentElement.classList.add("dark"); // Apply dark mode permanently
  }, []);
  return (
    <RecoilRoot>
      <BrowserRouter basename="/">
        <Suspense
          fallback={<span className="loading loading-ring loading-sm"></span>}
        >
          <Routes>
            {/* Body as the parent route */}
            <Route path="/" element={<Body />}>
              <Route index element={<Dashboard />} />{" "}
              {/* Default child route */}
              <Route path="login" element={<Login />} />
              <Route path="signup" element={<Signup />} />
              <Route path="folder/:folderId/:folderName" element={<Folder />} />
              <Route path="settings" element={<Setting />} />
            </Route>
          </Routes>
        </Suspense>
      </BrowserRouter>
    </RecoilRoot>
  );
}

export default App;
