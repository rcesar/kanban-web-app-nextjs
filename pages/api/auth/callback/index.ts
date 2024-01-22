import { createPagesServerClient, createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { NextApiRequest, NextApiResponse } from "next";
import { cookies } from "next/headers";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({message: 'Method not allowed'});
  }

  const { code } = req.query

  if (code) {
    const supabase = createPagesServerClient({ req, res })
    await supabase.auth.exchangeCodeForSession(String(code))
  }

  res.redirect('/')
}