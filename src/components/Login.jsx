import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Section from "./Section";

const Login = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { exchangeCode, redirectToSSO, user } = useAuth();
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);

  const code = searchParams.get("code");

  useEffect(() => {
    // Already logged in, go home
    if (user && !code) {
      navigate("/");
      return;
    }

    // We have a code from SSO callback — exchange it for tokens
    if (code && !processing) {
      setProcessing(true);
      exchangeCode(code)
        .then(() => navigate("/"))
        .catch((err) => {
          setError(err.message || "Login failed. Please try again.");
          setProcessing(false);
        });
      return;
    }

    // No code, not logged in — redirect to SSO
    if (!code && !user) {
      redirectToSSO();
    }
  }, [code, user]);

  // Show status while processing the code exchange
  if (code) {
    return (
      <Section className="pt-[12rem] pb-[6rem]">
        <div className="container text-center">
          {error ? (
            <>
              <h2 className="h3 mb-4 text-color-1">Login Failed</h2>
              <p className="body-2 text-n-3 mb-6">{error}</p>
              <button
                onClick={redirectToSSO}
                className="button inline-flex items-center justify-center h-11 px-7 text-n-1 border border-n-6 rounded-full transition-colors hover:text-color-1"
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

  // Redirecting to SSO...
  return (
    <Section className="pt-[12rem] pb-[6rem]">
      <div className="container text-center">
        <h2 className="h3 mb-4">Redirecting to login...</h2>
      </div>
    </Section>
  );
};

export default Login;
