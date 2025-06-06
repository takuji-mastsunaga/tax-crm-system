/* eslint-disable @typescript-eslint/no-explicit-any */
import { getServerSession } from "next-auth/next"
import GoogleProvider from "next-auth/providers/google"

const ALLOWED_EMAILS = [
  "tackjioffice@gmail.com",
  "t7810164825837@gmail.com"
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
      if (user.email && ALLOWED_EMAILS.includes(user.email)) {
        return true
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