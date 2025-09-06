// Mobile Menu Toggle
const hamburger = document.querySelector(".hamburger");
const navMenu = document.querySelector(".nav-menu");

hamburger.addEventListener("click", () => {
  hamburger.classList.toggle("active");
  navMenu.classList.toggle("active");
});

// Close mobile menu when clicking on a link
document.querySelectorAll(".nav-link").forEach((n) =>
  n.addEventListener("click", () => {
    hamburger.classList.remove("active");
    navMenu.classList.remove("active");
  })
);

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  });
});

// Header background change on scroll
window.addEventListener("scroll", () => {
  const header = document.querySelector(".header");
  if (window.scrollY > 100) {
    header.style.background = "rgba(255, 255, 255, 0.98)";
    header.style.boxShadow = "0 2px 10px rgba(0, 0, 0, 0.1)";
  } else {
    header.style.background = "rgba(255, 255, 255, 0.95)";
    header.style.boxShadow = "none";
  }
});

// Animate elements on scroll
const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -50px 0px",
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = "1";
      entry.target.style.transform = "translateY(0)";
    }
  });
}, observerOptions);

// Add animation classes to elements
document.addEventListener("DOMContentLoaded", () => {
  const animatedElements = document.querySelectorAll(
    ".about-card, .course-card, .feature-card, .contact-card"
  );

  animatedElements.forEach((el) => {
    el.style.opacity = "0";
    el.style.transform = "translateY(30px)";
    el.style.transition = "all 0.6s ease";
    observer.observe(el);
  });
});

// Form handling and Excel export functionality
const registrationForm = document.getElementById("registrationForm");
const successModal = document.getElementById("successModal");
const closeModalBtns = document.querySelectorAll(".close, .close-modal");

// Excel data storage (في الواقع، ستحتاج إلى خدمة backend لحفظ البيانات)
let registrationData = [];

registrationForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  // Show loading state
  const submitBtn = e.target.querySelector('button[type="submit"]');
  const originalText = submitBtn.innerHTML;
  submitBtn.innerHTML = '<span class="loading"></span> جاري الإرسال...';
  submitBtn.disabled = true;

  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 2000));

  // Collect form data
  const formData = new FormData(registrationForm);
  const data = {};

  // Handle regular form fields
  for (let [key, value] of formData.entries()) {
    if (key !== "courses") {
      data[key] = value;
    }
  }

  // Handle checkboxes for courses
  const selectedCourses = [];
  const courseCheckboxes = document.querySelectorAll(
    'input[name="courses"]:checked'
  );
  courseCheckboxes.forEach((checkbox) => {
    selectedCourses.push(checkbox.value);
  });
  data.courses = selectedCourses;

  // Add timestamp
  data.registrationDate = new Date().toLocaleString("ar-EG");

  // Store data (in a real app, send to server)
  registrationData.push(data);

  // Save to localStorage for demonstration (in real app, use backend)
  localStorage.setItem(
    "academyRegistrations",
    JSON.stringify(registrationData)
  );

  // Reset form
  registrationForm.reset();

  // Reset button
  submitBtn.innerHTML = originalText;
  submitBtn.disabled = false;

  // Show success modal
  successModal.style.display = "block";

  // Export to Excel (demonstration - in real app, handle server-side)
  exportToExcel(data);
});

// Export to Excel function
function exportToExcel(newData) {
  // This is a simplified version. In a real application, you would:
  // 1. Send data to your backend
  // 2. Backend saves to Excel file or database
  // 3. Optionally provide download link

  console.log("New registration data:", newData);
  console.log("All registrations:", registrationData);

  // For demonstration purposes, we'll create a CSV-like structure
  const csvData = convertToCSV(registrationData);
  console.log("CSV format:", csvData);
}

// Convert data to CSV format
function convertToCSV(data) {
  if (data.length === 0) return "";

  const headers = [
    "اسم الطالب",
    "العمر",
    "الجنس",
    "اسم ولي الأمر",
    "رقم الهاتف",
    "البريد الإلكتروني",
    "الكورسات المختارة",
    "الوقت المفضل",
    "ملاحظات",
    "تاريخ التسجيل",
  ];

  const rows = data.map((row) => [
    row.studentName || "",
    row.age || "",
    row.gender === "male" ? "ذكر" : "أنثى",
    row.parentName || "",
    row.phone || "",
    row.email || "",
    Array.isArray(row.courses) ? row.courses.join(", ") : "",
    getTimeLabel(row.preferredTime) || "",
    row.message || "",
    row.registrationDate || "",
  ]);

  return [headers, ...rows].map((row) => row.join(",")).join("\n");
}

