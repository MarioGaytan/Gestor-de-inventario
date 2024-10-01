import { Route, Routes, Navigate, useLocation } from "react-router-dom";
import React, { useEffect, useState } from 'react';
import AddProducts from "./views/AddProducts";
import Products from "./views/Products";
import SignIn from "./views/SignIn";
import Grafics from "./views/Grafics";
import Page404 from "./views/others/Page404";
import Navbar from "./components/Navbar";
import app from '../firebase-config';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import Protected from './components/Protected';
import Loading from "./components/Loading";


function App() {
  const [userAuth, setUserAuth] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const auth = getAuth(app);
  const location = useLocation();

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserAuth(user.email);
        console.log("Usuario autenticado:", user);
      } else {
        setUserAuth(null);
        console.log("No hay usuario autenticado");
      }
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <>
    
    {location.pathname !== "/signin" && <Navbar />}
      
      <Routes>
        <Route 
          path="/signin" 
          element={userAuth ? <Navigate to="/" replace /> : <SignIn />} 
        />

        {/* Rutas protegidas */}
        <Route element={<Protected isActive={!userAuth} />}>
          <Route path="/" element={<Products />} />
          <Route path="/add_productos" element={<AddProducts />} />
          <Route path="/graficas" element={<Grafics />} />
        </Route>

        {/* Ruta por defecto si no se encuentra la página */}
        <Route path="/*" element={<Page404 />} />
      </Routes>
    </>
  );
}

export default App;
