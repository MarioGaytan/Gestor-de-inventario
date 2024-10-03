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
import { getFirestore, doc, getDoc } from "firebase/firestore";
import Protected from './components/Protected';
import Loading from "./components/Loading";
import Navbar1 from "./components/Navbar1";
import UserRole from './components/UserRole'; // Importa el nuevo componente

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const auth = getAuth(app);
  const firestore = getFirestore(app);

  useEffect(() => {
    const fetchUserRole = async (uid) => {
      const docRef = doc(firestore, `usuarios/${uid}`);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        console.log("Rol del usuario:", docSnap.data().rol); // Añade este log
        return docSnap.data().rol;
      } else {
        return null;
      }
    };

    const handleAuthStateChanged = async (user) => {
      if (user) {
        const role = await fetchUserRole(user.uid);
        console.log("Usuario autenticado:", { ...user, role }); // Añade este log
        setUser({ ...user, role });
      } else {
        setUser(null);
      }
      setLoading(false);
    };

    const unsubscribe = onAuthStateChanged(auth, handleAuthStateChanged);
    return () => unsubscribe();
  }, [auth, firestore]);

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      {location.pathname !== "/signin" && <Navbar1 />}
      {location.pathname !== "/signin" && user?.role === 'dueno' && <Navbar />}
      {user && <UserRole role={user.role} />} {/* Muestra el rol del usuario */}
      <Routes>
        <Route
          path="/signin"
          element={user ? <Navigate to="/" replace /> : <SignIn />}
        />
        <Route element={<Protected isActive={!user} />}>
          <Route path="/" element={<Products />} />
          <Route path="/add_productos" element={<AddProducts />} />
          <Route path="/graficas" element={<Grafics />} />
        </Route>
        <Route path="/*" element={<Page404 />} />
      </Routes>
    </>
  );
}

export default App;
