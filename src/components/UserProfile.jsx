"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { useEffect } from "react";

export default function UserProfile() {
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "authenticated") {
      console.log("User is authenticated:", session.user);
    } else if (status === "unauthenticated") {
      console.log("User is not authenticated.");
    }
  }, [status, session]);

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  if (status === "authenticated") {
    return (
      <div>
        <p>
          Welcome, <strong>{session.user.name}</strong>!
        </p>
        <p>Email: {session.user.email}</p>
        <p>Role: {session.user.role}</p>
        <button
          onClick={() => signOut()}
          style={{
            padding: "10px 20px",
            background: "#ff4d4d",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Sign Out
        </button>
      </div>
    );
  }

  return (
    <div>
      <p>You are not signed in.</p>
      <button
        onClick={() => signIn()}
        style={{
          padding: "10px 20px",
          background: "#4d7cff",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Sign In
      </button>
    </div>
  );
}
