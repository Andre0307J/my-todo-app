import { useEffect } from "react";

const ErrorTest = () => {
  useEffect(() => {
    throw new Error("This is a test error to trigger the error boundary.");
  }, []);

  return <div>This component is for testing the error boundary.</div>;
};

export default ErrorTest;