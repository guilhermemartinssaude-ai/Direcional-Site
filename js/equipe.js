// Equipe da Direcional: edite só este array.
// foto: arquivo dentro de assets/fotos/equipe/ (sem o arquivo, aparecem as iniciais)
// whatsapp: formato internacional, só dígitos
const EQUIPE = [
  { nome: "Carla Martins", funcao: "Sócia-diretora", foto: "carla.jpg", whatsapp: "5548999561319", destaque: true },
  { nome: "Guilherme Martins", funcao: "Consultor de planos de saúde", foto: "guilherme.jpg", whatsapp: "5548998150085" },
  { nome: "Felipe", funcao: "Consultor de planos de saúde", foto: "felipe.jpg", whatsapp: "5548998100284" },
  { nome: "Katia", funcao: "Consultora de planos de saúde", foto: "katia.jpg", whatsapp: "5548998350168" },
  { nome: "Patricia Carrero", funcao: "Consultora de planos de saúde", foto: "patricia.jpg", whatsapp: "5548999900676" },
  { nome: "Taisa", funcao: "Cadastro e pós-venda", foto: "taisa.jpg", whatsapp: "5548996523833" },
];

(function renderEquipe() {
  const destaque = document.getElementById("equipeDestaque");
  const grade = document.getElementById("equipeGrid");
  if (!destaque || !grade) return;

  const esc = (s) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
  const iniciais = (nome) => {
    const p = nome.trim().split(/\s+/);
    return (p[0][0] + (p.length > 1 ? p[p.length - 1][0] : "")).toUpperCase();
  };

  const card = (m) => {
    const primeiroNome = m.nome.split(" ")[0];
    const texto = encodeURIComponent(`Olá, ${primeiroNome}! Vim pelo site da Direcional.`);
    return `
      <article class="membro card-hover${m.destaque ? " membro-destaque" : ""}">
        <div class="membro-foto" data-fallback>
          <img src="assets/fotos/equipe/${esc(m.foto)}" alt="Foto de ${esc(m.nome)}" loading="lazy">
          <span class="membro-iniciais" aria-hidden="true">${iniciais(m.nome)}</span>
        </div>
        <div>
          <h3>${esc(m.nome)}</h3>
          <p>${esc(m.funcao)}</p>
          <a class="btn btn-whats" href="https://wa.me/${m.whatsapp}?text=${texto}" target="_blank" rel="noopener">
            <svg class="ico" aria-hidden="true"><use href="#i-conversa"/></svg>Falar no WhatsApp<span class="sr-only"> com ${esc(primeiroNome)}</span>
          </a>
        </div>
      </article>`;
  };

  destaque.innerHTML = EQUIPE.filter((m) => m.destaque).map(card).join("");
  grade.innerHTML = EQUIPE.filter((m) => !m.destaque).map(card).join("");
})();
