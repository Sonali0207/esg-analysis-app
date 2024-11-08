const csvUrl = 'https://raw.githubusercontent.com/Sonali0207/esg-analysis-app/main/Untitled spreadsheet - Sheet1.csv'; // Replace this with the actual URL of your CSV file

// Function to fetch and parse CSV data
async function fetchESGData() {
    const companyName = document.getElementById('companyName').value;

    // Fetch the CSV file
    const response = await fetch(csvUrl);
    const csvText = await response.text();

    // Parse CSV using PapaParse
    const parsedData = Papa.parse(csvText, {
        header: true,
        skipEmptyLines: true
    });

    // Find the company data from the parsed CSV
    const companyData = parsedData.data.find(row => row.Company.toLowerCase() === companyName.toLowerCase());

    if (!companyData) {
        document.getElementById('esgResult').innerHTML = 'Company not found. Please check the name and try again.';
        return;
    }

    // Display ESG Score and show the details with the graph immediately
    document.getElementById('esgResult').innerHTML = `
        <h3>ESG Score for ${companyData.Company}</h3>
        <p><strong>ESG Score:</strong> ${companyData["ESG Score"]}</p>
        <p><strong>Temperature Score (2050):</strong> ${companyData["Temperature Score (2050)"]}</p>
        <p><strong>Emissions (Scope 1 & 2):</strong> ${companyData["Emissions: Tonnes of CO2e (Scope 1 & 2)"]}</p>
        <p><strong>Emissions (Scope 3):</strong> ${companyData["Emissions: Tonnes of CO2e (Scope 3)"]}</p>
        <p><strong>Market Cap Category:</strong> ${companyData["Market Cap Category"]}</p>
    `;

    renderChart(companyData);  // Automatically show the graph after displaying the details
}

// Function to render a chart
function renderChart(companyData) {
    // Show the chart container
    document.getElementById('chartContainer').style.display = 'block';

    // Get the chart context and render the graph
    const ctx = document.getElementById('esgChart').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['ESG Score', 'Emissions (Scope 1 & 2)', 'Emissions (Scope 3)'],
            datasets: [{
                label: `${companyData.Company} ESG Data`,
                data: [
                    parseFloat(companyData["ESG Score"]),
                    parseFloat(companyData["Emissions: Tonnes of CO2e (Scope 1 & 2)"]),
                    parseFloat(companyData["Emissions: Tonnes of CO2e (Scope 3)"])
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
}
