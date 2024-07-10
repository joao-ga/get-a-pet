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
              <Route path='/' element={<Home />} />
            </Routes>
          </Container>
        <Footer />
      </UserProvider>
    </Router>
  );
}

export default App;
