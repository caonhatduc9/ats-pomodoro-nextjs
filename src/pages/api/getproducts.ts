import type { NextApiRequest, NextApiResponse } from 'next'
import Stripe from "stripe";


export default async function GET(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
    const stripe = new Stripe(process.env.NEXT_STRIPE_SECRET_KEY as string,{apiVersion: "2022-11-15"})
    const prices = await stripe.prices.list({limit: 2})
    // console.log(prices.data);
    
    return res.status(200).json(prices.data.reverse())
}
