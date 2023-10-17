import { Button } from '@mui/material';
import ParticlesBg from 'particles-bg';
import {useNavigate} from 'react-router-dom';
import './PortofolioPage.scss';

export default function PortofolioPage() {
    const navigate = useNavigate();
    return (
        <div className='mainHeader'>
            <h1>Entry point</h1>
            <Button 
                sx={{ m:2 }} 
                variant="contained" 
                color="primary"
                onClick={() => navigate('/dashboard')}>
                    Prototype platform
                </Button>
            <div className='paperBg'>
            <ParticlesBg type='cobweb' bg={true} color='#3660A3'/>
            </div>
        </div>
    )
}