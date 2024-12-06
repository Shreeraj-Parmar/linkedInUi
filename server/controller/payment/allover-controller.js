import Stripe from "stripe";
import Company from "../../model/company.js";
import User from "../../model/user.js";
import StripeCustomer from "../../model/stripe-customer.js";
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);



const connectToStripe = async (method, user) => {
    try {

        const account = await stripe.accounts.create({
            type: "express",
            // country: "US",
            // type: "standard", // Updated from "express" to "standard"
            // country: "IN",    // Assuming your platform is based in India
            capabilities: {
                card_payments: { requested: true },
                transfers: { requested: true },
            },
            metadata: {
                name: user.name,
                email: user.email,
                mobile: user.mobile
            }
        });
        console.log("account:", account);
        if (account) {
            let updateUser = await User.findOneAndUpdate(
                { _id: user._id },
                {
                    $set: {
                        payment_details: {
                            stripe: {
                                accountId: account?.id,
                                created: account?.created,
                                default_currency: account?.default_currency,
                            },
                        },
                    },
                },
                { new: true }
            )

            console.log("updateUser", updateUser);

            const accountLink = await stripe.accountLinks.create({
                account: account.id,
                refresh_url: "http://localhost:5173/profile",
                return_url: "http://localhost:5173/profile",
                type: "account_onboarding",
            });
            console.log("accountLink", accountLink);
            return accountLink.url;
        }

    } catch (e) {
        console.log("error while calling connectToStripe", e.message);
    }
}



// connect Payment Method
export const sendSessionLink = async (req, res) => {
    const { method } = req.body;
    try {
        console.log(req.body);
        console.log("...................................................................................");

        let user = await User.findOne({ _id: req._id });
        const validPaymentMethods = ["square", "paypal", "stripe"];
        if (!validPaymentMethods.includes(method)) {

            return res.status(400).json({ error: "Invalid payment method" });
        }


        if (user?.payment_method) {
            console.log("dissconnectin");
            return res.status(500).json({
                message: `Please disconnect the currently connected method before proceeding to connect ${method}.`,
            });
        }

        let authentication_url;

        switch (method) {
            case "square":
                // authentication_url = await connectToSquare(req, res, companyId);
                break;
            case "paypal":
                // authentication_url = await connectToPayPal(req.body, companyId);
                break;
            case "stripe":
                authentication_url = await connectToStripe(method, user);
                break;
        }

        console.log("authentication_url : ", authentication_url);

        if (authentication_url) {
            const updateuser = await User.findOneAndUpdate(
                { _id: req._id },
                { $set: { payment_method: method, auth_url: authentication_url } },
                { new: true }
            )

            console.log("finally updated user with payment is", updateuser);
            return res.status(200).json({
                authentication_url: authentication_url,
                message: "Payment method connecting..",
            });
        } else {
            return res.status(404).json({
                message: "Connection error please try again later.",
            });
        }

    } catch (error) {
        console.log(
            `error while calling sendSessionLink API & error is ${error.message}`
        );
        res.status(500).json({ message: "Internal Server Error" });
    }
}


const disconnectFromStripe = async (method, user) => {
    if (user?.subscription?.is_active) {
        const subscriptions = await stripe.subscriptions.list({
            customer: company?.subscription?.customer_id,
            status: "active",
        });

        if (subscriptions) {
            const subscription = await stripe.subscriptions.cancel(
                subscriptions?.data[0]?.id
            );
        }
    }

    await User.findOneAndUpdate(
        { _id: user._id },
        {
            $set: {
                payment_method: "",
                payment_details: {
                    stripe: {},
                },
                auth_url: "",
                "subscription.is_active": false,
                "subscription.plan": "Free",
            },
        },
        { new: true }
    );
}


// Disconnect Payment Method
export const disconnectFromPaymentProvder = async (req, res) => {
    try {
        const { method } = req.body;



        // Validate payment method
        const validPaymentMethods = ["square", "paypal", "stripe"];
        if (!validPaymentMethods.includes(method)) {
            return res.status(400).json({ error: "Invalid payment method" });
        }

        const user = await User.findById(req._id);
        console.log("user ", user);

        if (user?.payment_method == method) {
            switch (method) {
                case "square":
                    await disconnectFromSquare(method, user);
                    break;
                case "paypal":
                    await disconnectFromPayPal(method, user);
                    break; user
                case "stripe":
                    await disconnectFromStripe(method, user);
                    break;
            }

            return res.status(200).json({
                message: `Payment method disconnected successfully..`,
            });
        } else {
            return res.status(500).json({
                message: `Sorry, the payment method you're trying to disconnect was not found`,
            });
        }
    } catch (error) {
        console.error("Error processing payment:", error);
        res.status(500).json({
            err_server: "An error occurred while disconnecting payment method.",
        });
    }
}



