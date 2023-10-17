import { Button } from '@mui/material';
import axios from 'axios';
import {useNavigate} from 'react-router-dom';
import { api } from '../../environment';
import './HomePage.scss';
import { AppRegistration, Logout } from '@mui/icons-material';

export default function HomePage() {
    const navigate = useNavigate();
    const onLogout = async () => {
        await axios.get(`${api}/logout`, {
            withCredentials: true
        })
        .then(res => {
            if(res.status === 200){
                navigate('/login');
            }
        })
        .catch(err => {
            console.error(err)
        })
    }
    return (
        <div>
            <div className='header'>
            <h1>Dashboard</h1>
            <div>
            <Button variant="contained" endIcon={<AppRegistration />}
                sx={{ m:1 }} 
                color="primary"
                size='small'
                onClick={() => navigate('/register')}>
                    Register
                </Button>
                <Button variant="contained"  onClick={onLogout} color='error' size='small' endIcon={<Logout />}>
                Logout
            </Button>
            </div>
            </div>
            <div className='widgets'>
            <Button 
                sx={{ m:2 }} 
                variant="contained" 
                color="secondary"
                onClick={() => { window.location.href = 'http://localhost:4200'; }}>
                    Web Map
                </Button>
            </div>
        </div>
    )
}