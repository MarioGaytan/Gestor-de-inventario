import { Center, Spinner } from '@chakra-ui/react';
import React from 'react';

/**
 * Componente Loading que muestra una animación de carga centrada en la pantalla.
 */
function Loading() {
    return (
        <Center h="100vh">
            <Spinner
                thickness="4px"         // Grosor del borde del spinner
                speed="0.65s"           // Velocidad de rotación del spinner
                emptyColor="gray.200"   // Color del fondo del spinner
                color="blue.500"        // Color del borde del spinner
                size="xl"               // Tamaño del spinner
            />
        </Center>
    );
}

export default Loading;
