document.getElementById('resetPasswordForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const token = window.location.pathname.split('/').pop();
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if (newPassword !== confirmPassword) {
        document.getElementById('responseMessage').textContent = 'Passwords do not match';
        return;
    }

    localStorage.setItem('token', token); // Store the token in local storage

    try {
        const response = await fetch(`/resetting-password/${token}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ newPassword })
        });

        const result = await response.json();
        document.getElementById('responseMessage').textContent = result.message;

        if (result.success) {
            localStorage.removeItem('token'); // Remove the token from local storage
            window.location.href = '/login.html';
        }
    } catch (error) {
        console.error('Error:', error);
    }
});