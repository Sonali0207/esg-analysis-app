const csvUrl = 'https://raw.githubusercontent.com/Sonali0207/esg-analysis-app/main/Untitled spreadsheet - Sheet1.csv'; // Replace this with the actual URL of your CSV file

let companyNames = []; // To store company names once loaded
let chartInstance; // Variable to store the chart instance

// Function to load company names from CSV on page load
async function loadCompanyNames() {
    const response = await fetch(csvUrl);
    const csvText = await response.text();

    // Parse the CSV
    const parsedData = Papa.parse(csvText, { header: true, skipEmptyLines: true });

    // Extract the company names into an array
    companyNames = parsedData.data.map(row => row.Company).filter(Boolean);
}

loadCompanyNames(); // Call function to load company names

// Function to fetch and parse ESG data
async function fetchESGData() {
    const companyName = document.getElementById('companyName').value;

    // Fetch the CSV file
    const response = await fetch(csvUrl);
    const csvText = await response.text();

    // Parse CSV using PapaParse
    const parsedData = Papa.parse(csvText, { header: true, skipEmptyLines: true });

    // Find the company data from the parsed CSV
    const companyData = parsedData.data.find(row => row.Company.toLowerCase() === companyName.toLowerCase());

    if (!companyData) {
        document.getElementById('esgResult').innerHTML = 'Company not found. Please check the name and try again.';
        return;
    }

    // Display ESG Score and show details button
    document.getElementById('esgResult').innerHTML = `
        <h3>ESG Score for ${companyData.Company}</h3>
        <p>ESG Score: ${companyData["ESG Score"]}</p>
        <button onclick="showDetails('${companyData.Company}')">More Details</button>
    `;

    // Function to show more details when "More Details" is clicked
    window.showDetails = function(companyName) {
        const details = parsedData.data.find(row => row.Company.toLowerCase() === companyName.toLowerCase());
        document.getElementById('esgResult').innerHTML = `
            <h3>Details for ${details.Company}</h3>
            <p><strong>Temperature Score (2050):</strong> ${details["Temperature Score (2050)"]}</p>
            <p><strong>Emissions (Scope 1 & 2):</strong> ${details["Emissions: Tonnes of CO2e (Scope 1 & 2)"]}</p>
            <p><strong>Emissions (Scope 3):</strong> ${details["Emissions: Tonnes of CO2e (Scope 3)"]}</p>
            <p><strong>Market Cap Category:</strong> ${details["Market Cap Category"]}</p>
            <button id="showGraphBtn" onclick="renderChart('${details.Company}')">Show Graph</button>
        `;
    };

    // Function to render a chart
    window.renderChart = function(companyName) {
        const details = parsedData.data.find(row => row.Company.toLowerCase() === companyName.toLowerCase());

        // Hide the "Show Graph" button after it's clicked
        document.getElementById('showGraphBtn').style.display = 'none';

        // Clear any existing chart instance
        if (chartInstance) {
            chartInstance.destroy();
        }

        // Show the chart container
        document.getElementById('chartContainer').style.display = 'block';

        // Get the chart context and render the graph
        const ctx = document.getElementById('esgChart').getContext('2d');
        chartInstance = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['ESG Score', 'Emissions (Scope 1 & 2)', 'Emissions (Scope 3)'],
                datasets: [{
                    label: 'Company ESG Data',
                    data: [
                        parseFloat(details["ESG Score"]),
                        parseFloat(details["Emissions: Tonnes of CO2e (Scope 1 & 2)"]),
                        parseFloat(details["Emissions: Tonnes of CO2e (Scope 3)"])
                    ],
                    backgroundColor: ['#4caf50', '#ff9800', '#f44336'],
                    borderColor: ['#388e3c', '#f57c00', '#d32f2f'],
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: { beginAtZero: true }
                }
            }
        });
    };
}

// Autocomplete suggestions for company names
const input = document.getElementById('companyName');
const suggestionsBox = document.createElement('ul');
suggestionsBox.className = 'suggestions-list';
document.querySelector('.suggestions').appendChild(suggestionsBox);

input.addEventListener('input', function() {
    const inputVal = this.value.toLowerCase();
    suggestionsBox.innerHTML = ''; // Clear previous suggestions

    if (inputVal) {
        // Filter names to only include those that start with the input value
        const filteredNames = companyNames.filter(name => name.toLowerCase().startsWith(inputVal));
        filteredNames.forEach(name => {
            const suggestionItem = document.createElement('li');
            suggestionItem.textContent = name;
            suggestionItem.addEventListener('click', () => {
                input.value = name;
                suggestionsBox.innerHTML = ''; // Clear suggestions
            });
            suggestionsBox.appendChild(suggestionItem);
        });
    }
});
