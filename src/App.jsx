import { Route, Routes } from "react-router-dom"
import React, { useEffect, useState } from 'react'
import Home from "./views/Home"
import Products from "./views/Products"
import SignIn from "./views/SignIn"
import Grafics from "./views/Grafics"
import Page404 from "./views/others/Page404"
import Navbar from "./components/Navbar"
import app from '../firebase-config';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import Protected from './components/Protected';


function App() {
  const [userAuth, setUserAuth] = useState(null);
  const auth = getAuth(app);
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserAuth(user.email);
        console.log(user);
      } else {
        console.log("Favor de volverse a autenticar");
      }
    });
  }, []);

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/signin" element={<SignIn />} />
        <Route element={<Protected isActive={!userAuth} />}>
          <Route path="/" element={<Products />} />
          <Route path="/productos" element={<Home />} />
          <Route path="/graficas" element={<Grafics />} />
          <Route path="/*" element={<Page404 />} />
        </Route>
      </Routes>
    </>
  )
}

export default App
