import { Route, Routes } from "react-router-dom"
import Home from "./views/Home"
import Products from "./views/Products"
import SignIn from "./views/SignIn"
import Grafics from "./views/Grafics"
import Page404 from "./views/others/Page404"
import Navbar from "./components/Navbar"

function App() {


  return (
    <>
    <Navbar/>
      <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/productos" element={<Products />} />
      <Route path="/signin" element={<SignIn />} />
      <Route path="/graficas" element={<Grafics />} />
      <Route path="/*" element={<Page404 />} />
      </Routes>
    </>
  )
}

export default App
