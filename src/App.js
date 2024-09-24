import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
// Import bootstrap
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';

// import fontawesome
import '@fortawesome/fontawesome-free/css/all.min.css';

//import boostrap icons
import 'bootstrap-icons/font/bootstrap-icons.css';

// Import all components

//import PublicNavbar from './components/PublicNavbar/PublicNavbar';
import Homep from './components/Homep/Homep';
import LogInSignUp from './components/LogInSignUp/LogInSignUp';
import ShowEvent from './components/ShowEvent/ShowEvent';
import UserRegister from './components/UserRegister/UserRegister';
import PrivateRoute from './components/PrivateRoute/PrivateRoute';
import LoginSuccess from './components/LoginSuccess/LoginSuccess';
import UserProfile from './components/UserProfile/UserProfile';
import HomeUser from './components/HomeUser/HomeUser';
import ShowAllEvents from './components/ShowAllEvents/ShowAllEvents';
import Footer from './components/Footer/Footer';
import PrivateRouteAfterLogin from './components/PrivateRouteAfterLogin/PrivateRouteAfterLogin';
import { Toaster } from 'react-hot-toast';
import Notificaciones from './components/Notificaciones/Notificaciones';
import CreateEventF from './components/CreateEventF/CreateEventF';
import UpdateEventF from './components/UpdateEventF/UpdateEventF';
import CreateBeneficio from './components/CreateBeneficio/CreateBeneficio';
import ShowAllBeneficios from './components/ShowAllBeneficios/ShowAllBeneficios';
import ShowBeneficio from './components/ShowBeneficio/ShowBeneficio';
import UpdateBeneficio from './components/UpdateBeneficio/UpdateBeneficio';
import UserNavbar from './components/UserNavbar/UserNavbar';
import PrivateLayout from './components/PrivateLayout/PrivateLayout';
import AI from './components/AI/AI';
import CreateDescuento from './components/CreateDescuento/CreateDescuento';
import ShowAllDescuentos from './components/ShowAllDescuentos/ShowAllDescuentos';
import ShowDescuento from './components/ShowDescuento/ShowDescuento';
import UpdateDescuento from './components/UpdateDescuento/UpdateDescuento';
import CreatePractica from './components/CreatePractica/CreatePractica';
import ShowAllPracticas from './components/ShowAllPracticas/ShowAllPracticas';
import ShowPractica from './components/ShowPractica/ShowPractica';
import UpdatePractica from './components/UpdatePractica/UpdatePractica';

const App = () =>{
  return (
    // Main app routes
    <Router>
      <main>
        <Routes>
          {/* <Route path='/' element={<Homep/>}/>
          <Route path='/signUp' element={<LogInSignUp/>}/> */}

          {/* Public Routes */}
          <Route path='/' element={<PrivateRouteAfterLogin element={<Homep />} />}/>
          <Route path='/signUp' element={<PrivateRouteAfterLogin element={<LogInSignUp />} />}/>
          <Route path='/success' element={<LoginSuccess/>}/>
          <Route path='/ia' element={<AI/>}/>
          {/* <Route path='/userRegister' element={<UserRegister/>}/>
          <Route path='/crearEvento' element={<CreateEventF/>}/>
          <Route path='/crearBeneficio' element={<CreateBeneficio/>}/> */}
          {/* <Route path='/event/:id' element={<PrivateRoute element={<ShowEvent />} />}/>
          <Route path='/beneficio/:id' element={<PrivateRoute element={<ShowBeneficio />} />}/>
          <Route path='/updateEvent/:id' element={<PrivateRoute element={<UpdateEventF />} />}/>
          <Route path='/updateBeneficio/:id' element={<PrivateRoute element={<UpdateBeneficio />} />}/>
          <Route path='/home' element={<PrivateRoute element={<HomeUser />} />}/>
          <Route path='/showAllEvents' element={<PrivateRoute element={<ShowAllEvents />} />}/>
          <Route path='/showAllBeneficios' element={<PrivateRoute element={<ShowAllBeneficios />} />}/> */}
          {/* End Public Routes */}
          
          {/* Private routes */}
          <Route
          path='/*'
          element={
            <PrivateLayout
              routes={[
                { path: '/event/:id', element: <ShowEvent /> },
                { path: '/beneficio/:id', element: <ShowBeneficio /> },
                { path: '/updateEvent/:id', element: <UpdateEventF /> },
                { path: '/updateBeneficio/:id', element: <UpdateBeneficio /> },
                { path: '/home', element: <HomeUser /> },
                { path: '/showAllEvents', element: <ShowAllEvents /> },
                { path: '/showAllBeneficios', element: <ShowAllBeneficios /> },
                { path: '/userRegister', element: <UserRegister /> },
                { path: '/crearEvento', element: <CreateEventF /> },
                { path: '/crearBeneficio', element: <CreateBeneficio /> },
                { path: '/crearDescuento', element: <CreateDescuento /> },
                { path: '/showAllDescuentos', element: <ShowAllDescuentos /> },
                { path: '/descuento/:id', element: <ShowDescuento /> },
                { path: '/updateDescuento/:id', element: <UpdateDescuento /> },
                { path: '/crearPractica', element: <CreatePractica /> },
                { path: '/showAllPracticas', element: <ShowAllPracticas /> },
                { path: '/practica/:id', element: <ShowPractica /> },
                { path: '/updatePractica/:id', element: <UpdatePractica /> },
              ]}
            />
          }
        />

          {/* <Route path='*' element={<404page/>}/> */}
        </Routes>
        <Footer/>
      </main>
      <Toaster/>
    </Router>
  );
};

export default App;
