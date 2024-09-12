import React, { useState, useEffect } from 'react';
import { Card, CardBody, Text, SimpleGrid, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, Button, Input, Grid, Box } from '@chakra-ui/react';
import { DeleteIcon } from '@chakra-ui/icons';

/**
 * Componente Cards que muestra una lista de tarjetas con información de productos.
 * @param {Function} onDelete - Función para eliminar un producto.
 * @param {Function} onUpdate - Función para actualizar la cantidad de un producto.
 */
function Cards({ onDelete, onUpdate }) {
  const [todos, setTodos] = useState([]); // Estado para almacenar los productos obtenidos de la API
  const [isOpen, setIsOpen] = useState(false); // Estado para controlar la visibilidad del modal
  const [selectedTodo, setSelectedTodo] = useState(null); // Estado para el producto seleccionado
  const [newCantidad, setNewCantidad] = useState(''); // Estado para la nueva cantidad del producto

  /**
   * useEffect para obtener los datos de la API cuando el componente se monta.
   */
  useEffect(() => {
    fetch('http://localhost:3000/data')
      .then(response => response.json())
      .then(data => setTodos(data))
      .catch(error => console.error('Error al obtener los datos:', error));
  }, []);

  /**
   * Abre el modal y establece el producto seleccionado.
   * @param {Object} todo - Producto seleccionado.
   */
  const openModal = (todo) => {
    setSelectedTodo(todo);
    setNewCantidad(todo.cantidad);
    setIsOpen(true);
  };

  /**
   * Cierra el modal y restablece los estados.
   */
  const closeModal = () => {
    setIsOpen(false);
    setSelectedTodo(null);
    setNewCantidad('');
  };

  /**
   * Maneja la eliminación del producto seleccionado.
   */
  const handleDelete = () => {
    onDelete(selectedTodo.id);
    closeModal();
  };

  /**
   * Maneja la actualización de la cantidad del producto seleccionado.
   */
  const handleUpdate = () => {
    onUpdate(selectedTodo.id, newCantidad);
    closeModal();
  };

  return (
    <>
      <SimpleGrid columns={[1, 2, 4]} spacing={6}>
        {todos.map((todo, index) => (
          <Card key={index} mb={4} boxShadow="md" borderRadius="md" overflow="hidden" onClick={() => openModal(todo)}>
            <CardBody>
              <Grid templateColumns='repeat(2, 1fr)' gap={2}>
                <Box bg='tomato' w='87%' h={150} color='white'></Box>
                <Box>
                  <Text>Nombre: {todo.nombre}</Text>
                  <Text>Descripción: {todo.descripcion}</Text>
                  <Text>Cantidad: {todo.cantidad}</Text>
                </Box>
              </Grid>
            </CardBody>
          </Card>
        ))}
      </SimpleGrid>

      <Modal isOpen={isOpen} onClose={closeModal} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Detalles del Producto</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Grid templateColumns='repeat(2, 1fr)'>
              <Box bg='tomato' w='80%' justifyContent="center" alignItems="center" h={150} color='white'></Box>
              <Box>
                {selectedTodo && (
                  <>
                    <Text fontWeight="bold">ID: {selectedTodo.id}</Text>
                    <Text>Nombre: {selectedTodo.nombre}</Text>
                    <Text>Descripción: {selectedTodo.descripcion}</Text>
                    <Text>Cantidad: {selectedTodo.cantidad}</Text>
                    <Grid templateColumns='repeat(2, 1fr)' gap={6}>
                      <Text>Retirar:</Text>
                      <Input
                        type="number"
                      />
                    </Grid>
                    <Grid templateColumns='repeat(2, 1fr)' gap={6}>
                      <Text>Agregar:</Text>
                      <Input
                        type="number"
                      />
                    </Grid>
                  </>
                )}
              </Box>
            </Grid>
          </ModalBody>
          <ModalFooter justifyContent="center">
            <Grid templateColumns='repeat(4, 1fr)'>
              <Button colorScheme="blue" onClick={handleUpdate}>
                Actualizar
              </Button>
              <Box />
              <Box />
              <Button colorScheme="red" mr={3} onClick={handleDelete} leftIcon={<DeleteIcon />}>
                Eliminar
              </Button>
            </Grid>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default Cards;
