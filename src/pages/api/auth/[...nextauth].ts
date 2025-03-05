import NextAuth from "next-auth";
import EmailProvider from "next-auth/providers/email";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
import { sendEmail } from "@/utils/sendEmail"; // Import your sendEmail function

const prisma = new PrismaClient();

export default NextAuth({
  providers: [
    EmailProvider({
      server: process.env.EMAIL_SERVER,
      from: process.env.EMAIL_FROM,
      async sendVerificationRequest({ identifier, url }) {
        // Customize the verification URL to point to your custom API route
        const verificationUrl = `${process.env.NEXTAUTH_URL}/api/confirm-email?token=${identifier}`;

        // Send the email with the custom verification link
        await sendEmail({
          to: identifier,
          subject: "Verify your email",
          html: `<p>Click <a href="${verificationUrl}">here</a> to verify your email.</p>`,
        });
      },
    }),
  ],
  adapter: PrismaAdapter(prisma),
  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
        session.user.role = user.role;
      }
      return session;
    },
  },
  debug: true,
});