import { Button } from '@mui/material';
import {useNavigate} from 'react-router-dom';

export default function PortofolioPage() {
    const navigate = useNavigate();
    return (
        <div>
            <h1>Portofolio</h1>
            <Button 
                sx={{ m:2 }} 
                variant="contained" 
                color="primary"
                onClick={() => navigate('/dashboard')}>
                    Login
                </Button>
        </div>
    )
}