// Link to the raw CSV file on GitHub
const csvUrl = 'https://raw.githubusercontent.com/Sonali0207/esg-analysis-app/main/United spreadsheet-Sheet1.csv'; // Replace with your GitHub CSV link

// Function to fetch and display ESG data
async function fetchESGData() {
    const companyName = document.getElementById('companyName').value.trim().toLowerCase();

    try {
        const response = await fetch(csvUrl);
        const csvData = await response.text();

        Papa.parse(csvData, {
            header: true,
            complete: (results) => {
                const data = results.data;

                // Find the company's ESG data by name (assuming your CSV has "Company Name" column)
                const companyData = data.find(row => row["Company Name"] && row["Company Name"].toLowerCase() === companyName);

                // Check if the company was found in the data
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
