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
      const response = await fetch("https://formspree.io/f/REPLACE_WITH_YOUR_FORM_ID", {
        method: "POST",
        body: formData,
        headers: { Accept: "application/json" }
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
        errorEl.textContent =
          (data.errors && data.errors[0] && data.errors[0].message) ||
          "Form failed. Check the Formspree endpoint.";
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
