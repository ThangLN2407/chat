import { useNavigate } from "react-router-dom";
import { type FriendType } from "../types/user";
import Avatar from "./Avatar";

import { useUser } from "../context/UserContext";
import { Button } from "antd";
import { LoginOutlined } from "@ant-design/icons";

type Props = {
  friends: FriendType[] | [];
};

const ListFriend = ({ friends }: Props) => {
  const { user } = useUser();
  const navigate = useNavigate();

  const handleGoToChat = (chatId: string, friend: FriendType) => {
    navigate(`/chat/${chatId}`, { state: { friend } });
  };

  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="text-lg font-semibold mb-2">👑 Danh sách bạn bè</h2>
      <div className="space-y-2">
        {friends.map((friend) => {
          const chatId =
            String(user?.uid) > friend.uid
              ? `${user?.uid}-${friend.uid}`
              : `${friend.uid}-${user?.uid}`;

          return (
            <div
              key={friend.uid}
              className="flex items-center justify-between gap-4 bg-gray-50 p-2 rounded hover:shadow"
            >
              <span className="flex items-center gap-2">
                <Avatar src={friend.photoURL} />
                <span className="font-medium">{friend.displayName}</span>
              </span>
              <Button
                color="primary"
                variant="solid"
                onClick={() => handleGoToChat(chatId, friend)}
              >
                Chat <LoginOutlined style={{ color: "white" }} />
              </Button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ListFriend;
