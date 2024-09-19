import { Route, Routes } from 'react-router-dom';
import PrivateRoute from '../PrivateRoute/PrivateRoute';
import UserNavbar from '../UserNavbar/UserNavbar';

const PrivateLayout = ({ routes }) => (
  <>
    <UserNavbar />
    <Routes>
    {routes.map((route, index) => (
        <Route
        key={index}
        path={route.path}
        element={<PrivateRoute element={route.element} />}
        />
    ))}
    </Routes>
  </>
);

export default PrivateLayout;