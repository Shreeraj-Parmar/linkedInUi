import Stripe from "stripe";
import Company from "../../model/company.js";
import User from "../../model/user.js";
import StripeCustomer from "../../model/stripe-customer.js";
import Subscription from "../../model/subscription.js";
import transporter from "../../utils/mailer.js";
// import getRawBody from "raw-body";

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

                    customerId: event.data.object.customer,

                    subscriptionId: event.data.object.subscription,
                    provider: "stripe",
                };
                // console.log("dara is", event.data.object);

                const customer = await stripe.customers.retrieve(obje.customerId);
                // console.log("customer is", customer);
                obje.userId = customer.metadata.userId;
                const subscription = await stripe.subscriptions.retrieve(event.data.object.subscription);

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
                obje.start_date = subscription.current_period_start;
                obje.end_date = subscription.current_period_end;

                obje.plan = {
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