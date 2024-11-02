import React, { useState, useEffect } from 'react';
import { Box, Flex, Button, IconButton, Input, List, ListItem, Text } from "@chakra-ui/react";
import { NavLink, useNavigate } from "react-router-dom";
import { AddIcon, SearchIcon, InfoIcon } from '@chakra-ui/icons';
import { signOut, getAuth, onAuthStateChanged } from 'firebase/auth';
import app from '../../firebase-config';

const auth = getAuth(app);

const Navbar = ({ userRole, onFilterChange }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]); // Para almacenar solo los productos filtrados
  const [showSearch, setShowSearch] = useState(false);
  const [noResults, setNoResults] = useState(false); // Para mostrar mensaje si no hay resultados
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        navigate("/signin");
      }
    });

    fetchData(); // Cargar productos al inicio
    return () => unsubscribe();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch('http://localhost:3000/productos');
      if (!response.ok) throw new Error(`Error ${response.status}`);
      const productos = await response.json();
      setItems(productos.data || []); // Guardar todos los productos en `items`
      setFilteredItems(productos.data || []); // Inicializar `filteredItems` con todos los productos
    } catch (error) {
      console.error('Error al obtener los datos:', error);
    }
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    // Filtrar los productos según el término de búsqueda
    if (value.trim()) {
      const results = items.filter(item =>
        item.nombre.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredItems(results);
      setNoResults(results.length === 0); // Mostrar mensaje si no hay coincidencias
      onFilterChange(results); // Enviar los resultados filtrados
    } else {
      setFilteredItems(items); // Mostrar todos si no hay término de búsqueda
      setNoResults(false);
      onFilterChange(items); // Enviar todos los productos si no hay término de búsqueda
    }
  };

  return (
    <Box>
      <Flex bg={"blue.900"} color={"white"} py={2} px={4} align={"center"}>
        <Button onClick={() => signOut(auth)}>Cerrar sesión</Button>

        <Flex ml="auto">
          {/* Botón visible solo para 'gerente' y 'dueño' */}
          {(userRole === 'gerente' || userRole === 'dueno') && (
            <>
              <IconButton as={NavLink} to={"/add_productos"} aria-label="Agregar" icon={<AddIcon />} variant={"ghost"} color="white" />
              <IconButton as={NavLink} to={"/graficas"} aria-label="Gráfica" icon={<InfoIcon />} variant={"ghost"} color="white" />
            </>
          )}

          {/* Botón visible para todos los roles */}
          <IconButton aria-label="Buscar" icon={<SearchIcon />} variant={"ghost"} onClick={() => setShowSearch(!showSearch)} color="white" />
        </Flex>
      </Flex>

      {showSearch && (
        <Box p={4} bg="white" color="black">
          <Input placeholder="Buscar..." value={searchTerm} onChange={handleSearchChange} />
          <List mt={4}>
            {noResults ? (
              <Text color="gray.500">No se encontraron resultados</Text>
            ) : (
              filteredItems.map((item) => (
                <ListItem key={item.id}>{item.nombre}</ListItem>
              ))
            )}
          </List>
        </Box>
      )}
    </Box>
  );
};

export default Navbar;