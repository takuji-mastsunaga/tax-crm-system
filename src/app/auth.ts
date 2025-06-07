/* eslint-disable @typescript-eslint/no-explicit-any */
import { getServerSession } from "next-auth/next"
import GoogleProvider from "next-auth/providers/google"

// 許可されたメールアドレスとドメイン
const ALLOWED_EMAILS = [
  "tackjioffice@gmail.com",
  "t7810164825837@gmail.com"
]

const ALLOWED_DOMAINS = [
  "solvis-group.com"
]

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user }: any) {
      if (user.email) {
        // 特定のメールアドレスをチェック
        if (ALLOWED_EMAILS.includes(user.email)) {
          return true
        }
        
        // 許可されたドメインをチェック
        const emailDomain = user.email.split('@')[1]
        if (ALLOWED_DOMAINS.includes(emailDomain)) {
          return true
        }
      }
      return false
    }
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error"
  }
}

export const auth = () => getServerSession(authOptions)