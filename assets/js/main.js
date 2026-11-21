const toggle = document.querySelector(".nav-toggle");
const nav = document.querySelector(".nav");

if (toggle && nav) {
  const closeMenu = () => {
    nav.classList.remove("nav-open");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Deschide meniul");
  };
  toggle.hidden = false;
  toggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("nav-open");
    toggle.setAttribute("aria-expanded", String(isOpen));
    toggle.setAttribute("aria-label", isOpen ? "Închide meniul" : "Deschide meniul");
  });
  nav.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", closeMenu);
  });
  document.addEventListener("keydown", event => {
    if (event.key === "Escape" && nav.classList.contains("nav-open")) {
      closeMenu();
      toggle.focus();
    }
  });
  document.addEventListener("click", event => {
    if (!nav.contains(event.target) && !toggle.contains(event.target)) closeMenu();
  });
  window.matchMedia("(max-width: 900px)").addEventListener("change", closeMenu);
}

const year = document.getElementById("year");
if (year) year.textContent = new Date().getFullYear();

// Native constraints remain active without JavaScript; the server validates again.
const form = document.querySelector("form");
if (form) {
  form.addEventListener("submit", event => {
    const name = form.querySelector("#name");
    const message = form.querySelector("#message");
    name.setCustomValidity(name.value.trim().length < 2 ? "Introdu un nume de cel puțin 2 caractere." : "");
    message.setCustomValidity(message.value.trim().length < 10 ? "Introdu un mesaj de cel puțin 10 caractere." : "");
    if (!form.reportValidity()) event.preventDefault();
  });
  form.querySelectorAll("input, textarea").forEach(field => {
    field.addEventListener("input", () => field.setCustomValidity(""));
  });
}

const formStatus = document.getElementById("formStatus");
if (formStatus && new URLSearchParams(window.location.search).get("contact") === "accepted") {
  formStatus.hidden = false;
  formStatus.textContent = "Mesajul a fost preluat de server pentru trimitere. Livrarea în inbox nu este confirmată.";
}

const copyBtn = document.getElementById("copyEmailBtn");
const copyStatus = document.getElementById("copyStatus");
const emailLink = document.querySelector('a[href^="mailto:"]');
const emailToCopy = emailLink?.getAttribute("href").slice("mailto:".length);

if (copyBtn && emailToCopy) {
  copyBtn.addEventListener("click", async () => {
    let copied = false;
    try {
      await navigator.clipboard.writeText(emailToCopy);
      copied = true;
    } catch {
      const temp = document.createElement("input");
      temp.value = emailToCopy;
      temp.setAttribute("readonly", "");
      temp.style.position = "fixed";
      temp.style.opacity = "0";
      document.body.appendChild(temp);
      temp.select();
      try {
        copied = document.execCommand("copy");
      } catch {
        copied = false;
      } finally {
        temp.remove();
        copyBtn.focus();
      }
    }
    if (copyStatus) {
      copyStatus.textContent = copied ? "Email copiat." : "Copiere indisponibilă. Folosește linkul Deschide Email.";
      setTimeout(() => { copyStatus.textContent = ""; }, 4000);
    }
  });
}

document.querySelectorAll(".btn").forEach(btn => {
  btn.addEventListener("mousemove", event => {
    const rect = btn.getBoundingClientRect();
    btn.style.setProperty("--x", event.clientX - rect.left + "px");
    btn.style.setProperty("--y", event.clientY - rect.top + "px");
  });
});

// Reveal once with one observer. Content is visible if JS or this API is unavailable.
if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("active");
        entry.target.classList.remove("reveal-pending");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0, rootMargin: "0px 0px -30px 0px" });

  document.querySelectorAll(".reveal").forEach(section => {
    observer.observe(section);
    section.classList.add("reveal-pending");
  });
}