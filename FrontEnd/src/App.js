import logo from './logo.svg';
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css';
import EmployeeForm from './Components/form';
import UserTable from './Components/userTable';
import SignUp from './Components/SignUp';
import Navbar from './Components/NavBar';
import Login from './Components/Login';
import SideBar from './Components/SideBar';
// import AttendanceCalendar from './Components/attendance';
import Attendance from './Components/Attendance2';
import ContactRegistration from './Components/Contact';
import Dashboard from './Components/Dashboard';
import RequestPage from './Pages/RequestPage';
import Profile from './Pages/ProfilePage';
import Leaves from './Components/leaves';
import LandingPage from './Pages/Landing_Page/LandingPage';
import MainVenueCard from './Components/Card/MainVenueCard';

function App() {
  return (
    <div>
      <BrowserRouter>
        <Navbar/>
        <Routes>  
          <Route path='/' element = {<LandingPage/>}/>
          <Route path='/new' element = {<EmployeeForm submit = {true} update = {false} delete = {false}/>} />
          <Route path='/table' element = {<UserTable/>} />
          <Route path='/signup' element = {<SignUp signUp = {true} login = {false} />} />
          <Route path='/login' element = {<Login/>} />
          <Route path='/sidebar' element = {<SideBar/>} />
          <Route path='/attendance' element = {<Attendance/>} />
          <Route path='/contact' element = {<ContactRegistration/>} />
          <Route path='/dashboard' element = {<Dashboard/>} />
          <Route path='/request' element = {<RequestPage/>} />
          <Route path='/profile' element = {<Profile/>} />
          <Route path='/leaves' element = {<Leaves/>} />
          <Route path='/venue' element = {<MainVenueCard/>} />

        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
