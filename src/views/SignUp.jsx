import React from "react";
import app from "../../firebase-config";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, collection, setDoc } from "firebase/firestore";

const auth = getAuth(app);


function Login() {
    const firestore = getFirestore(app);
    async function registrarUsuario(email, password, rol) {
        const infoUsuario = await createUserWithEmailAndPassword(auth, email, password)
            .then((usuarioFirebase) => {
                return usuarioFirebase;
            });
        console.log(infoUsuario.user.uid);
        const docuRef = doc(firestore, `Usuarios/${infoUsuario.user.uid}`);
        setDoc(docuRef, { correo: email, rol: rol });
    }

    function submitHandler(e) {
        e.preventDefault();

        const email = e.target.elements.namedItem('email').value;
        const password = e.target.elements.namedItem('password').value;
        const rol = e.target.elements.namedItem('rol').value;

        console.log("submit", email, password, rol);

        registrarUsuario(email, password, rol);
    }

    return (
        <div>
            <h1>Regístrate</h1>

            <form onSubmit={submitHandler}>
                <label>
                    Correo electrónico:
                    <input type="email" name="email" />
                </label>

                <label>
                    Contraseña:
                    <input type="password" name="password" />
                </label>

                <label>
                    Rol:
                    <select name="rol">
                        <option value="dueno">dueno</option>
                        <option value="trabajador">trabajador</option>
                        <option value="gerente">gerente</option>
                    </select>
                </label>

                <input
                    type="submit"
                    value="Iniciar sesión"
                />
            </form>
        </div>
    );
}

export default Login;
