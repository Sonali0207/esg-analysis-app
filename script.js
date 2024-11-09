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

    // Display ESG Score
    document.getElementById('esgResult').innerHTML = `
        <h3>ESG Score for ${companyData.Company}</h3>
        <p>ESG Score: ${companyData["ESG Score"]}</p>
        <button onclick="showDetails('${companyData.Company}')">More Details</button>
    `;
}

// Function to show more details when "More Details" is clicked
window.showDetails = async function(companyName) {
    const response = await fetch(csvUrl);
    const csvText = await response.text();
    const parsedData = Papa.parse(csvText, { header: true, skipEmptyLines: true });

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

// Function to render a chart
window.renderChart = async function(companyName) {
    const response = await fetch(csvUrl);
    const csvText = await response.text();
    const parsedData = Papa.parse(csvText, { header: true, skipEmptyLines: true });

    const details = parsedData.data.find(row => row.Company.toLowerCase() === companyName.toLowerCase());

    // Show the chart container
    document.getElementById('chartContainer').style.display = 'block';
    
    // Get the chart context and render the graph
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

// Function to download the report as PDF
async function downloadPDF() {
    const companyName = document.getElementById('companyName').value;

    if (!companyName) {
        alert("Please enter a company name to download the report.");
        return;
    }

    // Fetch data and find the selected company's data
    const response = await fetch(csvUrl);
    const csvText = await response.text();
    const parsedData = Papa.parse(csvText, { header: true, skipEmptyLines: true });
    const companyData = parsedData.data.find(row => row.Company.toLowerCase() === companyName.toLowerCase());

    if (!companyData) {
        alert("Company data not found. Please check the company name.");
        return;
    }

    // Generate the PDF
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF();

    pdf.setFontSize(16);
    pdf.text(`ESG Report for ${companyData.Company}`, 10, 10);

    pdf.setFontSize(12);
    pdf.text(`ESG Score: ${companyData["ESG Score"]}`, 10, 30);
    pdf.text(`Temperature Score (2050): ${companyData["Temperature Score (2050)"]}`, 10, 40);
    pdf.text(`Emissions (Scope 1 & 2): ${companyData["Emissions: Tonnes of CO2e (Scope 1 & 2)"]}`, 10, 50);
    pdf.text(`Emissions (Scope 3): ${companyData["Emissions: Tonnes of CO2e (Scope 3)"]}`, 10, 60);
    pdf.text(`Market Cap Category: ${companyData["Market Cap Category"]}`, 10, 70);

    pdf.save(`${companyData.Company}_ESG_Report.pdf`);
}

// Function to show suggestions as the user types
function showSuggestions() {
    const companyName = document.getElementById('companyName').value;
    const suggestions = document.getElementById('suggestions');
    if (companyName) {
        suggestions.innerHTML = `<p>Searching for "${companyName}"...</p>`;
        fetchESGData();
    } else {
        suggestions.innerHTML = '';
    }
}