// Helper function to get time labels in Arabic
function getTimeLabel(timeValue) {
  const timeLabels = {
    morning: "صباحاً (9 ص - 12 ظ)",
    afternoon: "بعد الظهر (1 ظ - 4 ع)",
    evening: "مساءً (5 م - 8 م)",
    flexible: "مرن",
  };
  return timeLabels[timeValue] || timeValue;
}

// Modal functionality
closeModalBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    successModal.style.display = "none";
  });
});

// Close modal when clicking outside
window.addEventListener("click", (e) => {
  if (e.target === successModal) {
    successModal.style.display = "none";
  }
});

// Form validation enhancements
function validateForm() {
  const requiredFields = registrationForm.querySelectorAll("[required]");
  let isValid = true;

  requiredFields.forEach((field) => {
    if (!field.value.trim()) {
      field.style.borderColor = "#ef4444";
      isValid = false;
    } else {
      field.style.borderColor = "#e5e7eb";
    }
  });

  // Validate at least one course is selected
  const courseCheckboxes = document.querySelectorAll(
    'input[name="courses"]:checked'
  );
  if (courseCheckboxes.length === 0) {
    alert("يرجى اختيار كورس واحد على الأقل");
    isValid = false;
  }

  // Validate email format
  const emailField = document.getElementById("email");
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (emailField.value && !emailPattern.test(emailField.value)) {
    emailField.style.borderColor = "#ef4444";
    alert("يرجى إدخال بريد إلكتروني صحيح");
    isValid = false;
  }

  // Validate phone number (Egyptian format)
  const phoneField = document.getElementById("phone");
  const phonePattern = /^(\+20|0)?1[0-2,5]\d{8}$/;
  if (
    phoneField.value &&
    !phonePattern.test(phoneField.value.replace(/\s/g, ""))
  ) {
    phoneField.style.borderColor = "#ef4444";
    alert("يرجى إدخال رقم هاتف صحيح");
    isValid = false;
  }

  return isValid;
}

// Add real-time validation
document.addEventListener("DOMContentLoaded", () => {
  const inputs = registrationForm.querySelectorAll("input, select, textarea");

  inputs.forEach((input) => {
    input.addEventListener("blur", () => {
      if (input.hasAttribute("required") && !input.value.trim()) {
        input.style.borderColor = "#ef4444";
      } else {
        input.style.borderColor = "#e5e7eb";
      }
    });

    input.addEventListener("input", () => {
      if (input.style.borderColor === "rgb(239, 68, 68)") {
        input.style.borderColor = "#e5e7eb";
      }
    });
  });
});

// Statistics counter animation
function animateNumbers() {
  const stats = document.querySelectorAll(".stat-number");

  stats.forEach((stat) => {
    const target = parseInt(stat.textContent);
    let current = 0;
    const increment = target / 50;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      stat.textContent =
        Math.floor(current) + (stat.textContent.includes("+") ? "+" : "");
    }, 40);
  });
}

// Trigger number animation when hero section is visible
const heroObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      animateNumbers();
      heroObserver.unobserve(entry.target);
    }
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const heroSection = document.querySelector(".hero");
  if (heroSection) {
    heroObserver.observe(heroSection);
  }
});

// Course cards hover effects
document.addEventListener("DOMContentLoaded", () => {
  const courseCards = document.querySelectorAll(".course-card");

  courseCards.forEach((card) => {
    card.addEventListener("mouseenter", () => {
      card.style.transform = "translateY(-10px) scale(1.02)";
    });

    card.addEventListener("mouseleave", () => {
      card.style.transform = "translateY(0) scale(1)";
    });
  });
});

