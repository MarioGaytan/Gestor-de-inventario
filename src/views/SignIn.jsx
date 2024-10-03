import React, { useState } from 'react';
import { Box, Grid, Button, Input, FormHelperText, HStack, VStack, FormControl, Checkbox, IconButton } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons'; // Importa iconos para mostrar y ocultar

function SignIn() {
  const navigate = useNavigate();
  const auth = getAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // Estado para mostrar/ocultar contraseña
  const [error, setError] = useState(null);

  const handleLogin = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then((credentials) => {
        const user = credentials.user;
        console.log("Se autenticó con el email", user.email);
        navigate("/");
      })
      .catch((error) => alert(error.message));
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
            <h1>Gestor De Inventario</h1>
            <h2>Login</h2>
            <p>Introduce correo y contraseña</p>
          </VStack>
        </HStack>
        <HStack p={"30px"} bg={"white"} borderRadius={"30px"}>
          <img
            src="https://img.freepik.com/foto-gratis/vasto-edificio-almacenamiento-lleno-productos-colocados-estantes-industriales-etiquetas_482257-83423.jpg?t=st=1725856085~exp=1725859685~hmac=1f5a029f2159c7a4de16684c9bfa45cb216a887c01048c9959dabeb0722f0d3f&w=250"
            alt="Imagen de un almacén"
          />
          <Box bg="#ffffff" p={5}>
            <Grid templateColumns="1fr" gap={1}>
              <Input placeholder="Usuario" onChange={(e) => setEmail(e.target.value)} />

              <FormControl>
                <Input
                  placeholder="Contraseña"
                  type={showPassword ? 'text' : 'password'} // Cambia entre text y password
                  onChange={(e) => setPassword(e.target.value)}
                />
                <HStack>
                  <IconButton
                    variant="link"
                    icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                  />
                  <FormHelperText>{showPassword ? 'Contraseña visible' : 'Contraseña oculta'}</FormHelperText>
                </HStack>
              </FormControl>

              <HStack w='full' justify='space-between'>
                <Checkbox>Recordarme.</Checkbox>
              </HStack>

              <Button onClick={handleLogin}>Iniciar Sesión</Button>
            </Grid>
          </Box>
        </HStack>
      </Box>
    </Box>
  );
}

export default SignIn;
