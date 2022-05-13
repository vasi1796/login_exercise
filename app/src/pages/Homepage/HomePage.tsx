import { Button } from '@mui/material';
import axios from 'axios';
import {useNavigate} from 'react-router-dom';
import { api } from '../../environment';

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
            <h1>Protected path</h1>
            <Button sx={{ m:2 }} variant="contained"  onClick={onLogout}>Logout</Button>
            <Button 
                sx={{ m:2 }} 
                variant="contained" 
                color="secondary"
                onClick={() => navigate('/register')}>
                    Register new user
                </Button>
        </div>
    )
}