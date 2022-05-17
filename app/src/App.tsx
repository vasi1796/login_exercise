import './App.scss';
import LoginPage from './pages/LoginPage/LoginPage';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import HomePage from './pages/Homepage/HomePage';
import RequireAuth from './components/RequireAuth/RequireAuth';
import RegisterPage from './pages/RegisterPage/RegisterPage';

function App() {
  return (
    <BrowserRouter>
    <Routes>
    <Route path='/login' element={ <LoginPage/>}/>
    <Route path='/register' element={
    <RequireAuth>
      <RegisterPage />
    </RequireAuth>
    }/>
    <Route path='/' element={
    <RequireAuth>
      <HomePage/>
    </RequireAuth>
    }/>
    </Routes>
    </BrowserRouter>
  );
}

export default App;
