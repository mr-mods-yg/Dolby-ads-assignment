import { useEffect } from 'react'
import { useNavigate } from 'react-router';

function Logout() {
    const navigate = useNavigate();
    useEffect(()=>{
        localStorage.removeItem("token");
        navigate("/");
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
  return (
    <div>
      You are now logged out!
    </div>
  )
}

export default Logout
