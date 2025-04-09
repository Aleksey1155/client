import { useState, useEffect } from "react";
import "./messenger.scss";
import Conversation from "../../components/conversation/Conversation";
import Message from "../../components/message/Message";
import axiosInstance from "../../axiosInstance";
import useFetchUserDataWithCheck from "../../hooks/useFetchUserDataWithCheck";

function Messenger() {
  const [users, setUsers] = useState([]);
  const { userData, loading, error } = useFetchUserDataWithCheck();
  const [selectedUser, setSelectedUser] = useState(null);

// console.log("Messenger------" , selectedUser)

  useEffect(() => {
    const fetchAllUsers = async () => {
      try {
        const res = await axiosInstance.get("/users");
        setUsers(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchAllUsers();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

 
  return (
    <div className="messenger">
      <div className="containerMessenger">
        <div className="messengerConversation">
          <Conversation users={users} userData={userData} onUserSelect={setSelectedUser} />
        </div>
        <div className="messengerMessage">
          <Message users={users} userData={userData} selectedUser={selectedUser}/>
          
        </div>
      </div>
    </div>
  );
}

export default Messenger;
