import Stripe from "stripe";
import Company from "../../model/company.js";
import User from "../../model/user.js";
import StripeCustomer from "../../model/stripe-customer.js";
import Subscription from "../../model/subscription.js";
import transporter from "../../utils/mailer.js";
import getToken from "../../utils/get-access-token-paypal.js";
import axios from "axios";
import crypto from "crypto"
import crc32 from "buffer-crc32"

import fs from "fs/promises"

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);


const handleInvoicePaymentFailed = async (id) => {
    console.log("id is", id)
    const res = await Subscription.findOneAndDelete({
        subscriptionId: id
    });
    console.log(res)
};


export const handleStripeWebhook = async (req, res) => {

    const sig = req.headers["stripe-signature"];
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

    let event;
    try {
        event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
        // console.log("event is from signature", event);


        switch (event.type) {
            case "customer.deleted":
                // console.log("customer delete ");
                // await Company.findOneAndUpdate(
                //   {
                //     "subscription.customer_id":
                //       process.env.NODE_ENV === "production"
                //         ? event?.data?.object?.customer
                //         : event.data.customer,
                //   },
                //   {
                //     "subscription.is_active": false,
                //     "subscription.plan": "Free",
                //     "subscription.customer": "",
                //   }
                // );
                break;
            case "customer.subscription.deleted":
                console.log("customer.subscription.deleted");
                await handleInvoicePaymentFailed(event.data.object.id);
                break;
            case "customer.subscription.pending_update_expired":
                console.log("customer.subscription.pending_update_expired");
                // await handleInvoicePaymentFailed(event.data);
                break;
            case "invoice.paid":
                let obje = {

                    stripeThrough: {

                        customerId: event.data.object.customer,

                        subscriptionId: event.data.object.subscription,
                    },

                    provider: "stripe",
                };
                // console.log("dara is", event.data.object);

                const customer = await stripe.customers.retrieve(obje.stripeThrough.customerId);
                // console.log("customer is", customer);
                obje.userId = customer.metadata.userId;
                const subscription = await stripe.subscriptions.retrieve(obje.stripeThrough.subscriptionId);

                let planName;
                switch (subscription.plan.product) {
                    case process.env.STRIPE_FREEBIE_MONTHLY:
                        planName = "Freebie";
                        break;
                    case process.env.STRIPE_FREEBIE_YEARLY:
                        planName = "Freebie";
                        break;
                    case process.env.STRIPE_PROFESSIONAL_MONTHLY:
                        planName = "Professional";
                        break;
                    case process.env.STRIPE_PROFESSIONAL_YEARLY:
                        planName = "Professional";
                        break;
                    case process.env.STRIPE_ENTERPRISE_MONTHLY:
                        planName = "Enterprise";
                        break;
                    case process.env.STRIPE_ENTERPRISE_YEARLY:
                        planName = "Enterprise";
                        break;
                    default:
                        planName = "none";
                }
                obje.stripeThrough.start_date = subscription.current_period_start;
                obje.stripeThrough.end_date = subscription.current_period_end;

                obje.stripeThrough.plan = {
                    name: planName,
                    interval: subscription.plan.interval,
                }

                console.log("obje is", obje);
                const newSub = new Subscription(obje);
                await newSub.save();


                // console.log("subscription is", subscription);
                // console.log(paymentIntent);
                break;
            case "invoice.payment_failed":
                const paymentFailed = event.data.object;
                console.log("Payment Failed");
                // console.log(paymentFailed);
                break;

            case "checkout.session.completed":
                console.log("checkout.session.completed");
                console.log("event is the ...................", event.data.object);

                if (event.data.object.mode === "subscription") {
                    return;
                }
                const paymentIntent = await stripe.paymentIntents.retrieve(
                    event.data.object.payment_intent
                );

                console.log("paymentIntent is", paymentIntent);
                const chargeId = paymentIntent.latest_charge;

                try {
                    const charge = await stripe.charges.retrieve(chargeId);
                    const receiptUrl = charge.receipt_url;
                    console.log('Receipt URL:', receiptUrl);

                    // Use the receipt URL (e.g., store it, display it, email it to the customer)
                } catch (error) {
                    console.error('Error fetching charge:', error.message);
                }

                break;

            default:
                console.log(`Unhandled event type ${event.type}`);
        }


    } catch (err) {
        console.log("stripe event", err);
        res.status(400).send(`Webhook Error: ${err.message}`);
        return;
    }

}


