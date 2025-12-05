const currencies = {
  "USD": "US Dollar",
  "EUR": "Euro",
  "BRL": "Brazilian Real",
  "UAH": "Ukrainian Hryvnia",
  "JPY": "Japanese Yen",
  "GBP": "British Pound"
};

const fromSelect = document.getElementById("fromCurrency");
const toSelect = document.getElementById("toCurrency");
const btn = document.getElementById("convertBtn");
const resultBox = document.getElementById("resultBox");
const resultP = document.getElementById("result");

// Populate dropdowns
for (const code in currencies) {
  const opt1 = document.createElement("option");
  opt1.value = code;
  opt1.textContent = `${code} — ${currencies[code]}`;
  fromSelect.appendChild(opt1);

  const opt2 = opt1.cloneNode(true);
  toSelect.appendChild(opt2);
}

fromSelect.value = "USD";
toSelect.value = "BRL";

// Convert button
btn.addEventListener("click", async () => {
  const amount = parseFloat(document.getElementById("amount").value);
  const from = fromSelect.value;
  const to = toSelect.value;

  if (!amount || amount <= 0) {
    alert("Enter a valid amount");
    return;
  }

  try {
    const res = await fetch(
      `https://api.exchangerate.host/convert?from=${from}&to=${to}&amount=${amount}`
    );
    const data = await res.json();

    // The correct field is: data.result
    if (data.result == null) {
      resultP.textContent = "Conversion failed.";
    } else {
      resultP.innerHTML = `${amount} ${from} = <strong>${data.result.toFixed(2)} ${to}</strong>`;
    }

    resultBox.classList.remove("hidden");

  } catch (err) {
    alert("Network or API error.");
    console.error(err);
  }
});
