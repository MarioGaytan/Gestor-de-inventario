import React, { useEffect, useState } from 'react';
import { Box, Card, CardBody, Text } from '@chakra-ui/react';
import Cards from '../ui-elements/card';

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
    <Box p={4}>
      {error ? (
        <Text color="red.500">Error: {error}</Text>
      ) : !todos.length ? (
        <Text>Cargando . . .</Text>
      ) : (
        <Cards todos={todos} />
      )}
    </Box>
  );
}

export default Products;
