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

const App = () =>{
  return (
    // Main app routes
    <Router>
      <main>
        <Routes>
          <Route path='/' element={<Homep/>}/>
          <Route path='/signUp' element={<LogInSignUp/>}/>
          {/* <Route path='/event' element={<ShowEvent/>}/> */}
          {/* Private Route */}
          <Route path='/event' element={<PrivateRoute element={<ShowEvent />} />}/>
          <Route path='/success' element={<LoginSuccess/>}/>
          <Route path='/userRegister' element={<UserRegister/>}/>
          <Route path='/profile' element={<UserProfile/>}/>
          {/* <Route path='*' element={<404page/>}/> */}
        </Routes>
      </main>
    </Router>
  );
};

export default App;
