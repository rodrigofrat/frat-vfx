# Portfólio FRAT.VFX — como atualizar

Tudo que muda (e-mail, capas, vídeos, títulos, legendas) fica em **`config.js`**. Edite, salve e recarregue a página.

```
site/
  index.html        página
  config.js         ← EDITE AQUI
  css/estilo.css    visual
  js/app.js         funcionamento
  midia/logo/       logo preta e branca
  midia/capas/      capas
  midia/fotos/      fotos de bastidores
  midia/videos/     vídeos MP4
  midia/icones/     ícones das ferramentas (opcional)
```

Enquanto um arquivo não existir, aparece uma capa provisória. Antes de publicar, troque `mostrarCaminhos: true` para `false` se não quiser exibir os caminhos nas capas provisórias.

## Trocar a foto do card Eu
Salve sua foto como `midia/capas/eu.jpg` (vertical, 3:4, ~900×1200). O site deixa em preto e branco e aplica o recorte de colagem.

## Trocar a capa de Outros
Salve como `midia/capas/outros.jpg` (vertical, 3:4). A faixa de claquete e o REC são aplicados por cima.

## Colocar o reel
- MP4: salve como `midia/videos/reel-frat.mp4`.
- YouTube: em `config.js`, troque `video` do bloco `reel` pelo link: `video: "https://www.youtube.com/watch?v=XXXXXXXXXXX"`.
- Capa do player: `midia/capas/reel-capa.jpg` (16:9).

## Adicionar um projeto (Motion ou Reels & Shorts)
Em `config.js`, copie uma linha da lista `motion` (ou `shorts`), cole no fim e edite:
```js
{ titulo: "Nome do projeto", papel: "Motion design", capa: "midia/capas/motion-05.jpg", video: "midia/videos/motion-05.mp4" },
```
Coloque vírgula entre os blocos. `papel` é opcional. Capas: 9:16 em Motion e em Shorts.

## Fotos e vídeos de bastidores (Outros)
```js
{ tipo: "foto",  arquivo: "midia/fotos/bastidor-07.jpg", formato: "vertical", legenda: "No set" },
{ tipo: "video", video: "midia/videos/bastidor-08.mp4", capa: "midia/capas/bastidor-08.jpg", formato: "horizontal", legenda: "" },
```
`formato`: `"horizontal"` ou `"vertical"`. Vídeo também aceita link do YouTube.

## Testar os players no seu computador
- Abrir o `index.html` com dois cliques funciona para fotos e MP4.
- O YouTube **não toca** em arquivo aberto direto (endereço `file://`). Rode um servidor local na pasta `site`:
  `python3 -m http.server 8000` e acesse `http://localhost:8000` (ou use a extensão Live Server do VS Code).
- Teste: clique no play do reel, num projeto Motion (janela 16:9), num Short (janela vertical) e num item de Outros. Feche com o botão ou Esc.
- Se aparecer “Vídeo ainda não adicionado”, o caminho no `config.js` não bate com o arquivo (atenção a maiúsculas e extensão).

## Publicar a atualização
Qualquer hospedagem estática serve. Exemplos:
- **Netlify Drop** (app.netlify.com/drop): arraste a pasta `site`. Para atualizar, arraste de novo em *Deploys*.
- **GitHub Pages / Vercel / Cloudflare Pages**: envie o conteúdo da pasta `site`.
- **Hospedagem com FTP**: envie o conteúdo de `site` para `public_html`.

Vídeos MP4 pesados deixam o site lento e podem passar do limite da hospedagem — para arquivos grandes, prefira YouTube (não listado também funciona).
