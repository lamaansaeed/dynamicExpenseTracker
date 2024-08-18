
console.log('Login script loaded');
document.getElementById('loginForm').addEventListener('submit', async function(event) {
    event.preventDefault(); // Prevent default form submission

    // Capture form data
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Prepare payload
    const payload = {
        email: email,
        password: password
    };

    try {
        console.log('i am here 1')
        console.log('Attempting login');
        const response = await fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        const result = await response.json();

        // Display response message
        document.getElementById('responseMessage').textContent = result.message;

        // If login is successful, redirect to another page
        // if (result.success) {
        //     window.location.href = '/dashboard'; // Example redirect after successful login
        // }
    } catch (error) {
        console.error('Error:', error);
    }
});
