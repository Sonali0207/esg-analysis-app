const csvUrl = 'https://raw.githubusercontent.com/Sonali0207/esg-analysis-app/main/Untitled spreadsheet - Sheet1.csv'; // Replace with your CSV file link

async function fetchESGData() {
    const inputCompanyName = document.getElementById('companyName').value.trim().toLowerCase(); // Normalize input

    try {
        const response = await fetch(csvUrl);
        const csvData = await response.text();

        Papa.parse(csvData, {
            header: true,
            skipEmptyLines: true, // Skip any empty rows
            complete: (results) => {
                const data = results.data;

                // Normalize and match company names from CSV
                const companyData = data.find(row => {
                    return row["Company Name"] && row["Company Name"].trim().toLowerCase() === inputCompanyName;
                });

                // Display ESG data or error message
                if (companyData) {
                    const esgRating = `
                        <h4>ESG Rating for ${companyData["Company Name"]}</h4>
                        <p>Environmental Score: ${companyData["Environmental Score"] || 'N/A'}</p>
                        <p>Social Score: ${companyData["Social Score"] || 'N/A'}</p>
                        <p>Governance Score: ${companyData["Governance Score"] || 'N/A'}</p>
                    `;
                    document.getElementById('esgResult').innerHTML = esgRating;
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

