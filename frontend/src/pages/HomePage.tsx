// import SearchBar from "../components/OnSearch";
import MessageContainer from "../components/MessageContainer";
import { useAppSelector } from "../hooks/hooks";

const HomePage: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth);




  return (
    <div className="flex flex-col gap-4 h-screen">
      {/* <SearchBar onSearch={handleSearch} /> */}
      <div className="flex flex-col flex-1 bg-white rounded-lg shadow-md overflow-hidden">
        <MessageContainer currentUserId={user?._id || user?.id || ""} />

      </div>
    </div>
  );
};

export default HomePage;
