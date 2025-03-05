import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";
import { v4 as uuidv4 } from "uuid";

const prisma = new PrismaClient();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "fredyalves.fredyalves101@gmail.com",//process.env.EMAIL_FROM,
    pass: "bcpx odvx xskv hasp"//process.env.EMAIL_PASSWORD,
  },
});


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).end(); // Method Not Allowed
  }

  const { email, password, name } = req.body;

  if (!email || !password || !name) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const existingUser = await prisma.user.findUnique({ where: { email } });

  if (existingUser) {
    return res.status(400).json({ message: "User already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const emailToken = uuidv4();

  const user = await prisma.user.create({
    data: {
      email,
      name,
      password: hashedPassword,
      emailToken,
      emailVerified: null,
    },
  });

  const mailOptions = {
    from: "fredyalves.fredyalves101@gmail.com", //process.env.EMAIL_FROM,
    to: email,
    subject: "Email Confirmation",
    text: `Please confirm your email by clicking the following link: ${process.env.NEXTAUTH_URL}/api/confirm-email?token=${emailToken}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email:", error);
    } else {
      console.log("Email sent:", info.response);
    }
  });

  return res.status(201).json(user);
}