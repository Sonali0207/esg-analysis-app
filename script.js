const API_KEY = '33KEH1W2QQ2SV961'; // Replace with your actual API key from Alpha Vantage

function fetchESGRating() {
    const companyName = document.getElementById('companyName').value;
    const url = `https://www.alphavantage.co/query?function=ESG&symbol=${companyName}&apikey=${API_KEY}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.Note) {
                document.getElementById('esgResult').innerHTML = 'API limit reached. Please try again later.';
                return;
            }
            if (data.Error) {
                document.getElementById('esgResult').innerHTML = 'Company not found. Please check the ticker symbol.';
                return;
            }
            const esgRating = `
                <h4>ESG Rating for ${companyName}</h4>
                <p>Environmental Score: ${data.environmental_score || 'N/A'}</p>
                <p>Social Score: ${data.social_score || 'N/A'}</p>
                <p>Governance Score: ${data.governance_score || 'N/A'}</p>
            `;
            document.getElementById('esgResult').innerHTML = esgRating;
        })
        .catch(error => {
            console.error('Error fetching ESG data:', error);
            document.getElementById('esgResult').innerHTML = 'Failed to fetch ESG data.';
        });
}

