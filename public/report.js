

async function fetchReportData(reportType) {
    console.log(reportType);
    try {
        const response = await fetch(`/report/${reportType}`,{
            method:'GET',
        });
        const data = await response.json();
        //console.log(data);
        return data;
    } catch (error) {
        console.log(error.message);
        return ;
    }
}

function generateReportTable(incomes, expenses) {
    console.log( 'i am the report');
    
    const tableBody = document.getElementById('reportTableBody');
    tableBody.innerHTML = ''; // Clear existing rows

    let totalIncome = 0;
    let totalExpense = 0;

    var combinedData = [...incomes, ...expenses].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
       console.log(combinedData);
    combinedData.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.createdAt}</td>
            <td>${item.description}</td>
            <td>${item.category}</td>
            <td>${item.incomeAmount || '-'}</td>
            <td>${item.expenseAmount || '-'}</td>
        `;
        tableBody.appendChild(row);

        totalIncome += item.incomeAmount || 0;
        totalExpense += item.expenseAmount || 0;
    });

    document.getElementById('totalIncome').textContent = totalIncome;
    document.getElementById('totalExpense').textContent = totalExpense;

    const netAmount = totalIncome - totalExpense;
    const netAmountElement = document.getElementById('netAmount');

    netAmountElement.textContent = netAmount;
    if (netAmount > 0) {
        netAmountElement.className = 'savings';
        netAmountElement.textContent += ' (Savings)';
    } else {
        netAmountElement.className = 'debt';
        netAmountElement.textContent += ' (Debt)';
    }
}

async function generateReport(reportType) {
    const { incomes, expenses } = await fetchReportData(reportType);
    
    generateReportTable(incomes, expenses);
}

document.getElementById('dailyReportBtn').addEventListener('click', () => generateReport('daily'));
document.getElementById('weeklyReportBtn').addEventListener('click', () => generateReport('weekly'));
document.getElementById('monthlyReportBtn').addEventListener('click', () => generateReport('monthly'));
document.getElementById('yearlyReportBtn').addEventListener('click', () => generateReport('yearly'));

// Placeholder for download report functionality
document.getElementById('downloadReportBtn').addEventListener('click', () => {
    alert('Download functionality will be added later.');
});
