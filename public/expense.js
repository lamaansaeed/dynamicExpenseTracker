document.getElementById('expenseForm').addEventListener('submit', async function(event) {
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
        // POST request to add an expense
        const response = await fetch('/expense', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
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
async function loadExpenses() {
    try {
        const response = await fetch('/expense');
        const expenses = await response.json();

        const expenseList = document.getElementById('expenseList');
        expenseList.innerHTML = ''; // Clear the list before appending

        expenses.forEach(expense => {
            const li = document.createElement('li');
            li.innerHTML = `${expense.amount} - ${expense.description} - ${expense.category} 
            <button onclick="deleteExpense(${expense.id})">Delete</button>`;
            expenseList.appendChild(li);
        });
    } catch (error) {
        console.error('Error:', error);
    }
}

// Function to delete an expense
async function deleteExpense(id) {
    try {
        await fetch(`/expense/${id}`, {
            method: 'DELETE'
        });
        loadExpenses(); // Reload the list after deletion
    } catch (error) {
        console.error('Error:', error);
    }
}

// Load expenses when the page loads
window.onload = loadExpenses;
