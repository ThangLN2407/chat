import { useEffect, useState } from "react";
import { Button, message, Modal, Skeleton } from "antd";
import {
  addDoc,
  collection,
  onSnapshot,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";
import { db } from "../firebase";
import { useUser } from "../context/UserContext";
import {
  type FriendRequestType,
  type FriendType,
  type UserType,
} from "../types/user";
import Header from "../components/Header";
import SearchFriend from "../components/SearchFriend";
import ListFriend from "../components/ListFriend";

const Home = () => {
  const { user } = useUser();
  const [searchEmail, setSearchEmail] = useState("");
  const [foundUser, setFoundUser] = useState<UserType | null>(null);
  const [modal, setModal] = useState<{ visible: boolean; notFound: boolean }>({
    visible: false,
    notFound: false,
  });
  const [friendRequests, setFriendRequests] = useState<FriendRequestType[]>([]);
  const [listFriend, setListFriend] = useState<FriendType[]>([]);

  const sendFriendRequest = async () => {
    if (!foundUser) return;

    try {
      await addDoc(collection(db, "friendRequests"), {
        from: user?.uid,
        to: foundUser?.uid,
        fromDisplayName: user?.displayName,
        photoURL: user?.photoURL,
        createdAt: serverTimestamp(),
        status: "pending",
      });
      message.success("Đã gửi lời mời kết bạn!");
    } catch (error) {
      console.error("Gửi lời mời thất bại", error);
    }
  };

  useEffect(() => {
    if (!user?.uid) return;

    const q = query(
      collection(db, "friendRequests"),
      where("to", "==", user.uid)
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const invites = snapshot.docs.map((doc) => {
          return {
            id: doc.id,
            ...doc.data(),
          } as FriendRequestType;
        });
        setFriendRequests(invites);
        if (invites.length > 0) {
          message.success("Bạn có lời mời kết bạn!");
        }
      },
      (error) => {
        console.error("🔥 Lỗi snapshot listener:", error);
      }
    );

    return () => {
      unsubscribe();
    };
  }, [user?.uid]);

  useEffect(() => {
    if (!user?.friends?.length) return;

    try {
      const q = query(
        collection(db, "users"),
        where("uid", "in", user.friends)
      );

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const friends = snapshot.docs.map((doc) => {
          return {
            uid: doc.id,
            ...doc.data(),
          } as FriendType;
        });
        setListFriend(friends);
      });

      return () => {
        unsubscribe();
      };
    } catch (error) {
      console.error("Lỗi khi lấy danh sách bạn bè:", error);
    }
  }, [user?.friends]);

  return (
    <div className="min-h-screen bg-gray-100">
      <Header user={user} friendRequests={friendRequests} />

      <main className="p-4 space-y-4 max-w-[500px]">
        <SearchFriend
          user={user}
          searchEmail={searchEmail}
          setSearchEmail={setSearchEmail}
          setFoundUser={setFoundUser}
          setModal={setModal}
        />

        {!listFriend.length ? (
          <Skeleton active />
        ) : (
          <ListFriend friends={listFriend} />
        )}
      </main>

      <Modal
        open={modal.visible}
        onCancel={() => setModal({ visible: false, notFound: false })}
        footer={null}
      >
        {modal.notFound ? (
          <p>👻 Không tìm thấy người dùng với email: {searchEmail}</p>
        ) : (
          <div className="space-y-2">
            <p>
              ✨ Tìm thấy người dùng:{" "}
              {foundUser?.displayName ?? foundUser?.email}
            </p>
            <div className="flex justify-end gap-2">
              <Button
                onClick={() => {
                  setSearchEmail("");
                  setModal({ visible: false, notFound: false });
                }}
              >
                Hủy
              </Button>
              <Button
                type="primary"
                onClick={() => {
                  sendFriendRequest();
                  setModal({ visible: false, notFound: false });
                }}
              >
                Gửi lời mời
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Home;
