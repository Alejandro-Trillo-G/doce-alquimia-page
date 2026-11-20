"use strict";

// Ajustes da loja para a apresentação: substitua o número, a taxa e os itens pelos dados reais.
const STORE = {
  whatsapp: "",
  deliveryFee: 8.9,
};

const PRODUCTS = [
  { id: "brownie", name: "Brownie da Lua", category: "bolos", detail: "Brownie intenso de chocolate · caixa com 4", price: 24, art: "🍫", badge: "queridinho", tile: "#e7d6c2", meta: "chocolate · 4 un." },
  { id: "bolo-pote", name: "Bolo de colher", category: "bolos", detail: "Camadas fofinhas com brigadeiro cremoso", price: 18, art: "🍰", badge: "feito hoje", tile: "#d9d2e8", meta: "brigadeiro · 250 ml" },
  { id: "brigadeiros", name: "Trio de estrelas", category: "docinhos", detail: "Brigadeiros artesanais para adoçar o dia", price: 15, art: "🍬", badge: "3 unidades", tile: "#efe2c6", meta: "brigadeiro · 3 un." },
  { id: "cookie", name: "Cookie encantado", category: "docinhos", detail: "Macio por dentro, com gotas de chocolate", price: 12, art: "🍪", badge: "assado na hora", tile: "#ead9ca", meta: "chocolate · 90 g" },
  { id: "caixinha", name: "Caixa de carinho", category: "presentes", detail: "Uma seleção especial para surpreender", price: 48, art: "🎁", badge: "para presentear", tile: "#d9d4e8", meta: "seleção da casa · 8 un." },
  { id: "pao-mel", name: "Pão de mel lunar", category: "docinhos", detail: "Especiarias, doce de leite e chocolate", price: 10, art: "🍯", badge: "feito à mão", tile: "#e9d8c0", meta: "doce de leite · 1 un." },
  { id: "brownie-box", name: "Brownie dos sonhos", category: "presentes", detail: "Caixinha com bilhetinho para alguém especial", price: 38, art: "🧁", badge: "com bilhetinho", tile: "#e3d5d5", meta: "chocolate · 6 un." },
  { id: "cookie-box", name: "Pote de cookies", category: "presentes", detail: "Cookies crocantes em pote para compartilhar", price: 32, art: "🍪", badge: "pote presenteável", tile: "#d6dfcf", meta: "chocolate · 8 un." },
];

const money = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
const $ = (selector) => document.querySelector(selector);
const productGrid = $("#product-grid");
const cartDrawer = $("#cart-drawer");
const cartItems = $("#cart-items");
let activeCategory = "todos";
let cart = loadCart();
let previousFocus = null;

function loadCart() {
  try {
    const saved = JSON.parse(localStorage.getItem("doce-alquimia-cart") || "[]");
    if (!Array.isArray(saved)) return [];
    return saved.filter((item) => PRODUCTS.some((product) => product.id === item.id) && Number.isInteger(item.quantity) && item.quantity > 0 && item.quantity < 100);
  } catch {
    return [];
  }
}

function saveCart() {
  try { localStorage.setItem("doce-alquimia-cart", JSON.stringify(cart)); } catch { /* armazenamento local pode estar indisponível */ }
}

function renderProducts() {
  productGrid.replaceChildren();
  const visible = PRODUCTS.filter((product) => activeCategory === "todos" || product.category === activeCategory);
  visible.forEach((product, index) => {
    const card = document.createElement("article");
    card.className = "product-card";
    card.style.animationDelay = `${Math.min(index * 45, 180)}ms`;

    const visual = document.createElement("div");
    visual.className = "product-visual";
    visual.style.setProperty("--tile", product.tile);
    const badge = document.createElement("span");
    badge.className = "product-badge";
    badge.textContent = product.badge;
    const art = document.createElement("span");
    art.className = "product-art";
    art.setAttribute("aria-hidden", "true");
    art.textContent = product.art;
    visual.append(badge, art);

    const info = document.createElement("div");
    info.className = "product-info";
    const meta = document.createElement("div");
    meta.className = "product-meta";
    meta.textContent = product.meta;
    const titleLine = document.createElement("div");
    titleLine.className = "product-title-line";
    const title = document.createElement("h3");
    title.textContent = product.name;
    const price = document.createElement("span");
    price.className = "product-price";
    price.textContent = money.format(product.price);
    titleLine.append(title, price);
    const detail = document.createElement("p");
    detail.textContent = product.detail;
    const add = document.createElement("button");
    add.type = "button";
    add.className = "add-button";
    add.dataset.add = product.id;
    add.textContent = "Adicionar à sacola  +";
    info.append(meta, titleLine, detail, add);
    card.append(visual, info);
    productGrid.append(card);
  });
}

function getProduct(id) { return PRODUCTS.find((product) => product.id === id); }

