document.getElementById('expenseForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const amount = document.getElementById('amount').value;
    const description = document.getElementById('description').value;
    const category = document.getElementById('category').value;

    const payload = {
        expenseAmount: amount,
        description: description,
        category: category
    };

    try {
        const token = localStorage.getItem('token');
        // POST request to add an expense
        const response = await fetch('/expense', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            loadExpenses(); // Reload the expenses list after adding a new one
        }
    } catch (error) {
        console.error('Error:', error.message);
    }
});

// Function to load and display expenses
async function loadExpenses(page = 1) {
    try {
        const token = localStorage.getItem('token');

        // Retrieve the number of items per page from local storage or set default
        let itemsPerPage = localStorage.getItem('itemsPerPage') || 10;

        const checkPremiumResponse = await fetch('/expense/check-premium', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (checkPremiumResponse.ok) {
            var premiumData = await checkPremiumResponse.json();

            const premiumButton = document.getElementById('buy-premium-btn');
            const leaderboardButton = document.getElementById('show-leaderboard-btn');
            const generateReportButton = document.getElementById('generate-report-btn');
            
            if (premiumData.premium) {
                premiumButton.textContent = 'You are a premium member';
                premiumButton.disabled = true;
                leaderboardButton.style.display = 'block';
                document.getElementById('show-leaderboard-btn').addEventListener('click', loadLeaderboard);
                generateReportButton.style.display = 'block';
                document.getElementById('generate-report-btn').addEventListener('click', function() {
                    window.location.href = '/report.html';
                });
            }
        }

        const response = await fetch(`/expense?page=${page}&limit=${itemsPerPage}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const data = await response.json();

        const expenseList = document.getElementById('expenseList');
        expenseList.innerHTML = ''; 

        data.expenses.forEach(expense => {
            const li = document.createElement('li');
            li.innerHTML = `${expense.expenseAmount} - ${expense.description} - ${expense.category} 
            <button onclick="deleteExpense(${expense.id})">Delete</button>`;
            expenseList.appendChild(li);
        });

        const pagination = document.getElementById('pagination');
        pagination.innerHTML = ''; 

        for (let i = 1; i <= data.totalPages; i++) {
            const button = document.createElement('button');
            button.textContent = i;
            button.disabled = i === data.currentPage;
            button.onclick = () => loadExpenses(i);
            pagination.appendChild(button);
        }

        const leaderboardList = document.getElementById('leaderboardList');
        if (premiumData.premium && leaderboardList.innerHTML !== '') {
            loadLeaderboard();
        }

    } catch (error) {
        console.error('Error:', error);
    }
}

// Store the user’s preference for items per page
document.getElementById('itemsPerPage').addEventListener('change', function() {
    const itemsPerPage = this.value;
    localStorage.setItem('itemsPerPage', itemsPerPage);
    loadExpenses(); // Reload expenses with the new setting
});

async function loadLeaderboard() {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch('/expense/leaderboard', {
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
async function deleteExpense(id) {
    try {
        const token = localStorage.getItem('token'); // Retrieve token from localStorage

        await fetch(`/expense/${id}`, {
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
window.onload = function() {
    const storedItemsPerPage = localStorage.getItem('itemsPerPage') || 10;
    document.getElementById('itemsPerPage').value = storedItemsPerPage;
    loadExpenses();
};
