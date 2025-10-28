// --- Khởi tạo header ---
function initHeaderFeatures() {
  console.log("✅ Header features initialized");

  const inputDesktop = document.getElementById("searchInput");
  const suggestionsDesktop = document.getElementById("suggestions");
  const inputMobile = document.getElementById("searchInputMobile");
  const suggestionsMobile = document.getElementById("suggestionsMobile");
  const mobileSearchBtn = document.getElementById("mobileSearchBtn");
  const mobileSearchBox = document.getElementById("mobileSearchBox");
  const menuToggle = document.getElementById("menuToggle");
  const mobileMenu = document.getElementById("mobileMenu");

  // 👉 Toggle menu mobile
  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener("click", () => {
      mobileMenu.classList.toggle("hidden");
      mobileSearchBox.classList.add("hidden");
    });
  }

  // 👉 Toggle khung tìm kiếm mobile
  if (mobileSearchBtn && mobileSearchBox) {
    mobileSearchBtn.addEventListener("click", () => {
      mobileSearchBox.classList.toggle("hidden");
      mobileMenu.classList.add("hidden");
      inputMobile?.focus();
    });
  }
}

async function fetchBlogList() {
  try {
    // Tự phát hiện đang chạy ở local hay GitHub Pages
    const isLocal = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
    
    // Nếu local thì không thêm prefix
    // Nếu chạy trên GitHub Pages thì thêm /pickchuan
    const basePath = isLocal ? "" : "/pickchuan";

    const res = await fetch(`${basePath}/api/blog_list.json`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const blogs = await res.json();
    console.log("📚 Đã tải blog list:", blogs);
    return blogs;
  } catch (err) {
    console.error("❌ Lỗi tải blog list:", err);
    return [];
  }
}

// --- Hàm hiển thị gợi ý tìm kiếm ---
function setupSearch(blogs, inputId, suggestionId) {
  const input = document.getElementById(inputId);
  const suggestionBox = document.getElementById(suggestionId);
  if (!input || !suggestionBox) return;

  input.addEventListener("input", (e) => {
    const keyword = e.target.value.trim().toLowerCase();
    if (!keyword) {
      suggestionBox.classList.add("hidden");
      suggestionBox.innerHTML = "";
      return;
    }

    // Tìm kiếm blog theo tên hoặc mô tả
    const matches = blogs.filter(
      (b) =>
        b.title.toLowerCase().includes(keyword) ||
        (b.description && b.description.toLowerCase().includes(keyword))
    );

    if (matches.length === 0) {
      suggestionBox.classList.add("hidden");
      suggestionBox.innerHTML = "";
      return;
    }

    // Tạo HTML gợi ý
    suggestionBox.innerHTML = matches
      .slice(0, 5)
      .map(
        (b) => `
        <div class="px-3 py-2 hover:bg-orange-50 cursor-pointer" data-link="${b.url}">
          <strong>${b.title}</strong><br/>
          <span class="text-xs text-gray-500">${b.description || ""}</span>
        </div>`
      )
      .join("");

    suggestionBox.classList.remove("hidden");

    // Click vào gợi ý
    suggestionBox.querySelectorAll("div").forEach((el) =>
      el.addEventListener("click", () => {
        const link = el.getAttribute("data-link");
        if (link) window.location.href = link;
      })
    );
  });

  // Enter để tìm toàn bộ
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      const keyword = input.value.trim();
      if (keyword) {
        window.location.href = `/search.html?q=${encodeURIComponent(keyword)}`;
      }
    }
  });
}
// --- search.js ---

async function initSearch() {
  const blogs = await fetchBlogList();
  if (!blogs.length) {
    console.warn("⚠️ Không có dữ liệu blog nào được tải.");
    return;
  }

  setupSearch(blogs, "searchInput", "suggestions");
  setupSearch(blogs, "searchInputMobile", "suggestionsMobile");

  console.log("🔍 Search initialized");
}

// --- Khởi chạy ---
