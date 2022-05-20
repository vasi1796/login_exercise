import './App.scss';
import LoginPage from './pages/LoginPage/LoginPage';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import HomePage from './pages/Homepage/HomePage';
import RequireAuth from './components/RequireAuth/RequireAuth';
import RegisterPage from './pages/RegisterPage/RegisterPage';
import PortofolioPage from './pages/PortofolioPage/PortofolioPage';

function App() {
  return (
    <BrowserRouter>
    <Routes>
    <Route path='/' element={ <PortofolioPage/>}/>
    <Route path='/login' element={ <LoginPage/>}/>
    <Route path='/register' element={
    <RequireAuth>
      <RegisterPage />
    </RequireAuth>
    }/>
    <Route path='/dashboard' element={
    <RequireAuth>
      <HomePage/>
    </RequireAuth>
    }/>
    </Routes>
    </BrowserRouter>
  );
}

export default App;
