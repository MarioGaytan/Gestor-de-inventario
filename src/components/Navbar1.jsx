import React, { useState, useEffect } from 'react';
import { Box, Flex, Button, IconButton, Input, List, ListItem } from "@chakra-ui/react";
import { NavLink, useNavigate } from "react-router-dom";
import { AddIcon, SearchIcon, InfoIcon } from '@chakra-ui/icons';
import { signOut, getAuth, onAuthStateChanged } from 'firebase/auth';

const Navbar1 = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [items, setItems] = useState([]);
    const [showSearch, setShowSearch] = useState(false);
    const auth = getAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (!user) {
                navigate("/signin");
            }
        });

        fetchData();
        return () => unsubscribe();
    }, []);

    const fetchData = async () => {
        try {
            const response = await fetch('http://localhost:3000/data');
            if (!response.ok) throw new Error(`Error ${response.status}`);
            const data = await response.json();
            setItems(data);
        } catch (error) {
            console.error('Error al obtener los datos:', error);
        }
    };

    const filteredItems = items.filter(item =>
        item.nombre.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSignOut = async () => {
        try {
            await signOut(auth);
            navigate("/signin");
        } catch (error) {
            alert(`Error: ${error}`);
        }
    };

    return (
        <Box>
            <Flex bg={"blue.900"} color={"white"} py={2} px={4} align={"center"}>
                <Button onClick={handleSignOut}>Cerrar sesión</Button>
                <Flex ml="auto">

                    <IconButton aria-label="Buscar" icon={<SearchIcon />} variant={"ghost"} onClick={() => setShowSearch(!showSearch)} color="white" />

                </Flex>
            </Flex>

            {showSearch && (
                <Box p={4} bg="white" color="black">
                    <Input placeholder="Buscar..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                    <List mt={4}>
                        {filteredItems.map((item, index) => (
                            <ListItem key={index}>{item.nombre}</ListItem>
                        ))}
                    </List>
                </Box>
            )}
        </Box>
    );
};

export default Navbar1;
