// Fetch Razorpay key and expose it to your frontend JS
fetch('/api/config')
  .then(response => response.json())
  .then(data => {
    window.razorpayKeyId = data.razorpayKeyId;
  })
  .catch(error => {
    console.error('Error fetching Razorpay key:', error);
  });
document.getElementById('buy-premium-btn').onclick = async function(e) {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const response = await fetch('/buy-premium', { method: 'POST',headers:{'Authorization': `Bearer ${token}`} });
    const orderData = await response.json();
    console.log(window);
    const razorpayKeyId = window.razorpayKeyId;
    var options = {
        "key": razorpayKeyId, // Enter the Key ID generated from the Dashboard
        "amount": orderData.amount, // Amount in paise
        "currency": orderData.currency,
        "name": "Your Company Name",
        "description": "Buy Premium",
        "image": "/your_logo.png",
        "order_id": orderData.id,
        "handler": async function (response){
            // After successful payment, call server to mark user as premium

            const paymentResult = await fetch('/verify-payment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    razorpay_payment_id: response.razorpay_payment_id,
                    razorpay_order_id: response.razorpay_order_id,
                    razorpay_signature: response.razorpay_signature
                })
            });

            const result = await paymentResult.json();
            if (result.success) {
                alert("You are now a premium member!");
                localStorage.setItem('token', result.token);
                // Update UI or redirect as needed
            } else {
                alert("Payment failed or could not verify the payment.");
            }
        },
        "prefill": {
            "name": "Your Name",
            "email": "your.email@example.com",
            "contact": "9999999999"
        },
        "theme": {
            "color": "#F37254"
        }
    };

    var rzp1 = new Razorpay(options);
    rzp1.open();
};
