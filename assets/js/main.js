// ============================================================
// Theme toggle (persisted to localStorage)
// ============================================================
(function initTheme() {
  const stored = localStorage.getItem("theme");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const theme = stored || (prefersDark ? "dark" : "light");
  document.documentElement.setAttribute("data-theme", theme);

  document.addEventListener("DOMContentLoaded", () => {
    const btn = document.getElementById("theme-toggle");
    if (!btn) return;

    const updateIcon = () => {
      const current = document.documentElement.getAttribute("data-theme");
      btn.innerHTML =
        current === "dark"
          ? '<i class="fas fa-sun"></i>'
          : '<i class="fas fa-moon"></i>';
    };
    updateIcon();

    btn.addEventListener("click", () => {
      const current = document.documentElement.getAttribute("data-theme");
      const next = current === "dark" ? "light" : "dark";
      document.documentElement.setAttribute("data-theme", next);
      localStorage.setItem("theme", next);
      updateIcon();
    });
  });
})();

// ============================================================
// Tag filtering on research page
// ============================================================
document.addEventListener("DOMContentLoaded", () => {
  const filterButtons = document.querySelectorAll(".filter-panel .filter-tag");
  const cards = document.querySelectorAll(".pub-card");
  if (!filterButtons.length || !cards.length) return;

  const active = new Set();

  const applyFilter = () => {
    cards.forEach((card) => {
      const tags = (card.dataset.tags || "")
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);
      const show =
        active.size === 0 || [...active].every((t) => tags.includes(t));
      card.classList.toggle("is-hidden", !show);
    });
  };

  filterButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const tag = btn.dataset.tag;
      if (!tag) return;
      if (active.has(tag)) {
        active.delete(tag);
        btn.classList.remove("is-active");
      } else {
        active.add(tag);
        btn.classList.add("is-active");
      }
      applyFilter();
    });
  });
});

// ============================================================
// Contact form (AJAX submit to Formspree)
// ============================================================
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("contact-form");
  const status = document.getElementById("form-status");
  if (!form || !status) return;

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const action = form.getAttribute("action") || "";
    if (action.includes("YOUR_FORM_ID")) {
      status.className = "form-status is-error";
      status.textContent =
        "Form endpoint not configured yet — see README for setup.";
      return;
    }

    const submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    status.className = "form-status";
    status.textContent = "Sending…";

    try {
      const res = await fetch(action, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" },
      });
      if (res.ok) {
        form.reset();
        status.className = "form-status is-success";
        status.textContent = "Thanks — your message is on its way.";
      } else {
        const data = await res.json().catch(() => ({}));
        status.className = "form-status is-error";
        status.textContent =
          (data.errors && data.errors.map((e) => e.message).join(", ")) ||
          "Something went wrong. Please try again.";
      }
    } catch (err) {
      status.className = "form-status is-error";
      status.textContent = "Network error. Please try again.";
    } finally {
      submitBtn.disabled = false;
    }
  });
});

// ============================================================
// Fade-in on scroll (IntersectionObserver)
// ============================================================
document.addEventListener("DOMContentLoaded", () => {
  const elements = document.querySelectorAll(".fade-in");
  if (!elements.length) return;

  if (!("IntersectionObserver" in window)) {
    elements.forEach((el) => el.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
  );

  elements.forEach((el) => observer.observe(el));
});

// ============================================================
// BibTeX copy buttons
// ============================================================
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".bibtex-copy").forEach((btn) => {
    btn.addEventListener("click", async (event) => {
      event.preventDefault();
      const wrapper = btn.closest(".bibtex-body");
      const code = wrapper && wrapper.querySelector(".bibtex-code");
      if (!code) return;
      const text = code.textContent.trim();
      try {
        await navigator.clipboard.writeText(text);
      } catch {
        const range = document.createRange();
        range.selectNode(code);
        const sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
        try { document.execCommand("copy"); } catch {}
        sel.removeAllRanges();
      }
      const original = btn.innerHTML;
      btn.classList.add("is-copied");
      btn.innerHTML = '<i class="fas fa-check"></i> Copied';
      setTimeout(() => {
        btn.classList.remove("is-copied");
        btn.innerHTML = original;
      }, 1800);
    });
  });
});

// ============================================================
// Last updated stamp
// ============================================================
document.addEventListener("DOMContentLoaded", () => {
  const stamp = document.getElementById("last-updated");
  if (!stamp) return;
  const d = new Date();
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  stamp.textContent = `${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
});
