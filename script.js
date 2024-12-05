const csvUrl = 'https://raw.githubusercontent.com/Sonali0207/esg-analysis-app/main/Untitled spreadsheet - Sheet1.csv'; // Replace this with the actual URL of your CSV file
let companyNames = []; // To store company names
let chartInstance; // Variable to store the chart instance


// Load company names from CSV
async function loadCompanyNames() {
    try {
        const response = await fetch(csvUrl);
        if (!response.ok) throw new Error('Failed to fetch CSV');
        const csvText = await response.text();

        // Parse CSV
        const parsedData = Papa.parse(csvText, { header: true, skipEmptyLines: true });
        companyNames = parsedData.data.map(row => row.Company).filter(Boolean);
    } catch (error) {
        console.error('Failed to load company names:', error);
    }
}

loadCompanyNames(); // Initialize company names on page load

// Fetch and display ESG data
async function fetchESGData() {
    const companyName = document.getElementById('companyName').value.trim();
    try {
        const response = await fetch(csvUrl);
        if (!response.ok) throw new Error('Failed to fetch CSV');
        const csvText = await response.text();

        const parsedData = Papa.parse(csvText, { header: true, skipEmptyLines: true });
        const companyData = parsedData.data.find(row => row.Company.toLowerCase() === companyName.toLowerCase());

        if (!companyData) {
            document.getElementById('esgResult').innerHTML = 'Company not found. Please check the name and try again.';
            return;
        }

        // Display ESG data
        document.getElementById('esgResult').innerHTML = `
            <h3>ESG Score for ${companyData.Company}</h3>
            <p><strong>ESG Score:</strong> ${companyData["ESG Score"]}</p>
            <p><strong>Temperature Score (2050):</strong> ${companyData["Temperature Score (2050)"]}</p>
            <p><strong>Emissions (Scope 1 & 2):</strong> ${companyData["Emissions: Tonnes of CO2e (Scope 1 & 2)"]}</p>
            <p><strong>Emissions (Scope 3):</strong> ${companyData["Emissions: Tonnes of CO2e (Scope 3)"]}</p>
            <p><strong>Market Cap Category:</strong> ${companyData["Market Cap Category"]}</p>
        `;

        renderChart(companyData); // Render chart
    } catch (error) {
        console.error('Error fetching ESG data:', error);
        document.getElementById('esgResult').innerHTML = 'Error fetching data.';
    }
}

// Render chart for ESG data
function renderChart(companyData) {
    if (chartInstance) chartInstance.destroy(); // Clear existing chart

    const ctx = document.getElementById('esgChart').getContext('2d');
    chartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['ESG Score', 'Emissions (Scope 1 & 2)', 'Emissions (Scope 3)'],
            datasets: [{
                label: 'Company ESG Data',
                data: [
                    parseFloat(companyData["ESG Score"]) || 0,
                    parseFloat(companyData["Emissions: Tonnes of CO2e (Scope 1 & 2)"]) || 0,
                    parseFloat(companyData["Emissions: Tonnes of CO2e (Scope 3)"]) || 0
                ],
                backgroundColor: ['#4caf50', '#ff9800', '#f44336'],
                borderColor: ['#388e3c', '#f57c00', '#d32f2f'],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: { beginAtZero: true }
            }
        }
    });

    document.getElementById('chartContainer').style.display = 'block'; // Show chart container
}

// Autocomplete suggestions for company names
const input = document.getElementById('companyName');
const suggestionsBox = document.querySelector('.suggestions');

input.addEventListener('input', function () {
    const inputVal = this.value.toLowerCase();
    suggestionsBox.innerHTML = '';

    if (inputVal) {
        const filteredNames = companyNames.filter(name => name.toLowerCase().startsWith(inputVal));
        if (filteredNames.length > 0) {
            filteredNames.forEach(name => {
                const li = document.createElement('li');
                li.textContent = name;
                li.addEventListener('click', () => {
                    input.value = name;
                    suggestionsBox.innerHTML = '';
                    fetchESGData(); // Fetch ESG data when a name is selected
                });
                suggestionsBox.appendChild(li);
            });
        } else {
            const li = document.createElement('li');
            li.textContent = 'No matching companies found';
            suggestionsBox.appendChild(li);
        }
    }
});
