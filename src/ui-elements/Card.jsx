import React from 'react';
import {Card, CardBody, Text, SimpleGrid } from '@chakra-ui/react';

function Cards({ todos }) {
  return (
    <SimpleGrid columns={[1, 2, 4]} spacing={6}>
      {todos.map((todo, index) => (
        <Card key={index} mb={4} boxShadow="md" borderRadius="md" overflow="hidden">
          <CardBody>
            {/* Aquí se puede agregar la imagen posteriormente */}
            <Text fontWeight="bold">ID: {todo.id}</Text>
            <Text>Nombre: {todo.nombre}</Text>
            <Text>Descripción: {todo.descripcion}</Text>
            <Text>Cantidad: {todo.cantidad}</Text>
          </CardBody>
        </Card>
      ))}
    </SimpleGrid>
  );
}

export default Cards;
