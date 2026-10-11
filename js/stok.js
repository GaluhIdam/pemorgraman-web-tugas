function initStock() {
  const updateLocations = () => {
    const select = $("#location-filter"),
      selected = select.value;

    select.replaceChildren(new Option("Semua lokasi", ""));
    [...new Set(stock.map((item) => item.kodeLokasi))]
      .sort()
      .forEach((location) => select.add(new Option(location, location)));

    select.value = selected;
  };

  const render = () => {
    const query = $("#stock-search").value.trim().toLowerCase(),
      location = $("#location-filter").value;
    const filtered = stock.filter(
      (item) =>
        (!location || item.kodeLokasi === location) &&
        (item.namaBarang + " " + item.kodeBarang).toLowerCase().includes(query),
    );

    const body = $("#stock-body");

    body.replaceChildren();

    filtered.forEach((item) => {
      const row = el("tr"),
        bookCell = el("td"),
        book = el("div", undefined, "book-cell");

      if (item.cover) {
        const image = el("img");
        image.src = item.cover;
        image.alt = "Sampul " + item.namaBarang;
        image.loading = "lazy";
        book.append(image);
      } else {
        book.append(el("span", "▤", "cover-placeholder"));
      }
      const title = el("div");

      title.append(el("strong", item.namaBarang), el("small", item.kodeBarang));
      book.append(title);
      bookCell.append(book);
      row.append(bookCell);
      [
        item.kodeLokasi,
        item.jenisBarang,
        item.edisi,
        formatNumber(item.stok),
      ].forEach((value) => row.append(el("td", String(value))));

      const status = el("td");
      status.append(badge(Number(item.stok) > 0 ? "Tersedia" : "Habis"));
      row.append(status);
      body.append(row);
    });
    if (!filtered.length) {
      const row = el("tr"),
        cell = el(
          "td",
          "Tidak ada bahan ajar yang sesuai pencarian.",
          "no-results",
        );
      cell.colSpan = 6;
      row.append(cell);
      body.append(row);
    }

    $("#stock-count").textContent =
      `Menampilkan ${filtered.length} dari ${stock.length} baris bahan ajar`;
    $("#stock-titles").textContent = formatNumber(
      new Set(stock.map((item) => item.kodeBarang)).size,
    );
    $("#stock-total").textContent = formatNumber(
      stock.reduce((sum, item) => sum + Number(item.stok), 0),
    );
    $("#stock-locations").textContent = new Set(
      stock.map((item) => item.kodeLokasi),
    ).size;
  };

  $("#stock-search").addEventListener("input", render);
  $("#location-filter").addEventListener("change", render);
  $("#add-stock").addEventListener("click", () => {
    $("#stock-error").textContent = "";
    $("#stock-dialog").showModal();
  });
  
  $("#stock-form").addEventListener("submit", (event) => {
    event.preventDefault();
    $("#stock-error").textContent = "";
    const item = {
      kodeBarang: "",
      kodeLokasi: "",
      namaBarang: "",
      jenisBarang: "BMP",
      edisi: "",
      stok: "",
      ...Object.fromEntries(new FormData(event.target)),
    };

    for (const key of Object.keys(item)) item[key] = item[key].trim();
    item.kodeBarang = item.kodeBarang.toUpperCase();
    item.kodeLokasi = item.kodeLokasi.toUpperCase();

    if (!/^[A-Z0-9-]{2,24}$/.test(item.kodeBarang))
      return error(
        "#stock-error",
        "Kode barang harus 2-24 karakter huruf, angka, atau tanda hubung.",
        $("#item-code"),
      );

    if (!/^[A-Z0-9-]{2,24}$/.test(item.kodeLokasi))
      return error(
        "#stock-error",
        "Kode lokasi harus 2-24 karakter huruf, angka, atau tanda hubung.",
        $("#item-location"),
      );

    if (item.namaBarang.length < 3)
      return error(
        "#stock-error",
        "Nama bahan ajar minimal 3 karakter.",
        $("#item-name"),
      );

    if (
      !item.edisi ||
      !Number.isInteger(Number(item.edisi)) ||
      Number(item.edisi) < 1 ||
      Number(item.edisi) > 999
    )
      return error(
        "#stock-error",
        "Edisi harus bilangan bulat antara 1 dan 999.",
        $("#item-edition"),
      );

    if (
      item.stok === "" ||
      !Number.isInteger(Number(item.stok)) ||
      Number(item.stok) < 0 ||
      Number(item.stok) > 1000000
    )
      return error(
        "#stock-error",
        "Stok harus bilangan bulat antara 0 dan 1.000.000.",
        $("#item-stock"),
      );

    if (
      stock.some(
        (row) =>
          row.kodeBarang === item.kodeBarang &&
          row.kodeLokasi === item.kodeLokasi &&
          Number(row.edisi) === Number(item.edisi),
      )
    )
      return error(
        "#stock-error",
        "Bahan ajar dengan kode, lokasi, dan edisi tersebut sudah ada.",
        $("#item-code"),
      );

    item.stok = Number(item.stok);
    item.cover = "";
    stock.push(item);

    const saved = writeStore("sitta.stock", stock.slice(dataBahanAjar.length));

    $("#stock-search").value = "";
    $("#location-filter").value = "";

    updateLocations();
    render();

    $("#stock-dialog").close();
    event.target.reset();
    toast(
      saved
        ? "Bahan ajar berhasil ditambahkan."
        : "Bahan ajar ditambahkan; penyimpanan browser tidak tersedia.",
    );
  });

  updateLocations();
  render();
}
