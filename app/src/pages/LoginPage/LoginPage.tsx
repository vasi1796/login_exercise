import './LoginPage.css';
import ParticlesBg from 'particles-bg';
import TextField from '@mui/material/TextField';
import { Button, Container, CssBaseline } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import axios from 'axios';
import {useNavigate} from 'react-router-dom';
import { useState } from 'react';
import { api } from '../../environment';

type FormValues = {
    email: string;
    password: string;
    otp_token: string;
  };
  

export default function LoginPage() {
    const navigate = useNavigate();
    const {handleSubmit, control} = useForm<FormValues>();
    const [phase, setPhase] = useState<number>(0);
    const [unauthorized, setUnauthorized] = useState<boolean>(false);
    const onSubmit = handleSubmit(async (data) => {
        if (phase === 0) {
            await axios.post(`${api}/login`, data, {
                withCredentials: true
            })
            .then(res => {
                if(res.status === 200){
                    if(res.data['otp'] === true) {
                        setPhase(1);
                    } else {
                        navigate('/');
                    }
                }
            })
            .catch(err => {
                if(err.response && err.response.status === 403){
                    setUnauthorized(true);
                }
                console.error(err)
            })
        } else if (phase === 1) {
            await axios.post(`${api}/verify-otp`, data, {
                withCredentials: true
            })
            .then(res => {
                if(res.status === 200){
                    navigate('/');
                }
            })
            .catch(err => {
                if(err.response && err.response.status === 403){
                    setUnauthorized(true);
                }
                console.error(err)
            })
        }
    });
    return(
        <Container className='main' component='main' maxWidth='xs'>
            <CssBaseline/>
            <div className='paper'>
            { unauthorized ? <div className='incorrect'>Incorrect credentials</div> : null}
            <form className='form' onSubmit={onSubmit}>
                { phase === 0 ? 
                <div>
                <Controller
                name='email'
                control={control}
                defaultValue='alice@prisma.io'
                rules={{ required: 'Email required' }}
                render={({ field: { onChange, value }, fieldState: {  error } }) => (
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
                defaultValue='password'
                rules={{ required: 'Password required' }}
                render={({ field: { onChange, value }, fieldState: {  error } }) => (
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
                </div> :
                <Controller
                name='otp_token'
                control={control}
                defaultValue=''
                rules={{ required: false }}
                render={({ field: { onChange, value }, fieldState: {  error } }) => (
                    <TextField 
                    label="OTP Code" 
                    variant="outlined" 
                    margin="normal" 
                    fullWidth 
                    value={value}
                    onChange={onChange}
                    error={!!error}
                    helperText={error ? error.message : null}/>
                )}
                /> 
                }
                <Button 
                sx={{ mt:2 }} 
                variant="contained" 
                size='large' 
                fullWidth
                color="primary"
                type='submit'>
                    {phase === 0 ? 'Login' : 'Verify'}
                </Button> 
            </form>
            </div>
            <div className='paperBg'>
            <ParticlesBg type='cobweb' bg={true}/>
            </div>
        </Container>
    )
}