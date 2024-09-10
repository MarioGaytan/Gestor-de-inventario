import { Box, Flex, Button, IconButton } from "@chakra-ui/react";
import { NavLink } from "react-router-dom";
import { AddIcon, SearchIcon, CalendarIcon, InfoIcon } from '@chakra-ui/icons'; // Usa solo íconos de Chakra

export default function Navbar() {
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
            as={NavLink} 
             
            aria-label="Carrito de compras" 
            icon={<CalendarIcon />}  // Usando CalendarIcon temporalmente
            variant={"ghost"} 
          />
          <IconButton 
            as={NavLink} 
            
            aria-label="Buscar" 
            icon={<SearchIcon />} 
            variant={"ghost"} 
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
    </Box>
  );
}
