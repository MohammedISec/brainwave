import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Section from "./Section";

const Login = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { exchangeCode, loginRedirect, user } = useAuth();
  const [error, setError] = useState(null);
  const [exchanging, setExchanging] = useState(false);

  const code = searchParams.get("code");

  useEffect(() => {
    if (user && !code) {
      navigate("/");
      return;
    }

    if (code && !exchanging) {
      setExchanging(true);
      exchangeCode(code)
        .then(() => {
          navigate("/");
        })
        .catch((err) => {
          setError(err.message || "Login failed. Please try again.");
          setExchanging(false);
        });
    }
  }, [code]);

  if (code) {
    return (
      <Section className="pt-[12rem] pb-[6rem]">
        <div className="container text-center">
          {error ? (
            <>
              <h2 className="h3 mb-4 text-color-1">Login Failed</h2>
              <p className="body-2 text-n-3 mb-6">{error}</p>
              <button
                onClick={loginRedirect}
                className="button relative inline-flex items-center justify-center h-11 px-7 text-n-1 transition-colors hover:text-color-1"
              >
                Try Again
              </button>
            </>
          ) : (
            <>
              <h2 className="h3 mb-4">Signing you in...</h2>
              <p className="body-2 text-n-3">
                Please wait while we complete your login.
              </p>
            </>
          )}
        </div>
      </Section>
    );
  }

  // No code param — show a simple login prompt
  return (
    <Section className="pt-[12rem] pb-[6rem]">
      <div className="container text-center">
        <h2 className="h3 mb-4">Sign In</h2>
        <p className="body-2 text-n-3 mb-8">
          Sign in with your account to continue.
        </p>
        <button
          onClick={loginRedirect}
          className="button relative inline-flex items-center justify-center h-11 px-7 text-n-1 transition-colors hover:text-color-1 border border-n-6 rounded-full"
        >
          Sign in with SSO
        </button>
      </div>
    </Section>
  );
};

export default Login;
