import fs from "fs";
import { SitemapStream, streamToPromise } from "sitemap";
import fetch from "node-fetch";
import slugify from "slugify"; // cần: npm install slugify

const API_URL =
  "https://script.google.com/macros/s/AKfycbxr-ULaNINjbEmgiizeQlREF92FvGYSadPBEhprCuwgtz4Dc8fjmPolUOPfqXiu94YX/exec?api=list";
const BASE_URL = "https://pickchuan.web.app"; // domain chính của bạn

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

    const usedSlugs = new Set();

    // Các trang review
    for (const product of products) {
      if (!product.title) continue;

      // Tạo slug thân thiện SEO
      let slug = slugify(product.title, { lower: true, strict: true });
      if (usedSlugs.has(slug)) slug += `-${product.id}`;
      usedSlugs.add(slug);

      // Thêm từng URL vào sitemap
      smStream.write({
        url: `/review/${slug}.html`,
        changefreq: "weekly",
        priority: 0.8,
        img: product.image
          ? [
              {
                url: product.image,
                caption: product.title,
              },
            ]
          : [],
      });
    }

    smStream.end();
    const sitemap = await streamToPromise(smStream).then((data) => data.toString());
    fs.writeFileSync("./sitemap.xml", sitemap, "utf8");

    console.log("✅ sitemap.xml đã được tạo thành công!");
  } catch (err) {
    console.error("⚠️ Lỗi khi fetch API:", err.message);
  }
}

generateSitemap();
