import React, { useEffect, useState } from 'react';
import { Box, Text } from '@chakra-ui/react';
import Cards from '../ui-elements/Card';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebase-config'

const Products = ({ userRole, idUsuario, searchTerm }) => {
  const url = 'https://api-inventario-n6uo.onrender.com/productos';
  const [todos, setTodos] = useState([]);
  const [filteredTodos, setFilteredTodos] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Conectar a la colección de Firestore
    const unsubscribe = onSnapshot(collection(db, 'productos'), (snapshot) => {
      const productos = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setTodos(productos);
    });

    // Limpia la suscripción cuando el componente se desmonte
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    // Filtrar productos cada vez que el término de búsqueda cambie
    if (searchTerm) {
      const filtered = todos.filter(product =>
        product.nombre.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredTodos(filtered);
    } else {
      setFilteredTodos(todos); // Si no hay término de búsqueda, mostrar todos
    }
  }, [searchTerm, todos]);

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

  const handleDeleteProduct = async (id) => {
    try {
      const response = await fetch(`${url}/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error(`Error deleting product with ID ${id}`);
      
      const updatedTodos = todos.filter(todo => todo.id !== id);
      setTodos(updatedTodos);
      setFilteredTodos(updatedTodos.filter(product =>
        product.nombre.toLowerCase().includes(searchTerm?.toLowerCase() || '')
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
      const updatedTodos = todos.map(product =>
        product.id === productId ? updatedProduct : product
      );
      setTodos(updatedTodos);
      setFilteredTodos(updatedTodos.filter(product =>
        product.nombre.toLowerCase().includes(searchTerm?.toLowerCase() || '')
      ));
    } catch (error) {
      setError(error.message);
      console.error('Error al actualizar el producto:', error);
    }
  };

  return (
    <Box p={4}>
      {error ? (
        <Text color="red.500">Error: {error}</Text>
      ) : !filteredTodos.length ? (
        <Text>No se encontraron productos</Text>
      ) : (
        <Cards
          productos={filteredTodos}
          onDelete={handleDeleteProduct}
          onUpdate={handleUpdateProduct}
          userRole={userRole}
          idUsuario={idUsuario}
        />
      )}
      <Text mt={4}>User Role: {userRole}</Text>
    </Box>
  );
};

export default Products;
