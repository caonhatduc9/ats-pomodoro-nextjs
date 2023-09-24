import { NextApiRequest, NextApiResponse } from 'next';
import { Stripe } from 'stripe';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    const stripe = new Stripe(process.env.NEXT_STRIPE_SECRET_KEY as string, {
      apiVersion: '2022-11-15', // Sử dụng phiên bản hợp lý của Stripe API
    });

    const data = req.body;
    // console.log(111,data);
    
    const priceId = data.priceId;

    try {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price: priceId,
            quantity: 1,
          },
        ],
        mode: 'subscription',
        success_url: 'http://localhost:3000',
        cancel_url: 'http://localhost:3000',
      });
      // console.log(session);
      
      res.status(200).json({ url: session.url });
    } catch (error) {
      console.error(error);
    //   res.status(500).json({ error: 'An error occurred.' });
      res.status(500).json({ error: JSON.stringify(error) });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end('Method Not Allowed');
  }
}
