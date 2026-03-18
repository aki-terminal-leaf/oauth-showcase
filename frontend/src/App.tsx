import { useEffect, useState } from "react";

interface User {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
}

interface SessionData {
  user: User | null;
  account?: {
    provider: string;
    scope: string | null;
    token_type: string | null;
  };
  linkedProviders?: Array<{
    provider: string;
    scope: string | null;
  }>;
}

const PROVIDERS = [
  {
    id: "google",
    name: "Google",
    icon: "https://authjs.dev/img/providers/google.svg",
    color: "bg-white border border-gray-300 hover:bg-gray-50",
    textColor: "text-gray-700",
  },
  {
    id: "github",
    name: "GitHub",
    icon: "https://authjs.dev/img/providers/github.svg",
    color: "bg-gray-900 hover:bg-gray-800",
    textColor: "text-white",
  },
  {
    id: "discord",
    name: "Discord",
    icon: "https://authjs.dev/img/providers/discord.svg",
    color: "bg-[#5865F2] hover:bg-[#4752C4]",
    textColor: "text-white",
  },
  {
    id: "twitter",
    name: "X (Twitter)",
    icon: "https://authjs.dev/img/providers/twitter.svg",
    color: "bg-black hover:bg-gray-900",
    textColor: "text-white",
  },
  {
    id: "line",
    name: "LINE",
    icon: "https://authjs.dev/img/providers/line.svg",
    color: "bg-[#06C755] hover:bg-[#05B04C]",
    textColor: "text-white",
  },
  {
    id: "apple",
    name: "Apple",
    icon: "https://authjs.dev/img/providers/apple.svg",
    color: "bg-black hover:bg-gray-900",
    textColor: "text-white",
  },
  {
    id: "microsoft-entra-id",
    name: "Microsoft",
    icon: "https://authjs.dev/img/providers/microsoft-entra-id.svg",
    color: "bg-[#2F2F2F] hover:bg-[#1A1A1A]",
    textColor: "text-white",
  },
  {
    id: "twitch",
    name: "Twitch",
    icon: "https://authjs.dev/img/providers/twitch.svg",
    color: "bg-[#9146FF] hover:bg-[#7B2FFF]",
    textColor: "text-white",
  },
];

const PROVIDER_LABELS: Record<string, { name: string; emoji: string }> = {
  google: { name: "Google", emoji: "🔵" },
  github: { name: "GitHub", emoji: "⚫" },
  discord: { name: "Discord", emoji: "🟣" },
  twitter: { name: "X (Twitter)", emoji: "⬛" },
  line: { name: "LINE", emoji: "🟢" },
  apple: { name: "Apple", emoji: "🍎" },
  "microsoft-entra-id": { name: "Microsoft", emoji: "🔷" },
  twitch: { name: "Twitch", emoji: "🟪" },
};

function ScopeBadge({ scope }: { scope: string }) {
  return (
    <span className="inline-block bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full font-mono">
      {scope}
    </span>
  );
}

function App() {
  const [session, setSession] = useState<SessionData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/auth/session", { credentials: "include" })
      .then((r) => r.json())
      .then((data) => {
        setSession(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const user = session?.user ?? null;
  const account = session?.account;

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
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">🔐 OAuth Showcase</h1>
          <p className="text-gray-500 text-sm">
            Third-party authentication demo with Auth.js
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8">
          {user ? (
            <div>
              {/* User Info */}
              <div className="text-center mb-6">
                {user.image && (
                  <img
                    src={user.image}
                    alt={user.name ?? "User"}
                    className="w-20 h-20 rounded-full mx-auto mb-4 border-2 border-gray-100"
                  />
                )}
                <h2 className="text-xl font-semibold">{user.name}</h2>
                <p className="text-gray-500 text-sm">{user.email}</p>
              </div>

              {/* Provider Info */}
              {account && (
                <div className="bg-blue-50 rounded-lg p-4 mb-4">
                  <p className="text-xs font-semibold text-blue-600 mb-2">
                    Authenticated via
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="text-lg">
                      {PROVIDER_LABELS[account.provider]?.emoji ?? "🔑"}
                    </span>
                    <span className="font-medium text-blue-900">
                      {PROVIDER_LABELS[account.provider]?.name ??
                        account.provider}
                    </span>
                    {account.token_type && (
                      <span className="text-xs text-blue-400 ml-auto">
                        {account.token_type}
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Scopes */}
              {account?.scope && (
                <div className="bg-green-50 rounded-lg p-4 mb-4">
                  <p className="text-xs font-semibold text-green-600 mb-2">
                    Granted Scopes
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {account.scope.split(/[\s,]+/).map((s) => (
                      <ScopeBadge key={s} scope={s} />
                    ))}
                  </div>
                </div>
              )}

              {/* Raw Session */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <p className="text-xs font-mono text-gray-400 mb-1">
                  Session Data
                </p>
                <pre className="text-xs text-gray-600 overflow-auto max-h-40">
                  {JSON.stringify(session, null, 2)}
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
                    <img
                      src={provider.icon}
                      alt={provider.name}
                      className="w-5 h-5"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = "none";
                      }}
                    />
                    Continue with {provider.name}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="text-center mt-6 space-y-2">
          <p className="text-gray-400 text-xs">
            8 providers · Google · GitHub · Discord · X · LINE · Apple ·
            Microsoft · Twitch
          </p>
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
