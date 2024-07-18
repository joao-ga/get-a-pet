import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'

//components
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import Container from './components/layout/Container'
import Message from './components/layout/Message'

//Context
import { UserProvider } from './context/UserContext'

// pages
import Login from './components/pages/auth/Login'
import Register from './components/pages/auth/Register'
import Home from './components/pages/Home'
import Profile from './components/pages/User/Profile'
import MyPets from './components/pages/Pet/MyPets'
import AddPet from './components/pages/Pet/AddPet'
import EditPet from './components/pages/Pet/EditPet'

function App() {
  return (
    <Router>
      <UserProvider>
        <Navbar />
        <Message />
          <Container>
            <Routes>
              <Route path='/login' element={<Login />} />
              <Route path='/register' element={<Register />} />
              <Route path='/user/profile' element={<Profile />} />
              <Route path='/pet/mypets' element={<MyPets />} />
              <Route path='/pet/add' element={<AddPet />} />
              <Route path='/pet/edit/:id' element={<EditPet />} />
              <Route path='/' element={<Home />} />
            </Routes>
          </Container>
        <Footer />
      </UserProvider>
    </Router>
  );
}

export default App;
