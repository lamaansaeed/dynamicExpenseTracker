document.getElementById('resetPasswordForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if (newPassword !== confirmPassword) {
        document.getElementById('responseMessage').textContent = 'Passwords do not match';
        return;
    }

    try {
        const response = await fetch(`/reset-password/${token}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ newPassword })
        });

        const result = await response.json();
        document.getElementById('responseMessage').textContent = result.message;

        if (result.success) {
            window.location.href = '/login.html';
        }
    } catch (error) {
        console.error('Error:', error);
    }
});
