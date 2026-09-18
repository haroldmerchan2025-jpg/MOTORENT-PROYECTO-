import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import Dashboard from "./pages/Dashboard/dashboard";
import Motos from "./pages/Motos/Motos";
import ProtectedRoute from "./components/ProtectedRoute";
import Perfil from "./pages/perfil/perfil";
import Rentas from "./pages/Rentas/rentas";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route/>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route element={<ProtectedRoute />}>
        <Route path="/motos" element={<Motos />} />
      </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;