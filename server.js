const express = require('express');
const stripe = require('stripe')('YOUR_SECRET_STRIPE_KEY');
const nodemailer = require('nodemailer');
const app = express();

app.use(express.static('public'));
app.use(express.json());

app.post('/create-checkout-session', async (req, res) => {
    const { price, ticketType } = req.body;

    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [{
            price_data: {
                currency: 'czk',
                product_data: {
                    name: ticketType,
                },
                unit_amount: price * 100,
            },
            quantity: 1,
        }],
        mode: 'payment',
        success_url: 'http://localhost:3000/success',
        cancel_url: 'http://localhost:3000/cancel',
    });

    res.json({ sessionId: session.id });
});

app.post('/send-ticket', (req, res) => {
    const { email, ticketType } = req.body;

    // Konfigurace Nodemailer
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'YOUR_EMAIL',
            pass: 'YOUR_EMAIL_PASSWORD'
        }
    });

    const mailOptions = {
        from: 'YOUR_EMAIL',
        to: email,
        subject: 'Vstupenka na maturitní ples',
        text: `Děkujeme za zakoupení vstupenky na maturitní ples! Zakoupili jste: ${ticketType}.`,
        attachments: [{
            filename: 'vstupenka.pdf',
            path: './vstupenka.pdf',
            contentType: 'application/pdf'
        }]
    };

    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error);
            res.status(500).send('Email nelze odeslat.');
        } else {
            console.log('Email sent: ' + info.response);
            res.status(200).send('Email úspěšně odeslán.');
        }
    });
});

app.listen(3000, () => {
    console.log('Server běží na http://localhost:3000');
});
