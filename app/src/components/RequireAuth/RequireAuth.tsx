import axios from "axios";
import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import LoadingPage from "../../pages/LoadingPage/LoadingPage";

export default function RequireAuth({ children }: { children: JSX.Element }) {
    const [isAuth, setAuth] = useState<boolean|undefined>(undefined);
    useEffect(() => {
        axios.get('http://localhost:3000/logged-in', {withCredentials: true})
        .then(res => {
          if(res.status===200){
            setAuth(true)
          }
        })
        .catch(err=> {
          setAuth(false);
          console.error(err)
        });
      }, []);
    let location = useLocation();
  
    if (isAuth === false) {
      return <Navigate to="/" state={{ from: location }} replace />;
    } else if(isAuth === undefined) {
      return <LoadingPage/>
    }
  
    return children;
  }