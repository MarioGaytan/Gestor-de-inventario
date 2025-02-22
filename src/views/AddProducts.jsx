import React, { useState } from 'react';
import { Box, Button, Input, FormControl, FormLabel, useToast } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

/**
 * Componente Home que permite agregar un producto a la API REST. 1
 */
function Home() {
  const navigate = useNavigate();
  const toast = useToast();

  // Definir estados para los campos del formulario
  const [id, setId] = useState('');
  const [nombre, setNombre] = useState(''); // Estado para el nombre del producto
  const [descripcion, setDescripcion] = useState(''); // Estado para la descripción del producto
  const [cantidad, setCantidad] = useState(0); // Estado para la cantidad del producto

  /**
   * Maneja el envío del formulario para agregar un nuevo producto.
   * @param {Event} e - Evento de envío del formulario.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Crear objeto con los datos del nuevo producto
    const newProduct = { id, nombre, descripcion, cantidad };

    try {
      // Enviar solicitud POST a la API para agregar el nuevo producto
      const response = await fetch('http://localhost:3000/productos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newProduct),
      });

      // Mostrar mensaje de éxito o error según la respuesta de la API
      if (response.ok) {
        toast({
          title: 'Producto agregado.',
          description: 'El producto ha sido agregado exitosamente.',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });

        // Reiniciar los campos del formulario
        setId('');
        setNombre('');
        setDescripcion('');
        setCantidad('');
      } else {
        throw new Error('Error al agregar el producto');
      }
    } catch (error) {
      // Mostrar mensaje de error en caso de fallo
      toast({
        title: 'Error.',
        description: 'Hubo un problema al agregar el producto.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Box p={4}>
      <Button colorScheme='blue' onClick={() => navigate('/')}>Atrás</Button>
      <Box as="form" mt={4} onSubmit={handleSubmit}>
        <FormControl id="nombre" isRequired>
          <FormLabel>Nombre</FormLabel>
          <Input
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Nombre del producto"
          />
        </FormControl>
        <FormControl id="descripcion" mt={4} isRequired>
          <FormLabel>Descripción</FormLabel>
          <Input
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            placeholder="Descripción del producto"
          />
        </FormControl>
        <FormControl id="cantidad" mt={4} isRequired>
          <FormLabel>Cantidad</FormLabel>
          <Input
            type="number"
            value={cantidad}
            onChange={(e) => setCantidad(Math.max(0, parseInt(e.target.value) || 0))}
            min="0"
            max="10000000" // Límite máximo de 10,000,000
            step="1"
            placeholder="Cantidad"
          />
        </FormControl>
        <Button mt={4} colorScheme="teal" type="submit">Agregar Producto</Button>
      </Box>
    </Box>
  );
}

export default Home;
