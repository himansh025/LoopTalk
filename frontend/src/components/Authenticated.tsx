import { Outlet, useNavigate } from 'react-router-dom'
import { useAppSelector } from '../hooks/hooks'
import { useEffect } from 'react'


function Authenticated(
) {
    const {user}= useAppSelector((state)=>state.auth)
    console.log(user)
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