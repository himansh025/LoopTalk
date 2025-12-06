import { Outlet, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { useSelector } from 'react-redux'


function Authenticated(
) {
    const {user}= useSelector((state:any)=>state.auth)
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