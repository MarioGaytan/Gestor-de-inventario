import React, { useState, useEffect } from 'react';
import { Button, Box, Grid, Input, HStack, Heading, Text, Divider, VStack, useColorModeValue } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts';

function Grafics() {
  // Estados para manejar datos de las gráficas y filtros
  const [ventasData, setVentasData] = useState([]);
  const [productosData, setProductosData] = useState([]);
  const [productosPorUsuarioData, setProductosPorUsuarioData] = useState([]);
  const [filteredProductosPorUsuarioData, setFilteredProductosPorUsuarioData] = useState([]);
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const navigate = useNavigate();
  const SCROLL_THRESHOLD = 10; // Define el número mínimo de productos o usuarios para activar el scroll
  const [error, setError] = useState(null);

  // Estilo de colores para diferentes usuarios
  const userColors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'];

  useEffect(() => {
    // Función para obtener datos de ventas y calcular las métricas
    const fetchVentas = async () => {
      try {
        const response = await fetch('https://api-inventario-n6uo.onrender.com/ventas');
        const result = await response.json();
        if (result.data) {
          const usuariosIds = [...new Set(result.data.map((venta) => venta.idUsuario))];
          const productosIds = [...new Set(result.data.map((venta) => venta.idProducto))];

          // Obtener correos electrónicos de los usuarios
          const usuariosEmails = await Promise.all(
            usuariosIds.map(async (idUsuario) => {
              const userResponse = await fetch(`https://api-inventario-n6uo.onrender.com/usuarios/${idUsuario}`);
              const userResult = await userResponse.json();
              return { idUsuario, email: userResult.correo };
            })
          );

          // Mapear IDs de usuarios a correos electrónicos
          const emailMap = usuariosEmails.reduce((acc, { idUsuario, email }) => {
            acc[idUsuario] = email;
            return acc;
          }, {});

          // Calcular ventas por usuario
          const ventasPorUsuario = result.data.reduce((acc, venta) => {
            const { idUsuario, cantidad } = venta;
            const email = emailMap[idUsuario];

            if (!acc[email]) {
              acc[email] = { email, vendidos: 0 };
            }
            acc[email].vendidos += cantidad;
            return acc;
          }, {});

          setVentasData(Object.values(ventasPorUsuario));

          // Calcular ventas por producto
          const productosPorVenta = result.data.reduce((acc, venta) => {
            const { idProducto, cantidad } = venta;
            if (!acc[idProducto]) {
              acc[idProducto] = { idProducto, vendidos: 0 };
            }
            acc[idProducto].vendidos += cantidad;
            return acc;
          }, {});

          const productosConNombres = await Promise.all(
            Object.values(productosPorVenta).map(async (producto) => {
              const productResponse = await fetch(`https://api-inventario-n6uo.onrender.com/productos/${producto.idProducto}`);
              const productResult = await productResponse.json();
              return { ...producto, nombre: productResult.nombre };
            })
          );

          setProductosData(productosConNombres);

          // Calcular ventas por producto y usuario
          const ventasPorProductoUsuario = productosIds.map((idProducto) => {
            const productoVentas = result.data.filter((venta) => venta.idProducto === idProducto);
            const usuariosData = usuariosIds.reduce((acc, idUsuario) => {
              const usuarioVentas = productoVentas
                .filter((venta) => venta.idUsuario === idUsuario)
                .reduce((sum, venta) => sum + venta.cantidad, 0);

              acc[emailMap[idUsuario]] = usuarioVentas;
              return acc;
            }, {});

            return { idProducto, ...usuariosData };
          });

          setProductosPorUsuarioData(ventasPorProductoUsuario);
          setFilteredProductosPorUsuarioData(ventasPorProductoUsuario); // Inicialmente no filtrado
        }
      } catch (error) {
        setError(error.message);
        console.error('Error al obtener ventas:', error);
      }
    };

    fetchVentas();
  }, []);

  // Función para filtrar ventas por rango de fechas
  const handleFilter = async () => {
    if (!fechaInicio || !fechaFin) {
      alert('Por favor, selecciona ambas fechas.');
      return;
    }

    try {
      const response = await fetch(
        `https://api-inventario-n6uo.onrender.com/ventas?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`
      );
      const result = await response.json();
      if (result.data) {
        const usuariosIds = [...new Set(result.data.map((venta) => venta.idUsuario))];
        const productosIds = [...new Set(result.data.map((venta) => venta.idProducto))];

        const usuariosEmails = await Promise.all(
          usuariosIds.map(async (idUsuario) => {
            const userResponse = await fetch(`https://api-inventario-n6uo.onrender.com/usuarios/${idUsuario}`);
            const userResult = await userResponse.json();
            return { idUsuario, email: userResult.correo };
          })
        );

        const emailMap = usuariosEmails.reduce((acc, { idUsuario, email }) => {
          acc[idUsuario] = email;
          return acc;
        }, {});

        const ventasPorProductoUsuario = productosIds.map((idProducto) => {
          const productoVentas = result.data.filter((venta) => venta.idProducto === idProducto);
          const usuariosData = usuariosIds.reduce((acc, idUsuario) => {
            const usuarioVentas = productoVentas
              .filter((venta) => venta.idUsuario === idUsuario)
              .reduce((sum, venta) => sum + venta.cantidad, 0);

            acc[emailMap[idUsuario]] = usuarioVentas;
            return acc;
          }, {});

          return { idProducto, ...usuariosData };
        });

        setFilteredProductosPorUsuarioData(ventasPorProductoUsuario);
      }
    } catch (error) {
      console.error('Error al filtrar las ventas:', error);
    }
  };

  // Botón para regresar a la página principal
  const handleClick = () => {
    navigate('/');
  };

  // Color del fondo según el modo de color
  const bgColor = useColorModeValue('gray.100', 'gray.900');

  return (
    <Box bg={bgColor} p={6} borderRadius="lg">
      <Button colorScheme="blue" onClick={handleClick} mb={4}>
        Atrás
      </Button>
      <Heading mb={6} textAlign="center">
        Estadísticas y Gráficas
      </Heading>
      <Grid templateColumns="repeat(1, 1fr)" gap={6} alignItems="center">
        {/* Ventas por Usuario */}
        <Box bg="white" p={6} borderRadius="lg" boxShadow="lg">
          <Heading size="md" mb={4} textAlign="center">
            Histórico total de Ventas por Usuario
          </Heading>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={ventasData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="email" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="vendidos" fill="#4CAF50" />
            </BarChart>
          </ResponsiveContainer>
        </Box>

        {/* Productos Vendidos */}
        <Box bg="white" p={6} borderRadius="lg" boxShadow="lg">
          <Heading size="md" mb={4} textAlign="center">
            Histórico total de Productos Vendidos
          </Heading>
          <div style={{ overflowX: productosData.length > SCROLL_THRESHOLD ? 'auto' : 'hidden' }}>
            <ResponsiveContainer width={productosData.length > SCROLL_THRESHOLD ? '150%' : '100%'} height={250}>
              <BarChart data={productosData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="nombre" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="vendidos" fill="#4287f5" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Box>

        {/* Filtro por Fechas */}
        <Box bg="white" p={6} borderRadius="lg" boxShadow="lg">
          <Heading size="md" mb={4} textAlign="center">
            Filtrar Desglose de Ventas por Producto y Usuario
          </Heading>
          <HStack spacing={4} marginBottom={4} justify="center">
            <Input
              type="date"
              placeholder="Fecha Inicio"
              value={fechaInicio}
              onChange={(e) => setFechaInicio(e.target.value)}
            />
            <Input
              type="date"
              placeholder="Fecha Fin"
              value={fechaFin}
              onChange={(e) => setFechaFin(e.target.value)}
            />
            <Button colorScheme="blue" onClick={handleFilter}>
              Confirmar
            </Button>
          </HStack>
          <div style={{ overflowX: productosData.length > SCROLL_THRESHOLD ? 'auto' : 'hidden' }}>
            <ResponsiveContainer width={productosData.length > SCROLL_THRESHOLD ? '150%' : '100%'} height={300}>
              <BarChart data={filteredProductosPorUsuarioData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="idProducto" />
                <YAxis />
                <Tooltip />
                <Legend />
                {Object.keys(filteredProductosPorUsuarioData[0] || {}).map((usuario, index) =>
                  usuario !== 'idProducto' ? (
                    <Bar
                      key={usuario}
                      dataKey={usuario}
                      fill={userColors[index % userColors.length]} // Colores dinámicos por usuario
                      name={usuario}
                    />
                  ) : null
                )}
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Box>
      </Grid>
    </Box>
  );
}

export default Grafics;
