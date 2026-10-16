// PLACEHOLDER: troque pelo número real de WhatsApp da Direcional (formato internacional, só dígitos)
const WHATSAPP_NUMBER = "5548900000000";

document.addEventListener("DOMContentLoaded", () => {
  const navToggle = document.getElementById("navToggle");
  const mainNav = document.querySelector(".main-nav");
  navToggle?.addEventListener("click", () => {
    mainNav.style.display = mainNav.style.display === "flex" ? "none" : "flex";
  });

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

    // TODO (próxima iteração): em vez de (ou além de) abrir o WhatsApp,
    // enviar esse lead direto pro CRM via POST para a API de leads do backend/.
  });
});
