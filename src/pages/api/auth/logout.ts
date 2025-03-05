import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import { destroyCookie } from "nookies";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });

  if (session) {
    // Destroy the session cookie
    destroyCookie({ res }, "next-auth.session-token", {
      path: "/",
    });

    // Remove the session from the database
    await prisma.session.delete({
      where: { id: session.user.id },
    });
  }

  // Redirect to the login page after logging out
  res.redirect("/login");
}