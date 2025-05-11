export interface UserType {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  createdAt: string | Date | null;
  friends: string[] | []
}

export interface FriendRequestType {
  id: string | null;
  fromDisplayName: string | null;
  photoURL: string | null;
  from: string;
  to: string;
  createdAt: string | Date | null;
  status: string;
}

export interface FriendType {
  uid: string;      
  displayName: string;
  photoURL: string;
}