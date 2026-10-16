// Os dados de contato ficam em js/config.js (objeto CONTATO)
const C = typeof CONTATO === "object" ? CONTATO : {};
const MSG_WHATS_PADRAO = "Olá! Vim pelo site da Direcional e quero falar com um consultor.";

const soDigitos = (s) => String(s || "").replace(/\D/g, "");
const linkWhats = (texto = MSG_WHATS_PADRAO, numero = C.whatsappPrincipal) =>
  `https://wa.me/${soDigitos(numero)}?text=${encodeURIComponent(texto)}`;

function formatarTelefone(s) {
  let d = soDigitos(s);
  if (d.length > 11 && d.startsWith("55")) d = d.slice(2);
  if (d.length === 11) return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
  if (d.length === 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return String(s || "");
}

/* ---------- Dados de contato: preenche e esconde o que estiver vazio ---------- */
function initContato() {
  const href = {
    whatsappPrincipal: () => linkWhats(),
    telefone: () => `tel:+55${soDigitos(C.telefone).replace(/^55/, "")}`,
    email: () => `mailto:${C.email}`,
    instagram: () => C.instagram,
    mapsUrl: () => C.mapsUrl,
    endereco: () => C.mapsUrl,
  };
  const texto = {
    whatsappPrincipal: () => formatarTelefone(C.whatsappPrincipal),
    telefone: () => formatarTelefone(C.telefone),
  };
  const vazio = (campo) => !String(C[campo] || "").trim();

  document.querySelectorAll("[data-contato]").forEach((el) => {
    if (el.dataset.contato.split(" ").some(vazio)) el.hidden = true;
  });
  document.querySelectorAll("[data-href]").forEach((el) => {
    const campo = el.dataset.href;
    if (!vazio(campo) && href[campo]) el.href = href[campo]();
  });
  document.querySelectorAll("[data-texto]").forEach((el) => {
    const campo = el.dataset.texto;
    if (!vazio(campo)) el.textContent = texto[campo] ? texto[campo]() : C[campo];
  });

  // Dados estruturados da home: completa com telefone e Instagram, se houver
  const ld = document.getElementById("dadosEstruturados");
  if (ld) {
    try {
      const dados = JSON.parse(ld.textContent);
      if (!vazio("telefone")) dados.telephone = `+55 ${formatarTelefone(C.telefone)}`;
      if (!vazio("instagram")) dados.sameAs = [C.instagram];
      if (!vazio("email")) dados.email = C.email;
      ld.textContent = JSON.stringify(dados, null, 2);
    } catch (e) { /* mantém o JSON original */ }
  }
}

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

const reduzMovimento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ---------- Entrada ao rolar (uma vez só, em cascata nos grupos) ---------- */
function initReveal() {
  document.querySelectorAll("[data-stagger]").forEach((grupo) => {
    const passo = Number(grupo.dataset.stagger) || 100;
    [...grupo.children].forEach((filho, i) => {
      filho.setAttribute("data-reveal", "");
      filho.style.setProperty("--d", `${i * passo}ms`);
    });
  });
  const els = [...document.querySelectorAll("[data-reveal]")];
  const terminar = (el) => {
    el.removeAttribute("data-reveal");
    el.classList.remove("is-visible");
    el.style.removeProperty("--d");
  };
  if (reduzMovimento || !("IntersectionObserver" in window)) {
    els.forEach(terminar);
    return;
  }
  const io = new IntersectionObserver(
    (entries) =>
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        const el = en.target;
        el.classList.add("is-visible");
        io.unobserve(el);
        // Ao terminar, devolve o elemento ao estado normal (libera o hover dos cards)
        const d = parseInt(el.style.getPropertyValue("--d")) || 0;
        setTimeout(() => terminar(el), 700 + d);
      }),
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );
  els.forEach((el) => io.observe(el));
}

