import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ element: Component, ...rest }) => {
    const isAuthenticated = !!localStorage.getItem('access'); // Verifica si el token de acceso está presente

    return isAuthenticated ? Component : <Navigate to="/signUp" />;
};

export default PrivateRoute;