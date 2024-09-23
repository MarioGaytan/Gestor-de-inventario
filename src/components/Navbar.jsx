import React, { useState, useEffect } from 'react';
import { Box, Flex, Button, IconButton, Input, List, ListItem, Drawer, DrawerBody, DrawerFooter, DrawerHeader, DrawerOverlay, DrawerContent, DrawerCloseButton, useDisclosure } from "@chakra-ui/react";
import { NavLink, useNavigate } from "react-router-dom";
import { AddIcon, SearchIcon, CalendarIcon, InfoIcon } from '@chakra-ui/icons';
import app from '../../firebase-config';
import { signOut, getAuth, onAuthStateChanged } from 'firebase/auth';

export default function Navbar() {
  const [showSearch, setShowSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [items, setItems] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const auth = getAuth(app);
  const navigate = useNavigate();

  const handleSignOut = () => {
    signOut(auth)
      .then(() => navigate("/signin", { replace: true }))
      .catch((error) => alert(`Se perdió la conexión, inténtalo más tarde. \n Error: ${error}`));
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUserAuth(user ? user.email : null);
    });

    fetch('http://localhost:3000/data')
      .then(response => response.json())
      .then(data => setItems(data))
      .catch(error => console.error('Error al obtener los datos:', error));

    return () => unsubscribe();
  }, [auth]);

  const filteredItems = items.filter(item =>
    item.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box>
      <Flex bg={"blue.900"} color={"white"} py={2} px={4} align={"center"}>
        <Button onClick={handleSignOut}>Cerrar sesión</Button>
        <Flex ml="auto">
          <IconButton as={NavLink} to={"/productos"} aria-label="Agregar" icon={<AddIcon />} variant={"ghost"} />
          <IconButton aria-label="Carrito de compras" icon={<CalendarIcon />} variant={"ghost"} onClick={onOpen} />
          <IconButton aria-label="Buscar" icon={<SearchIcon />} variant={"ghost"} onClick={() => setShowSearch(!showSearch)} />
          <IconButton as={NavLink} to={"/graficas"} aria-label="Gráfica" icon={<InfoIcon />} variant={"ghost"} />
        </Flex>
      </Flex>

      {showSearch && (
        <Box p={4} bg="white" color="black">
          <Input placeholder="Buscar..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          <List mt={4}>
            {filteredItems.map((item, index) => (
              <ListItem key={index}>{item.nombre}</ListItem>
            ))}
          </List>
        </Box>
      )}

      <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Carrito de Compras</DrawerHeader>
          <DrawerBody>
            <List>
              {items.map((item, index) => (
                <ListItem key={index}>{item.nombre}</ListItem>
              ))}
            </List>
          </DrawerBody>
          <DrawerFooter>
            <Button variant="outline" mr={3} onClick={onClose}>
              Cerrar
            </Button>
            <Button colorScheme="blue">Comprar</Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </Box>
  );
}
