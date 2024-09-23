import React, { useEffect, useState } from 'react';
import { Box, Text } from '@chakra-ui/react';
import Cards from '../ui-elements/card';

function Products() {
  const url = 'http://localhost:3000/data';
  const [todos, setTodos] = useState([]);
  const [error, setError] = useState(null);

  // Función para obtener los productos desde la API
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

  // Función para eliminar un producto del estado local y API
  const handleDeleteProduct = async (id) => {
    try {
      // Eliminar el producto en la API
      const response = await fetch(`${url}/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`Error deleting product with ID ${id}`);
      }

      // Eliminar el producto del estado local
      setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
    } catch (error) {
      console.error('Error deleting product:', error);
      setError(error.message);
    }
  };

  useEffect(() => {
    fetchApi();
  }, []);

  return (
    <Box p={4}>
      {error ? (
        <Text color="red.500">Error: {error}</Text>
      ) : !todos.length ? (
        <Text>Cargando . . .</Text>
      ) : (
        <Cards todos={todos} onDelete={handleDeleteProduct} />
      )}
    </Box>
  );
}

export default Products;