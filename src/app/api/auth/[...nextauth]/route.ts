import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import DiscordProvider from "next-auth/providers/discord";
import FacebookProvider from "next-auth/providers/facebook";
import { cookies } from "next/headers";
import getExpirationFromToken from "@/utils/jwtDecode";
import { renewAccessToken } from "@/utils/renewRefreshToken";

const scopes = ["identify", "email"];

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID as string,
      clientSecret: process.env.DISCORD_CLIENT_SECRET as string,
      authorization: { params: { scope: scopes.join(" ") } },
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID as string,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET as string,
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    signIn: async ({ user, account }) => {
      const { email, name, image } = user;
      const provider = account?.provider;
      const cookie = cookies();

      const response = await fetch(`${process.env.API_URL_ENV}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, name, profilePicture: image, provider }),
      });
      if (response.status === 200 || 201) {
        const data = await response.json();
        cookie.set("accessToken", data.backendTokens.accessToken);
        cookie.set("refreshToken", data.backendTokens.refreshToken);
        user = data.user;

        return data;
      } else {
        console.error("Authentication failed:", response.statusText);
        return null;
      }
    },
    async jwt({ token, user }) {
      const cookie = cookies();
      const accessToken = cookie.get("accessToken");
      const refreshToken = cookie.get("refreshToken");

      token.accessToken = accessToken?.value;
      token.refreshToken = refreshToken?.value;

      return token;
    },
    async session({ session, token, user }: any) {
      if (token) {
        const expiration = getExpirationFromToken(token.accessToken);

        if (expiration) {
          const currentTime = Date.now();

          const expirationThreshold = 3000;
          if (expiration - currentTime < expirationThreshold) {
            const newAccessToken = await renewAccessToken(token.refreshToken);
            if (newAccessToken) {
              token.accessToken = newAccessToken.accessToken;
              token.refreshToken = newAccessToken.refreshToken;
              cookies().set("accessToken", token.accessToken);
              cookies().set("refreshToken", token.refreshToken);
            }
          }
        }
      }

      return { ...session, ...token };
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
