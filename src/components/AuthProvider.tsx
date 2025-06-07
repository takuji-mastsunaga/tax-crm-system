"use client";

import { SessionProvider } from "next-auth/react";
import { useEffect } from "react";
import { useSession } from "next-auth/react";

function FirebaseAuthSync({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();

  useEffect(() => {
    const syncFirebaseAuth = async () => {
      if (session?.user?.email) {
        try {
          // NextAuthのセッションがある場合、Firebase Authenticationと同期
          // 実際の実装では、カスタムトークンを生成する必要があります
          console.log("User authenticated with NextAuth:", session.user.email);
        } catch (error) {
          console.error("Firebase auth sync error:", error);
        }
      }
    };

    syncFirebaseAuth();
  }, [session]);

  return <>{children}</>;
}

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <FirebaseAuthSync>
        {children}
      </FirebaseAuthSync>
    </SessionProvider>
  );
}
