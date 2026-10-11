function showReport(type) {
  const labels = {
    monitoring: "Monitoring progress DO bahan ajar",
    rekap: "Rekap bahan ajar",
    histori: "Histori transaksi bahan ajar",
  };

  $("#info-title").textContent = labels[type];

  const body = $("#info-body");
  body.replaceChildren();

  const note = el(
    "p",
    type === "histori"
      ? "Riwayat berdasarkan data DO yang tersedia. Data ini tidak memuat transaksi pembelian terpisah."
      : "Ringkasan berdasarkan data bahan ajar dan pengiriman yang tersedia.",
    "report-note",
  );
  body.append(note);

  let headers, rows;
  if (type === "rekap") {
    headers = ["Kode lokasi", "Judul unik", "Total stok"];
    rows = [...new Set(stock.map((item) => item.kodeLokasi))]
      .sort()
      .map((location) => {
        const items = stock.filter((item) => item.kodeLokasi === location);
        return [
          location,
          new Set(items.map((item) => item.kodeBarang)).size,
          formatNumber(items.reduce((sum, item) => sum + Number(item.stok), 0)),
        ];
      });
  } else {
    headers =
      type === "monitoring"
        ? ["Nomor DO", "Nama", "Status data", "Keterangan terakhir"]
        : ["Nomor DO", "Tanggal kirim", "Nama", "Total pembayaran"];
    rows = Object.entries(dataTracking).map(([number, item]) =>
      type === "monitoring"
        ? [number, item.nama, item.status, item.perjalanan.at(-1).keterangan]
        : [number, localDate(item.tanggalKirim), item.nama, item.total],
    );
  }

  const wrap = el("div", undefined, "table-scroll"),
    table = el("table"),
    thead = el("thead"),
    tr = el("tr"),
    tbody = el("tbody");

  const caption = el("caption", labels[type], "sr-only");
  table.append(caption);

  headers.forEach((label) => {
    const th = el("th", label);
    th.scope = "col";
    tr.append(th);
  });
  thead.append(tr);

  rows.forEach((values) => {
    const row = el("tr");
    values.forEach((value) => row.append(el("td", String(value))));
    tbody.append(row);
  });

  table.append(thead, tbody);
  wrap.append(table);
  body.append(wrap);
  
  $("#info-dialog").showModal();
}