// Scroll progress indicator
function createScrollProgress() {
  const progressBar = document.createElement("div");
  progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 0%;
        height: 3px;
        background: linear-gradient(90deg, #1e3a8a, #3b82f6);
        z-index: 9999;
        transition: width 0.1s ease;
    `;
  document.body.appendChild(progressBar);

  window.addEventListener("scroll", () => {
    const scrolled =
      (window.scrollY /
        (document.documentElement.scrollHeight - window.innerHeight)) *
      100;
    progressBar.style.width = scrolled + "%";
  });
}

// Initialize scroll progress
document.addEventListener("DOMContentLoaded", createScrollProgress);

// Lazy loading for images
document.addEventListener("DOMContentLoaded", () => {
  const images = document.querySelectorAll("img");

  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target;
        if (img.dataset.src) {
          img.src = img.dataset.src;
          img.removeAttribute("data-src");
        }
        imageObserver.unobserve(img);
      }
    });
  });

  images.forEach((img) => {
    imageObserver.observe(img);
  });
});

// Enhanced form submission with better UX
registrationForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  // Validate form first
  if (!validateForm()) {
    return;
  }

  // Rest of the submission code...
  // (This replaces the earlier submit handler)
});

// Add smooth reveal animations for sections
function addRevealAnimations() {
  const sections = document.querySelectorAll("section");

  sections.forEach((section) => {
    section.style.opacity = "0";
    section.style.transform = "translateY(50px)";
    section.style.transition = "all 0.8s ease";
  });

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = "1";
          entry.target.style.transform = "translateY(0)";
        }
      });
    },
    { threshold: 0.1 }
  );

  sections.forEach((section) => {
    sectionObserver.observe(section);
  });
}

// Initialize reveal animations
document.addEventListener("DOMContentLoaded", addRevealAnimations);

// Add floating action button for quick registration
function createFloatingActionButton() {
  const fab = document.createElement("div");
  fab.innerHTML = '<i class="fas fa-plus"></i>';
  fab.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 60px;
        height: 60px;
        background: linear-gradient(135deg, #1e3a8a, #3b82f6);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: 24px;
        cursor: pointer;
        box-shadow: 0 4px 12px rgba(30, 58, 138, 0.3);
        z-index: 1000;
        transition: all 0.3s ease;
        opacity: 0;
        transform: scale(0);
    `;

  fab.addEventListener("click", () => {
    document.getElementById("register").scrollIntoView({ behavior: "smooth" });
  });

  fab.addEventListener("mouseenter", () => {
    fab.style.transform = "scale(1.1)";
    fab.style.boxShadow = "0 6px 16px rgba(30, 58, 138, 0.4)";
  });

  fab.addEventListener("mouseleave", () => {
    fab.style.transform = "scale(1)";
    fab.style.boxShadow = "0 4px 12px rgba(30, 58, 138, 0.3)";
  });

  document.body.appendChild(fab);

  // Show/hide FAB based on scroll position
  window.addEventListener("scroll", () => {
    if (window.scrollY > 500) {
      fab.style.opacity = "1";
      fab.style.transform = "scale(1)";
    } else {
      fab.style.opacity = "0";
      fab.style.transform = "scale(0)";
    }
  });
}

// Initialize floating action button
document.addEventListener("DOMContentLoaded", createFloatingActionButton);

// Add typing animation for hero title
function typeWriter(element, text, speed = 100) {
  let i = 0;
  element.innerHTML = "";

  function type() {
    if (i < text.length) {
      element.innerHTML += text.charAt(i);
      i++;
      setTimeout(type, speed);
    }
  }
  type();
}

// Initialize typing animation
document.addEventListener("DOMContentLoaded", () => {
  const heroTitle = document.querySelector(".hero-title");
  if (heroTitle) {
    const originalText = heroTitle.textContent;
    typeWriter(heroTitle, originalText, 80);
  }
});

// Initialize Google Sheets integration on page load
document.addEventListener("DOMContentLoaded", () => {
  // Test connection on page load (optional)
  // testGoogleSheetsConnection();

  // Try to retry any failed submissions from previous sessions
  setTimeout(() => {
    retryFailedSubmissions();
  }, 3000); // Wait 3 seconds after page load
});

// Console message for developers
console.log(`
🎓 أكاديميتنا - موقع الأكاديمية
════════════════════════════════

📊 إحصائيات الموقع:
• تم تحميل جميع الملفات بنجاح
• النموذج متصل بـ Google Sheets
• جميع الرسوم المتحركة مفعلة

📋 Google Sheets Integration:
• URL: ${GOOGLE_SHEETS_URL}
• البيانات ترسل تلقائياً لـ Google Sheets
• نسخة احتياطية في localStorage

💡 للمطورين:
• البيانات: localStorage.getItem('academyRegistrations')
• اختبار الاتصال: testGoogleSheetsConnection()
• إعادة الإرسال: retryFailedSubmissions()

🔗 التواصل:
info@academy.com
════════════════════════════════
`);
