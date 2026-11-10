/* =====================================================================
   FRAT.VFX — ARQUIVO DE CONFIGURAÇÃO
   Tudo o que muda no site fica aqui: e-mail, capas, vídeos, títulos e legendas.
   Edite, salve e recarregue a página.

   COMO INSERIR UM VÍDEO (vale para reel, Motion, Reels & Shorts e Outros):
     MP4 local ........ video: "midia/videos/meu-video.mp4"
     Link do YouTube .. video: "https://www.youtube.com/watch?v=XXXXXXXXXXX"
                        (também aceita youtu.be/..., /shorts/... e /embed/...)
   Nos dois casos o vídeo toca dentro do portfólio.

   Capas e fotos: coloque o arquivo na pasta indicada mantendo o nome,
   ou troque o caminho abaixo. Enquanto o arquivo não existir, o site
   mostra uma capa provisória.
   ===================================================================== */

window.FRAT_CONFIG = {

  email: "contato.rodrigofrat@gmail.com",

  // Logo: versão preta (fundos claros) e branca (fundos escuros)
  logo: {
    preto: "midia/logo/frat-vfx-preto.png",
    branco: "midia/logo/frat-vfx-branco.png"
  },

  // Mostra o caminho do arquivo nas capas provisórias (ajuda a saber o que falta).
  // Mude para false antes de publicar, se preferir.
  mostrarCaminhos: true,

  // ---------- CAPAS DOS 4 CARDS DA ABERTURA ----------
  capasAbertura: {
    motion: "midia/capas/motion.jpg",   // frame de um trabalho de motion
    eu:     "midia/capas/eu.jpg",       // sua foto (o site deixa em P&B)
    reels:  "midia/capas/reels.jpg",    // frame de uma edição curta
    outros: "midia/capas/outros.jpg"    // você operando a câmera
  },

  // ---------- REEL DE APRESENTAÇÃO (seção Sobre mim) ----------
  reel: {
    titulo: "Reel FRAT.VFX",
    capa: "midia/capas/reel-capa.jpg",
    video: "midia/videos/web/reel-frat.mp4"
    // video: "https://www.youtube.com/watch?v=XXXXXXXXXXX"
  },

  sobre: {
    texto: "Sou Rodrigo Melo, também conhecido como Frat. Faço vídeo desde 2014 e fundei a FRAT.VFX. Trabalho com edição de vídeo, motion design e captação. Meu canal no YouTube chegou a 1,4 milhão de inscritos.",
    // icone é opcional: se o arquivo existir, substitui a sigla
    ferramentas: [
      { nome: "After Effects", sigla: "Ae", icone: "midia/icones/after-effects.png" },
      { nome: "Premiere Pro",  sigla: "Pr", icone: "midia/icones/premiere-pro.png" },
      { nome: "CapCut",        sigla: "Cc", icone: "midia/icones/capcut.png" },
      { nome: "Claude",        sigla: "Cl", icone: "midia/icones/claude.png" },
      { nome: "ChatGPT",       sigla: "Gp", icone: "midia/icones/chatgpt.png" }
    ]
  },

  // ---------- MOTION (trabalhos completos, 16:9) ----------
  // Para adicionar um projeto, copie um bloco { ... }, cole no fim e edite.
  // "papel" é opcional — deixe "" para não mostrar descrição.
  motion: [
    { titulo: "Projeto Motion 01", papel: "", capa: "midia/capas/motion-01.jpg", video: "midia/videos/web/motion-01.mp4" },
    { titulo: "Projeto Motion 02", papel: "",capa: "midia/capas/motion-02.jpg", video: "midia/videos/web/motion-02.mp4" },
    { titulo: "Projeto Motion 03", papel: "",                           capa: "midia/capas/motion-03.jpg", video: "midia/videos/web/motion-03.mp4" },
    { titulo: "Projeto Motion 04", papel: "",capa: "midia/capas/motion-04.jpg", video: "midia/videos/web/motion-04.mp4" }
  ],

  // ---------- REELS & SHORTS (vídeos curtos, 9:16) ----------
  shorts: [
    { titulo: "Short 01", capa: "midia/capas/FRAT_VFX_03_Azul_Klein.png", video: "midia/videos/web/short-01.mp4" },
    { titulo: "Short 02", capa: "midia/capas/FRAT_VFX_01_Verde_Acido.png", video: "midia/videos/web/short-02.mp4" },
    { titulo: "Short 03", capa: "midia/capas/FRAT_VFX_04_Rosa_Chiclete.png", video: "midia/videos/short-03.mp4" },
    { titulo: "Short 04", capa: "midia/capas/FRAT_VFX_06_Roxo_Ultravioleta.png", video: "midia/videos/short-04.mp4" },
    { titulo: "Short 05", capa: "midia/capas/FRAT_VFX_05_Laranja_Fluor.png", video: "midia/videos/web/short-05.mp4" }
    // Exemplo com YouTube Shorts:
    // { titulo: "Short 06", capa: "midia/capas/short-06.jpg", video: "https://www.youtube.com/shorts/XXXXXXXXXXX" }
  ],

  // ---------- OUTROS — Bastidores de gravação ----------
  // tipo: "foto" ou "video"   |   formato: "horizontal" ou "vertical"
  // Foto:  { tipo: "foto",  arquivo: "midia/fotos/bastidor-07.jpg", formato: "vertical", legenda: "..." }
  // Vídeo: { tipo: "video", video: "midia/videos/bastidor-08.mp4", capa: "midia/capas/bastidor-08.jpg", formato: "horizontal", legenda: "..." }
  outros: [
    { tipo: "foto",  arquivo: "midia/fotos/bastidor-01.jpg", formato: "vertical", legenda: "No set" },
    { tipo: "video", video: "midia/videos/web/bastidor-02.mp4", capa: "midia/capas/bastidor-02.jpg", formato: "vertical", legenda: "Filmando com uma YouTuber fitness" },
    { tipo: "foto",  arquivo: "midia/fotos/bastidor-03.jpg", formato: "vertical",   legenda: "" }
  ]
};
