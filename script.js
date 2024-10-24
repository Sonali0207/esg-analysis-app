async function getEsgRating() {
    const apiKey = 'csd5a1pr01qi0n6ek9r0csd5a1pr01qi0n6ek9rg'; // Replace with your actual Finnhub API key
    const companyName = document.getElementById('companyName').value;

    if (!companyName) {
        alert('Please enter a company ticker.');
        return;
    }

    try {
        const response = await fetch(`https://finnhub.io/api/v1/stock/esg?symbol=${companyName}&token=${csd5a1pr01qi0n6ek9r0csd5a1pr01qi0n6ek9rg}`);

        if (!response.ok) {
            const error = await response.json();
            throw new Error(`Error: ${error.message}`);
        }

        const data = await response.json();
        // Display ESG data
        if (data && data.esgRating) {
            document.getElementById('esgData').innerHTML = `
                <p><strong>ESG Rating for ${companyName.toUpperCase()}:</strong> ${data.esgRating}</p>
                <p><strong>Environmental Score:</strong> ${data.environmentalScore}</p>
                <p><strong>Social Score:</strong> ${data.socialScore}</p>
                <p><strong>Governance Score:</strong> ${data.governanceScore}</p>
            `;
        } else {
            document.getElementById('esgData').innerHTML = 'No ESG data found for this company.';
        }
    } catch (error) {
        document.getElementById('esgData').innerHTML = `Error fetching ESG data: ${error.message}`;
    }
}
