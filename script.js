const csvUrl = 'https://raw.githubusercontent.com/Sonali0207/esg-analysis-app/main/Untitled spreadsheet - Sheet1.csv'; // Replace this with the actual URL of your CSV file
let companyNames = [];  // Array to hold company names

// Function to fetch CSV data and store company names
async function loadCompanyNames() {
    const response = await fetch(csvUrl);
    const csvText = await response.text();

    // Parse CSV to get company names
    const parsedData = Papa.parse(csvText, {
        header: true,
        skipEmptyLines: true
    });

    // Populate companyNames array
    companyNames = parsedData.data.map(row => row.Company);
}

// Call the function to load company names when the page loads
loadCompanyNames();

// Function to show suggestions based on input
function showSuggestions() {
    const input = document.getElementById('companyName').value.toLowerCase();
    const suggestionsBox = document.getElementById('suggestions');
    suggestionsBox.innerHTML = ''; // Clear previous suggestions

    if (input.length === 0) {
        suggestionsBox.style.display = 'none';
        return;
    }

    const matchedCompanies = companyNames.filter(name => name.toLowerCase().includes(input)).slice(0, 5); // Show up to 5 suggestions

    // Display matching suggestions
    matchedCompanies.forEach(company => {
        const div = document.createElement('div');
        div.className = 'suggestion-item';
        div.textContent = company;
        div.onclick = () => selectCompany(company);
        suggestionsBox.appendChild(div);
    });

    suggestionsBox.style.display = 'block';
}

// Function to select a suggestion and fill in the input field
function selectCompany(companyName) {
    document.getElementById('companyName').value = companyName;
    document.getElementById('suggestions').style.display = 'none';
}

// Function to fetch ESG data (existing code, with no changes needed here)
async function fetchESGData() {
    const companyName = document.getElementById('companyName').value;

    const response = await fetch(csvUrl);
    const csvText = await response.text();

    const parsedData = Papa.parse(csvText, {
        header: true,
        skipEmptyLines: true
    });

    const companyData = parsedData.data.find(row => row.Company.toLowerCase() === companyName.toLowerCase());

    if (!companyData) {
        document.getElementById('esgResult').innerHTML = 'Company not found. Please check the name and try again.';
        return;
    }

    document.getElementById('esgResult').innerHTML = `
        <h3>ESG Score for ${companyData.Company}</h3>
        <p>ESG Score: ${companyData["ESG Score"]}</p>
        <button onclick="showDetails('${companyData.Company}')">More Details</button>
    `;

    window.showDetails = function(companyName) {
        const details = parsedData.data.find(row => row.Company.toLowerCase() === companyName.toLowerCase());
        document.getElementById('esgResult').innerHTML = `
            <h3>Details for ${details.Company}</h3>
            <p><strong>Temperature Score (2050):</strong> ${details["Temperature Score (2050)"]}</p>
            <p><strong>Emissions (Scope 1 & 2):</strong> ${details["Emissions: Tonnes of CO2e (Scope 1 & 2)"]}</p>
            <p><strong>Emissions (Scope 3):</strong> ${details["Emissions: Tonnes of CO2e (Scope 3)"]}</p>
            <p><strong>Market Cap Category:</strong> ${details["Market Cap Category"]}</p>
            <button onclick="renderChart('${details.Company}')">Show Graph</button>
        `;
    };

    window.renderChart = function(companyName) {
        const details = parsedData.data.find(row => row.Company.toLowerCase() === companyName.toLowerCase());

        document.getElementById('chartContainer').style.display = 'block';
        
        const ctx = document.getElementById('esgChart').getContext('2d');
        new Chart(ctx, {
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
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    };
}
