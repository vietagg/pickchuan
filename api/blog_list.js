import fs from "fs";
import path from "path";

export default function handler(req, res) {
  try {
    // đường dẫn đến thư mục /public/blog
    const blogDir = path.join(process.cwd(), "public", "blog");

    // đọc danh sách file .html
    const files = fs.readdirSync(blogDir).filter(f => f.endsWith(".html"));

    const blogs = files.map(filename => {
      const filePath = path.join(blogDir, filename);
      const html = fs.readFileSync(filePath, "utf8");

      const titleMatch = html.match(/<title>(.*?)<\/title>/i);
      const descMatch = html.match(/<meta\s+name=["']description["']\s+content=["'](.*?)["']/i);

      const title = titleMatch ? titleMatch[1] : filename.replace(".html", "").replace(/_/g, " ");
      const description = descMatch ? descMatch[1] : `Bài viết: ${title}`;

      return {
        title,
        description,
        // file trong /public có thể truy cập trực tiếp
        url: `/blog/${filename}`,
      };
    });

    res.status(200).json(blogs);
  } catch (error) {
    res.status(500).json({ error: "Lỗi tải danh sách blog", details: error.message });
  }
}