export const createPaypalWebhook = async (url) => {
    let accessToken = await getToken();
    let data = {

        url: url,
        event_types: [
            {
                "name": "BILLING.SUBSCRIPTION.CREATED"
            },
            {
                "name": "PAYMENT.SALE.COMPLETED"
            },
            {
                "name": "BILLING.SUBSCRIPTION.CANCELLED"
            }
        ]
    }

    let res = await axios.post("https://api-m.sandbox.paypal.com/v1/notifications/webhooks", data, {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`
        }
    })

    console.log("res is", res.data);

}


export const viewWebhookDetails = async (id) => {
    let accessToken = await getToken();
    let res = await axios.get(`https://api-m.sandbox.paypal.com/v1/notifications/webhooks/${id}`, {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`
        }
    })

    console.log("res is", res.data);

}


export const deleteWebhook = async (id) => {
    let accessToken = await getToken();
    let res = await axios.delete(`https://api-m.sandbox.paypal.com/v1/notifications/webhooks/${id}`, {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`
        }
    })

    console.log("res is", res.data);

}

async function verifySignature(event, headers) {
    const transmissionId = headers['paypal-transmission-id']
    const timeStamp = headers['paypal-transmission-time']
    const crc = parseInt("0x" + crc32(event).toString('hex')); // hex crc32 of raw event data, parsed to decimal form

    const message = `${transmissionId}|${timeStamp}|${process.env.PAYPAL_WEBHOOK_ID}|${crc}`
    console.log(`Original signed message ${message}`);

    const certPem = await downloadAndCache(headers['paypal-cert-url']);

    // Create buffer from base64-encoded signature
    const signatureBuffer = Buffer.from(headers['paypal-transmission-sig'], 'base64');

    // Create a verification object
    const verifier = crypto.createVerify('SHA256');

    // Add the original message to the verifier
    verifier.update(message);

    return verifier.verify(certPem, signatureBuffer);
}

async function downloadAndCache(url, cacheKey) {
    if (!cacheKey) {
        cacheKey = url.replace(/\W+/g, '-')
    }
    const filePath = `./paypalCatch/${cacheKey}`;

    // Check if cached file exists
    const cachedData = await fs.readFile(filePath, 'utf-8').catch(() => null);
    if (cachedData) {
        return cachedData;
    }

    // Download the file if not cached
    const response = await fetch(url);
    const data = await response.text()
    await fs.writeFile(filePath, data);

    return data;
}


const viewDetailsOfPaypalSubscription = async (id) => {

    try {

        let accessToken = await getToken();

        let headersOfURL = {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`
        }

        let res = await axios.get(`https://api.sandbox.paypal.com/v1/billing/subscriptions/${id}`, { headers: headersOfURL });
        console.log("this is detaild view of bill", res.data)
    } catch (error) {
        console.log("error while calling viewDetailsOfPaypalSubscription API & error is", error.message);
    }

}


export const handlePaypalWebhook = async (req, res) => {
    try {
        const headers = req.headers;
        const event = req.body;
        const data = JSON.parse(event)

        // console.log(`headers`, headers);
        // console.log(`parsed json`, JSON.stringify(data, null, 2));
        // console.log(`raw event: ${event}`);

        const isSignatureValid = await verifySignature(event, headers);

        if (isSignatureValid) {
            console.log('Signature is valid.');

            // Successful receipt of webhook, do something with the webhook data here to process it, e.g. write to database
            // console.log(`Received event`, JSON.stringify(data, null, 2));
            // let resObj = JSON.stringify(data, null, 2);
            console.log("data is from verifided signature", data);
            let resObj = data;


            if (resObj?.event_type === "PAYMENT.SALE.COMPLETED") {
                console.log(`Payment completed for ${resObj?.resource?.billing_agreement_id}`);
                viewDetailsOfPaypalSubscription(resObj?.resource?.billing_agreement_id);
                res.status(200).send("Success");
            }

        } else {
            console.log(`Signature is not valid for ${resObj?.id} ${headers?.['correlation-id']}`);
            res.status(400).send("Bad Request");
            // Reject processing the webhook event. May wish to log all headers+data for debug purposes.
        }

    } catch (error) {
        console.error("Error verifying webhook:", error);
        res.status(500).send("Internal Server Error");
    }
};

