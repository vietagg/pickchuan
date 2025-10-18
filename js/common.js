function initLayout({ header = true, footer = true }) {
  if (header) {
    fetch("../header.html")
      .then(res => res.text())
      .then(html => document.getElementById("header").innerHTML = html);
  }
  if (footer) {
    fetch("../footer.html")
      .then(res => res.text())
      .then(html => document.getElementById("footer").innerHTML = html);
  }
}

