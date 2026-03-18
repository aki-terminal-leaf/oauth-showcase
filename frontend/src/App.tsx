import { useEffect, useState } from "react";

interface User {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
}

const PROVIDERS = [
  {
    id: "google",
    name: "Google",
    icon: "🔵",
    color: "bg-white border border-gray-300 hover:bg-gray-50",
    textColor: "text-gray-700",
  },
  {
    id: "github",
    name: "GitHub",
    icon: "⚫",
    color: "bg-gray-900 hover:bg-gray-800",
    textColor: "text-white",
  },
];

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/auth/session", { credentials: "include" })
      .then((r) => r.json())
      .then((data) => {
        setUser(data?.user ?? null);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleSignIn = (provider: string) => {
    window.location.href = `/api/auth/signin/${provider}`;
  };

  const handleSignOut = () => {
    window.location.href = "/api/auth/signout";
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">🔐 OAuth Showcase</h1>
          <p className="text-gray-500 text-sm">
            Third-party authentication demo with Auth.js
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          {user ? (
            /* Logged in state */
            <div className="text-center">
              {user.image && (
                <img
                  src={user.image}
                  alt={user.name ?? "User"}
                  className="w-20 h-20 rounded-full mx-auto mb-4 border-2 border-gray-100"
                />
              )}
              <h2 className="text-xl font-semibold">{user.name}</h2>
              <p className="text-gray-500 text-sm mb-6">{user.email}</p>

              <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
                <p className="text-xs font-mono text-gray-400 mb-1">
                  Session Data
                </p>
                <pre className="text-xs text-gray-600 overflow-auto">
                  {JSON.stringify(user, null, 2)}
                </pre>
              </div>

              <button
                onClick={handleSignOut}
                className="w-full py-2.5 px-4 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors font-medium"
              >
                Sign Out
              </button>
            </div>
          ) : (
            /* Logged out state */
            <div>
              <h2 className="text-xl font-semibold text-center mb-6">
                Sign in with
              </h2>
              <div className="space-y-3">
                {PROVIDERS.map((provider) => (
                  <button
                    key={provider.id}
                    onClick={() => handleSignIn(provider.id)}
                    className={`w-full py-3 px-4 rounded-lg flex items-center justify-center gap-3 font-medium transition-colors ${provider.color} ${provider.textColor}`}
                  >
                    <span className="text-xl">{provider.icon}</span>
                    Continue with {provider.name}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <a
            href="https://github.com/aki-terminal-leaf/oauth-showcase"
            className="text-gray-400 hover:text-gray-600 text-sm transition-colors"
          >
            View Source on GitHub →
          </a>
        </div>
      </div>
    </div>
  );
}

export default App;
