import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import { sign } from "jsonwebtoken";
import { setCookie } from "nookies";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { token } = req.query;

  if (!token || typeof token !== "string") {
    return res.status(400).json({ message: "Invalid token" });
  }

  const user = await prisma.user.findFirst({ where: { emailToken: token } }); //change to backend

  if (!user) {
    return res.status(400).json({ message: "Invalid token" });
  }

  await prisma.user.update({               //change to backend
    where: { id: user.id },
    data: {
      emailVerified: new Date(), // Set emailVerified to the current date and time
      emailToken: null,
    },
  });

  // Ensure NEXTAUTH_SECRET is defined
  if (!process.env.NEXTAUTH_SECRET) {
    return res.status(500).json({ message: "NEXTAUTH_SECRET is not defined" });
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
  const session = await prisma.session.create({  //change to backend
    data: {
      sessionToken: jwtToken,
      userId: user.id,
      expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // Set session to expire in 30 days
    },
  });

  // Set the JWT token as a cookie
  setCookie({ res }, "next-auth.session-token", jwtToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
  });

  return res.redirect("/dashboard");
}