document.querySelectorAll('.buy-ticket').forEach(button => {
    button.addEventListener('click', async () => {
        const price = button.getAttribute('data-price');
        const ticketType = button.getAttribute('data-ticket');

        const response = await fetch('/create-checkout-session', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                price,
                ticketType
            }),
        });

        const { sessionId } = await response.json();
        const stripe = Stripe('YOUR_PUBLIC_STRIPE_KEY');
        await stripe.redirectToCheckout({ sessionId });
    });
});
