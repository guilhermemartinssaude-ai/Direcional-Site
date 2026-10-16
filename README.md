# Site da Direcional Corretora de Seguros e Saúde

Site estático (HTML, CSS e JavaScript puro), publicado pelo GitHub Pages a partir da branch `main`.

## Páginas

| Arquivo | Página |
|---|---|
| `index.html` | Início |
| `quem-somos.html` | Quem somos, trajetória, adesão, equipe |
| `plano-de-saude-individual.html` | Plano individual, familiar e por adesão |
| `plano-de-saude-empresarial.html` | Plano empresarial e MEI |
| `plano-odontologico.html` | Plano odontológico |
| `seguro-de-vida.html` | Seguro de vida |
| `politica-de-privacidade.html` | Política de privacidade |

## Onde editar

- **Contatos** (WhatsApp, telefone, e-mail, Instagram, CNPJ, SUSEP, endereço): `js/config.js`.
  Campo vazio esconde o botão ou a linha correspondente em todo o site.
- **Equipe**: array em `js/equipe.js`. A seção está oculta; para ativar, remova `hidden`
  da seção `#equipe` em `quem-somos.html` e do item "Nossa equipe" do menu (em todas as páginas).
- **Depoimentos**: seção `#depoimentos` da home, oculta até haver depoimentos reais.
- **Clientes**: duplique o bloco marcado com `<!-- CLIENTE: duplicar este bloco -->`.
- **Trajetória**: duplique o bloco marcado com `<!-- MARCO: duplicar e editar -->`.
- **Foto do hero**: procure `<!-- FOTO HERO -->`.
- **Domínio**: troque `https://SEU-DOMINIO.com.br` em `sitemap.xml`.

## Imagens esperadas em `assets/`

Enquanto um arquivo não existe, o site mostra um fallback (nome ou iniciais).

- `logo-direcional.png`
- `operadoras/`: `amil.png`, `bradesco-saude.png`, `sulamerica.png`, `hapvida.png`, `tempomed.png`, `unimed.png`
- `clientes/`: `floripa-shopping.png`, `via-catarina.png`, `laboratorio-santa-luzia.png`, `transporte-publico.png`
- `administradoras/`: `hubcare.png`, `extramed.png`
- `fotos/equipe/`: `carla.jpg`, `guilherme.jpg`, `felipe.jpg`, `katia.jpg`, `patricia.jpg`, `taisa.jpg`
- `fotos/equipe-hero.jpg` (opcional)

## Blocos repetidos entre páginas

Cabeçalho, ícones, formulário, operadoras, clientes, adesão, "Para onde você quer ir?" e rodapé
ficam entre comentários `<!-- NOME:INICIO -->` e `<!-- NOME:FIM -->`. O HTML é idêntico em todas
as páginas: ao mudar um bloco, mude em todas.

## Como visualizar localmente

Abra o `index.html` no navegador, ou rode `python -m http.server 8080` nesta pasta e acesse
http://localhost:8080.
