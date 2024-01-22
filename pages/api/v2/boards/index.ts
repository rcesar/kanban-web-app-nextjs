// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

import Board from "@/model/Board";
import { getData } from "@/utils/boards-fs";
import BoardsModel from "@/database/data";
import { cookies } from 'next/headers'
import { createPagesServerClient, createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // await connectMongo();
    // const data = getData();
    // let docs = await BoardsModel.find();
    // if (docs.length === 0) {
    //   await BoardsModel.create(data);
    //   docs = data.boards;
    // }

  const supabase = createPagesServerClient({ req, res})

  const {
    data: { user },
  } = await supabase.auth.getUser()
  console.log('USER', user)
  if (!user)
    return res.status(401).json({
      error: 'not_authenticated',
      description: 'The user does not have an active session or is not authenticated',
    })
    
  let { data: cards, error } = await supabase
    .from('cards')
    .select('*')
          

    if (req.method === "GET") {
      res.status(200).json({cards, error});
    }

    if (req.method === "POST") {
      docs[0].boards.push(req.body);
      await docs[0].save();
      res.status(201).json(req.body);
    }
  } catch (error) {
    res.status(500).json({});
  }
}
