import React, { useState, useEffect } from 'react';
import { Box, Flex, Button, IconButton, Input } from "@chakra-ui/react";
import { NavLink, useNavigate } from "react-router-dom";
import { AddIcon, SearchIcon, InfoIcon } from '@chakra-ui/icons';
import { signOut, getAuth, onAuthStateChanged } from 'firebase/auth';
import app from '../../firebase-config';

const auth = getAuth(app);

const Navbar = ({ userRole, onSearchChange }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        navigate("/signin");
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearchChange(value); // Se delega la lógica de filtrado a `App.jsx`
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
            onClick={() => setShowSearch(!showSearch)}
            color="white"
          />
        </Flex>
      </Flex>

      {showSearch && (
        <Box p={4} bg="white" color="black">
          <Input
            placeholder="Buscar..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </Box>
      )}
    </Box>
  );
};

export default Navbar;
