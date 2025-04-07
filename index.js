// // const {onRequest} = require("firebase-functions/v2/https");
// // const logger = require("firebase-functions/logger");
// const express = require("express")
// const cors =require("cors")
// const dotenv =require("dotenv")
// dotenv.config();
// const stripe = require("stripe")(process.env.STRIPE_KEY)


// const app = express()
// app.use(cors({origin:true}))
// app.use(express.json())

// app.get("/", (req, res) => {
//     res.status(200).json({
//       message: "Success !",
//     });
//   });

//   app.post("/payment/create", async (req, res) => {
//     const total = req.query.total;
//     if (total > 0) {
//       const paymentIntent = await stripe.paymentIntents.create({
//         amount:total,
//         currency:"usd",
//       });
//       //console.log(paymentIntent);


//       res.status(201).json({
//         clientsecret:paymentIntent.client_secret,
//       });
//     }else{
//       res.status(403).json({
//         message:"total must be greater than 0",
//       });
//     }
// });

// app.listen(5000, (err)=>{
//     if(err)throw err
//     console.log("amazon server running on port:5000,http://localhost:5000")
// });
// index.js or app.js (in backend folder)

const express = require("express");
const cors = require("cors");
const stripe = require("stripe")(process.env.STRIPE_KEY); // Add Stripe key here

const app = express();
app.use(cors({ origin: true }));
app.use(express.json());

// Simple health check route (just to verify the server)
app.get("/", (req, res) => {
  res.status(200).json({
    message: "Server is up and running!",
  });
});

// Payment route to create payment intent
app.post("/api/payment/create", async (req, res) => {
  const { total } = req.body;  // Get total amount (in cents, e.g., $10 = 1000)

  if (total > 0) {
    try {
      // Create payment intent with Stripe
      const paymentIntent = await stripe.paymentIntents.create({
        amount: total,  // Total in cents
        currency: "usd",
      });

      res.status(201).json({
        clientSecret: paymentIntent.client_secret,
      });
    } catch (error) {
      console.error("Error creating payment intent:", error);
      res.status(500).json({
        message: "Failed to create payment intent",
      });
    }
  } else {
    res.status(403).json({
      message: "Total must be greater than 0",
    });
  }
});

// Start the Express server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

