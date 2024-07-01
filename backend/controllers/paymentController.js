// const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY );
// const  catchAsyncError  = require( "../middleware/catchAsyncError.js");

// import stripe from 'stripe';
// import catchAsyncError from '../middleware/catchAsyncError.js';

// const stripeInstance = stripe(process.env.STRIPE_SECRET_KEY);

// export const processPayment = catchAsyncError(async(req,res,next) => {
//     const myPayment = await stripe.paymentIntents.create({
//         amount: req.body.amount,
//         currency: "inr",
//         metadata: {
//             company: "Smart Shopping"
//         },

//     })

//     res.status(200).json({
//         success : true,
//         client_secret : myPayment.client_secret
//     })
// })

// import stripeModule from 'stripe';
// import catchAsyncError from '../middleware/catchAsyncError.js';
// import dotenv from 'dotenv';

// dotenv.config()

// const stripeInstance = stripeModule(process.env.STRIPE_SECRET_KEY);

// export const processPayment = catchAsyncError(async (req, res, next) => {
 

//     const myPayment = await stripeInstance.paymentIntents.create({
//         amount: req.body.amount,
//         currency: "inr",
//         metadata: {
//             company: "Smart Shopping"
//         },
//     });

//     res.status(200).json({
//         success: true,
//         client_secret: myPayment.client_secret
//     });
// });


import stripeModule from 'stripe';
import catchAsyncError from '../middleware/catchAsyncError.js';
import dotenv from 'dotenv';

dotenv.config();

// Make sure to set STRIPE_SECRET_KEY in your environment variables
const stripeInstance = stripeModule(process.env.STRIPE_SECRET_KEY);

export const processPayment = catchAsyncError(async (req, res, next) => {
    try {
        // Ensure that the Stripe API key is provided
        if (!process.env.STRIPE_SECRET_KEY) {
            throw new Error('Stripe API key is not provided. Set STRIPE_SECRET_KEY in your environment variables.');
        }

        const myPayment = await stripeInstance.paymentIntents.create({
            amount: req.body.amount,
            currency: "inr",
            metadata: {
                company: "Smart Shopping"
            },
        });

        res.status(200).json({
            success: true,
            client_secret: myPayment.client_secret
        });
    } catch (error) {
        // Handle the error appropriately
        console.error('Error processing payment:', error);
        res.status(500).json({
            success: false,
            error: 'Error processing payment'
        });
    }
});



export const sendStripeApiKey = catchAsyncError(async(req,res,next) => {
    res.status(200).json({stripeApiKey: process.env.STRIPE_API_KEY })
})