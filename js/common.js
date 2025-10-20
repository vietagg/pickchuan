// --- common.js ---
(async function initLayout(options = { header: true, footer: true }) {
  if (options.header) {
    await fetch("/header.html")
      .then(r => r.text())
      .then(html => {
        document.getElementById("header").innerHTML = html;
        console.log("✅ Header loaded");

        if (typeof initHeaderFeatures === "function") {
          console.log("✅ Gọi initHeaderFeatures");
          initHeaderFeatures();
        }

        // 👉 Gọi lại hàm khởi tạo tìm kiếm sau khi header đã có
        if (typeof initSearch === "function") {
          console.log("🔍 Gọi initSearch sau header load");
          initSearch();
        }
      })
      .catch(err => console.error("❌ Lỗi load header:", err));
  }

  if (options.footer) {
    await fetch("/footer.html")
      .then(r => r.text())
      .then(html => {
        document.getElementById("footer").innerHTML = html;
        console.log("✅ Footer loaded");
      })
      .catch(err => console.error("❌ Lỗi load footer:", err));
  }
})();
