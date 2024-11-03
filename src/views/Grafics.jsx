import React, { useState, useEffect } from 'react';
import { Button } from '@chakra-ui/react';
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
  const [data, setData] = useState([]);
  const navigate = useNavigate();

  // Obtener datos de ventas y emails de usuarios
  useEffect(() => {
    const fetchVentas = async () => {
      try {
        const response = await fetch('http://localhost:3000/ventas');
        const result = await response.json();
        if (result.data) {
          // Obtener el conjunto de idUsuarios únicos
          const usuariosIds = [...new Set(result.data.map(venta => venta.idUsuario))];
          
          // Consultar los emails de cada usuario usando idUsuario
          const usuariosEmails = await Promise.all(usuariosIds.map(async idUsuario => {
            const userResponse = await fetch(`http://localhost:3000/usuarios/${idUsuario}`);
            const userResult = await userResponse.json();
            return { idUsuario, email: userResult.correo };
          }));
          
          // Crear un mapa para acceder rápidamente al email de cada idUsuario
          const emailMap = usuariosEmails.reduce((acc, { idUsuario, email }) => {
            acc[idUsuario] = email;
            return acc;
          }, {});

          // Procesar datos para agrupar por email y sumar cantidades
          const ventasPorUsuario = result.data.reduce((acc, venta) => {
            const { idUsuario, cantidad } = venta;
            const email = emailMap[idUsuario]; // Obtener el email de idUsuario

            if (!acc[email]) {
              acc[email] = { email, vendidos: 0 };
            }
            acc[email].vendidos += cantidad;
            return acc;
          }, {});

          // Convertir objeto en array para el gráfico
          const processedData = Object.values(ventasPorUsuario);
          setData(processedData);
        }
      } catch (error) {
        console.error('Error al obtener ventas:', error);
      }
    };
    fetchVentas();
  }, []);

  const handleClick = () => {
    navigate('/');
  };

  return (
    <div>
      <Button colorScheme='blue' onClick={handleClick}>Atrás</Button>
      <h1>Aquí estadísticas y gráficas</h1>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="email" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="vendidos" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default Grafics;
