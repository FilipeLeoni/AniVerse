import GoogleProvider from "next-auth/providers/google";
import DiscordProvider from "next-auth/providers/discord";
import FacebookProvider from "next-auth/providers/facebook";
import { NextAuthOptions } from "next-auth";
import getExpirationFromToken from "./jwtDecode";
import { renewAccessToken } from "./renewRefreshToken";
import Cookies from "js-cookie";

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
  secret: process.env.SECRET,
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token }) {
      return token;
    },
    async session({ session, token, account }: any) {
      if (session) {
        const { email, name, image } = token;
        const provider = account?.provider;

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email,
              name,
              profilePicture: image,
              provider,
            }),
          }
        );
        const userData = await response.json();
        console.log(userData);
        session.user = userData.user;
        Cookies.set("accessToken", userData.backendTokens.accessToken);
        Cookies.set("refreshToken", userData.backendTokens.refreshToken);
        token.accessToken = userData.backendTokens.accessToken;
        token.accessToken = userData.backendTokens.refreshToken;
      }
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
              Cookies.set("accessToken", token.accessToken);
              Cookies.set("refreshToken", token.refreshToken);
            }
          }
        }
      }

      return { ...session, ...token };
    },
  },
};
