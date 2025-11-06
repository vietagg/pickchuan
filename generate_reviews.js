import fetch from "node-fetch";
import fs from "fs-extra";
import slugify from "slugify";

const API_URL = "https://script.google.com/macros/s/AKfycbxr-ULaNINjbEmgiizeQlREF92FvGYSadPBEhprCuwgtz4Dc8fjmPolUOPfqXiu94YX/exec?api=list"; // 🔗 thay bằng API list thật của bạn
const OUTPUT_DIR = "./review"; // Thư mục chứa các file HTML
const SITE_URL = "https://pickchuan.vercel.app"; // Domain chính của bạn

// Hàm tạo HTML tĩnh cho từng bài
function generateHTML(product) {
  const title = product.title || "Bài review";
  const image = product.image || "https://via.placeholder.com/600x400";
  const slug = slugify(title, { lower: true, strict: true });

  return `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} | PickChuẩn Review</title>
  <meta name="description" content="Đánh giá chi tiết ${title} – so sánh, ưu nhược điểm và trải nghiệm thực tế.">
  <meta property="og:title" content="${title} | PickChuẩn Review">
  <meta property="og:description" content="Đánh giá chi tiết ${title}. Xem ngay tại PickChuẩn.">
  <meta property="og:image" content="${image}">
  <meta property="og:url" content="${SITE_URL}/review/${product.id}-${slug}.html">
  <meta name="robots" content="index, follow">
  <link rel="canonical" href="${SITE_URL}/review/${product.id}-${slug}.html">
  <style>
    body { font-family: sans-serif; margin: 2rem auto; max-width: 800px; line-height: 1.6; }
    h1 { color: #111; font-size: 1.8rem; }
    img { width: 100%; border-radius: 8px; margin: 1rem 0; }
    a.btn { display: inline-block; background: #0070f3; color: #fff; padding: 10px 16px; border-radius: 6px; text-decoration: none; }
  </style>
</head>
<body>
  <h1>${title}</h1>
  <img src="${image}" alt="${title}">
  <p>Đọc bài review chi tiết tại <a href="${product.link}" target="_blank">PickChuẩn</a>.</p>
  <p><a class="btn" href="${SITE_URL}">← Quay lại trang chủ</a></p>
  <script>
    // Gọi API chi tiết khi người dùng vào (để lấy nội dung đầy đủ mà không chậm SEO)
    fetch("${product.link}")
      .then(res => res.json())
      .then(data => {
        if (!data || data.error) return;
        const detailHTML = \`
          <h2>Giới thiệu</h2><p>\${data.gioithieu || ""}</p>
          <h2>Tổng quan</h2><p>\${data.tongquan || ""}</p>
          <h2>Ưu điểm</h2><p>\${data.uudiem || ""}</p>
          <h2>Nhược điểm</h2><p>\${data.nhuocdiem || ""}</p>
          <h2>Kết luận</h2><p>\${data.ketluan || ""}</p>
        \`;
        document.body.insertAdjacentHTML("beforeend", detailHTML);
      });
  </script>
</body>
</html>`;
}

async function main() {
  console.log("🔄 Đang lấy danh sách review từ API...");
  try {
    const res = await fetch(API_URL);
    const data = await res.json();

    if (!Array.isArray(data)) {
      console.error("❌ Dữ liệu API không hợp lệ:", data);
      return;
    }

    await fs.ensureDir(OUTPUT_DIR);

    for (const product of data) {
      const slug = slugify(product.title || "review", { lower: true, strict: true });
      const filename = `${OUTPUT_DIR}/${product.id}-${slug}.html`;
      const html = generateHTML(product);
      await fs.writeFile(filename, html, "utf8");
      console.log(`✅ Đã tạo: ${filename}`);
    }

    console.log(`🎉 Tạo HTML review thành công (${data.length} bài)!`);
  } catch (err) {
    console.error("❌ Lỗi khi tạo file review:", err);
  }
}

main();
