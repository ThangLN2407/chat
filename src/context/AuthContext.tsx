import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { onAuthStateChanged, type User } from "firebase/auth";
import { auth } from "../firebase";

type AuthContextType = {
  loading: boolean;
  currentUser: User | null;
};

interface Props {
  readonly children: ReactNode;
}

const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  loading: true,
});

export const AuthProvider = ({ children }: Props) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unListener = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return () => unListener();
  }, []);

  const contextValue = useMemo(
    () => ({ currentUser, loading }),
    [currentUser, loading]
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
