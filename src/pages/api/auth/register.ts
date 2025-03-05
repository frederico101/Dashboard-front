import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/utils/prisma"; // Criamos uma instância global de Prisma
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";
import { v4 as uuidv4 } from "uuid";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.NEXT_PUBLIC_EMAIL_FROM,
    pass: process.env.NEXT_PUBLIC_EMAIL_PASSWORD,
  },
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Método não permitido" });
  }

  const { email, password, name } = req.body;

  if (!email || !password || !name) {
    return res.status(400).json({ message: "Todos os campos são obrigatórios" });
  }

  const existingUser = await prisma.user.findUnique({ where: { email } });   //change to backend

  if (existingUser) {
    return res.status(400).json({ message: "Usuário já existe" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const emailToken = uuidv4();

  const user = await prisma.user.create({     //change to backend
    data: {
      email,
      name,
      password: hashedPassword,
      emailToken,
      emailVerified: null,
    },
  });

  const mailOptions = {
    from: process.env.NEXT_PUBLIC_EMAIL_FROM,
    to: email,
    subject: "Confirme seu e-mail",
    text: `Clique no link para confirmar seu e-mail: ${process.env.NEXTAUTH_URL}/api/confirm-email?token=${emailToken}`,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Erro ao enviar e-mail:", error);
    return res.status(500).json({ message: "Erro ao enviar e-mail de verificação" });
  }

  return res.status(201).json({ message: "Usuário registrado! Verifique seu e-mail." });
}
