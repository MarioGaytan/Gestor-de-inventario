import React, { useState, useEffect } from 'react';
import {
  Card, CardBody, Text, SimpleGrid, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, Button, Input, Grid, Box, useToast,
} from '@chakra-ui/react';
import { DeleteIcon } from '@chakra-ui/icons';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebase-config'

/**
 * Componente Cards que muestra una lista de tarjetas con información de productos.
 * @param {Array} productos - Lista de productos a mostrar.
 * @param {Function} onDelete - Función para eliminar un producto.
 * @param {Function} onUpdate - Función para actualizar la cantidad de un producto.
 * @param {String} userRole - Rol del usuario (e.g., "dueno", "gerente").
 * @param {String} idUsuario - ID del usuario actual.
 */
function Cards({ productos, onDelete, onUpdate, userRole, idUsuario }) {
  const [todos, setTodos] = useState([]); // Estado interno para los productos
  const [isOpen, setIsOpen] = useState(false); // Estado para controlar la visibilidad del modal
  const [selectedTodo, setSelectedTodo] = useState(null); // Estado para el producto seleccionado
  const [cantidadAgregar, setCantidadAgregar] = useState(0); // Estado para la cantidad a agregar
  const [cantidadRetirar, setCantidadRetirar] = useState(0); // Estado para la cantidad a retirar
  const [confirmAction, setConfirmAction] = useState(null); // Manejar confirmaciones
  const [isConfirmOpen, setIsConfirmOpen] = useState(false); // Estado para el modal de confirmación
  const toast = useToast(); // Hook de Chakra UI para notificaciones
  const apiURL = 'http://localhost:3000/ventas'; // URL de la API de ventas

  useEffect(() => {
    // Conectar a la colección de Firestore
    const unsubscribe = onSnapshot(collection(db, 'productos'), (snapshot) => {
      const productos = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setTodos(productos);
    });

    // Limpia la suscripción cuando el componente se desmonte
    return () => unsubscribe();
  }, []);

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

  const handleConfirm = (actionType, actionCallback) => {
    setConfirmAction({ type: actionType, callback: actionCallback });
    setIsConfirmOpen(true);
  };
  
  const executeConfirmedAction = () => {
    if (confirmAction?.callback) confirmAction.callback();
    setIsConfirmOpen(false);
  };
  

  /**
   * Maneja la eliminación del producto seleccionado.
   */
  const handleDelete = () => {
    handleConfirm( 'delete', () => {
      onDelete(selectedTodo.id); // Llama a la función de eliminación
      toast({
        title: 'Producto Eliminado',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      closeModal();
    });
  };

  /**
   * Función para manejar la actualización de productos y la creación de ventas.
   */
  const handleUpdateProduct = () => {
    handleConfirm('update',() => {
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

      onUpdate(selectedTodo.id, { ...selectedTodo, cantidad: newCantidad });
      toast({
        title: 'Producto actualizado.',
        description: `La nueva cantidad es ${newCantidad}.`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

    // Crear venta automáticamente si se ha retirado una cantidad
      if (cantidadRetirar > 0) {
        handleCreateSale(); // Llamar a la función para crear la venta
      }

      closeModal();
    });
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
          idUsuario: idUsuario,
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
      {/* Modal de confirmación add*/}
      <Modal isOpen={isConfirmOpen} onClose={() => setIsConfirmOpen(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Confirmar Acción</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {confirmAction?.type === 'delete' && selectedTodo ? (
              <Text>
                ¿Estás seguro que deseas eliminar el producto <strong>{selectedTodo.nombre}</strong>? Esta acción es permanente.
              </Text>
            ) : (
              <Text>
                ¿Estás seguro que deseas actualizar el producto <strong>{selectedTodo?.nombre}</strong> ajustando las cantidades? 
                Se agregarán <strong>{cantidadAgregar}</strong> y se retirarán <strong>{cantidadRetirar}</strong>.
              </Text>
            )}
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="red" onClick={executeConfirmedAction}>
              Confirmar
            </Button>
            <Button ml={3} onClick={() => setIsConfirmOpen(false)}>
              Cancelar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default Cards;