/* ---------- Contadores de 0 até o valor ---------- */
function initCounters() {
  const els = document.querySelectorAll("[data-count]");
  if (reduzMovimento || !("IntersectionObserver" in window)) return;
  const escrever = (el, v) => (el.textContent = (el.dataset.prefix || "") + v.toLocaleString("pt-BR") + (el.dataset.suffix || ""));
  const animar = (el) => {
    const alvo = Number(el.dataset.count);
    const dur = 1400;
    const t0 = performance.now();
    const passo = (t) => {
      const p = Math.min((t - t0) / dur, 1);
      escrever(el, Math.round(alvo * (1 - Math.pow(1 - p, 3))));
      if (p < 1) requestAnimationFrame(passo);
    };
    requestAnimationFrame(passo);
  };
  const io = new IntersectionObserver(
    (entries) =>
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        io.unobserve(en.target);
        animar(en.target);
      }),
    { threshold: 0.6 }
  );
  els.forEach((el) => {
    escrever(el, 0);
    io.observe(el);
  });
}

/* ---------- Linhas que se desenham ao rolar (passos, trajetória) ---------- */
function initDraw() {
  const els = document.querySelectorAll("[data-draw]");
  if (reduzMovimento || !("IntersectionObserver" in window)) {
    els.forEach((el) => el.classList.add("is-drawn"));
    return;
  }
  const io = new IntersectionObserver(
    (entries) =>
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        en.target.classList.add("is-drawn");
        io.unobserve(en.target);
      }),
    { threshold: 0.35 }
  );
  els.forEach((el) => io.observe(el));
}

/* ---------- Acordeão: uma resposta aberta por vez ---------- */
function initAcordeao() {
  document.querySelectorAll(".acordeao").forEach((grupo) => {
    const itens = [...grupo.querySelectorAll(".acordeao-item")];
    const set = (item, aberto) => {
      item.classList.toggle("aberto", aberto);
      item.querySelector(".acordeao-botao").setAttribute("aria-expanded", String(aberto));
    };
    itens.forEach((item) =>
      item.querySelector(".acordeao-botao").addEventListener("click", () => {
        const abrir = !item.classList.contains("aberto");
        itens.forEach((i) => set(i, false));
        set(item, abrir);
      })
    );
    grupo.addEventListener("keydown", (e) => {
      if (e.key !== "Escape") return;
      const aberto = itens.find((i) => i.classList.contains("aberto"));
      if (aberto) {
        set(aberto, false);
        aberto.querySelector(".acordeao-botao").focus();
      }
    });
    if (itens[0]) set(itens[0], true);
  });
}

/* ---------- Voltar ao topo ---------- */
function initToTop() {
  const btn = document.getElementById("toTop");
  if (!btn) return;
  const update = () => btn.classList.toggle("show", window.scrollY > 600);
  update();
  window.addEventListener("scroll", update, { passive: true });
  btn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: reduzMovimento ? "auto" : "smooth" });
    document.querySelector(".brand")?.focus({ preventScroll: true });
  });
}

