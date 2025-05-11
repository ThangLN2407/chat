const NotFound = () => {
  return (
    <div>
      <h1 className="text-4xl font-bold text-center mt-20">404 - Not Found</h1>
      <p className="text-center mt-4">
        The page you are looking for does not exist.
      </p>
      <div className="flex justify-center mt-8">
        <img src="/path/to/your/image.png" alt="Not Found" className="w-1/2" />
      </div>
      <div className="text-center mt-4">
        <a href="/" className="text-blue-500 hover:underline">
          Go back to Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;
