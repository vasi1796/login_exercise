import './RegisterPage.css';
import ParticlesBg from 'particles-bg';
import TextField from '@mui/material/TextField';
import { Button, Container, CssBaseline } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import axios from 'axios';
import {useNavigate} from 'react-router-dom';
import { useState } from 'react';
import { api } from '../../environment';

type FormValues = {
    name: string;
    email: string;
    password: string;
  };
  

export default function RegisterPage() {
    const navigate = useNavigate();
    const {handleSubmit, control} = useForm<FormValues>();
    const [unauthorized, setUnauthorized] = useState<boolean>(false);
    const onSubmit = handleSubmit(async (data) => {
        await axios.post(`${api}/signup`, data, {
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
    });
    return(
        <Container className='main' component='main' maxWidth='xs'>
            <CssBaseline/>
            <div className='paper'>
            <h2>Sign Up</h2>
            { unauthorized ? <div className='incorrect'>Incorrect details provided</div> : null}
            <form className='form' onSubmit={onSubmit}>
                <Controller
                name='name'
                control={control}
                defaultValue=''
                rules={{ required: 'Username required' }}
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
                name='email'
                control={control}
                defaultValue=''
                rules={{ required: 'Email required' }}
                render={({ field: { onChange, value }, fieldState: {  error } }) => (
                    <TextField 
                    label="Email" 
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
                <Button 
                sx={{ mt:2 }} 
                variant="contained" 
                size='large' 
                fullWidth
                color="primary"
                type='submit'>
                    Register
                </Button> 
            </form>
            </div>
            <div className='paperBg'>
            <ParticlesBg type='cobweb' bg={true}/>
            </div>
        </Container>
    )
}