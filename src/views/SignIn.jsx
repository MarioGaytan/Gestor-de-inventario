import React, { useState } from 'react';
import {  Box, Grid, Button, Input, FormHelperText, HStack, VStack, FormControl, FormLabel, Checkbox } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

function SignIn() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');   
  const [error, setError] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();

    setError(null);    
    if (!email.trim()) {
      setError('El correo electrónico es obligatorio.');
    } else if (!password.trim()) {
      setError('La contraseña es obligatoria.');
    } else {
      console.log('Formulario enviado:', { email, password });
      navigate('/'); 
    }
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100vh"
      backgroundImage={"https://img.freepik.com/vector-premium/descarga-gratuita-imagenes-fondo-freepik_689361-61.jpg"}
      backgroundSize="cover"
      backgroundPosition="center"
      w={"100%"}
    >
      <Box p={4} bg="white" borderRadius="md" shadow="md" alignItems="center">
        <HStack spacing={4} align='flex-start' w='full'>
          <VStack spacing={1} align={['flex-start', 'center']} w='full'>
            <heading>Login</heading>
            <text>Introduce correo y contraseña</text>
          </VStack>
        </HStack>
        <HStack p={"30px"} bg={"white"} borderRadius={"30px"}>
          <img
            src="https://img.freepik.com/foto-gratis/vasto-edificio-almacenamiento-lleno-productos-colocados-estantes-industriales-etiquetas_482257-83423.jpg?t=st=1725856085~exp=1725859685~hmac=1f5a029f2159c7a4de16684c9bfa45cb216a887c01048c9959dabeb0722f0d3f&w=250"
            alt="Imagen de un almacén" // Agrega un atributo alt descriptivo
          />
          <card bg="#ffffff" p={5}>
            <Grid templateColumns="1fr" gap={1}>
              <FormControl isInvalid={error}>
                <FormLabel>Correo electrónico</FormLabel>
                <Input
                  rounded='none'
                  variant='filled'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                {error && <FormHelperText>{error}</FormHelperText>}
              </FormControl>

              <FormControl isInvalid={error}>
                <FormLabel>Contraseña</FormLabel>
                <Input
                  rounded='none'
                  variant='filled'
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                {error && <FormHelperText>{error}</FormHelperText>}
              </FormControl>

              <HStack w='full' justify='space-between'>
                <Checkbox>Recordarme.</Checkbox>
              </HStack>

              <Button
                style={{ backgroundColor: "#450068", color: "#ffffff" }}
                onClick={handleSubmit}
                isDisabled={!email.trim() || !password.trim()}
              >
                Iniciar sesión
              </Button>
            </Grid>
          </card>
        </HStack>
      </Box>
    </Box>
  );
}

export default SignIn;
