function calculateESG() {
    const environmental = parseFloat(document.getElementById("environmental").value);
    const social = parseFloat(document.getElementById("social").value);
    const governance = parseFloat(document.getElementById("governance").value);

    if (isNaN(environmental) || isNaN(social) || isNaN(governance)) {
        alert("Please enter valid numbers for all scores.");
        return;
    }

    const esgScore = ((environmental + social + governance) / 3).toFixed(2);
    document.getElementById("esg-score").textContent = `The ESG Score is: ${esgScore}`;
}
