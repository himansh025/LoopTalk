import { useSelector } from "react-redux";
import MessageContainer from "../components/MessageContainer";

const HomePage: React.FC = () => {
  const { user } = useSelector((state:any) => state.auth);


  return (
    <div className="flex flex-col gap-4 h-screen">
      <div className="flex flex-col flex-1 bg-white rounded-lg shadow-md overflow-hidden">
        <MessageContainer currentUserId={user?._id || user?.id} />

      </div>
    </div>
  );
};

export default HomePage;
