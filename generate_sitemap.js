import fs from "fs";
import { SitemapStream, streamToPromise } from "sitemap";
import fetch from "node-fetch";

const API_URL = "https://script.google.com/macros/s/AKfycbxr-ULaNINjbEmgiizeQlREF92FvGYSadPBEhprCuwgtz4Dc8fjmPolUOPfqXiu94YX/exec?api=list";
const BASE_URL = "https://pickchuan.web.app"; // đổi thành domain thực tế của bạn

async function generateSitemap() {
  try {
    const response = await fetch(API_URL);
    const products = await response.json();

    if (!Array.isArray(products)) {
      console.error("❌ API không trả về mảng:", products);
      return;
    }

    const smStream = new SitemapStream({ hostname: BASE_URL });

    // Trang chủ
    smStream.write({ url: "/", changefreq: "daily", priority: 1.0 });

    // Các trang review
    for (const product of products) {
      smStream.write({
        url: `/review/${encodeURIComponent(product.id)}.html`,
        changefreq: "weekly",
        priority: 0.8,
      });
    }

    smStream.end();

    const sitemap = await streamToPromise(smStream).then(data => data.toString());
    fs.writeFileSync("./sitemap.xml", sitemap, "utf8");

    console.log("✅ sitemap.xml đã được tạo thành công!");
  } catch (err) {
    console.error("⚠️ Lỗi khi fetch API:", err.message);
  }
}

generateSitemap();
