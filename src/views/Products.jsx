import React, { useEffect, useState } from 'react';
import { Box, Text } from '@chakra-ui/react';
import Cards from '../ui-elements/card';

const Products = () => {
  const url = 'http://localhost:3000/data';
  const [todos, setTodos] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch('http://localhost:3000/data');
      if (!response.ok) throw new Error(`Error ${response.status}`);
      const data = await response.json();
      setTodos(data);
    } catch (error) {
      setError(error.message);
      console.error('Error al obtener los datos:', error);
    }
  };

  const handleDeleteProduct = async (id) => {
    try {
      const response = await fetch(`${url}/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error(`Error deleting product with ID ${id}`);
      setTodos(todos.filter(todo => todo.id !== id));
    } catch (error) {
      setError(error.message);
      console.error('Error deleting product:', error);
    }
  };

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
};

export default Products;