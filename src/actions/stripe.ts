'use server';

import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-08-26.dahlia',
});

export async function createCheckoutSession(formData: FormData) {
  const { userId } = await auth();
  const organizationId = formData.get('organizationId') as string;

  if (!userId || !organizationId) {
    throw new Error('Unauthorized billing request');
  }

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    billing_address_collection: 'auto',
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'SaaS Pulse Pro',
            description: 'Unlock unlimited projects and premium features.',
          },
          unit_amount: 2000,
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    metadata: {
      organizationId,
      userId,
    },
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/organization/${organizationId}?success=true`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/organization/${organizationId}?canceled=true`,
  });

  if (!session.url) {
    throw new Error('Failed to generate Stripe checkout URL');
  }

  redirect(session.url);
}