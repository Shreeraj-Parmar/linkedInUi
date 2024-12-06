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
    subscriptionId: {
        type: String,
        required: true,
    },
    start_date: {
        type: Number,
        required: true,
    },
    end_date: {
        type: Number,
        required: true,
    },
    customerId: {
        type: String,
        required: true,
    },
    plan: {

        name: {
            type: String,
            enum: ["Freebie", "Professional", "Enterprise"],
            required: true
        },
        interval: {
            type: String,
            enum: ["month", "year"],
            required: true
        },


    }

});

const Subscription = mongoose.model("Subscription", subscriptionSchema);

export default Subscription;