import './LoginPage.css';
import ParticlesBg from 'particles-bg';
import TextField from '@mui/material/TextField';
import { Button, Container, CssBaseline } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import axios from 'axios';

type FormValues = {
    email: string;
    password: string;
  };
  

export default function SignIn() {
    const {handleSubmit, control} = useForm<FormValues>();
    const onSubmit = handleSubmit(async (data) => {
        await axios.post('http://localhost:3000/login', data, {
            withCredentials: true
        })
        .then(res => console.log('success',res))
        .catch(err => console.error(err))
    });
    return(
        <Container className='main' component='main' maxWidth='xs'>
            <CssBaseline/>
            <div className='paper'>
            <form className='form' onSubmit={onSubmit}>
                <Controller
                name='email'
                control={control}
                defaultValue=''
                rules={{ required: 'Email required' }}
                render={({ field: { onChange, value }, fieldState: { error } }) => (
                    <TextField 
                    label="Username" 
                    variant="outlined" 
                    margin="normal" 
                    fullWidth 
                    value={value}
                    onChange={onChange}
                    error={!!error}
                    helperText={error ? error.message : null}/>
                )}
                />
                <Controller
                name='password'
                control={control}
                defaultValue=''
                rules={{ required: 'Password required' }}
                render={({ field: { onChange, value }, fieldState: { error } }) => (
                    <TextField 
                    label="Password" 
                    variant="outlined" 
                    margin="normal" 
                    fullWidth 
                    type='password'
                    value={value}
                    onChange={onChange}
                    error={!!error}
                    helperText={error ? error.message : null}/>
                )}
                />
                <Button 
                sx={{ mt:2 }} 
                variant="contained" 
                size='large' 
                fullWidth
                color="primary"
                type='submit'>
                    Login
                </Button> 
            </form>
            </div>
            <ParticlesBg type='cobweb' bg={true}/>
        </Container>
    )
}