import { Outlet, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { useSelector } from 'react-redux'


function Authenticated(
) {
    const {user}= useSelector((state:any)=>state.auth)
    const navigate= useNavigate()
    useEffect(()=>{
      if(!user) navigate("/login")
    },[])    

  return (
    <>
    <Outlet/>
    </>
    
  )
}

export default Authenticated