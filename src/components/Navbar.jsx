import React, { useState, useEffect } from 'react';
import { Box, Flex, Button, IconButton, Input } from "@chakra-ui/react";
import { NavLink, useNavigate } from "react-router-dom";
import { AddIcon, SearchIcon, InfoIcon } from '@chakra-ui/icons';
import { signOut, getAuth, onAuthStateChanged } from 'firebase/auth';
import app from '../../firebase-config';

const auth = getAuth(app);

/**
 * Componente Navbar que muestra una barra de navegación con opciones de búsqueda y control de sesión.
 * @param {string} userRole - El rol del usuario (por ejemplo, 'gerente' o 'dueno') para mostrar opciones específicas.
 * @param {function} onSearchChange - Función para manejar cambios en el campo de búsqueda.
 */
const Navbar = ({ userRole, onSearchChange }) => {
  const [searchTerm, setSearchTerm] = useState(''); // Estado para el término de búsqueda
  const [showSearch, setShowSearch] = useState(false); // Estado para mostrar u ocultar el campo de búsqueda
  const navigate = useNavigate();

  useEffect(() => {
    // Suscribirse a los cambios en la autenticación del usuario
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        navigate("/signin"); // Navegar a la página de inicio de sesión si no hay un usuario autenticado
      }
    });

    // Limpiar la suscripción cuando el componente se desmonte
    return () => unsubscribe();
  }, [navigate]);

  /**
   * Maneja el cambio en el campo de búsqueda.
   * @param {Event} e - Evento de cambio en el campo de búsqueda.
   */
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value); // Actualiza el estado del término de búsqueda
    onSearchChange(value); // Llama a la función de cambio de búsqueda pasada como prop
  };

  return (
    <Box>
      <Flex bg={"blue.900"} color={"white"} py={2} px={4} align={"center"}>
        <Button onClick={() => signOut(auth)}>Cerrar sesión</Button>
        <Flex ml="auto">
          {(userRole === 'gerente' || userRole === 'dueno') && (
            <>
              <IconButton
                as={NavLink}
                to={"/add_productos"}
                aria-label="Agregar"
                icon={<AddIcon />}
                variant={"ghost"}
                color="white"
              />
              <IconButton
                as={NavLink}
                to={"/graficas"}
                aria-label="Gráfica"
                icon={<InfoIcon />}
                variant={"ghost"}
                color="white"
              />
            </>
          )}
          <IconButton
            aria-label="Buscar"
            icon={<SearchIcon />}
            variant={"ghost"}
            onClick={() => setShowSearch(!showSearch)} // Alterna la visibilidad del campo de búsqueda
            color="white"
          />
        </Flex>
      </Flex>

      {showSearch && (
        <Box p={4} bg="white" color="black">
          <Input
            placeholder="Buscar..."
            value={searchTerm}
            onChange={handleSearchChange} // Llama a la función de manejo de cambio de búsqueda
          />
        </Box>
      )}
    </Box>
  );
};

export default Navbar;
