const csvUrl = 'https://raw.githubusercontent.com/Sonali0207/esg-analysis-app/main/Untitled spreadsheet - Sheet1.csv'; // Replace with your actual CSV URL

let chart;  // To keep track of the chart instance for updates

async function fetchESGData() {
    const inputCompanyName = document.getElementById('companyName').value.trim().toLowerCase();

    try {
        const response = await fetch(csvUrl);
        const csvData = await response.text();

        Papa.parse(csvData, {
            header: true,
            skipEmptyLines: true,
            complete: (results) => {
                const data = results.data;

                // Find the company data by matching the company name
                const companyData = data.find(row => row["Company"] && row["Company"].trim().toLowerCase() === inputCompanyName);

                if (companyData) {
                    // Display ESG Score only initially
                    const esgScore = `
                        <h4>ESG Information for ${companyData["Company"]}</h4>
                        <p><strong>ESG Score:</strong> ${companyData["ESG Score"] || 'N/A'}</p>
                        <button onclick="showMoreDetails()">More Details</button>
                        <div id="moreDetails" style="display: none;">
                            <p><strong>Rank:</strong> ${companyData["Rank"] || 'N/A'}</p>
                            <p><strong>Region:</strong> ${companyData["Region"] || 'N/A'}</p>
                            <p><strong>Country:</strong> ${companyData["Country"] || 'N/A'}</p>
                            <p><strong>Sector:</strong> ${companyData["Sector"] || 'N/A'}</p>
                            <p><strong>Industry:</strong> ${companyData["Industry"] || 'N/A'}</p>
                            <p><strong>Temperature Score (2050):</strong> ${companyData["Temperature Score (2050)"] || 'N/A'}</p>
                            <p><strong>Emissions (Scope 1 & 2):</strong> ${companyData["Emissions: Tonnes of CO2e (Scope 1 & 2)"] || 'N/A'}</p>
                            <p><strong>Emissions (Scope 3):</strong> ${companyData["Emissions: Tonnes of CO2e (Scope 3)"] || 'N/A'}</p>
                            <p><strong>Market Cap Category:</strong> ${companyData["Market Cap Category"] || 'N/A'}</p>
                        </div>
                    `;
                    document.getElementById('esgResult').innerHTML = esgScore;

                    // Plot data using Chart.js
                    plotESGChart(companyData);
                } else {
                    document.getElementById('esgResult').innerHTML = 'Company not found in the data.';
                }
            },
            error: (error) => {
                console.error('Error parsing CSV data:', error);
                document.getElementById('esgResult').innerHTML = 'Failed to load ESG data.';
            }
        });
    } catch (error) {
        console.error('Error fetching ESG data:', error);
        document.getElementById('esgResult').innerHTML = 'Failed to fetch ESG data.';
    }
}

// Function to display more details on button click
function showMoreDetails() {
    document.getElementById('moreDetails').style.display = 'block';
}

// Function to plot the ESG data as a chart
function plotESGChart(companyData) {
    const esgScore = parseFloat(companyData["ESG Score"]) || 0;
    const temperatureScore = parseFloat(companyData["Temperature Score (2050)"]) || 0;
    const emissionsScope1And2 = parseFloat(companyData["Emissions: Tonnes of CO2e (Scope 1 & 2)"]) || 0;
    const emissionsScope3 = parseFloat(companyData["Emissions: Tonnes of CO2e (Scope 3)"]) || 0;

    // Destroy the existing chart instance if it exists
    if (chart) chart.destroy();

    // Create the chart
    const ctx = document.getElementById('esgChart').getContext('2d');
    chart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['ESG Score', 'Temperature Score', 'Emissions Scope 1 & 2', 'Emissions Scope 3'],
            datasets: [{
                label: companyData["Company"],
                data: [esgScore, temperatureScore, emissionsScope1And2, emissionsScope3],
                backgroundColor: [
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)'
                ],
                borderColor: [
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 99, 132, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}
