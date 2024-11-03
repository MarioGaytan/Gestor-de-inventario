import React, { useEffect, useState } from 'react';
import { Box, Text, Input } from '@chakra-ui/react';
import Cards from '../ui-elements/Card';

const Products = ({ userRole, idUsuario }) => {
  const url = 'http://localhost:3000/productos';
  const [todos, setTodos] = useState([]);
  const [filteredTodos, setFilteredTodos] = useState([]); // Nuevo estado para productos filtrados
  const [searchTerm, setSearchTerm] = useState(''); // Estado para el término de búsqueda
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`Error ${response.status}`);
      const { data } = await response.json(); // Desestructurar para obtener 'data'
      setTodos(data);
      setFilteredTodos(data); // Inicializa productos filtrados con todos los productos
    } catch (error) {
      setError(error.message);
      console.error('Error al obtener los datos:', error);
    }
  };

  // Función para manejar cambios en el campo de búsqueda
  const handleSearchChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);

    // Filtrar productos que coincidan con el término de búsqueda
    const filtered = todos.filter(product =>
      product.nombre.toLowerCase().includes(term.toLowerCase()) // Ajusta el campo según tus datos
    );
    setFilteredTodos(filtered);
  };

  const handleDeleteProduct = async (id) => {
    try {
      const response = await fetch(`${url}/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error(`Error deleting product with ID ${id}`);
      
      // Actualiza ambos estados tras la eliminación
      const updatedTodos = todos.filter(todo => todo.id !== id);
      setTodos(updatedTodos);
      setFilteredTodos(updatedTodos.filter(product =>
        product.nombre.toLowerCase().includes(searchTerm.toLowerCase())
      ));
    } catch (error) {
      setError(error.message);
      console.error('Error deleting product:', error);
    }
  };

  const handleUpdateProduct = async (productId, updatedData) => {
    try {
      const response = await fetch(`${url}/${productId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData),
      });
      if (!response.ok) throw new Error('Error al actualizar el producto');

      const updatedProduct = await response.json();

      // Actualiza ambos estados tras la modificación
      const updatedTodos = todos.map(product =>
        product.id === productId ? updatedProduct : product
      );
      setTodos(updatedTodos);
      setFilteredTodos(updatedTodos.filter(product =>
        product.nombre.toLowerCase().includes(searchTerm.toLowerCase())
      ));
    } catch (error) {
      console.error('Error al actualizar el producto:', error);
    }
  };

  return (
    <Box p={4}>
      <Input
        placeholder="Buscar producto..."
        value={searchTerm}
        onChange={handleSearchChange} // Manejar cambios en la búsqueda
        mb={4}
      />
      {error ? (
        <Text color="red.500">Error: {error}</Text>
      ) : !filteredTodos.length ? (
        <Text>No se encontraron productos</Text>
      ) : (
        <Cards todos={filteredTodos} onDelete={handleDeleteProduct} onUpdate={handleUpdateProduct} userRole={userRole} idUsuario={idUsuario} />
      )}
      <Text mt={4}>User Role: {userRole}</Text>
    </Box>
  );
};

export default Products;
