import React, { useEffect, useState } from 'react';
import { Box, Card, CardBody, Text } from '@chakra-ui/react';

function Products() {
  const url = 'http://localhost:3000/data';
  const [todos, setTodos] = useState([]);
  const [error, setError] = useState(null);

  const fetchApi = async () => {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const responseJSON = await response.json();
      setTodos(responseJSON);
      console.log(responseJSON);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError(error.message);
    }
  };

  useEffect(() => {
    fetchApi();
  }, []);

  return (
    <Box>
      {error ? (
        <Text color="red.500">Error: {error}</Text>
      ) : !todos.length ? (
        'Cargando . . .'
      ) : (
        todos.map((todo, index) => (
          <Card key={index} mb={4}>
            <CardBody>
              <Text>ID: {todo.id}</Text>
              <Text>Nombre: {todo.nombre}</Text>
              <Text>Descripcion: {todo.descripcion}</Text>
              <Text>Cantidad: {todo.cantidad}</Text>
            </CardBody>
          </Card>
        ))
      )}
    </Box>
  );
}

export default Products;
