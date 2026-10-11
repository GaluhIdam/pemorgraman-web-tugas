function initDashboard(user) {
  const now = new Date(),
    hour = now.getHours();
  $("#greeting").textContent =
    hour < 11
      ? "Selamat pagi"
      : hour < 15
        ? "Selamat siang"
        : hour < 18
          ? "Selamat sore"
          : "Selamat malam";

  $("#first-name").textContent = user.nama.split(" ")[0];

  $("#today").textContent = new Intl.DateTimeFormat("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  })
    .format(now)
    .toUpperCase();

  $("#stat-titles").textContent = formatNumber(
    new Set(stock.map((item) => item.kodeBarang)).size,
  );

  $("#stat-stock").textContent = formatNumber(
    stock.reduce((sum, item) => sum + Number(item.stok), 0),
  );

  $("#stat-deliveries").textContent = Object.keys(dataTracking).length;

  for (const [number, delivery] of Object.entries(dataTracking)) {
    const link = el("a", undefined, "delivery");
    link.href = "tracking.html?do=" + encodeURIComponent(number);

    const detail = el("div");
    detail.append(
      el("strong", "#" + number),
      el("p", delivery.nama + " · " + delivery.ekspedisi),
    );

    link.append(detail, badge(delivery.status));
    
    $("#recent-deliveries").append(link);
  }
}
