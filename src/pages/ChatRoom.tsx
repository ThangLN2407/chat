import {
  collection,
  onSnapshot,
  orderBy,
  query,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import EmojiPicker, { type EmojiClickData } from "emoji-picker-react";
import { useEffect, useRef, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { db } from "../firebase";
import { useUser } from "../context/UserContext";
import { Input, Button, message as antdMessage } from "antd";
import Avatar from "../components/Avatar";
import { type MessageIdType } from "../types/chat";
import { SmileOutlined } from "@ant-design/icons";

const ChatRoom = () => {
  const navigate = useNavigate();
  const { chatId } = useParams();
  const { user } = useUser();
  const location = useLocation();
  const friend = location.state?.friend;

  const [messages, setMessages] = useState<MessageIdType[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const emojiRef = useRef<HTMLDivElement>(null);

  const handleEmojiClick = (emojiData: EmojiClickData) => {
    setNewMessage((prev) => prev + emojiData.emoji);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        emojiRef.current &&
        !emojiRef.current.contains(event.target as Node)
      ) {
        setShowEmojiPicker(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (!chatId) return;

    const q = query(
      collection(db, "chats", chatId, "messages"),
      orderBy("createdAt")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs: MessageIdType[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as MessageIdType[];
      setMessages(msgs);
    });

    return () => unsubscribe();
  }, [chatId]);

  const handleSend = async () => {
    if (!newMessage.trim()) return;
    setShowEmojiPicker(false);

    try {
      await addDoc(collection(db, "chats", chatId!, "messages"), {
        senderId: user?.uid,
        text: newMessage,
        createdAt: serverTimestamp(),
      });
      setNewMessage("");
    } catch (err) {
      antdMessage.error("Không thể gửi tin nhắn");
      console.error(err);
    }
  };

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-white">
        <div className="flex items-center justify-between gap-2">
          <Avatar src={friend?.photoURL} />
          <span className="font-semibold text-lg">{friend?.displayName}</span>
        </div>
        <Button onClick={() => navigate("/")}>Trở về</Button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-gray-50">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`max-w-[60%] w-[fit-content] p-2 rounded-lg ${
              msg.senderId === user?.uid
                ? "bg-blue-500 text-white ml-auto"
                : "bg-gray-200 text-black"
            }`}
          >
            {msg.text}
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="flex items-center gap-2 mt-4 py-3">
        <Input.TextArea
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Nhập tin nhắn..."
          autoSize={{ minRows: 1, maxRows: 3 }}
        />
        {/* Nút chọn emoji */}
        <div className="relative">
          <Button
            icon={<SmileOutlined />}
            onClick={() => setShowEmojiPicker((prev) => !prev)}
          />
          {showEmojiPicker && (
            <div className="absolute bottom-12 right-0 z-10" ref={emojiRef}>
              <EmojiPicker onEmojiClick={handleEmojiClick} height={300} />
            </div>
          )}
        </div>
        <Button type="primary" onClick={handleSend}>
          Gửi
        </Button>
      </div>
    </div>
  );
};

export default ChatRoom;
