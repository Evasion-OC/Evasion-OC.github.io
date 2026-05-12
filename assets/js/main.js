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
// Last updated stamp
// ============================================================
document.addEventListener("DOMContentLoaded", () => {
  const stamp = document.getElementById("last-updated");
  if (!stamp) return;
  const d = new Date();
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  stamp.textContent = `${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
});
