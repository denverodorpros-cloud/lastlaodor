const menuToggle = document.querySelector("[data-nav-toggle]");
const nav = document.querySelector("[data-nav]");
const siteHeader = document.querySelector(".site-header");

if (menuToggle && nav) {
  menuToggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("open");
      menuToggle.setAttribute("aria-expanded", "false");
    });
  });
}

const updateHeaderState = () => {
  if (!siteHeader) return;
  siteHeader.classList.toggle("is-scrolled", window.scrollY > 16);
};

updateHeaderState();
window.addEventListener("scroll", updateHeaderState, { passive: true });

const revealTargets = document.querySelectorAll([
  ".trust-card",
  ".service-card",
  ".step-card",
  ".testimonial",
  ".faq-item",
  ".service-section",
  ".contact-card",
  ".info-box",
  ".glass-card",
  ".metric",
  ".pill",
  ".cta-band",
  ".focus-band"
].join(","));

revealTargets.forEach((element, index) => {
  element.classList.add("reveal-on-scroll");
  element.style.setProperty("--stagger-index", String(index % 6));
});

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.16,
    rootMargin: "0px 0px -8% 0px"
  });

  revealTargets.forEach((element) => {
    revealObserver.observe(element);
  });
} else {
  revealTargets.forEach((element) => {
    element.classList.add("is-visible");
  });
}

const form = document.getElementById("estimateForm");

if (form) {
  const submitBtn = document.getElementById("submitBtn");
  const successEl = document.getElementById("formSuccess");
  const errorEl = document.getElementById("formError");

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (successEl) successEl.hidden = true;
    if (errorEl) errorEl.hidden = true;
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = "Sending...";
    }

    try {
      const formData = new FormData(form);
      const payload = Object.fromEntries(formData.entries());
      const response = await fetch("/api/estimate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        body: JSON.stringify(payload)
      });
      let data = {};

      try {
        data = await response.json();
      } catch (error) {
        data = {};
      }

      if (response.ok) {
        form.reset();
        if (successEl) successEl.hidden = false;
      } else if (errorEl) {
        errorEl.textContent = formatErrorMessage(data.error, response.status);
        errorEl.hidden = false;
      }
    } catch (error) {
      if (errorEl) {
        errorEl.textContent = "Network error. Try again.";
        errorEl.hidden = false;
      }
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = "Submit Free Estimate Request";
      }
    }
  });
}

function formatErrorMessage(errorValue, statusCode) {
  if (statusCode === 404) {
    return "This deployment is missing the estimate form backend. Redeploy the full project root, including the api folder, to Vercel.";
  }

  if (typeof errorValue === "string" && errorValue.trim()) {
    return errorValue.trim();
  }

  if (errorValue && typeof errorValue === "object") {
    for (const value of Object.values(errorValue)) {
      if (typeof value === "string" && value.trim()) {
        return value.trim();
      }
    }
  }

  return "Form failed. Check the Vercel email configuration.";
}
