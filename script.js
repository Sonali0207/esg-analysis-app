const API_KEY = '33KEH1W2QQ2SV961'; // Replace with your actual API key from Alpha Vantage

async function fetchESGData() {
    const companyName = document.getElementById('companyName').value;
    const url = `https://www.alphavantage.co/query?function=ESG&symbol=${companyName}&apikey=${API_KEY}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.Note) {
            document.getElementById('esgResult').innerHTML = 'API limit reached. Please try again later.';
            return;
        }

        if (data["Error Message"]) {
            document.getElementById('esgResult').innerHTML = 'Company not found. Please check the ticker symbol.';
            return;
        }

        if (!data.symbol) {
            document.getElementById('esgResult').innerHTML = 'No ESG data available for the specified company.';
            return;
        }

        const esgRating = `
            <h4>ESG Rating for ${companyName}</h4>
            <p>Environmental Score: ${data.environmentalScore || 'N/A'}</p>
            <p>Social Score: ${data.socialScore || 'N/A'}</p>
            <p>Governance Score: ${data.governanceScore || 'N/A'}</p>
        `;
        document.getElementById('esgResult').innerHTML = esgRating;

    } catch (error) {
        console.error('Error fetching ESG data:', error);
        document.getElementById('esgResult').innerHTML = 'Failed to fetch ESG data.';
    }
}
