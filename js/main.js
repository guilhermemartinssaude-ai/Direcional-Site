// PLACEHOLDER: troque pelo número real de WhatsApp da Direcional (formato internacional, só dígitos)
const WHATSAPP_NUMBER = "5548900000000";

/* ---------- Cabeçalho: fundo sólido após 50px ---------- */
function initHeader() {
  const header = document.getElementById("siteHeader");
  if (!header) return;
  const update = () => header.classList.toggle("is-scrolled", window.scrollY > 50);
  update();
  window.addEventListener("scroll", update, { passive: true });
}

/* ---------- Menu: submenus (hover, Tab, toque, Esc) e hambúrguer ---------- */
function initMenu() {
  const header = document.getElementById("siteHeader");
  const navToggle = document.getElementById("navToggle");
  const desktop = window.matchMedia("(min-width: 1061px) and (hover: hover)");
  const items = [...document.querySelectorAll(".has-sub")];

  const setOpen = (li, open) => {
    li.classList.toggle("open", open);
    li.querySelector(".sub-toggle").setAttribute("aria-expanded", String(open));
  };
  const closeAll = (except) => items.forEach((li) => li !== except && setOpen(li, false));

  items.forEach((li) => {
    const btn = li.querySelector(".sub-toggle");
    let closeTimer;

    li.addEventListener("mouseenter", () => {
      if (!desktop.matches) return;
      clearTimeout(closeTimer);
      closeAll(li);
      setOpen(li, true);
    });
    li.addEventListener("mouseleave", () => {
      if (!desktop.matches) return;
      closeTimer = setTimeout(() => setOpen(li, false), 150);
    });
    li.addEventListener("focusin", () => {
      if (li.dataset.skipFocus) return delete li.dataset.skipFocus;
      if (!desktop.matches) return;
      closeAll(li);
      setOpen(li, true);
    });
    li.addEventListener("focusout", (e) => {
      if (!li.contains(e.relatedTarget)) setOpen(li, false);
    });
    btn.addEventListener("click", () => {
      // No computador, hover/foco já abriram: o clique só garante aberto.
      // No celular, funciona como acordeão.
      const open = desktop.matches ? true : !li.classList.contains("open");
      if (!desktop.matches) closeAll(li);
      setOpen(li, open);
    });
  });

  const setNavOpen = (open) => {
    header.classList.toggle("nav-open", open);
    navToggle.setAttribute("aria-expanded", String(open));
    navToggle.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
    if (!open) closeAll();
  };
  navToggle?.addEventListener("click", () => setNavOpen(!header.classList.contains("nav-open")));

  // Fecha o menu do celular ao escolher um link
  document.querySelectorAll(".main-nav a").forEach((a) =>
    a.addEventListener("click", () => setNavOpen(false))
  );

  document.addEventListener("keydown", (e) => {
    if (e.key !== "Escape") return;
    const open = items.find((li) => li.classList.contains("open"));
    if (open) {
      setOpen(open, false);
      const btn = open.querySelector(".sub-toggle");
      // Devolve o foco ao botão sem reabrir o submenu
      if (document.activeElement !== btn) {
        open.dataset.skipFocus = "1";
        btn.focus();
      }
    } else if (header.classList.contains("nav-open")) {
      setNavOpen(false);
      navToggle.focus();
    }
  });

  document.addEventListener("click", (e) => {
    if (!e.target.closest(".has-sub")) closeAll();
  });

  desktop.addEventListener("change", () => setNavOpen(false));
}

/* ---------- Item ativo do menu ---------- */
function initActiveNav() {
  const page = document.body.dataset.page;
  const links = [...document.querySelectorAll(".nav-link[data-nav]")];
  const mark = (key) => links.forEach((l) => l.classList.toggle("is-active", l.dataset.nav === key));

  if (page !== "inicio") {
    mark(page);
    return;
  }

  // Na home, o destaque acompanha a seção visível
  const spy = {
    inicio: "inicio", operadoras: "operadoras", produtos: "planos", comparar: "planos",
    clientes: "sobre", depoimentos: "sobre", duvidas: "duvidas",
  };
  const sections = Object.keys(spy).map((id) => document.getElementById(id)).filter(Boolean);
  mark("inicio");
  if (!("IntersectionObserver" in window)) return;
  const io = new IntersectionObserver(
    (entries) => entries.forEach((en) => en.isIntersecting && mark(spy[en.target.id])),
    { rootMargin: "-45% 0px -50% 0px" }
  );
  sections.forEach((s) => io.observe(s));
}

/* ---------- Imagens que ainda não existem: esconde e mostra o fallback ---------- */
function initImgFallback() {
  const fail = (img) => {
    img.hidden = true;
    img.closest("[data-fallback]")?.classList.add("sem-imagem");
  };
  document.querySelectorAll("img").forEach((img) => {
    if (img.complete && img.naturalWidth === 0) fail(img);
    else img.addEventListener("error", () => fail(img), { once: true });
  });
}

/* ---------- Formulário de cotação ---------- */
function initForm() {
  const waFloat = document.getElementById("waFloat");
  if (waFloat) {
    waFloat.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Olá! Quero saber mais sobre planos de saúde e seguros.")}`;
  }

  const form = document.getElementById("quoteForm");
  form?.addEventListener("submit", (e) => {
    e.preventDefault();

    const tipo = document.getElementById("tipoPlano").value;
    const nome = document.getElementById("nome").value.trim();
    const whatsapp = document.getElementById("whatsapp").value.trim();

    if (!tipo || !nome || !whatsapp) return;

    const mensagem =
      `Olá! Meu nome é ${nome} e quero uma cotação de: ${tipo}.\n` +
      `Meu WhatsApp pra contato: ${whatsapp}`;

    window.open(
      `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(mensagem)}`,
      "_blank"
    );
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initImgFallback();
  initHeader();
  initMenu();
  initActiveNav();
  initForm();
});
