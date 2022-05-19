import './RegisterPage.scss';
import ParticlesBg from 'particles-bg';
import TextField from '@mui/material/TextField';
import { Button, Checkbox, Container, CssBaseline } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import axios from 'axios';
import {useNavigate} from 'react-router-dom';
import { useEffect, useState } from 'react';
import { api } from '../../environment';
import ReactPhoneInput from 'react-phone-input-material-ui';

type FormValues = {
    name: string;
    email: string;
    password: string;
    otp_token: string;
    base32: string;
    tel_number: string;
    sms_token: string;
  };

type QRSecret = {
    qr: string,
    secret: { 
    ascii: string,
    base32: string,
    hex: string
    }
}

type MFAChecks = {
    mfa: boolean,
    app: boolean,
    sms: boolean
}

export default function RegisterPage() {
    const navigate = useNavigate();
    const {handleSubmit, control} = useForm<FormValues>();
    const [unauthorized, setUnauthorized] = useState<boolean>(false);
    const [mfaEnabled, setMFAEnabled] = useState<MFAChecks>({mfa: false, app: false, sms: false});
    const [phase, setPhase] = useState<number>(0);
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
    const signup = async (data: FormValues) => {
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
    }
    const onSubmit = handleSubmit(async (data) => {
        data.base32 = (qrCode && qrCode.secret.base32) || '';
        if (phase === 0 && mfaEnabled.sms) {
            await axios.post(`${api}/verify-number`, data, {
                withCredentials: true
            })
            .then(res => {
                if(res.status === 200){
                    setPhase(1);
                }
            })
            .catch(err => {
                if(err.response && err.response.status === 403){
                    setUnauthorized(true);
                }
                console.error(err)
            })
        } else {
            signup(data);
        }
    });
    return(
        <Container className='main' component='main' maxWidth='xs'>
            <CssBaseline/>
            <div className='paper'>
            <h2>Register new user</h2>
            { unauthorized ? <div className='incorrect'>Incorrect details provided</div> : null}
            { qrCode && qrCode.qr && mfaEnabled.app && phase === 0 ? <img src={qrCode.qr}/> : null}
            <form className='form' onSubmit={onSubmit}>
            { phase ===0 ?
            <div>
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
              <div>
                  <Checkbox
                  checked={mfaEnabled.mfa}
                  onChange={() => setMFAEnabled({mfa: !mfaEnabled.mfa, app: mfaEnabled.app, sms: mfaEnabled.sms})}/>
                      Enable 2FA
                  {mfaEnabled.mfa? 
                  <div>
                       <Checkbox
                  checked={mfaEnabled.app}
                  onChange={() => setMFAEnabled({mfa: mfaEnabled.mfa, app: !mfaEnabled.app, sms: mfaEnabled.sms})}/>
                      Auth app
                      <Checkbox
                  checked={mfaEnabled.sms}
                  onChange={() => setMFAEnabled({mfa: mfaEnabled.mfa, app: mfaEnabled.app, sms: !mfaEnabled.sms})}/>
                      SMS
                  </div> : null}
              </div>
              { mfaEnabled.app ?
                  <Controller
                  name='otp_token'
                  control={control}
                  defaultValue=''
                  rules={{ required: mfaEnabled.app ? 'OTP Required' : false }}
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
                  /> : null }
              { mfaEnabled.sms ?
                  <Controller
                  name='tel_number'
                  control={control}
                  defaultValue=''
                  rules={{ required: mfaEnabled.sms ? 'Phone Number Required' : false }}
                  render={({ field: { onChange, value }, fieldState: {  error } }) => (
                      <ReactPhoneInput
                          value={value}
                          onChange={onChange}
                          component={TextField}
                          autoFormat={true}
                          defaultErrorMessage={error ? error.message : undefined}/>
                  )}
                  /> : null }
                  </div>  :
                    <Controller
                    name='sms_token'
                    control={control}
                    defaultValue=''
                    rules={{ required: phase === 1 ? 'SMS OTP Required' : false }}
                    render={({ field: { onChange, value }, fieldState: {  error } }) => (
                        <TextField 
                        label="SMS OTP Code" 
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
                { phase === 0 ? 'Register' : 'Verify'}
                </Button> 
            </form>
            </div>
            <div className='paperBg'>
            <ParticlesBg type='cobweb' bg={true}/>
            </div>
        </Container>
    )
}