import { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import { sign } from "jsonwebtoken";
import { setCookie } from "nookies";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Verificar se o método HTTP é GET
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  // Obter o token da query string
  const { token } = req.query;

  // Verificar se o token está presente e é uma string
  if (!token || typeof token !== "string") {
    return res.status(400).json({ message: "Invalid token" });
  }

  try {
    // Verificar o token de email no backend Laravel
    const userResponse = await axios.get(`http://127.0.0.1:8000/api/users/email/${token}`);
    const user = userResponse.data.user;

    // Verificar se o usuário foi encontrado
    if (!user) {
      return res.status(400).json({ message: "Invalid token" });
    }

    // Atualizar o usuário no backend Laravel
    await axios.put(`http://127.0.0.1:8000/api/users/${user.id}`, {
      emailVerified: new Date(),
      emailToken: null,
    });

    // Verificar se NEXTAUTH_SECRET está definido
    if (!process.env.NEXTAUTH_SECRET) {
      return res.status(500).json({ message: "NEXTAUTH_SECRET is not defined" });
    }

    // Gerar um JWT para o usuário
    const jwtToken = sign(
      {
        name: user.name,
        email: user.email,
        sub: user.id,
      },
      process.env.NEXTAUTH_SECRET,
      { expiresIn: "1h" }
    );

    // Criar uma sessão para o usuário no backend Laravel
    await axios.post("http://127.0.0.1:8000/api/sessions", {
      sessionToken: jwtToken,
      userId: user.id,
      expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // Definir a sessão para expirar em 30 dias
    });

    // Definir o JWT como um cookie
    setCookie({ res }, "next-auth.session-token", jwtToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
    });

    // Redirecionar para o dashboard
    return res.redirect("/dashboard");
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}