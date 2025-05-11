import { Button, Input, message } from "antd";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase";
import { type UserType } from "../types/user";

type Props = {
  user: UserType | null;
  searchEmail: string;
  setSearchEmail: (email: string) => void;
  setFoundUser: (user: UserType | null) => void;
  setModal: (modal: { visible: boolean; notFound: boolean }) => void;
};

const SearchFriend = ({
  user,
  searchEmail,
  setSearchEmail,
  setFoundUser,
  setModal,
}: Props) => {
  const handleSearch = async () => {
    if (!searchEmail) return;

    try {
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("email", "==", searchEmail));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const targetUser = querySnapshot.docs[0].data() as UserType;
        if (user?.uid === targetUser.uid) {
          message.error("Bạn không thể gửi lời mời cho chính mình!");
          return;
        }
        setFoundUser(targetUser);
        setModal({ visible: true, notFound: false });
      } else {
        setFoundUser(null);
        setModal({ visible: true, notFound: true });
      }
    } catch (err) {
      console.log("🚀 ~ handleSearch ~ err:", err);
    }
  };

  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="text-lg font-semibold mb-2">🔍 Tìm bạn bè</h2>
      <div className="flex gap-2">
        <Input
          placeholder="Nhập email người bạn"
          value={searchEmail}
          onChange={(e) => setSearchEmail(e.target.value)}
        />
        <Button type="primary" onClick={handleSearch}>
          Tìm kiếm
        </Button>
      </div>
    </div>
  );
};

export default SearchFriend;
