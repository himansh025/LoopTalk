import { useNavigate } from "react-router-dom";
import MessageContainer from "../components/MessageContainer";
import { useAppSelector } from "../hooks/hooks";

const HomePage: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth);
  // const navigate= useNavigate()
  // if(!user){
  //   navigate("/login")
    
  // }

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <MessageContainer currentUserId={user?._id || ""} />
    </div>
  );
};

export default HomePage;