const verifyStripeAccount = async (user) => {

    // here we check account inside stripe
    if (user?.payment_details?.stripe?.accountId) {
        const account = await stripe.accounts.retrieve(user?.payment_details?.["stripe"].accountId);
        console.log("account is", account);

        console.log("requirements are", account?.requirements.currently_due);

        if (account.charges_enabled && account.payouts_enabled && account?.requirements.currently_due.length === 0) {
            return true;
        } else {
            return false;
        }
    }

}


// Verify it is Avilable For Not Or Not !!

export const verifyPaymentAccount = async (req, res) => {
    // console.log("req is", req);
    try {
        let user = await User.findById(req._id);
        console.log(user);
        if (!user.payment_method) return res.status(201).json({ message: "payment method not connected" });

        switch (user.payment_method) {
            case "square":
                //    let res = await verifySquareAccount(user);
                break;
            case "paypal":
                // await verifyPayPalAccount(user);
                break;
            case "stripe":
                let resToSend = await verifyStripeAccount(user);
                if (resToSend) {
                    return res.status(200).json({ message: "Account Is ready To Accept payment" });
                } else {
                    return res.status(201).json({ message: "Account Is Not ready To Accept payment, Some requirements are pending, Please Reconnect" });
                }

            default:
                return res.status(200).json({ message: "payment method Not Available" });

        }


    } catch (error) {
        console.error("Error processing payment:", error);
        res.status(500).json({
            err_server: "An error occurred while calling  verifyPaymentAccount .",
        });
    }
}



const createSubscriptionIntoStripe = async (env, id) => {
    const product = await stripe.products.retrieve(env);

    // console.log("product is", product);
    const price = await stripe.prices.retrieve(product.default_price);
    console.log("price is", price);

    const session = await stripe.checkout.sessions.create({
        billing_address_collection: "auto",
        line_items: [
            {
                price: price.id,
                quantity: 1,
            },
        ],
        mode: "subscription",
        success_url: `http://localhost:5173/premium`,
        cancel_url: `http://localhost:5173/premium`,
        customer: id,
        discounts: [
            {
                coupon: "50-off", // Replace with actual coupon ID
            },
        ],
    });

    console.log("session is", session);

    return session.url;

}



//createSubscription 
export const createSubscription = async (req, res) => {
    const { mainTitle, monthPrice } = req.body;
    console.log("body is", req.body)
    try {


        let customer_id;
        let env;

        // check customer exist or not
        let existCustomer = await StripeCustomer.findOne({ userId: req._id });
        if (!existCustomer) {
            const customer = await stripe.customers.create({
                metadata: { userId: req._id.toString(), purpose: "subscription" },
            });
            console.log("customer is", customer);
            customer_id = customer.id;
            const newCreatedCustomer = new StripeCustomer({
                userId: req._id,
                customerId: customer.id,
            });
            await newCreatedCustomer.save();
            console.log("newCreatedCustomer is", newCreatedCustomer);
        } else {

            customer_id = existCustomer.customerId;
        }
        console.log("customer_id is", customer_id);
        let user = await User.findById(req._id);
        let method = user.payment_method;
        if (monthPrice) {

            switch (mainTitle) {
                case "Freebie":
                    env = process.env.STRIPE_FREEBIE_MONTHLY;
                    break;
                case "Enterprise":
                    env = process.env.STRIPE_ENTERPRISE_MONTHLY;
                    break;
                case "Professional":
                    env = process.env.STRIPE_PROFESSIONAL_MONTHLY;
                    break;
                default:
                    return res.status(400).json({ message: "payment method Not Available" });
            }
            switch (method) {
                case "square":
                    // await createSubscriptionIntoSquare(data, req._id);   
                    break;
                case "paypal":
                    // await createSubscriptionIntoPayPal(data, req._id);
                    break;
                case "stripe":
                    let resFrom = await createSubscriptionIntoStripe(env, customer_id);
                    return res.status(200).json({ message: "Url Generated Successfully", url: resFrom });

                default:
                    return res.status(400).json({ message: "payment method Not Available" });
            }
        } else {

            switch (mainTitle) {
                case "Freebie":
                    env = process.env.STRIPE_FREEBIE_YEARLY;
                    break;
                case "Enterprise":
                    env = process.env.STRIPE_ENTERPRISE_YEARLY;
                    break;
                case "Professional":
                    env = process.env.STRIPE_PROFESSIONAL_YEARLY;
                    break;
                default:
                    return res.status(400).json({ message: "payment method Not Available" });
            }
            switch (method) {
                case "square":
                    // await createSubscriptionIntoSquare(data, req._id);
                    break;
                case "paypal":
                    // await createSubscriptionIntoPayPal(data, req._id);
                    break;
                case "stripe":
                    let resFrom = await createSubscriptionIntoStripe(env, customer_id);
                    return res.status(200).json({ message: "Url Generated Successfully", url: resFrom });

                default:
                    return res.status(400).json({ message: "payment method Not Available" });
            }
        }


    } catch (error) {
        console.error("Error processing payment:", error.message);
        res.status(500).json({
            err_server: "An error occurred while calling  createSubscription .",
        });
    }
}