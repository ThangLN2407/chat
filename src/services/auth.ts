
import { signInWithPopup } from "firebase/auth";
import { auth, db, googleProvider } from "../firebase"
import { doc, getDoc, setDoc } from "firebase/firestore";

export const signInWithGoogle = async () => {
  const {user} = await signInWithPopup(auth, googleProvider)
  
  const userRef = doc(db, "users", user.uid);
  const userSnap = await getDoc(userRef);

  if(!userSnap.exists()){
    await setDoc(userRef, {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      createdAt: new Date(),
    });
  }

  return user;
}