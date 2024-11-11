import React, { useState, useEffect } from 'react';
import { Button, Box, Grid } from '@chakra-ui/react';
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
  const [ventasData, setVentasData] = useState([]);
  const [productosData, setProductosData] = useState([]);
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVentas = async () => {
      try {
        const response = await fetch('http://localhost:3000/ventas');
        const result = await response.json();
        if (result.data) {
          const usuariosIds = [...new Set(result.data.map(venta => venta.idUsuario))];
          const usuariosEmails = await Promise.all(usuariosIds.map(async idUsuario => {
            const userResponse = await fetch(`http://localhost:3000/usuarios/${idUsuario}`);
            const userResult = await userResponse.json();
            return { idUsuario, email: userResult.correo };
          }));

          const emailMap = usuariosEmails.reduce((acc, { idUsuario, email }) => {
            acc[idUsuario] = email;
            return acc;
          }, {});

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
        }
      } catch (error) {
        setError(error.message);
        console.error('Error al obtener ventas:', error);
      }
    };

    const fetchProductos = async () => {
      try {
        const response = await fetch('http://localhost:3000/ventas');
        const result = await response.json();
        if (result.data) {
          const productosPorVenta = result.data.reduce((acc, venta) => {
            const { idProducto, cantidad } = venta;
            if (!acc[idProducto]) {
              acc[idProducto] = { idProducto, vendidos: 0 };
            }
            acc[idProducto].vendidos += cantidad;
            return acc;
          }, {});

          const productosConNombres = await Promise.all(Object.values(productosPorVenta).map(async (producto) => {
            const productResponse = await fetch(`http://localhost:3000/productos/${producto.idProducto}`);
            const productResult = await productResponse.json();
            return { ...producto, nombre: productResult.nombre };
          }));

          setProductosData(productosConNombres);
        }
      } catch (error) {
        setError(error.message);
        console.error('Error al obtener productos:', error);
      }
    };

    fetchVentas();
    fetchProductos();
  }, []);

  const handleClick = () => {
    navigate('/');
  };

  return (
    <div>
      <Button colorScheme='blue' onClick={handleClick}>Atrás</Button>
      <h1>Estadísticas y Gráficas</h1>
      <Grid templateColumns="repeat(2, 1fr)" gap={6} alignItems="center">
        <Box>
          <h2>Ventas por Usuario</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={ventasData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="email" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="vendidos" fill="#4CAF50" /> {/* Color verde */}
            </BarChart>
          </ResponsiveContainer>
        </Box>

        <Box>
          <h2>Productos Vendidos</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={productosData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="nombre" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="vendidos" fill="#4287f5" /> {/* Color azul */}
            </BarChart>
          </ResponsiveContainer>
        </Box>
      </Grid>
    </div>
  );
}

export default Grafics;
