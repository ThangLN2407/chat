import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { type UserType } from "../types/user";
import { useAuth } from "./AuthContext";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";

interface Props {
  readonly children: ReactNode;
}

type User = {
  user: UserType | null;
};

const UserContext = createContext<User>({ user: null });

export const UserProvider = ({ children }: Props) => {
  const { currentUser } = useAuth();
  const [user, setUser] = useState<UserType | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      if (!currentUser?.uid) {
        setUser(null);
        return;
      }

      try {
        const userRef = doc(db, "users", currentUser.uid);
        const unsubscribe = onSnapshot(userRef, (docSnap) => {
          if (docSnap.exists()) {
            setUser(docSnap.data() as UserType);
          } else {
            console.warn("User không tồn tại trong Firestore");
            setUser(null);
          }
        });

        return () => unsubscribe();
      } catch (err) {
        console.error("Lỗi khi lấy user từ Firestore:", err);
        setUser(null);
      }
    };
    fetchUser();
  }, [currentUser]);

  const contextValue = useMemo(() => ({ user }), [user]);

  return (
    <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
