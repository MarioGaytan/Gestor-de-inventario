import React from "react";
import { Navigate, Outlet } from "react-router-dom";

/**
 * Componente Protected que protege rutas basadas en una condición de actividad.
 * @param {boolean} isActive - Determina si la condición de actividad es verdadera.
 * @param {string} route - Ruta de redirección cuando la condición de actividad es verdadera (por defecto "/signin").
 */
function Protected({ isActive, route = "/signin" }) {
    if (isActive) {
        // Redirige a la ruta especificada si la condición de actividad es verdadera
        return <Navigate to={route} replace />;
    }
    // Si la condición de actividad es falsa, renderiza los componentes hijos
    return <Outlet />;
}

export default Protected;
