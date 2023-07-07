import "./App.css";
import { useEffect, useState } from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Summary from "./components/Summary";
import { useDispatch, useSelector } from "react-redux";
import { fetchCurrentTab } from "./utils/fetch-current-tab";
import session from "./utils/session";
import { updateLocation } from "./utils/update-location";
import AddImportDetails from "./pages/AddImportDetails";

function App() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [isProcessComplete, setIsProcessComplete] = useState(false);
  const userData = useSelector((state) => state.user.userData);

  useEffect(() => {
    console.log(session.token);
    if (session.token) {
      navigate("/");
    } else {
      navigate("/login");
    }
    window.addEventListener("message", onMessageReceived);
    return () => {
      window.removeEventListener("message", onMessageReceived);
    };
  }, []);

  const onMessageReceived = async (e) => {
    const { data } = e;
    if (!session.token) {
      navigate(`/login`);
      window.location.href = `${window.location.href}${data}`;
      return;
    }
    const tab = await fetchCurrentTab();
    updateLocation(data, tab, navigate, null);
  };

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Home />} />
      <Route path="/add-import-details" element={<AddImportDetails />} />
    </Routes>
  );
}

export default App;
