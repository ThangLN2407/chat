import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebase";

export const saveUserToFireStore = async (uid: string, email: string) => {
  try {
    await setDoc(doc(db, "users", uid), {
      uid: uid,
      email: email,
      displayName: email.split("@")[0],
      photoURL: '',
      createdAt: new Date(),
    });
  } catch (error: unknown) {
    console.error("Lỗi khi lưu người dùng vào Firestore:", error);
    throw error;
  }
}