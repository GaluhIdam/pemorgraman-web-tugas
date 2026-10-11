function getSession() {
  try {
    const value = JSON.parse(sessionStorage.getItem("sitta.session"));
    return value && typeof value.nama === "string" ? value : null;
  } catch {
    return null;
  }
}

function initShell(user) {
  $("#user-name").textContent = user.nama;

  $("#user-role").textContent = user.lokasi || user.role;
  
  $("#avatar").textContent = user.nama
    .split(" ")
    .map((word) => word[0])
    .slice(0, 2)
    .join("");

  $("#logout").addEventListener("click", () => {
    sessionStorage.removeItem("sitta.session");
    location.href = "index.html";
  });
  
  $$("[data-report]").forEach((button) =>
    button.addEventListener("click", () => showReport(button.dataset.report)),
  );
}
