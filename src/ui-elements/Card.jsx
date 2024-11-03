import React, { useState } from 'react';
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
function Cards({ todos, onDelete, onUpdate, userRole, idUsuario }) {
  const [isOpen, setIsOpen] = useState(false); // Estado para controlar la visibilidad del modal
  const [selectedTodo, setSelectedTodo] = useState(null); // Estado para el producto seleccionado
  const [cantidadAgregar, setCantidadAgregar] = useState(0); // Estado para la cantidad a agregar
  const [cantidadRetirar, setCantidadRetirar] = useState(0); // Estado para la cantidad a retirar
  const toast = useToast(); // Hook de Chakra UI para notificaciones
  const apiURL = 'http://localhost:3000/ventas'; // URL de la API de ventas

  /**
   * Abre el modal y establece el producto seleccionado.
   * @param {Object} todo - Producto seleccionado.
   */
  const openModal = (todo) => {
    setSelectedTodo(todo);
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
    setCantidadAgregar(0);
    setCantidadRetirar(0);
  };

  /**
   * Maneja la eliminación del producto seleccionado.
   */
  const handleDelete = () => {
    onDelete(selectedTodo.id); // Llama a la función de eliminación
    toast({
      title: "Producto Eliminado",
      status: "error",
      duration: 3000,
      isClosable: true,
    });
    closeModal();
  };

  /**
   * Función para manejar la actualización de productos y la creación de ventas.
   */
  const handleUpdateProduct = async () => {
    if (!selectedTodo) return;

    const newCantidad = selectedTodo.cantidad + cantidadAgregar - cantidadRetirar;

    // Asegúrate de que la nueva cantidad no sea negativa
    if (newCantidad < 0) {
      toast({
        title: "Error",
        description: "La cantidad no puede ser negativa.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    onUpdate(selectedTodo.id, { ...selectedTodo, cantidad: newCantidad }); // Llama a la función que actualiza el producto
    toast({
      title: "Producto actualizado.",
      description: `La nueva cantidad es ${newCantidad}.`,
      status: "success",
      duration: 3000,
      isClosable: true,
    });

    // Crear venta automáticamente si se ha retirado una cantidad
    if (cantidadRetirar > 0) {
      await handleCreateSale(); // Llamar a la función para crear la venta
    }

    closeModal();
  };

  /**
   * Función para manejar la creación del registro de venta si se ha retirado una cantidad.
   */
  const handleCreateSale = async () => {
    try {
      const response = await fetch(apiURL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          idUsuario: userRole === 'trabajador' ? null : idUsuario,
          idProducto: selectedTodo?.id,
          cantidad: cantidadRetirar,
        }),
      });

      if (!response.ok) throw new Error(`Error: ${response.status}`);

      toast({
        title: 'Venta creada con éxito',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Error al crear la venta',
        description: error.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
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
                      {userRole !== 'dueno' && userRole !== 'gerente' ? null : (
                        <>
                          <Text>Agregar:</Text>
                          <Input
                            type="number"
                            value={cantidadAgregar}
                            onChange={e => setCantidadAgregar(Math.max(0, parseInt(e.target.value) || 0))}
                            min="0"
                            step="1"
                            placeholder="Cantidad a agregar"
                          />
                        </>
                      )}
                    </Grid>
                    <Grid templateColumns='repeat(2, 1fr)' gap={6} mt={4}>
                      <Text>Retirar:</Text>
                      <Input
                        type="number"
                        value={cantidadRetirar}
                        onChange={e => setCantidadRetirar(Math.max(0, Math.min(parseInt(e.target.value) || 0, selectedTodo.cantidad)))}
                        min="0"
                        step="1"
                        max={selectedTodo.cantidad}
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
              <Button colorScheme="blue" onClick={handleUpdateProduct}>
                Actualizar
              </Button>
              <Box />
              <Box />
              {userRole === 'dueno' && (
                <Button colorScheme="red" mr={3} onClick={handleDelete} leftIcon={<DeleteIcon />}>
                  Eliminar
                </Button>
              )}
            </Grid>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default Cards;
