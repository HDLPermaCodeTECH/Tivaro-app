import axios from 'axios';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load .env file
dotenv.config({ path: path.join(__dirname, '../.env') });

const secretKey = process.env.PAYMONGO_SECRET_KEY;
if (!secretKey) {
  console.error('PAYMONGO_SECRET_KEY is not set');
  process.exit(1);
}

const authHeader = 'Basic ' + Buffer.from(secretKey + ':').toString('base64');

async function createPlan() {
  try {
    const response = await axios.post(
      'https://api.paymongo.com/v1/subscriptions/plans',
      {
        data: {
          attributes: {
            name: 'Tivaro PRO Plan',
            description: 'Monthly subscription for Tivaro PRO features',
            amount: 49900, // ₱499.00 in cents
            currency: 'PHP',
            interval: 'monthly',
            interval_count: 1
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

    console.log('Plan Created Successfully!');
    console.log('Plan ID:', response.data.data.id);
    console.log('Full Response:', JSON.stringify(response.data, null, 2));
  } catch (error: any) {
    console.error('Error creating plan:', error.response?.data || error.message);
  }
}

createPlan();
