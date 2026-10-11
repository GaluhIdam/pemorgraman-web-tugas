function initTracking() {
  const lookup = () => {

    const number = $("#do-number").value.trim();
    const result = $("#tracking-result");

    result.replaceChildren();
    result.hidden = true;

    $("#tracking-empty").hidden = false;
    $("#tracking-error").textContent = "";

    if (!number)
      return error(
        "#tracking-error",
        "Nomor Delivery Order wajib diisi.",
        $("#do-number"),
      );

    const found = Object.hasOwn(dataTracking, number)
      ? dataTracking[number]
      : null;

    if (!found)
      return error(
        "#tracking-error",
        "Nomor DO tidak ditemukan. Periksa kembali nomor yang dimasukkan.",
        $("#do-number"),
      );

    $("#tracking-empty").hidden = true;
    result.hidden = false;
    result.className = "tracking-grid";

    const summary = el("article", undefined, "card tracking-summary");

    summary.append(
      el("p", "DETAIL PENGIRIMAN", "eyebrow"),
      el("h2", "DO #" + number),
      badge(found.status),
    );

    const dl = el("dl");

    for (const [label, value] of [
      ["Nama mahasiswa", found.nama],
      ["Ekspedisi", found.ekspedisi],
      ["Tanggal kirim", localDate(found.tanggalKirim)],
      ["Paket / kode paket", found.paket],
      ["Total pembayaran", found.total],
    ]) {
      const group = el("div");
      group.append(el("dt", label), el("dd", value));
      dl.append(group);
    }
    summary.append(dl);

    const journey = el("article", undefined, "card");

    journey.append(
      el("p", "RIWAYAT DISTRIBUSI", "eyebrow"),
      el("h2", "Perjalanan paket"),
    );

    const list = el("ol", undefined, "timeline");

    found.perjalanan.forEach((step) => {
      const li = el("li");
      const time = el("time", localDate(step.waktu, true));
      time.dateTime = step.waktu.replace(" ", "T");
      li.append(time, el("span", step.keterangan));
      list.append(li);
    });

    journey.append(list);
    result.append(summary, journey);
  };

  $("#tracking-form").addEventListener("submit", (event) => {
    event.preventDefault();
    lookup();
  });

  $$("[data-do]").forEach((button) =>
    button.addEventListener("click", () => {
      $("#do-number").value = button.dataset.do;
      lookup();
    }),
  );

  const requested = new URLSearchParams(location.search).get("do");

  if (requested) {
    $("#do-number").value = requested;
    lookup();
  }
}
