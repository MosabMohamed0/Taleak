// ====== Google Sheet Form Submit ======
const scriptURL =
  "https://script.google.com/macros/s/AKfycbwsXbfcLllF2yUDHjyjXSmmOa2kaIdJ9N-1pZLC1uqGItR_uQtqkc_DHJAYh5axI8uLsw/exec";
// ضع رابط Google Apps Script الخاص بك هنا
const form = document.forms["submit-to-google-sheet"];
const msg = document.getElementById("msg");

if (form) {
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    fetch(scriptURL, { method: "POST", body: new FormData(form) })
      .then(() => {
        msg.style.color = "green";
        msg.innerHTML = "✅ تم إرسال البيانات بنجاح!";
        setTimeout(() => (msg.innerHTML = ""), 4000);
        form.reset();
      })
      .catch(() => {
        msg.style.color = "red";
        msg.innerHTML = "❌ حصل خطأ، حاول تاني.";
      });
  });
}

// ====== Smooth Scroll Navbar ======
document.querySelectorAll(".navbar nav ul li a").forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    if (this.getAttribute("href").startsWith("#")) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        window.scrollTo({
          top: target.offsetTop - 60,
          behavior: "smooth",
        });
      }
    }
  });
});