function updateCart() {
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  $("#cart-count").textContent = String(itemCount);
  cartItems.replaceChildren();
  $("#empty-cart").hidden = itemCount !== 0;
  $("#checkout-form").hidden = itemCount === 0;

  cart.forEach((item) => {
    const product = getProduct(item.id);
    if (!product) return;
    const row = document.createElement("div");
    row.className = "cart-row";
    const thumb = document.createElement("div");
    thumb.className = "cart-thumb";
    thumb.setAttribute("aria-hidden", "true");
    thumb.textContent = product.art;
    const description = document.createElement("div");
    const name = document.createElement("h3");
    name.textContent = product.name;
    const unit = document.createElement("small");
    unit.textContent = `${money.format(product.price)} cada`;
    const quantity = document.createElement("div");
    quantity.className = "quantity";
    const decrease = document.createElement("button");
    decrease.type = "button";
    decrease.dataset.change = product.id;
    decrease.dataset.delta = "-1";
    decrease.setAttribute("aria-label", `Diminuir ${product.name}`);
    decrease.textContent = "−";
    const amount = document.createElement("span");
    amount.textContent = String(item.quantity);
    const increase = document.createElement("button");
    increase.type = "button";
    increase.dataset.change = product.id;
    increase.dataset.delta = "1";
    increase.setAttribute("aria-label", `Aumentar ${product.name}`);
    increase.textContent = "+";
    const remove = document.createElement("button");
    remove.type = "button";
    remove.dataset.remove = product.id;
    remove.className = "remove-item";
    remove.textContent = "Remover";
    quantity.append(decrease, amount, increase, remove);
    description.append(name, unit, quantity);
    const lineTotal = document.createElement("span");
    lineTotal.className = "cart-row-price";
    lineTotal.textContent = money.format(product.price * item.quantity);
    row.append(thumb, description, lineTotal);
    cartItems.append(row);
  });

  const subtotal = cart.reduce((sum, item) => sum + getProduct(item.id).price * item.quantity, 0);
  $("#fee-value").textContent = money.format(STORE.deliveryFee);
  $("#cart-total").textContent = money.format(subtotal + STORE.deliveryFee);
  saveCart();
}

function addToCart(id) {
  const existing = cart.find((item) => item.id === id);
  if (existing) existing.quantity = Math.min(existing.quantity + 1, 99);
  else cart.push({ id, quantity: 1 });
  updateCart();
  showToast(`${getProduct(id).name} foi para sua sacola ✦`);
}

function changeQuantity(id, delta) {
  const item = cart.find((entry) => entry.id === id);
  if (!item) return;
  item.quantity += delta;
  if (item.quantity < 1) cart = cart.filter((entry) => entry.id !== id);
  updateCart();
}

function openCart() {
  previousFocus = document.activeElement;
  $("#drawer-backdrop").hidden = false;
  cartDrawer.classList.add("open");
  cartDrawer.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
  $("#close-cart").focus();
}

function closeCart() {
  cartDrawer.classList.remove("open");
  cartDrawer.setAttribute("aria-hidden", "true");
  $("#drawer-backdrop").hidden = true;
  document.body.style.overflow = "";
  if (previousFocus && typeof previousFocus.focus === "function") previousFocus.focus();
}

let toastTimer;
function showToast(message) {
  const toast = $("#toast");
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2400);
}

productGrid.addEventListener("click", (event) => {
  const button = event.target.closest("[data-add]");
  if (button) addToCart(button.dataset.add);
});

$(".category-tabs").addEventListener("click", (event) => {
  const button = event.target.closest("[data-category]");
  if (!button) return;
  activeCategory = button.dataset.category;
  document.querySelectorAll(".category-tab").forEach((tab) => tab.classList.toggle("active", tab === button));
  renderProducts();
});

cartItems.addEventListener("click", (event) => {
  const change = event.target.closest("[data-change]");
  const remove = event.target.closest("[data-remove]");
  if (change) changeQuantity(change.dataset.change, Number(change.dataset.delta));
  if (remove) {
    cart = cart.filter((item) => item.id !== remove.dataset.remove);
    updateCart();
  }
});

$("#open-cart").addEventListener("click", openCart);
$("#close-cart").addEventListener("click", closeCart);
$("#drawer-backdrop").addEventListener("click", closeCart);
$("#continue-shopping").addEventListener("click", () => { closeCart(); $("#cardapio").scrollIntoView({ behavior: "smooth" }); });
document.addEventListener("keydown", (event) => { if (event.key === "Escape" && cartDrawer.classList.contains("open")) closeCart(); });

$("#checkout-form").addEventListener("submit", (event) => {
  event.preventDefault();
  if (!cart.length) return;
  if (!/^\d{12,13}$/.test(STORE.whatsapp)) {
    showToast("Configure o WhatsApp da loja no app.js para ativar os pedidos.");
    return;
  }
  const form = event.currentTarget;
  if (!form.reportValidity()) return;
  const name = $("#customer-name").value.trim();
  const address = $("#customer-address").value.trim();
  const subtotal = cart.reduce((sum, item) => sum + getProduct(item.id).price * item.quantity, 0);
  const lines = cart.map((item) => {
    const product = getProduct(item.id);
    return `• ${item.quantity}x ${product.name} — ${money.format(product.price * item.quantity)}`;
  });
  const message = [
    "Olá! Quero fazer este pedido pela Doce Alquimia ✨",
    "",
    ...lines,
    "",
    `Subtotal: ${money.format(subtotal)}`,
    `Taxa de entrega: ${money.format(STORE.deliveryFee)}`,
    `Total: ${money.format(subtotal + STORE.deliveryFee)}`,
    "",
    `Nome: ${name}`,
    `Endereço de entrega: ${address}`,
  ].join("\n");
  const whatsappUrl = `https://wa.me/${STORE.whatsapp}?text=${encodeURIComponent(message)}`;
  window.open(whatsappUrl, "_blank", "noopener,noreferrer");
});

renderProducts();
updateCart();

const scrollSections = document.querySelectorAll("#cardapio, #nossa-magia, #entrega");
const prefersLessMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (!prefersLessMotion && "IntersectionObserver" in window) {
  document.body.classList.add("scroll-effects-ready");
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      entry.target.classList.toggle("is-visible", entry.isIntersecting);
    });
  }, { threshold: 0.08, rootMargin: "0px 0px -8% 0px" });

  scrollSections.forEach((section) => sectionObserver.observe(section));
} else {
  scrollSections.forEach((section) => section.classList.add("is-visible"));
}
