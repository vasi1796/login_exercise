import './LoginPage.css';
import ParticlesBg from 'particles-bg';
import TextField from '@mui/material/TextField';
import { Button, Container, CssBaseline } from '@mui/material';

export default function SignIn() {
    return(
        <Container className='main' component='main' maxWidth='xs'>
            <CssBaseline/>
            <div className='paper'>
            <form className='form'>
                <TextField 
                id="outlined-basic" 
                label="Username" 
                variant="outlined" 
                margin="normal" 
                fullWidth 
                required/>
                <TextField 
                id="outlined-basic" 
                label="Password" 
                variant="outlined" 
                margin="normal" 
                fullWidth 
                required/>
                <Button 
                sx={{ mt:2 }} 
                variant="contained" 
                size='large' 
                fullWidth
                color="primary">
                    Login
                </Button> 
            </form>
            </div>
            <ParticlesBg type='cobweb' bg={true}/>
        </Container>
    )
}