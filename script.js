const el = id => document.getElementById(id);

const amountInput = el("amount");
const baseSelect = el("base");
const targetSelect = el("target");
const convertBtn = el("convert");
const swapBtn = el("swap");
const reverseBtn = el("reverse");
const resultBox = el("result");
const convertedText = el("converted");
const rateInfo = el("rateInfo");
const errorBox = el("error");
const cacheNote = el("cacheNote");

const API = "https://api.exchangerate.host";
const CACHE_KEY = "fx_cache";

// Number formatter
function fmt(n) {
  return new Intl.NumberFormat(undefined, { maximumFractionDigits: 6 }).format(n);
}

// Cache helpers
function saveCache(key, data) {
  localStorage.setItem(CACHE_KEY + "_" + key, JSON.stringify({ ts: Date.now(), data }));
}

function loadCache(key, maxAge) {
  const raw = localStorage.getItem(CACHE_KEY + "_" + key);
  if (!raw) return null;
  const obj = JSON.parse(raw);
  if (Date.now() - obj.ts > maxAge) return null;
  return obj.data;
}

// Fetch wrapper
async function fetchJSON(path) {
  const r = await fetch(API + path);
  if (!r.ok) throw new Error("Network error");
  return r.json();
}

// Load currency list
async function loadSymbols() {
  const cached = loadCache("symbols", 86400000);
  if (cached) return cached;

  const json = await fetchJSON("/symbols");
  saveCache("symbols", json.symbols);
  return json.symbols;
}

// Fill dropdowns
function populateSelects(symbols) {
  const entries = Object.entries(symbols).sort((a, b) => a[0].localeCompare(b[0]));

  for (const [code, info] of entries) {
    let o1 = document.createElement("option");
    o1.value = code;
    o1.textContent = `${code} — ${info.description}`;
    baseSelect.appendChild(o1);

    let o2 = document.createElement("option");
    o2.value = code;
    o2.textContent = `${code} — ${info.description}`;
    targetSelect.appendChild(o2);
  }

  baseSelect.value = "USD";
  targetSelect.value = "BRL";
}

function showError(msg) {
  errorBox.textContent = msg;
  errorBox.style.display = "block";
}

function hideError() {
  errorBox.style.display = "none";
}

// Convert
async function convert() {
  hideError();

  const amount = parseFloat(amountInput.value);
  const from = baseSelect.value;
  const to = targetSelect.value;

  if (!isFinite(amount) || amount < 0) {
    return showError("Enter a valid amount.");
  }

  const cacheKey = `rate_${from}_${to}`;
  let rateData = loadCache(cacheKey, 300000); // 5 minutes

  if (!rateData) {
    try {
      const json = await fetchJSON(`/latest?base=${from}&symbols=${to}`);
      rateData = { rate: json.rates[to], date: json.date };
      saveCache(cacheKey, rateData);
      cacheNote.textContent = "";
    } catch (err) {
      return showError("Failed to load exchange rate.");
    }
  } else {
    cacheNote.textContent = "Using cached rate.";
  }

  const converted = amount * rateData.rate;

  convertedText.innerHTML = `${fmt(amount)} <strong>${from}</strong> = <strong>${fmt(converted)}</strong> ${to}`;
  rateInfo.textContent = `1 ${from} = ${fmt(rateData.rate)} ${to} (date: ${rateData.date})`;

  resultBox.style.display = "block";
}

// Events
convertBtn.addEventListener("click", convert);
amountInput.addEventListener("keydown", e => {
  if (e.key === "Enter") convert();
});

swapBtn.addEventListener("click", () => {
  const temp = baseSelect.value;
  baseSelect.value = targetSelect.value;
  targetSelect.value = temp;
  convert();
});

reverseBtn.addEventListener("click", () => {
  const temp = baseSelect.value;
  baseSelect.value = targetSelect.value;
  targetSelect.value = temp;
});

// Initialize
(async function init() {
  try {
    const symbols = await loadSymbols();
    populateSelects(symbols);
  } catch {
    showError("Failed to load currency list.");
  }
})();
