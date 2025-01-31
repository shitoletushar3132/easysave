import "./App.css";
import FilePreview from "./components/FilePreview";
import Header from "./components/Header";

function App() {
  const path = decodeURIComponent(window.location.pathname);
  const owner = path.split("/")[3];
  const fileKey = path.split("/").slice(4).join("/");

  return (
    <div className="w-screen h-screen relative">
      {/* Background with overlay effect */}
      <div className="w-full h-full bg-gradient-to-r from-blue-500 via-white to-red-500 bg-cover absolute inset-0">
        {/* Overlay effect */}
        <div className="absolute inset-0 bg-black opacity-50"></div>
      </div>

      <div className="relative z-10">
        <Header />
        <div className="text-center p-5 underline underline-offset-4">
          <span className="text-4xl font-semibold tracking-wide bg-gradient-to-r from-sky-600 via-white to-red-700 text-transparent bg-clip-text ">
            EasySave
          </span>
        </div>
        <FilePreview ownerId={owner} fileKey={fileKey} />
      </div>
    </div>
  );
}

export default App;
