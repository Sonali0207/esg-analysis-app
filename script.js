const csvUrl = 'https://raw.githubusercontent.com/Sonali0207/esg-analysis-app/main/Untitled spreadsheet - Sheet1.csv'; // Replace with your actual CSV URL

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
