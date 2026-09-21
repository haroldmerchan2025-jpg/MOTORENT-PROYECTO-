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
import Contrato from "./pages/Contrato/Contrato";
import PublicarMoto from "./pages/Publicarmoto/publicarmoto";

function App() {
  return (
    <BrowserRouter>

     <Navbar />

     
      <Routes>
        <Route/>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/motos" element={<Motos />} />


        <Route element={<ProtectedRoute />}>
        <Route path="/perfil" element={<Perfil/>}/>
        <Route path="/dashboard" element={<Dashboard/>} />
        <Route path="/rentas" element={<Rentas />} />
        <Route path="/contrato" element={<Contrato />} />
        <Route path="/publicarmoto" element={<PublicarMoto />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;