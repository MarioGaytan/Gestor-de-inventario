import React from 'react';
import { Button } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

function Grafics() {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/');
  };
  return (
    <div>
      <Button colorScheme='blue' onClick={handleClick}>Atras</Button>
      <h1>aqui estadisticas y graficas</h1>
    </div>
  )
}

export default Grafics
