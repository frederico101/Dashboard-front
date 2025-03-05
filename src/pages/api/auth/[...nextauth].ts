"use client"
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import EmailProvider from "next-auth/providers/email";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { sendEmail } from "@/utils/sendEmail";
import { sign } from "jsonwebtoken";

const prisma = new PrismaClient();

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required");
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user) {
          throw new Error("User not found");
        }

        if (!user.password) {
          throw new Error("This user cannot log in with credentials");
        }

        // Block login if the email is not verified
        if (!user.emailVerified) {
          throw new Error("Please verify your email before logging in.");
        }

        const isPasswordCorrect = await bcrypt.compare(
          credentials.password, 
          user.password
        );

        if (!isPasswordCorrect) {
          throw new Error("Invalid email or password");
        } else {
          // Ensure NEXTAUTH_SECRET is defined
          if (!process.env.NEXTAUTH_SECRET) {
            throw new Error("NEXTAUTH_SECRET is not defined");
          }

          // Generate a JWT token for the user
          const jwtToken = sign(
            {
              name: user.name,
              email: user.email,
              sub: user.id,
            },
            process.env.NEXTAUTH_SECRET,
            { expiresIn: "1h" }
          );

          // Create a session for the user
          await prisma.session.create({
            data: {
              sessionToken: jwtToken,
              userId: user.id,
              expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // Set session to expire in 30 days
            },
          });

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
          };
        }
      }
    }),
    EmailProvider({
      server: process.env.EMAIL_SERVER,
      from: process.env.EMAIL_FROM,
      async sendVerificationRequest({ identifier }) {
        const user = await prisma.user.findUnique({ where: { email: identifier } });

        if (!user) {
          throw new Error("User not found.");
        }

        const verificationUrl = `${process.env.NEXTAUTH_URL}/api/confirm-email?token=${user.emailToken}`;

        await sendEmail({
          to: identifier,
          subject: "Verify your email",
          html: `<p>Click <a href="${verificationUrl}">here</a> to verify your email.</p>`,
        });
      },
    }),
  ],
  adapter: PrismaAdapter(prisma),
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async session({ session, token }: { session: any, token: any }) {
      if (token) {
        session.user = {
          id: token.sub || "",
          email: token.email || "",
          name: token.name || "",
          role: token.role as string,
        };
      }
      return session;
    },
    async jwt({ token, user }: { token: any, user: any }) {
      if (user) {
        token.id = user.id;
        token.email = user.email || "";
        token.name = user.name;
        token.role = user.role;
      } else if (token) {
        token.email = token.email || "";
      }
      return token;
    },
  },
  debug: true,
});