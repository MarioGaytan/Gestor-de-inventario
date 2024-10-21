import React, { useState } from 'react';
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
  const [data, setData] = useState([
    { empleado: 'Empleado 1', vendidos: 50 },
    { empleado: 'Empleado 2', vendidos: 30 },
    { empleado: 'Empleado 3', vendidos: 25 },
    { empleado: 'Empleado 4', vendidos: 37 },
    { empleado: 'Empleado 5', vendidos: 44 },
  ]);

  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/');
  };

  const increaseSales = () => {
    setData(prevData =>
      prevData.map(item =>
        item.empleado === 'Empleado 1'
          ? { ...item, vendidos: item.vendidos + 1 }
          : item
      )
    );
  };

  const decreaseSales = () => {
    setData(prevData =>
      prevData.map(item =>
        item.empleado === 'Empleado 1' && item.vendidos > 0
          ? { ...item, vendidos: item.vendidos - 1 }
          : item
      )
    );
  };

  return (
    <div>
      <Button colorScheme='blue' onClick={handleClick}>Atrás</Button>
      <h1>Aquí estadísticas y gráficas</h1>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="empleado" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="vendidos" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
      <Button colorScheme='green' onClick={increaseSales}>Más</Button>
      <Button colorScheme='red' onClick={decreaseSales}>Menos</Button>
    </div>
  );
}

export default Grafics;
