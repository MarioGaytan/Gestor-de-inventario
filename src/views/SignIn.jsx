import React, { useState } from 'react';
import {
  Box, Grid, Button, Input, FormHelperText, HStack, VStack, FormControl,
  Checkbox, IconButton, Text, Heading, Image, useColorModeValue, Flex
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';

function SignIn() {
  const navigate = useNavigate();
  const auth = getAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);

  const handleLogin = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then((credentials) => {
        const user = credentials.user;
        console.log("Se autenticó con el email", user.email);
        navigate("/");
      })
      .catch((error) => {
        // Manejamos diferentes mensajes de error según el código de error de Firebase
        switch (error.code) {
          case 'auth/invalid-email':
            setError("El formato del correo es inválido.");
            break;
          case 'auth/invalid-credential':
            setError("El correo o Contraseña incorrecta.");
            break;
          case 'auth/missing-password':
            setError("Falta contraseña.");
            break;
          default:
            setError("Ocurrió un error inesperado. Inténtalo de nuevo.");
        }
      });
  };

  return (
    <Flex
      align="center"
      justify="center"
      height="100vh"
      backgroundImage="url('https://img.freepik.com/vector-premium/descarga-gratuita-imagenes-fondo-freepik_689361-61.jpg')"
      backgroundSize="cover"
      backgroundPosition="center"
    >
      <Box
        bg={useColorModeValue("white", "gray.800")}
        p={8}
        rounded="lg"
        shadow="lg"
        width={{ base: "90%", md: "400px" }}
        textAlign="center"
      >
        <VStack spacing={4}>
          <Image
            src="/LOGO.svg"
            alt="Logo de la empresa"
            boxSize="80px"
            objectFit="cover"
          />
          <Heading fontSize="2xl" color={useColorModeValue("blue.800", "blue.300")}>
            Gestor de Inventario
          </Heading>
          <Text fontSize="sm" color={useColorModeValue("gray.600", "gray.400")}>
            Inicia sesión con tu correo y contraseña
          </Text>
        </VStack>

        <Box mt={6}>
          <Grid templateColumns="1fr" gap={4}>
            <FormControl>
              <Input
                placeholder="Correo electrónico"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                borderColor={useColorModeValue("gray.300", "gray.600")}
                _focus={{ borderColor: "blue.500" }}
              />
            </FormControl>

            <FormControl>
              <Input
                placeholder="Contraseña"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                borderColor={useColorModeValue("gray.300", "gray.600")}
                _focus={{ borderColor: "blue.500" }}
              />
              <IconButton
                mt={2}
                variant="ghost"
                size="sm"
                icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
              />
            </FormControl>

            {error && (
              <Text color="red.500" fontSize="sm">
                {error}
              </Text>
            )}
          </Grid>

          <HStack mt={4} justify="space-between">
            <Checkbox colorScheme="blue">Recordarme</Checkbox>
            <Text fontSize="sm" color="blue.500" cursor="pointer">
              ¿Olvidaste tu contraseña?
            </Text>
          </HStack>

          <Button
            mt={6}
            colorScheme="blue"
            width="full"
            onClick={handleLogin}
            _hover={{ bg: "blue.600" }}
          >
            Iniciar Sesión
          </Button>
        </Box>
      </Box>
    </Flex>
  );
}

export default SignIn;
