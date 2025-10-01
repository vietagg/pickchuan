const API_URL = "https://script.google.com/macros/s/AKfycbx12345/exec?action=list";

fetch(API_URL)
  .then(res => res.json())
  .then(data => {
    const container = document.getElementById("reviews");
    data.forEach(item => {
      const div = document.createElement("div");
      div.innerHTML = `<h3><a href="review.html?id=${item.id}">${item.title}</a></h3>`;
      container.appendChild(div);
    });
  })
  .catch(err => console.error("API Error:", err));
