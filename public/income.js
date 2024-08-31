document.getElementById('incomeForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const amount = document.getElementById('amount').value;
    const description = document.getElementById('description').value;
    const category = document.getElementById('category').value;

    const payload = {
        amount: amount,
        description: description,
        category: category
    };

    try {
        const token = localStorage.getItem('token');
        // POST request to add an income
        const response = await fetch('/income', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            loadIncomes(); // Reload the expenses list after adding a new one
        }
    } catch (error) {
        console.error('Error:', error.message);
    }
});

// Function to load and display expenses
async function loadIncomes() {
    try {
        const token = localStorage.getItem('token');
        
        // Check if the user is a premium member
        const checkPremiumResponse = await fetch('/income/check-premium', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (checkPremiumResponse.ok) {
            var premiumData = await checkPremiumResponse.json();

            const premiumButton = document.getElementById('buy-premium-btn');
            const leaderboardButton = document.getElementById('show-leaderboard-btn');
            // If user is a premium member, update the button text
            if (premiumData.premium) {
                premiumButton.textContent = 'You are a premium member';
                premiumButton.disabled = true; // Optionally disable the button
                leaderboardButton.style.display = 'block';
                document.getElementById('show-leaderboard-btn').addEventListener('click', loadLeaderboard);
            }
        }
        const response = await fetch('/income',{
            headers:{
                'Authorization': `Bearer ${token}`
            }
        });
        const incomes = await response.json();

        const incomeList = document.getElementById('incomeList');
        incomeList.innerHTML = ''; // Clear the list before appending

        incomes.forEach(income => {
            const li = document.createElement('li');
            li.innerHTML = `${income.amount} - ${income.description} - ${income.category} 
            <button onclick="deleteExpense(${income.id})">Delete</button>`;
            incomeList.appendChild(li);
        });
        const leaderboardList = document.getElementById('leaderboardList');
        // const premiumData = await checkPremiumResponse.json();
        if(premiumData.premium & leaderboardList.innerHTML!==''){
            loadLeaderboard();
        }
    
    } catch (error) {
        console.error('Error:', error);
    }
}
async function loadLeaderboard() {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch('/income/leaderboard', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            const leaderboardData = await response.json();
            const leaderboardList = document.getElementById('leaderboardList');
            leaderboardList.innerHTML = ''; // Clear the list before appending

            leaderboardData.forEach(user => {
                const li = document.createElement('li');
                li.innerHTML = `${user.name} - Expense: ${user.totalExpense}`;
                leaderboardList.appendChild(li);
            });

            // Show the leaderboard section
            document.getElementById('leaderboard').style.display = 'block';
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

// Function to delete an expense
async function deleteIncome(id) {
    try {
        const token = localStorage.getItem('token'); // Retrieve token from localStorage

        await fetch(`/Income/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}` // Include token in headers
            }
        });

        loadExpenses(); // Reload the list after deletion
    } catch (error) {
        console.error('Error:', error);
    }
}

// Load expenses when the page loads
window.onload = loadExpenses;