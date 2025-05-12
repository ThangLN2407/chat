import {
  collection,
  onSnapshot,
  orderBy,
  query,
  addDoc,
  serverTimestamp,
  type DocumentData,
  limit,
  startAfter,
  getDocs,
} from "firebase/firestore";
import EmojiPicker, { type EmojiClickData } from "emoji-picker-react";
import { useEffect, useRef, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { db } from "../../firebase";
import { useUser } from "../../context/UserContext";
import { Input, Button, message as antdMessage } from "antd";
import Avatar from "../../components/Avatar";
import { type MessageIdType } from "../../types/chat";
import { SmileOutlined } from "@ant-design/icons";
import styles from "./style.module.scss";

const ChatRoom = () => {
  const navigate = useNavigate();
  const { chatId } = useParams();
  const { user } = useUser();
  const location = useLocation();
  const friend = location.state?.friend;

  const [messages, setMessages] = useState<MessageIdType[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [lastVisible, setLastVisible] = useState<DocumentData | null>(null);
  // const [showScrollToBottom, setShowScrollToBottom] = useState(false);
  const [isAddMessage, setIsAddMessage] = useState(false);

  const emojiRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const messagesRef = useRef<HTMLDivElement>(null);

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
      orderBy("createdAt", "desc"),
      limit(20)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs: MessageIdType[] = snapshot.docs.reverse().map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as MessageIdType[];
      setMessages(msgs);
      setLastVisible(snapshot.docs[snapshot.docs.length - 1]);
    });

    return () => unsubscribe();
  }, [chatId]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);

    return () => clearTimeout(timeout);
  }, []);

  const handleSend = async () => {
    if (!newMessage.trim()) return;
    setNewMessage("");
    setShowEmojiPicker(false);

    try {
      setIsAddMessage(true);
      await addDoc(collection(db, "chats", chatId!, "messages"), {
        senderId: user?.uid,
        text: newMessage,
        createdAt: serverTimestamp(),
      });
    } catch (err) {
      antdMessage.error("Không thể gửi tin nhắn");
      console.error(err);
    } finally {
      setIsAddMessage(false);
    }
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [isAddMessage]);

  const handleScroll = async () => {
    if (!chatId) return;
    const top = messagesRef.current?.scrollTop;
    if (top === 0 && lastVisible) {
      const moreQuery = query(
        collection(db, "chats", chatId, "messages"),
        orderBy("createdAt", "desc"),
        startAfter(lastVisible),
        limit(20)
      );
      const snapshot = await getDocs(moreQuery);
      const newDocs = snapshot.docs.reverse();
      setMessages((prev) => [
        ...(newDocs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as MessageIdType[]),
        ...prev,
      ]);

      setLastVisible(snapshot.docs[snapshot.docs.length - 1]);
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
      <div
        id="messages"
        className="flex-1 overflow-y-auto p-4 space-y-2 bg-gray-50"
        ref={messagesRef}
        onScroll={handleScroll}
      >
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`${styles.box_message} ${
              msg.senderId === user?.uid ? styles.user : styles.friend
            }`}
          >
            {msg.text}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="flex items-center gap-2 m-5">
        <Input.TextArea
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Nhập tin nhắn..."
          autoSize={{ minRows: 1, maxRows: 3 }}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey && !e.altKey) {
              e.preventDefault();
              handleSend();
            }
          }}
        />
        {/* Nút chọn emoji */}
        <div className="relative">
          <Button
            icon={<SmileOutlined />}
            onClick={() => setShowEmojiPicker((prev) => !prev)}
          />
          {showEmojiPicker && (
            <div className="absolute bottom-12 right-0 z-10" ref={emojiRef}>
              <EmojiPicker onEmojiClick={handleEmojiClick} height={500} />
            </div>
          )}
        </div>
        <Button type="primary" onClick={handleSend}>
          Gửi
        </Button>
      </div>

      {/* {showScrollToBottom && (
        <Button
          onClick={() =>
            messagesRef.current?.scrollTo({
              top: messagesRef.current.scrollHeight,
              behavior: "smooth",
            })
          }
          className="fixed bottom-28 right-5 z-50"
          shape="circle"
          icon={<ArrowDownOutlined />}
        />
      )} */}
    </div>
  );
};

export default ChatRoom;
