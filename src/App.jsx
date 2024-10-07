import { Route, Routes, Navigate, useLocation } from "react-router-dom";
import React, { useEffect, useState } from 'react';
import AddProducts from "./views/AddProducts";
import Products from "./views/Products";
import SignIn from "./views/SignIn";
import Grafics from "./views/Grafics";
import Page404 from "./views/others/Page404";
import Navbar from "./components/Navbar";
import Navbar1 from "./components/Navbar1";
import Login from "./views/login";
import app from '../firebase-config';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import Protected from './components/Protected';
import Loading from "./components/Loading";
import { getFirestore, doc, getDoc } from "firebase/firestore";

const auth = getAuth(app);
const firestore = getFirestore(app);

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  async function getRol(uid) {
    const docuRef = doc(firestore, `Usuarios/${uid}`);
    const docuCifrada = await getDoc(docuRef);
    const infoFinal = docuCifrada.data().rol;
    return infoFinal;
  }

  function setUserWithFirebaseAndRol(usuarioFirebase) {
    getRol(usuarioFirebase.uid).then((rol) => { // Corregido .them a .then
      const userData = {
        uid: usuarioFirebase.uid,
        email: usuarioFirebase.email,
        rol: rol,
      };
      setUser(userData);
      console.log("userData final", userData);
      console.log("User Role:", usuarioFirebase.rol);
    });
  }

  useEffect(() => {
    onAuthStateChanged(auth, (usuarioFirebase) => {
      if (usuarioFirebase) {
        if (!user) {
          setUserWithFirebaseAndRol(usuarioFirebase);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      {location.pathname !== "/signin" && user?.rol === "gerente" || user?.rol === "trabajador" ? <Navbar1 /> : null}
      {location.pathname !== "/signin" && user?.rol === "dueno" ? <Navbar /> : null}

      <Routes>
        <Route
          path="/signin"
          element={user ? <Navigate to="/" replace /> : <SignIn />}
        />

        {/* Rutas protegidas */}
        <Route element={<Protected isActive={!user} />}>
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
