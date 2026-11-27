// True-Low Friday — filtering, sorting and the shareable hash state.
// A deal is [id, name, category, store, sale, usual, verdict, evidence, source].

export function discountOf(deal) {
  return Math.round((1 - deal[4] / deal[5]) * 100);
}

const VERDICT_RANK = { "true-low": 0, strong: 1, routine: 2 };

export function applyFilters(deals, state) {
  const q = state.q.toLowerCase();
  const kept = deals.filter((deal) => {
    if (state.verdict !== "all" && deal[6] !== state.verdict) return false;
    if (state.category && deal[2] !== state.category) return false;
    if (state.store && deal[3] !== state.store) return false;
    if (discountOf(deal) < state.minDiscount) return false;
    if (q && !(deal[1] + " " + deal[2] + " " + deal[3]).toLowerCase().includes(q)) return false;
    return true;
  });
  const byDiscount = (a, b) => discountOf(b) - discountOf(a) || a[4] - b[4];
  switch (state.sort) {
    case "discount": kept.sort(byDiscount); break;
    case "price-asc": kept.sort((a, b) => a[4] - b[4]); break;
    case "price-desc": kept.sort((a, b) => b[4] - a[4]); break;
    case "name": kept.sort((a, b) => a[1].localeCompare(b[1])); break;
    default: kept.sort((a, b) => VERDICT_RANK[a[6]] - VERDICT_RANK[b[6]] || byDiscount(a, b));
  }
  return kept;
}

export function readHashState() {
  const params = new URLSearchParams(location.hash.slice(1));
  return {
    q: params.get("q") || "",
    category: params.get("cat") || "",
    store: params.get("store") || "",
    minDiscount: Number(params.get("off") || 0),
    sort: params.get("sort") || "verdict",
    verdict: params.get("verdict") || "all",
  };
}

export function writeHashState(state) {
  const params = new URLSearchParams();
  if (state.q) params.set("q", state.q);
  if (state.category) params.set("cat", state.category);
  if (state.store) params.set("store", state.store);
  if (state.minDiscount) params.set("off", String(state.minDiscount));
  if (state.sort !== "verdict") params.set("sort", state.sort);
  if (state.verdict !== "all") params.set("verdict", state.verdict);
  const hash = params.toString();
  history.replaceState(null, "", hash ? "#" + hash : location.pathname);
}
