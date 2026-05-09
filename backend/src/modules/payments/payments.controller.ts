import { Response, NextFunction } from 'express';
import { AuthRequest } from '../../middleware/auth.middleware';
import axios from 'axios';

export const createCheckoutSession = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const secretKey = process.env.PAYMONGO_SECRET_KEY;
    if (!secretKey) {
      return res.status(500).json({ error: 'PayMongo secret key is not configured' });
    }

    const { plan } = req.body;
    const isUltimate = plan?.toLowerCase() === 'ultimate';
    const amount = isUltimate ? 99900 : 49900;
    const description = isUltimate ? 'Tivaro Ultimate Plan Subscription' : 'Tivaro PRO Plan Subscription';
    const name = isUltimate ? 'Ultimate Subscription' : 'PRO Tier Subscription';

    // PayMongo uses Basic Auth. Username is the secret key, password is blank.
    const authHeader = 'Basic ' + Buffer.from(secretKey + ':').toString('base64');

    const response = await axios.post(
      'https://api.paymongo.com/v1/checkout_sessions',
      {
        data: {
          attributes: {
            cancel_url: 'http://localhost:3000/checkout',
            billing: {
              email: req.user?.email || 'test@example.com'
            },
            description,
            line_items: [
              {
                amount,
                currency: 'PHP',
                name,
                quantity: 1
              }
            ],
            payment_method_types: ['gcash', 'card'],
            success_url: 'http://localhost:3000/checkout/success'
          }
        }
      },
      {
        headers: {
          'accept': 'application/json',
          'content-type': 'application/json',
          'authorization': authHeader
        }
      }
    );

    // Return the checkout URL to the frontend
    res.json({ checkoutUrl: response.data.data.attributes.checkout_url });
  } catch (error: any) {
    console.error('PayMongo Error:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to create payment session' });
  }
};

export const createSubscription = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const secretKey = process.env.PAYMONGO_SECRET_KEY;
    if (!secretKey) {
      return res.status(500).json({ error: 'PayMongo secret key is not configured' });
    }

    const { paymentMethodId } = req.body;
    if (!paymentMethodId) {
      return res.status(400).json({ error: 'Payment method ID is required' });
    }

    const authHeader = 'Basic ' + Buffer.from(secretKey + ':').toString('base64');

    // 1. Create a Customer in PayMongo
    const customerResponse = await axios.post(
      'https://api.paymongo.com/v1/customers',
      {
        data: {
          attributes: {
            email: req.user?.email || 'test@example.com',
            name: (req.user as any)?.name || 'Test User'
          }
        }
      },
      {
        headers: {
          'accept': 'application/json',
          'content-type': 'application/json',
          'authorization': authHeader
        }
      }
    );

    const customerId = customerResponse.data.data.id;

    // 2. Create the Subscription
    const planId = process.env.PAYMONGO_PLAN_ID || 'plan_default_test';

    const subscriptionResponse = await axios.post(
      'https://api.paymongo.com/v1/subscriptions',
      {
        data: {
          attributes: {
            customer_id: customerId,
            plan_id: planId,
            payment_method_id: paymentMethodId
          }
        }
      },
      {
        headers: {
          'accept': 'application/json',
          'content-type': 'application/json',
          'authorization': authHeader
        }
      }
    );

    // I-return ang subscription ID at payment intent para sa unang bayad
    res.json({
      subscriptionId: subscriptionResponse.data.data.id,
      paymentIntentId: subscriptionResponse.data.data.attributes.latest_invoice.payment_intent.id,
      clientKey: subscriptionResponse.data.data.attributes.latest_invoice.payment_intent.attributes.client_key
    });
  } catch (error: any) {
    console.error('PayMongo Subscription Error:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to create subscription', details: error.response?.data });
  }
};
