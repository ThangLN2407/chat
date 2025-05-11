import AuthForm from "../components/AuthForm";

const Login = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <AuthForm isLogin={true} />
    </div>
  );
};

export default Login;
