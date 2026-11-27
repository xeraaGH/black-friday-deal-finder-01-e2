// True-Low Friday — the "same product, several stores" comparison table.
// COMPARE is [{ name, prices: [[store, price], ...] }]; the cheapest price wins.

export function renderCompare(container, compare, money) {
  const wrap = document.createElement("div");
  wrap.className = "compare-grid";
  for (const item of compare) {
    const cheapest = Math.min(...item.prices.map(([, price]) => price));
    const card = document.createElement("div");
    card.className = "compare-card";
    const heading = document.createElement("h3");
    heading.textContent = item.name;
    card.append(heading);
    for (const [store, price] of [...item.prices].sort((a, b) => a[1] - b[1])) {
      const row = document.createElement("div");
      row.className = "compare-row";
      const storeEl = document.createElement("span");
      storeEl.textContent = store;
      const priceEl = document.createElement("span");
      priceEl.textContent = money(price);
      if (price === cheapest) priceEl.className = "best";
      row.append(storeEl, priceEl);
      card.append(row);
    }
    wrap.append(card);
  }
  container.replaceChildren(wrap);
}
