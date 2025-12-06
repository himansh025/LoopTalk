import MessageContainer from "../components/MessageContainer";
import { useSelector } from "react-redux";

const HomePage: React.FC = () => {
  const { user } = useSelector((state:any) => state.auth);


  return (
    <div className="flex h-full flex-col overflow-hidden">
      <MessageContainer currentUserId={user?._id || ""} />
    </div>
  );
};

export default HomePage;
