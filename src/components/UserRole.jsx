// UserRole.js
import React from 'react';

const UserRole = ({ role }) => {
    console.log("Prop role en UserRole:", role); // Añade este log
    return <div>Rol del usuario: {role}</div>;
};

export default UserRole;
