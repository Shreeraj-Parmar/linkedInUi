import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    provider: {
        type: String,
        enum: ["stripe", "paypal", "square"],
        required: true,
    },
    stripeThrough: {
        subscriptionId: {
            type: String,
            required: ({ provider }) => provider === "stripe",
        },
        start_date: {
            type: Number,
            required: ({ provider }) => provider === "stripe",
        },
        end_date: {
            type: Number,
            required: ({ provider }) => provider === "stripe",
        },
        customerId: {
            type: String,
            required: ({ provider }) => provider === "stripe",
        },
        plan: {
            name: {
                type: String,
                enum: ["Freebie", "Professional", "Enterprise"],
                required: ({ provider }) => provider === "stripe"
            },
            interval: {
                type: String,
                enum: ["month", "year"],
                required: ({ provider }) => provider === "stripe"
            },
        }
    },
    paypalThrough: {
        billing_id: {
            type: String,
            required: ({ provider }) => provider === "paypal"
        },
        plan: {
            name: {
                type: String,
                enum: ["Freebie", "Professional", "Enterprise"],
                required: ({ provider }) => provider === "paypal"
            },
            interval: {
                type: String,
                enum: ["month", "year"],
                required: ({ provider }) => provider === "paypal"
            },
        }
    }

});

const Subscription = mongoose.model("Subscription", subscriptionSchema);

export default Subscription;