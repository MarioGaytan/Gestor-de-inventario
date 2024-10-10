import React, { useEffect, useState } from 'react';
import { Box, Text } from '@chakra-ui/react';
import Cards from '../ui-elements/card';

const Products = ({ userRole }) => {
  const url = 'http://localhost:3000/data';
  const [todos, setTodos] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch(url);
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

  const handleUpdateProduct = async (productId, newCantidad) => {
    try {
      const response = await fetch(`${url}/${productId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cantidad: newCantidad }),
      });
      if (!response.ok) throw new Error('Error al actualizar el producto');

      const updatedProduct = await response.json();
      // Actualiza el estado con el producto actualizado
      setTodos(prevProducts =>
        prevProducts.map(product =>
          product.id === productId ? updatedProduct : product
        )
      );
    } catch (error) {
      console.error('Error al actualizar el producto:', error);
    }
  };

  return (
    <Box p={4}>
      {error ? (
        <Text color="red.500">Error: {error}</Text>
      ) : !todos.length ? (
        <Text>Cargando . . .</Text>
      ) : (<Cards todos={todos} onDelete={handleDeleteProduct} onUpdate={handleUpdateProduct} userRole={userRole} />
      )}
      <Text mt={4}>User Role: {userRole}</Text>
    </Box>
  );
};

export default Products;

       
