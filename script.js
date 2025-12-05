// Built-in currency list with full names
const currencies = {
    "USD": "US Dollar",
    "EUR": "Euro",
    "BRL": "Brazilian Real",
    "GBP": "British Pound",
    "JPY": "Japanese Yen",
    "AUD": "Australian Dollar",
    "CAD": "Canadian Dollar",
    "CHF": "Swiss Franc",
    "CNY": "Chinese Yuan",
    "RUB": "Russian Ruble",
    "UAH": "Ukrainian Hryvnia",
    "PLN": "Polish Zloty",
    "MXN": "Mexican Peso",
    "ARS": "Argentine Peso",
    "CLP": "Chilean Peso",
    "ZAR": "South African Rand",
    "NZD": "New Zealand Dollar",
    "INR": "Indian Rupee",
    "KRW": "South Korean Won",
    "SEK": "Swedish Krona",
    "NOK": "Norwegian Krone",
    "DKK": "Danish Krone",
    "TRY": "Turkish Lira"
};

// Populate selects
const fromSelect = document.getElementById("fromCurrency");
const toSelect = document.getElementById("toCurrency");

for (const code in currencies) {
    const option1 = document.createElement("option");
    option1.value = code;
    option1.textContent = `${code} — ${currencies[code]}`;

    const option2 = option1.cloneNode(true);

    fromSelect.appendChild(option1);
    toSelect.appendChild(option2);
}

// Default values
fromSelect.value = "USD";
toSelect.value = "BRL";

// Convert
document.getElementById("convertBtn").addEventListener("click", async () => {
    const amount = parseFloat(document.getElementById("amount").value);
    const from = fromSelect.value;
    const to = toSelect.value;

    if (isNaN(amount) || amount <= 0) {
        alert("Enter a valid amount");
        return;
    }

    // Fetch exchange rate
    const res = await fetch(`https://api.exchangerate.host/convert?from=${from}&to=${to}`);
    const data = await res.json();

    const result = amount * data.info.rate;

    document.getElementById("result").innerHTML =
        `${amount} ${from} = <strong>${result.toFixed(2)} ${to}</strong>`;

    document.getElementById("resultBox").classList.remove("hidden");
});
