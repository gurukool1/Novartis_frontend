import React from 'react'
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children, role }) => {
    const auth = useSelector(state => state.auth)
    if (!auth.isAuthenticated) {
        return <Navigate to="/" />
    }
 if (role && auth.user?.role !== role) {
    return <Navigate to="/" />;
  }
    return children;
}

export default PrivateRoute
