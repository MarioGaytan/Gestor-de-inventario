import React, { useState, useEffect } from 'react';
import { Box, Flex, Button, IconButton, Input, List, ListItem, Drawer, DrawerBody, DrawerFooter, DrawerHeader, DrawerOverlay, DrawerContent, DrawerCloseButton } from "@chakra-ui/react";
import { NavLink } from "react-router-dom";
import { AddIcon, SearchIcon, CalendarIcon, InfoIcon } from '@chakra-ui/icons';


/**
 * Componente Navbar que muestra un menú de navegación con opciones y una barra de búsqueda dinámica.
 */
export default function Navbar() {
  const [showSearch, setShowSearch] = useState(false); // Estado para controlar la visibilidad de la barra de búsqueda
  const [searchTerm, setSearchTerm] = useState(''); // Estado para manejar el término de búsqueda
  const [items, setItems] = useState([]); // Estado para almacenar los ítems obtenidos de la API
  const [isDrawerOpen, setIsDrawerOpen] = useState(false); // Estado para controlar la visibilidad del Drawer

  /**
   * useEffect para obtener los datos de la API cuando el componente se monta.
   */
  useEffect(() => {
    fetch('http://localhost:3000/data')
      .then(response => response.json())
      .then(data => setItems(data))
      .catch(error => console.error('Error al obtener los datos:', error));
  }, []);

  /**
   * Filtra los ítems en función del término de búsqueda.
   */
  const filteredItems = items.filter(item =>
    item.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  /**
   * Abre el Drawer.
   */
  const openDrawer = () => setIsDrawerOpen(true);

  /**
   * Cierra el Drawer.
   */
  const closeDrawer = () => setIsDrawerOpen(false);

  return (
    <Box>
      <Flex bg={"blue.900"} color={"white"} py={2} px={4} align={"center"}>
        <Button as={NavLink} to={"/signin"} color="red.500" fontWeight={400} variant={"link"}>
          cerrar sesión
        </Button>

        <Flex ml="auto">
          <IconButton
            as={NavLink}
            to={"/productos"}
            aria-label="Agregar"
            icon={<AddIcon />}
            variant={"ghost"}
          />
          <IconButton
            aria-label="Carrito de compras"
            icon={<CalendarIcon />}
            variant={"ghost"}
            onClick={openDrawer} // Abre el Drawer al hacer clic
          />
          <IconButton
            aria-label="Buscar"
            icon={<SearchIcon />}
            variant={"ghost"}
            onClick={() => setShowSearch(!showSearch)}
          />
          <IconButton
            as={NavLink}
            to={"/graficas"}
            aria-label="Gráfica"
            icon={<InfoIcon />}
            variant={"ghost"}
          />
        </Flex>
      </Flex>

      {showSearch && (
        <Box p={4} bg="white" color="black">
          <Input
            placeholder="Buscar..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <List mt={4}>
            {filteredItems.map((item, index) => (
              <ListItem key={index}>{item.nombre}</ListItem>
            ))}
          </List>
        </Box>
      )}

      <Drawer isOpen={isDrawerOpen} placement="right" onClose={closeDrawer}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Carrito de Compras</DrawerHeader>
          <DrawerBody>
            {/* Aquí puedes agregar el contenido del carrito */}
            <List>
              {items.map((item, index) => (
                <ListItem key={index}>{item.nombre}</ListItem>
              ))}
            </List>
          </DrawerBody>
          <DrawerFooter>
            <Button variant="outline" mr={3} onClick={closeDrawer}>
              Cerrar
            </Button>
            <Button colorScheme="blue">Comprar</Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </Box>
  );
}
