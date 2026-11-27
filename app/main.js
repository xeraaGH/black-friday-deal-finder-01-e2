// True-Low Friday — page wiring: reads the hash for a starting view, renders the
// stats, the compare table and the deal grid, and re-renders when filters change.
import { DEALS, STORES, SWEEP, COMPARE } from "./data.js";
import { applyFilters, readHashState, writeHashState } from "./filters.js";
import { renderCompare } from "./compare.js";

const grid = document.getElementById("dealGrid");
const resultCount = document.getElementById("resultCount");
const emptyNote = document.getElementById("emptyNote");
const searchInput = document.getElementById("searchInput");
const categorySelect = document.getElementById("categorySelect");
const storeSelect = document.getElementById("storeSelect");
const discountSelect = document.getElementById("discountSelect");
const sortSelect = document.getElementById("sortSelect");
const verdictChips = document.getElementById("verdictChips");

export const VERDICT_LABELS = {
  "true-low": "True low",
  strong: "Strong price",
  routine: "Routine sale",
};

export function discountOf(deal) {
  return Math.round((1 - deal[4] / deal[5]) * 100);
}

export function money(n) {
  return "$" + n.toLocaleString("en-US", { minimumFractionDigits: n % 1 ? 2 : 0, maximumFractionDigits: 2 });
}

function dealCard(deal) {
  const [, name, category, store, sale, usual, verdict, evidence, source] = deal;
  const article = document.createElement("article");
  article.className = "deal";
  article.innerHTML = `
    <div class="deal-top"><span class="deal-cat"></span><span class="badge badge-${verdict}"></span></div>
    <h3></h3>
    <p class="deal-store"></p>
    <p class="prices"><span class="sale"></span><span class="was"></span><span class="off"></span></p>
    <p class="evidence"></p>
    <p class="meta"></p>
    <a class="shop-btn" target="_blank" rel="noopener">Shop at ${store} &rarr;</a>`;
  article.querySelector(".deal-cat").textContent = category;
  article.querySelector(".badge").textContent = VERDICT_LABELS[verdict];
  article.querySelector("h3").textContent = name;
  article.querySelector(".deal-store").textContent = store;
  article.querySelector(".sale").textContent = money(sale);
  article.querySelector(".was").textContent = money(usual);
  article.querySelector(".off").textContent = discountOf(deal) + "% off";
  article.querySelector(".evidence").textContent = evidence + ".";
  article.querySelector(".meta").textContent = `Checked ${SWEEP.checked} · Source: ${source}`;
  article.querySelector(".shop-btn").href = STORES[store];
  return article;
}

function renderStats() {
  const trueLows = DEALS.filter((d) => d[6] === "true-low").length;
  const categories = new Set(DEALS.map((d) => d[2])).size;
  const stores = new Set(DEALS.map((d) => d[3])).size;
  const avg = Math.round(DEALS.reduce((s, d) => s + discountOf(d), 0) / DEALS.length);
  const best = Math.max(...DEALS.map((d) => discountOf(d)));
  document.getElementById("stats").innerHTML = `
    <div class="stat hot"><b>${trueLows}</b><span>true-low deals</span></div>
    <div class="stat"><b>${DEALS.length}</b><span>deals checked</span></div>
    <div class="stat"><b>${categories}</b><span>categories</span></div>
    <div class="stat"><b>${stores}</b><span>stores</span></div>
    <div class="stat"><b>${avg}%</b><span>average discount (best ${best}%)</span></div>`;
}

function fillSelect(select, values, allLabel) {
  select.innerHTML = `<option value="">${allLabel}</option>` +
    values.map((v) => `<option value="${v}">${v}</option>`).join("");
}

function currentState() {
  return {
    q: searchInput.value.trim(),
    category: categorySelect.value,
    store: storeSelect.value,
    minDiscount: Number(discountSelect.value),
    sort: sortSelect.value,
    verdict: verdictChips.querySelector(".chip.active").dataset.verdict,
  };
}

function render() {
  const state = currentState();
  const shown = applyFilters(DEALS, state);
  grid.replaceChildren(...shown.map(dealCard));
  emptyNote.hidden = shown.length > 0;
  resultCount.textContent = shown.length === DEALS.length
    ? `Showing all ${DEALS.length} deals, true lows first.`
    : `Showing ${shown.length} of ${DEALS.length} deals.`;
  writeHashState(state);
}

function applyStateToControls(state) {
  searchInput.value = state.q;
  categorySelect.value = state.category;
  storeSelect.value = state.store;
  discountSelect.value = String(state.minDiscount);
  sortSelect.value = state.sort;
  verdictChips.querySelectorAll(".chip").forEach((chip) => {
    chip.classList.toggle("active", chip.dataset.verdict === state.verdict);
  });
}

fillSelect(categorySelect, [...new Set(DEALS.map((d) => d[2]))].sort(), "All categories");
fillSelect(storeSelect, [...new Set(DEALS.map((d) => d[3]))].sort(), "All stores");
document.getElementById("dealCount").textContent = DEALS.length;
document.getElementById("sweepTime").textContent = SWEEP.checked;

applyStateToControls(readHashState());
renderStats();
renderCompare(document.getElementById("compareTable"), COMPARE, money);
render();

for (const el of [searchInput, categorySelect, storeSelect, discountSelect, sortSelect]) {
  el.addEventListener("input", render);
}
verdictChips.addEventListener("click", (event) => {
  const chip = event.target.closest(".chip");
  if (!chip) return;
  verdictChips.querySelectorAll(".chip").forEach((c) => c.classList.toggle("active", c === chip));
  render();
});
window.addEventListener("hashchange", () => {
  applyStateToControls(readHashState());
  render();
});
