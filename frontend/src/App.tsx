import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";


import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import Dashboard from "./pages/Dashboard/dashboard";
import Motos from "./pages/Motos/Motos";
import Perfil from "./pages/perfil/perfil";
import Rentas from "./pages/Rentas/rentas";
import PublicarMoto from "./pages/Publicarmoto/publicarmoto";

function App() {
  return (
    <BrowserRouter>

     <Navbar />

     
      <Routes>
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/perfil" element={<Perfil />} />
          <Route path="/rentas" element={<Rentas />} />
          <Route path="/publicarmoto" element={<PublicarMoto />} />
        </Route>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Home />} />
          <Route path="/motos" element={<Motos />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;