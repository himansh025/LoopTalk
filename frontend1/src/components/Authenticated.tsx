import { Outlet, useNavigate } from 'react-router-dom'
import { useAppSelector } from '../hooks/hooks'
import { useEffect } from 'react'

// interface Authenticatedprop{
//     children:React.ReactNode
// }
function Authenticated(
  // {}:Authenticatedprop
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
    {/* {children} */}
    </>
    
  )
}

export default Authenticated