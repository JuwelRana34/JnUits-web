import { NextResponse } from 'next/server';
import SSLCommerzPayment from 'sslcommerz-lts'; 

const store_id = process.env.STORE_ID as string;
const store_passwd = process.env.STORE_PASSWORD as string;
const is_live = process.env.is_live === 'true';

export async function POST(request: Request) {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    
    const {UserId, eventId, productName, CustomerName, CustomerEmail, CustomerPhone } = await request.json();
    
    console.log(UserId, eventId, productName, CustomerName, CustomerEmail, CustomerPhone);

    const data = {
        total_amount: 100,
        currency: 'BDT',
        tran_id: `JNUITS_${crypto.randomUUID()}`, 
        success_url: `${baseUrl}/payments/success`,
        fail_url: `${baseUrl}/payments/fail`,
        cancel_url: `${baseUrl}/payments/cancel`,
        ipn_url: `${baseUrl}/api/ipn`,
        shipping_method: 'Online',
        product_name: productName || 'Computer',
        product_category: 'Online',
        product_profile: 'general',
        cus_name: CustomerName || 'John Doe',
        cus_email: CustomerEmail || 'john@example.com',
        cus_add1: 'Dhaka',
        cus_add2: 'Dhaka',
        cus_city: 'Dhaka',
        cus_state: 'Dhaka',
        cus_postcode: '1000',
        cus_country: 'Bangladesh',
        // Number গ্লোবাল অবজেক্টের বদলে CustomerPhone ভেরিয়েবল ব্যবহার করা হয়েছে
        cus_phone: CustomerPhone || "01711111111", 
        cus_fax: '01711111111',
        ship_name: CustomerName || 'John Doe',
        ship_add1: 'Dhaka',
        ship_add2: 'Dhaka',
        ship_city: 'Dhaka',
        ship_state: 'Dhaka',
        ship_postcode: 1000,
        ship_country: 'Bangladesh',
    };

    const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live);

    try {
        const apiResponse = await sslcz.init(data);
        const GatewayPageURL = apiResponse.GatewayPageURL;

        if (GatewayPageURL) {
            return NextResponse.json({ gatewayUrl: GatewayPageURL }, { status: 200 });
        } else {
            return NextResponse.json({ error: "Gateway URL not found" }, { status: 400 });
        }

    } catch (error) {
        console.error("SSLCommerz Error:", error);
        return NextResponse.json({ error: "Payment initiation failed" }, { status: 500 });
    }
}