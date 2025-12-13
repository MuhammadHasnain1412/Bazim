"use client";

import { useEffect, useState } from "react";
import { safeLocalStorage } from "@/lib/localStorage";

export default function DebugAuth() {
  const [token, setToken] = useState<string | null>(null);
  const [authStatus, setAuthStatus] = useState<string>("Checking...");

  useEffect(() => {
    const storedToken = safeLocalStorage.getItem("adminToken");
    setToken(storedToken);

    if (storedToken) {
      fetch("/api/auth/me", {
        headers: {
          Authorization: `Bearer ${storedToken}`,
        },
      })
        .then((res) => {
          if (res.ok) {
            setAuthStatus("Valid token");
          } else {
            setAuthStatus("Invalid token");
          }
        })
        .catch(() => {
          setAuthStatus("Error checking token");
        });
    } else {
      setAuthStatus("No token found");
    }
  }, []);

  return (
    <div style={{ padding: "20px", fontFamily: "monospace" }}>
      <h3>Authentication Debug</h3>
      <p><strong>Token:</strong> {token ? `${token.substring(0, 20)}...` : "None"}</p>
      <p><strong>Status:</strong> {authStatus}</p>
      <button onClick={() => safeLocalStorage.removeItem("adminToken")}>
        Clear Token
      </button>
    </div>
  );
}
