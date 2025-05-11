import AuthForm from "../components/AuthForm";

const Register = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <AuthForm isLogin={false} />
    </div>
  );
};

export default Register;
