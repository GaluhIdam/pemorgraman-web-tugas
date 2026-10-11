"use strict";

const $ = (selector, context = document) => context.querySelector(selector);

const $$ = (selector, context = document) => [
  ...context.querySelectorAll(selector),
];

const formatNumber = (value) => new Intl.NumberFormat("id-ID").format(value);

const memory = {};

function readStore(key, fallback) {
  try {
    return JSON.parse(localStorage.getItem(key)) ?? fallback;
  } catch {
    return memory[key] ?? fallback;
  }
}

function writeStore(key, value) {
  memory[key] = value;
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

function el(tag, text, className) {
  const node = document.createElement(tag);
  if (text !== undefined) node.textContent = text;
  if (className) node.className = className;
  return node;
}

function toast(message) {
  const node = $("#toast");
  node.textContent = message;
  node.hidden = false;
  clearTimeout(toast.timer);
  toast.timer = setTimeout(() => {
    node.hidden = true;
  }, 4500);
}

const extraUsers = readStore("sitta.users", []);

const users = [
  ...dataPengguna,
  ...(Array.isArray(extraUsers) ? extraUsers : []),
];

const extraStock = readStore("sitta.stock", []);

const stock = [
  ...dataBahanAjar,
  ...(Array.isArray(extraStock) ? extraStock : []),
];

const validEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

function error(id, message, input) {
  $(id).textContent = message;
  if (input) {
    input.setAttribute("aria-invalid", "true");
    input.focus();
  }
}

document.addEventListener("input", (event) =>
  event.target.removeAttribute("aria-invalid"),
);

$$("[data-close]").forEach((button) =>
  button.addEventListener("click", () => button.closest("dialog").close()),
);

$$("dialog").forEach((dialog) =>
  dialog.addEventListener("click", (event) => {
    const rect = dialog.getBoundingClientRect();
    if (
      event.target === dialog &&
      (event.clientX < rect.left ||
        event.clientX > rect.right ||
        event.clientY < rect.top ||
        event.clientY > rect.bottom)
    )
      dialog.close();
  }),
);

function badge(text) {
  return el(
    "span",
    text,
    "badge " + (/selesai|tersedia/i.test(text) ? "green" : "amber"),
  );
}

function localDate(value, withTime = false) {

  const date = new Date(
    value.includes(" ") ? value.replace(" ", "T") : value + "T00:00:00",
  );

  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
    ...(withTime ? { timeStyle: "short" } : {}),
  }).format(date);
}
