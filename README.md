# Landing Page — Direcional Corretora

Primeira versão da landing page, inspirada na estrutura do site da América
Broker, com a identidade visual da Direcional (cores oficiais da marca).

## Como visualizar localmente

Não precisa de build — é HTML/CSS/JS puro.

```bash
cd site
python3 -m http.server 8080
# depois abra http://localhost:8080
```

Ou simplesmente abra o `index.html` direto no navegador.

## O que falta pra ficar pronta pra publicar

Marcado com `PLACEHOLDER` no código — procure por esse termo nos arquivos:

- [ ] **Logo oficial**: hoje usa `assets/logo-placeholder.svg` (um wordmark
      provisório). Troque pelo arquivo real da logo (`.svg` de preferência)
      e atualize as referências em `index.html`.
- [ ] **WhatsApp real**: definido em `js/main.js` na constante
      `WHATSAPP_NUMBER` (hoje é um número fictício). Também aparece no
      rodapé do `index.html`.
- [ ] **Depoimentos reais**: os 3 cards na seção "O que nossos clientes
      dizem" estão com texto de exemplo — troque por relatos reais antes de
      publicar (não deixe no ar como se fossem reais).
- [ ] **Números de confiança**: "+X anos de experiência" e "+X mil vidas
      protegidas" no hero — preencha com os números reais da Direcional.
- [ ] **Endereço real** no rodapé.
- [ ] **Links de redes sociais** no rodapé (hoje apontam pra `#`).

## Decisões de design

- **Cores**: paleta oficial (azul `#00AFF0`, verde-água `#00BFA5`, navy
  `#10233F`) aplicada na proporção 60-30-10 da diretriz de marca da
  Direcional — navy domina a estrutura (header, hero, rodapé), branco/neutro
  carrega o conteúdo, azul é o destaque de CTA.
- **Tipografia**: Manrope (títulos) + IBM Plex Sans (corpo/UI), via Google
  Fonts.
- **Formulário de cotação**: por enquanto abre o WhatsApp com a mensagem
  pré-preenchida (zero infra necessária). Próxima iteração natural: ligar
  esse formulário na API de leads do `backend/` deste repositório, já que
  ele já tem um módulo de Leads pronto.

## Próximos passos sugeridos

Depois que a landing estiver com os dados reais, o combinado foi migrar
esse diretório `site/` pra um repositório separado.
