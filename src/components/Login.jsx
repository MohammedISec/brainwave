import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Section from "./Section";

const Login = () => {
  const navigate = useNavigate();
  const { login, user } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  if (user) {
    navigate("/");
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const result = await login(email, password);

      if (result.requires_2fa) {
        setError("2FA is required. This feature is not yet supported.");
        setSubmitting(false);
        return;
      }

      navigate("/");
    } catch (err) {
      setError(err.message || "Login failed. Please try again.");
      setSubmitting(false);
    }
  };

  return (
    <Section className="pt-[12rem] pb-[6rem]">
      <div className="container max-w-md mx-auto">
        <h2 className="h3 mb-6 text-center">Sign In</h2>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-color-1/10 border border-color-1/30 text-color-1 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-n-3 text-sm mb-1" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              className="w-full h-11 px-4 bg-n-7 border border-n-6 rounded-lg text-n-1 placeholder:text-n-4 focus:outline-none focus:border-color-1 transition-colors"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-n-3 text-sm mb-1" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              className="w-full h-11 px-4 bg-n-7 border border-n-6 rounded-lg text-n-1 placeholder:text-n-4 focus:outline-none focus:border-color-1 transition-colors"
              placeholder="Enter your password"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="button relative inline-flex items-center justify-center w-full h-11 mt-2 px-7 text-n-8 bg-color-1 rounded-lg font-semibold transition-colors hover:bg-color-1/90 disabled:opacity-50"
          >
            {submitting ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </div>
    </Section>
  );
};

export default Login;
