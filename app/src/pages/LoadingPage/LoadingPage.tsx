import { CircularProgress, Container } from "@mui/material";
import './LoadingPage.css';

export default function LoadingPage() {
    return (
        <Container className='main' component='main' maxWidth='xs'>
        <div className='spinner'>
            <h1>Loading please wait...</h1>
            <CircularProgress />
        </div>
        </Container>
    )
}