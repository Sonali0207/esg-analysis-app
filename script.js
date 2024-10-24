async function calculateESG() {
    const companyName = document.getElementById('company-name').value;

    try {
        // Replace with your actual API endpoint and key
        const response = await fetch(``https://finnhub.io/api/v1/stock/esg?symbol=${companyName}&token=${csd7hb9r01qi0n6el2lgcsd7hb9r01qi0n6el2m0}`;`);

        // Check if the response is okay
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();

        // Assuming the API returns the ESG scores in the following format
        const environmentalScore = data.environmental; // Adjust according to the API response
        const socialScore = data.social; // Adjust according to the API response
        const governanceScore = data.governance; // Adjust according to the API response

        // Calculate overall ESG rating
        const esgRating = ((environmentalScore + socialScore + governanceScore) / 3).toFixed(2);

        // Display results
        document.getElementById('esg-result').innerHTML = `
            <h3>ESG Rating for ${companyName}: ${esgRating}</h3>
            <p><strong>Environmental Score:</strong> ${environmentalScore}</p>
            <p><strong>Social Score:</strong> ${socialScore}</p>
            <p><strong>Governance Score:</strong> ${governanceScore}</p>
        `;

    } catch (error) {
        document.getElementById('esg-result').innerHTML = `
            <p>Error fetching ESG data: ${error.message}</p>
        `;
    }

    // Clear the input field
    document.getElementById('company-name').value = '';
}