/* ---------- "Para onde você quer ir?": esconde o cartão da própria página ---------- */
function initParaOnde() {
  const arquivo = (caminho) => caminho.split("/").pop() || "index.html";
  const atual = arquivo(location.pathname);
  document.querySelectorAll(".destinos a[href]").forEach((a) => {
    const href = a.getAttribute("href");
    if (href.includes("#") || href.startsWith("http")) return; // âncoras e WhatsApp continuam
    if (arquivo(href) === atual) a.closest("li").hidden = true;
  });
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
const TIPOS = ["individual", "empresa", "odonto", "vida"];

// Máscara (48) 99999-9999
function mascaraWhats(valor) {
  const d = soDigitos(valor).slice(0, 11);
  if (d.length <= 2) return d.length ? `(${d}` : "";
  if (d.length <= 7) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}

function initForm() {
  const forms = [...document.querySelectorAll(".form-cotacao")];
  if (!forms.length) return;

  // Pré-seleção do tipo: link clicado > ?tipo= (na URL ou depois de #cotacao) > data-tipo da página
  const selecionarTipo = (tipo) => {
    if (TIPOS.includes(tipo)) forms.forEach((f) => (f.elements.tipo.value = tipo));
  };
  const tipoDaUrl = () => {
    const daBusca = new URLSearchParams(location.search).get("tipo");
    const doHash = (location.hash.split("?")[1] || "") && new URLSearchParams(location.hash.split("?")[1]).get("tipo");
    return doHash || daBusca;
  };
  selecionarTipo(document.body.dataset.tipo);
  selecionarTipo(tipoDaUrl());
  // "#cotacao?tipo=empresa" não é um id válido: rola até o formulário
  if (location.hash.startsWith("#cotacao?")) document.getElementById("cotacao")?.scrollIntoView();
  window.addEventListener("hashchange", () => selecionarTipo(tipoDaUrl()));
  document.addEventListener("click", (e) => {
    const link = e.target.closest("a[data-tipo]");
    if (link) selecionarTipo(link.dataset.tipo);
  });

  let seq = 0;
  forms.forEach((form) => {
    const campos = form.elements;

    // Mensagem de erro ligada a cada campo obrigatório
    const erro = (campo) => {
      let el = campo.parentElement.querySelector(".field-erro");
      if (!el) {
        el = document.createElement("small");
        el.className = "field-erro";
        el.id = `erro-${++seq}`;
        el.hidden = true;
        campo.parentElement.append(el);
        campo.setAttribute("aria-describedby", el.id);
      }
      return el;
    };
    const marcar = (campo, msg) => {
      const el = erro(campo);
      el.textContent = msg || "";
      el.hidden = !msg;
      campo.toggleAttribute("aria-invalid", !!msg);
      return !msg;
    };
    const validar = {
      tipo: (c) => marcar(c, c.value ? "" : "Escolha o tipo de plano."),
      nome: (c) => marcar(c, c.value.trim() ? "" : "Informe o seu nome."),
      whatsapp: (c) => marcar(c, soDigitos(c.value).length === 11 ? "" : "Informe o WhatsApp com DDD, 11 números."),
    };

    campos.whatsapp.addEventListener("input", (e) => {
      e.target.value = mascaraWhats(e.target.value);
    });
    Object.keys(validar).forEach((nome) => {
      const c = campos[nome];
      const ev = c.tagName === "SELECT" ? "change" : "blur";
      c.addEventListener(ev, () => c.hasAttribute("aria-invalid") || c.value ? validar[nome](c) : null);
      c.addEventListener("input", () => c.hasAttribute("aria-invalid") && validar[nome](c));
    });

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const invalidos = Object.keys(validar).filter((nome) => !validar[nome](campos[nome]));
      if (invalidos.length) {
        campos[invalidos[0]].focus();
        return;
      }

      const sel = campos.tipo;
      const linhas = [
        ["Tipo de plano", sel.options[sel.selectedIndex].text],
        ["Nome", campos.nome.value],
        ["WhatsApp", campos.whatsapp.value],
        ["Tem CNPJ ou MEI", campos.cnpj.value],
        ["Quantas pessoas", campos.pessoas.value],
        ["Cidade", campos.cidade.value],
        ["Plano atual", campos.plano_atual.value],
      ]
        .map(([rotulo, valor]) => [rotulo, String(valor).trim()])
        .filter(([, valor]) => valor)
        .map(([rotulo, valor]) => `${rotulo}: ${valor}`);

      const mensagem = ["Olá! Vim pelo site da Direcional e quero uma cotação.", ...linhas].join("\n");
      window.open(linkWhats(mensagem), "_blank", "noopener");
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initContato();
  initParaOnde();
  initImgFallback();
  initHeader();
  initMenu();
  initActiveNav();
  initReveal();
  initCounters();
  initDraw();
  initAcordeao();
  initToTop();
  initForm();
});
