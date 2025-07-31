
import { BrowserRouter, Route, Routes } from "react-router";
import { Navbar } from "./components/custom/Navbar";
import HomePage from "./pages/HomePage";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Dashboard from "./pages/Dashboard";
import Protected from "./components/custom/Protected";
import FolderPage from "./pages/FolderPage";

function App() {
  return (
    <div>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/dashboard" element={<Protected><Dashboard /></Protected>} />
          <Route path="/folder/:folderId" element={<Protected><FolderPage /></Protected>} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}



export default App
