function initLogin() {
  $("#fill-demo").addEventListener("click", () => {
    $("#email").value = "rina@ut.ac.id";
    $("#password").value = "rina123";
    $("#email").focus();
  });

  $("#toggle-password").addEventListener("click", (event) => {
    const show = $("#password").type === "password";
    $("#password").type = show ? "text" : "password";
    event.target.textContent = show ? "Sembunyikan" : "Lihat";
    event.target.setAttribute("aria-pressed", String(show));
    event.target.setAttribute(
      "aria-label",
      show ? "Sembunyikan password" : "Tampilkan password",
    );
  });

  $("#login-form").addEventListener("submit", (event) => {
    event.preventDefault();

    $("#login-error").textContent = "";

    const email = $("#email").value.trim().toLowerCase(),
      password = $("#password").value;

    if (!validEmail(email))
      return error(
        "#login-error",
        "Masukkan alamat email yang valid.",
        $("#email"),
      );
      
    if (!password)
      return error("#login-error", "Password wajib diisi.", $("#password"));

    const user = users.find(
      (item) =>
        item.email.toLowerCase() === email && item.password === password,
    );

    if (!user) {
      error(
        "#login-error",
        "email/password yang anda masukkan salah",
        $("#password"),
      );
      window.alert("email/password yang anda masukkan salah");
      return;
    }

    try {
      sessionStorage.setItem(
        "sitta.session",
        JSON.stringify({
          nama: user.nama,
          email: user.email,
          role: user.role,
          lokasi: user.lokasi,
        }),
      );
    } catch {
      return error(
        "#login-error",
        "Penyimpanan sesi tidak tersedia. Izinkan penyimpanan browser atau gunakan server lokal.",
      );
    }
    location.href = "dashboard.html";
  });

  $("#register-open").addEventListener("click", () => {
    $("#register-error").textContent = "";
    $("#register-dialog").showModal();
  });

  $("#forgot-open").addEventListener("click", () => {
    $("#forgot-message").textContent = "";
    $("#forgot-dialog").showModal();
  });

  $("#register-form").addEventListener("submit", (event) => {
    event.preventDefault();

    $("#register-error").textContent = "";

    const nama = $("#reg-name").value.trim(),
      email = $("#reg-email").value.trim().toLowerCase(),
      password = $("#reg-password").value;

    if (nama.length < 2)
      return error(
        "#register-error",
        "Nama minimal 2 karakter.",
        $("#reg-name"),
      );

    if (!validEmail(email))
      return error(
        "#register-error",
        "Alamat email tidak valid.",
        $("#reg-email"),
      );

    if (users.some((user) => user.email.toLowerCase() === email))
      return error(
        "#register-error",
        "Email sudah terdaftar.",
        $("#reg-email"),
      );

    if (password.length < 6)
      return error(
        "#register-error",
        "Password minimal 6 karakter.",
        $("#reg-password"),
      );

    if (password !== $("#reg-confirm").value)
      return error(
        "#register-error",
        "Konfirmasi password tidak cocok.",
        $("#reg-confirm"),
      );

    const user = {
      id: Date.now(),
      nama,
      email,
      password,
      role: "UT-Daerah",
      lokasi: "Akun demo",
    };

    users.push(user);

    const saved = writeStore("sitta.users", users.slice(dataPengguna.length));

    $("#register-dialog").close();

    $("#register-form").reset();

    $("#email").value = email;

    toast(
      saved
        ? "Akun berhasil dibuat. Silakan masuk."
        : "Akun dibuat untuk halaman ini; penyimpanan browser tidak tersedia.",
    );
  });
  $("#forgot-form").addEventListener("submit", (event) => {
    event.preventDefault();
    const email = $("#forgot-email").value.trim().toLowerCase();
    const message = $("#forgot-message");
    message.className = "error";

    if (!validEmail(email)) {
      message.textContent = "Masukkan email yang valid.";
      $("#forgot-email").focus();
      return;
    }

    if (!users.some((user) => user.email.toLowerCase() === email)) {
      message.textContent = "Email belum terdaftar.";
      return;
    }

    message.className = "demo-note";
    message.textContent =
      "Email ditemukan. Pada sistem nyata, tautan pemulihan akan dikirim ke email tersebut. Ini simulasi front-end: tidak ada email yang dikirim atau password yang diubah.";
  });
}
