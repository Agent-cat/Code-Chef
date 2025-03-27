import React from 'react';

const RoleBasedComponent = ({ children, allowedRoles, fallback = null }) => {
  const user = JSON.parse(localStorage.getItem('user'));
  
  if (!user || !allowedRoles.includes(user.role)) {
    return fallback;
  }
  
  return children;
};

export default RoleBasedComponent; 