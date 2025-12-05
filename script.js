// Currency list
const currencies = {
  "USD": "US Dollar",
  "EUR": "Euro",
  "BRL": "Brazilian Real",
  "UAH": "Ukrainian Hryvnia",
  "JPY": "Japanese Yen",
  "GBP": "British Pound",
  "CAD": "Canadian Dollar",
  "AUD": "Australian Dollar",
  "CHF": "Swiss Franc",
  "CNY": "Chinese Yuan",
  "RUB": "Russian Ruble",
};

// Elements
const fromSelect = document.getElementById("fromCurrency");
const toSelect = document.getElementById("toCurrency");
const resultBox = document.getElementById("resultBox");
const result = document.getElementById("result");

// Fill dropdowns
for (const code in currencies) {
  const opt1 = document.createElement("option");
  opt1.value = code;
  opt1.textContent = `${code} — ${currencies[code]}`;
  fromSelect.appendChild(opt1);

  const opt2 = opt1.cloneNode(true);
  toSelect.appendChild(opt2);
}

// Default values
fromSelect.value = "BRL";
toSelect.value = "UAH";

document.getElementById("convertBtn").addEventListener("click", async () => {
  const amount = parseFloat(document.getElementById("amount").value);
  const from = fromSelect.value;
  const to = toSelect.value;

  if (isNaN(amount) || amount <= 0) {
    alert("Enter a valid number.");
    return;
  }

  try {
    // Fetch conversion from API
    const res = await fetch(
      `https://api.exchangerate.host/convert?from=${from}&to=${to}&amount=${amount}`
    );

    const data = await res.json();
    console.log("API Response:", data); // useful for debugging

    // If API failed
    if (!data || !data.result && data.result !== 0) {
      result.innerHTML = "❌ Conversion failed (API returned no result)";
      resultBox.classList.remove("hidden");
      return;
    }

    // SUCCESS — Show result
    result.innerHTML = `
      ${amount} ${from} = 
      <strong>${data.result.toFixed(2)} ${to}</strong>
    `;

    resultBox.classList.remove("hidden");

  } catch (err) {
    console.error(err);
    result.innerHTML = "❌ Error connecting to API.";
    resultBox.classList.remove("hidden");
  }
});
