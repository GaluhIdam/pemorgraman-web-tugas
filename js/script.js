const page = document.body.dataset.page;

if (page === "login") {
  initLogin();
} else {
  const user = getSession();

  if (!user) {
    location.replace("index.html");
  } else {
    initShell(user);

    if (page === "dashboard") {
      initDashboard(user);
    }

    if (page === "tracking") {
      initTracking();
    }

    if (page === "stok") {
      initStock();
    }
  }
}
