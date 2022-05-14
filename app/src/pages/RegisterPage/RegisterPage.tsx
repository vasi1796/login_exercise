import './RegisterPage.css';
import ParticlesBg from 'particles-bg';
import TextField from '@mui/material/TextField';
import { Button, Container, CssBaseline } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import axios from 'axios';
import {useNavigate} from 'react-router-dom';
import { useEffect, useState } from 'react';
import { api } from '../../environment';

type FormValues = {
    name: string;
    email: string;
    password: string;
    otp_token: string;
    base32: string;
  };

type QRSecret = {
    qr: string,
    secret: { 
    ascii: string,
    base32: string,
    hex: string
    }
}

export default function RegisterPage() {
    const navigate = useNavigate();
    const {handleSubmit, control} = useForm<FormValues>();
    const [unauthorized, setUnauthorized] = useState<boolean>(false);
    const [qrCode, setQRCode] = useState<QRSecret|undefined>(undefined);
    useEffect(() => {
        axios.get(`${api}/otp`, {withCredentials: true})
        .then(res => {
          if(res.status===200){
            setQRCode(res.data)
          }
        })
        .catch(err=> {
          console.error(err)
        });
      }, []);
    const onSubmit = handleSubmit(async (data) => {
        data.base32 = (qrCode && qrCode.secret.base32) || '';
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
            <h2>Register new user</h2>
            { unauthorized ? <div className='incorrect'>Incorrect details provided</div> : null}
            { qrCode && qrCode.qr ? <img src={qrCode.qr}/> : null}
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
                    type='email'
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
                <Controller
                name='otp_token'
                control={control}
                defaultValue=''
                rules={{ required: 'OTP Code required' }}
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