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
import CreateEvent from './components/CreateEvent/CreateEvent';
import HomeUser from './components/HomeUser/HomeUser';
import ShowAllEvents from './components/ShowAllEvents/ShowAllEvents';
import Footer from './components/Footer/Footer';
import UpdateEvent from './components/UpdateEvent/UpdateEvent';
import PrivateRouteAfterLogin from './components/PrivateRouteAfterLogin/PrivateRouteAfterLogin';

const App = () =>{
  return (
    // Main app routes
    <Router>
      <main>
        <Routes>
          {/* <Route path='/' element={<Homep/>}/>
          <Route path='/signUp' element={<LogInSignUp/>}/> */}

          {/* Private Routes */}
          <Route path='/' element={<PrivateRouteAfterLogin element={<Homep />} />}/>
          <Route path='/signUp' element={<PrivateRouteAfterLogin element={<LogInSignUp />} />}/>
          <Route path='/event/:id' element={<PrivateRoute element={<ShowEvent />} />}/>
          <Route path='/updateEvent/:id' element={<PrivateRoute element={<UpdateEvent />} />}/>
          <Route path='/home' element={<PrivateRoute element={<HomeUser />} />}/>
          <Route path='/showAllEvents' element={<PrivateRoute element={<ShowAllEvents />} />}/>
          {/* Private Routes */}
          
          <Route path='/success' element={<LoginSuccess/>}/>
          <Route path='/userRegister' element={<UserRegister/>}/>
          <Route path='/profile' element={<UserProfile/>}/>
          <Route path='/createEvent' element={<CreateEvent/>}/>
          {/* <Route path='*' element={<404page/>}/> */}
        </Routes>
        <Footer/>
      </main>
    </Router>
  );
};

export default App;
