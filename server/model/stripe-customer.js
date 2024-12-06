import mongoose from "mongoose";

const stripeCustomerSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    customerId: {
        type: String,
        required: true,
    },
});

const StripeCustomer = mongoose.model("StripeCustomer", stripeCustomerSchema);

export default StripeCustomer;