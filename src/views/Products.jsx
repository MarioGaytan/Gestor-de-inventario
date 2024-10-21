import React, { useEffect, useState } from 'react';
import { Box, Text } from '@chakra-ui/react';
import Cards from '../ui-elements/card';

/**
 * Componente Products.
 * 
 * Muestra una lista de productos obtenidos de una API local y permite eliminar productos.
 * 
 * @returns {JSX.Element} Componente de la lista de productos.
 */
const Products = () => {
  /**
   * Guarda la lista de productos obtenidos.
   * @type {Array<Object>}
   */
  const [todos, setTodos] = useState([]);

  /**
   * Almacena el mensaje de error si algo falla.
   * @type {string | null}
   */
  const [error, setError] = useState(null);

  /**
   * Al cargarse el componente, llama a la función para obtener los productos.
   */
  useEffect(() => {
    fetchData();
  }, []);

  /**
   * Obtiene los productos de una API local y los guarda en el estado.
   * Si hay un error, lo guarda en el estado de error.
   */
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

  /**
   * Elimina un producto de la lista y de la API.
   * 
   * @param {number} id - ID del producto que se va a eliminar.
   */
  const handleDeleteProduct = async (id) => {
    try {
      const response = await fetch(`${url}/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error(`Error al eliminar el producto con ID ${id}`);
      setTodos(todos.filter(todo => todo.id !== id));
    } catch (error) {
      setError(error.message);
      console.error('Error al eliminar el producto:', error);
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
