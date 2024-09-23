import React, { useState, useEffect } from 'react';
import {
  Card, CardBody, Text, SimpleGrid, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody,
  ModalCloseButton, Button, Input, Grid, Box, useToast
} from '@chakra-ui/react';
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
  const [cantidadAgregar, setCantidadAgregar] = useState(0); // Estado para la cantidad a agregar
  const [cantidadRetirar, setCantidadRetirar] = useState(0); // Estado para la cantidad a retirar
  const toast = useToast(); // Hook de Chakra UI para notificaciones

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
    setCantidadAgregar(0); // Restablecer las cantidades de agregar y retirar
    setCantidadRetirar(0);
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
    onDelete(selectedTodo.id); // Llama a la función de eliminación
    setTodos(todos.filter(todo => todo.id !== selectedTodo.id)); // Remueve el producto del estado local
    closeModal();
  };

  /**
   * Maneja la actualización de la cantidad del producto seleccionado.
   */
  const handleUpdate = () => {
    const totalRetirar = parseFloat(cantidadRetirar);
    const totalAgregar = parseFloat(cantidadAgregar);
    const cantidadActual = parseFloat(newCantidad);

    // Validaciones de las cantidades
    if (totalRetirar > cantidadActual) {
      toast({
        title: 'Error',
        description: 'No puedes retirar más de lo que existe',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const cantidadFinal = cantidadActual - totalRetirar + totalAgregar;

    // Actualiza el producto localmente
    const updatedTodos = todos.map(todo =>
      todo.id === selectedTodo.id ? { ...todo, cantidad: cantidadFinal } : todo
    );

    setTodos(updatedTodos);
    onUpdate(selectedTodo.id, cantidadFinal); // Llama a la función onUpdate con la nueva cantidad
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
                    <Text>Cantidad actual: {selectedTodo.cantidad}</Text>
                    <Grid templateColumns='repeat(2, 1fr)' gap={6} mt={4}>
                      <Text>Agregar:</Text>
                      <Input
                        type="number"
                        value={cantidadAgregar}
                        onChange={e => {
                          const value = parseInt(e.target.value, 10);
                          if (!isNaN(value) && value >= 0) {
                            setCantidadAgregar(value);
                          }
                        }}
                        min="0"
                        step="1"
                        placeholder="Cantidad a agregar"
                      />
                    </Grid>
                    <Grid templateColumns='repeat(2, 1fr)' gap={6} mt={4}>
                      <Text>Retirar:</Text>
                      <Input
                        type="number"
                        value={cantidadRetirar}
                        onChange={e => {
                          const value = parseInt(e.target.value, 10);
                          if (!isNaN(value) && value >= 0) {
                            setCantidadRetirar(value);
                          }
                        }}
                        min="0"
                        step="1"
                        max={newCantidad}
                        placeholder="Cantidad a retirar"
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