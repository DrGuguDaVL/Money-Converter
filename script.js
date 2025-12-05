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
};

// Fill dropdowns
const fromSelect = document.getElementById("fromCurrency");
const toSelect = document.getElementById("toCurrency");
const resultBox = document.getElementById("resultBox");
const result = document.getElementById("result");

for (const code in currencies) {
  const o1 = document.createElement("option");
  o1.value = code;
  o1.textContent = `${code} — ${currencies[code]}`;
  fromSelect.appendChild(o1);

  const o2 = o1.cloneNode(true);
  toSelect.appendChild(o2);
}

fromSelect.value = "BRL";
toSelect.value = "UAH";

document.getElementById("convertBtn").addEventListener("click", async () => {
  const amount = parseFloat(document.getElementById("amount").value);
  const from = fromSelect.value;
  const to = toSelect.value;

  if (!amount || amount <= 0) {
    alert("Enter a valid number");
    return;
  }

  try {
    // NEW WORKING API (Frankfurter)
    const url = `https://api.frankfurter.app/latest?amount=${amount}&from=${from}&to=${to}`;
    const res = await fetch(url);
    const data = await res.json();

    console.log(data);

    if (!data.rates || !data.rates[to]) {
      result.innerHTML = "❌ Conversion not available";
      resultBox.classList.remove("hidden");
      return;
    }

    const converted = data.rates[to];

    result.innerHTML = `${amount} ${from} = <strong>${converted.toFixed(2)} ${to}</strong>`;
    resultBox.classList.remove("hidden");

  } catch (err) {
    console.error(err);
    result.innerHTML = "❌ Error contacting API";
    resultBox.classList.remove("hidden");
  }
});
