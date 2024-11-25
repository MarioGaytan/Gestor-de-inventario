import { Route, Routes, Navigate, useLocation } from "react-router-dom";
import React, { useEffect, useState } from 'react';
import AddProducts from "./views/AddProducts";
import Products from "./views/Products";
import SignIn from "./views/SignIn";
import Grafics from "./views/Grafics";
import Page404 from "./views/others/Page404";
import Navbar from "./components/Navbar";
import SignUp from "./views/SignUp";
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
  const [searchTerm, setSearchTerm] = useState(""); // Nuevo estado para el término de búsqueda

  // Fetch user role from Firestore
  async function getRol(uid) {
    const docuRef = doc(firestore, `Usuarios/${uid}`);
    const docuCifrada = await getDoc(docuRef);
    const infoFinal = docuCifrada.data().rol;
    return infoFinal;
  }

  // Set user data with Firebase user information and role
  function setUserWithFirebaseAndRol(usuarioFirebase) {
    getRol(usuarioFirebase.uid).then((rol) => {
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

  // Handle search term change
  const handleSearchChange = (term) => {
    setSearchTerm(term);
  };

  // Listen for authentication state changes
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
      {location.pathname !== "/signin" && user ? <Navbar userRole={user.rol} onSearchChange={handleSearchChange} /> : null}

      <Routes>
        <Route
          path="/signin"
          element={user ? <Navigate to="/" replace /> : <SignIn />}
        />

        {/* Protected routes */}
        <Route element={<Protected isActive={!user} />}>
          <Route
            path="/"
            element={user ?
              <Products
                userRole={user.rol}
                idUsuario={user.uid}
                searchTerm={searchTerm}
              /> : <Loading />}
          />
          <Route path="/add_productos" element={<AddProducts />} />
          <Route path="/graficas" element={<Grafics />} />
        </Route>

        {/* Default route for non-existing pages */}
        <Route path="/*" element={<Page404 />} />
      </Routes>
    </>
  );
}

export default App;
