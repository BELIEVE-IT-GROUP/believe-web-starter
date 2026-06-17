/* CSS de la landing NeuroRealidad, scopeado a .nr-shell. NO editar a mano. */
export const NR_CSS = `
:root{
  --bg:#060a18; --bg2:#091022; --ink:#eaf0ff; --muted:#a3b1d4; --soft:#c8d3f0;
  --cyan:#16b4ff; --cyan2:#7ad7ef; --deep:#0a1f4d; --warm:#ffce63;
  --line:rgba(140,170,255,.10); --line2:rgba(140,170,255,.18);
  --maxw:1160px;
  --ease:cubic-bezier(.16,.84,.3,1);
  --serif:'Fraunces',Georgia,serif; --sans:'Inter',system-ui,sans-serif;
}
*{box-sizing:border-box;margin:0;padding:0}
html{scroll-behavior:smooth;-webkit-text-size-adjust:100%}
.nr-shell{background:var(--bg);color:var(--ink);min-height:100vh;position:relative;isolation:isolate}
.nr-shell .bg{position:absolute;inset:0;z-index:0;pointer-events:none;
  background:
    radial-gradient(1200px 700px at 82% -10%,rgba(22,180,255,.18),transparent 58%),
    radial-gradient(900px 800px at -8% 18%,rgba(13,40,110,.5),transparent 60%),
    radial-gradient(700px 500px at 50% 115%,rgba(22,180,255,.10),transparent 60%),
    linear-gradient(transparent 0 47px,rgba(140,170,255,.035) 47px 48px),
    linear-gradient(90deg,transparent 0 47px,rgba(140,170,255,.035) 47px 48px);
  background-size:auto,auto,auto,48px 48px,48px 48px}
.wrap{max-width:var(--maxw);margin:0 auto;padding:0 28px;position:relative;z-index:1}
.col{max-width:820px}
a{color:inherit;text-decoration:none}
:focus-visible{outline:2px solid var(--cyan);outline-offset:3px;border-radius:6px}
em{font-style:italic;color:var(--cyan2)}
h1,h2,h3{font-family:var(--serif);font-weight:600;line-height:1.04;letter-spacing:-.025em}
.display{font-size:clamp(46px,7.2vw,92px)}
.h2{font-size:clamp(32px,4.8vw,58px);line-height:1.05}
.lead{color:var(--soft);font-size:clamp(18px,2vw,21px);line-height:1.6}
.muted{color:var(--muted)}
.eyebrow{font-family:var(--sans);font-size:12.5px;letter-spacing:.22em;text-transform:uppercase;color:var(--cyan2);font-weight:700;display:inline-flex;align-items:center;gap:12px}
.eyebrow::before{content:"";width:30px;height:1px;background:linear-gradient(90deg,var(--cyan),transparent)}
section{padding:clamp(80px,13vw,160px) 0;position:relative}
.btn{display:inline-flex;align-items:center;gap:10px;font-family:var(--sans);font-weight:600;font-size:16px;padding:17px 28px;border-radius:999px;border:1px solid transparent;transition:transform .3s var(--ease),box-shadow .3s var(--ease),border-color .3s,color .3s;cursor:pointer}
.btn--primary{background:var(--cyan);color:#02101f;box-shadow:0 10px 40px rgba(22,180,255,.35)}
.btn--primary:hover{transform:translateY(-2px);box-shadow:0 16px 60px rgba(22,180,255,.55)}
.btn--ghost{border-color:rgba(111,210,236,.32);color:var(--cyan2);background:rgba(22,180,255,.04)}
.btn--ghost:hover{border-color:var(--cyan2);color:var(--ink);background:rgba(22,180,255,.10)}
.price{opacity:.75;font-weight:500;margin-left:2px}

/* NAV */
.nav{position:sticky;top:0;z-index:50;backdrop-filter:blur(16px);background:rgba(6,10,24,.66);border-bottom:1px solid var(--line)}
.nav__row{display:flex;align-items:center;justify-content:space-between;height:70px}
.wm{font-family:var(--sans);font-weight:800;font-size:20px;letter-spacing:-.03em}
.wm span{color:var(--cyan2)}
.wm .tm{font-size:.5em;vertical-align:super;color:var(--cyan2);font-weight:600;letter-spacing:0}
.nav__links{display:flex;gap:30px;font-size:14.5px;color:var(--muted);font-weight:500}
.nav__links a:hover{color:var(--cyan2)}
.nav .btn{padding:11px 20px;font-size:14px}
@media(max-width:880px){.nav__links{display:none}}

/* HERO */
.hero{padding-top:clamp(48px,7vw,86px);padding-bottom:clamp(70px,9vw,120px)}
.hero__grid{display:grid;grid-template-columns:1.04fr .96fr;gap:clamp(36px,5vw,72px);align-items:center}
.hero .display{margin:20px 0 26px}
.hero .lead{max-width:40ch;margin-bottom:34px}
.hero .lead b{color:var(--ink);font-weight:600}
.hero__cta{display:flex;gap:14px;flex-wrap:wrap;align-items:center}
.hero__trust{display:flex;align-items:center;gap:14px;margin-top:30px;font-size:14.5px;color:var(--muted);flex-wrap:wrap}
.stars{color:var(--warm);letter-spacing:3px;font-size:15px}
.hero__trust b{color:var(--soft);font-weight:600}
.bookwrap{position:relative;display:flex;justify-content:center}
.bookimg{width:min(400px,90%);height:auto;border-radius:8px;filter:drop-shadow(0 50px 80px rgba(0,0,0,.65)) drop-shadow(0 0 50px rgba(22,180,255,.25));animation:float 7s var(--ease) infinite;will-change:transform}
@keyframes float{0%,100%{transform:translateY(0) rotate(-1.2deg)}50%{transform:translateY(-16px) rotate(1deg)}}
.book__glow{position:absolute;inset:4% 8% 6%;z-index:-1;background:radial-gradient(closest-side,rgba(22,180,255,.42),transparent 72%);filter:blur(34px)}
.hero__badge{position:absolute;bottom:9%;left:-7%;background:rgba(9,16,36,.82);backdrop-filter:blur(8px);border:1px solid var(--line2);border-radius:14px;padding:13px 18px;font-size:13px;color:var(--muted);box-shadow:0 24px 60px rgba(0,0,0,.55);max-width:200px}
.hero__badge b{display:block;font-family:var(--serif);font-size:22px;color:var(--ink);margin-bottom:3px;font-weight:600;letter-spacing:-.02em}
@media(max-width:880px){.hero__grid{grid-template-columns:1fr;gap:40px}.hero__art{order:-1;max-width:360px;margin:0 auto}.hero .lead{max-width:none}.hero__badge{left:0}}

/* BIG STATEMENT */
.say{text-align:center}
.say .k{font-family:var(--serif);font-size:clamp(30px,5.2vw,62px);line-height:1.12;font-weight:600;letter-spacing:-.025em;max-width:18ch;margin:22px auto 0}
.say .sub{font-size:clamp(18px,2vw,21px);color:var(--muted);max-width:58ch;margin:30px auto 0;line-height:1.7}
.say .sub b{color:var(--soft);font-weight:600}
.rule{width:1px;height:64px;margin:0 auto 6px;background:linear-gradient(var(--cyan),transparent)}

/* RECONOCES — editorial list, no cards */
.recog{display:grid;gap:0;margin-top:clamp(40px,6vw,72px);border-top:1px solid var(--line)}
.recog__row{display:grid;grid-template-columns:auto 1fr;gap:clamp(20px,4vw,56px);padding:clamp(28px,4vw,44px) 0;border-bottom:1px solid var(--line);align-items:baseline;transition:padding-left .4s var(--ease)}
.recog__row:hover{padding-left:12px}
.recog__n{font-family:var(--serif);font-style:italic;font-size:clamp(28px,4vw,46px);color:var(--cyan2);min-width:1.6em}
.recog__row h3{font-family:var(--serif);font-size:clamp(22px,2.6vw,30px);font-weight:500;letter-spacing:-.02em;max-width:24ch}
.recog__row p{color:var(--muted);font-size:17px;margin-top:10px;max-width:54ch}
@media(min-width:880px){.recog__t{display:grid;grid-template-columns:1.1fr 1fr;gap:48px;align-items:baseline}}

/* CAMINO — timeline */
.line{position:relative;margin-top:clamp(48px,7vw,80px);display:grid;grid-template-columns:repeat(3,1fr);gap:clamp(20px,3vw,40px)}
.line::before{content:"";position:absolute;top:46px;left:8%;right:8%;height:1px;background:linear-gradient(90deg,transparent,var(--line2) 12%,var(--line2) 88%,transparent)}
.mv{position:relative;text-align:center}
.mv__dot{width:13px;height:13px;border-radius:50%;background:var(--cyan);margin:40px auto 0;box-shadow:0 0 0 6px rgba(22,180,255,.14),0 0 30px var(--cyan)}
.mv__d{font-family:var(--serif);font-size:clamp(64px,9vw,104px);line-height:.9;font-weight:600;color:transparent;-webkit-text-stroke:1.5px rgba(111,210,236,.45);margin:24px 0 6px}
.mv .t{font-family:var(--sans);font-weight:700;letter-spacing:.04em;font-size:13px;text-transform:uppercase;color:var(--cyan2)}
.mv h3{font-family:var(--serif);font-size:clamp(22px,2.6vw,28px);font-weight:600;margin:8px 0 12px}
.mv p{color:var(--muted);font-size:16px;max-width:34ch;margin:0 auto}
@media(max-width:760px){.line{grid-template-columns:1fr;gap:48px}.line::before{display:none}.mv__dot{margin-top:0}}

/* PROMESA — full editorial moment */
.vow{text-align:center;background:linear-gradient(180deg,transparent,rgba(22,180,255,.05),transparent)}
.vow p{font-family:var(--serif);font-weight:500;font-size:clamp(30px,5.4vw,66px);line-height:1.12;letter-spacing:-.025em;max-width:16ch;margin:0 auto}
.vow .two{font-size:clamp(19px,2.3vw,26px);font-style:italic;color:var(--soft);max-width:40ch;margin:32px auto 0;line-height:1.4}

/* DENTRO — asymmetric */
.inside{display:grid;grid-template-columns:.92fr 1.08fr;gap:clamp(40px,6vw,80px);align-items:center}
.inside__art{display:flex;justify-content:center}
.inside__art img{display:block;width:min(360px,82%);height:auto;filter:drop-shadow(0 40px 70px rgba(0,0,0,.55)) drop-shadow(0 0 40px rgba(22,180,255,.18));transform:rotate(-3deg);transition:transform .6s var(--ease)}
.inside__art:hover img{transform:rotate(0)}
.bullets{display:grid;gap:0}
.bullets .b{padding:22px 0;border-top:1px solid var(--line)}
.bullets .b:first-child{border-top:none}
.bullets h3{font-family:var(--sans);font-weight:700;font-size:19px;letter-spacing:-.01em;margin-bottom:6px}
.bullets p{color:var(--muted);font-size:16px;max-width:48ch}
@media(max-width:880px){.inside{grid-template-columns:1fr;gap:36px}.inside__art{max-width:340px}}

/* AUTHOR */
.author{display:grid;grid-template-columns:.82fr 1.18fr;gap:clamp(36px,5vw,72px);align-items:center}
.author__photo{border-radius:16px;overflow:hidden;border:1px solid var(--line2);box-shadow:0 40px 90px rgba(0,0,0,.5);position:relative}
.author__photo img{display:block;width:100%;filter:grayscale(1) contrast(1.05)}
.author__photo::after{content:"";position:absolute;inset:0;background:linear-gradient(180deg,transparent 55%,rgba(6,10,24,.5));mix-blend-mode:multiply}
.author blockquote{font-family:var(--serif);font-size:clamp(24px,3.2vw,34px);line-height:1.28;font-style:italic;margin:18px 0 22px;letter-spacing:-.02em}
.author .meta{display:flex;gap:28px;flex-wrap:wrap;margin-top:24px;padding-top:24px;border-top:1px solid var(--line)}
.author .meta div{font-size:14px;color:var(--muted)}
.author .meta b{display:block;font-family:var(--serif);font-size:26px;color:var(--cyan2);font-weight:600;line-height:1}
.logos{display:flex;gap:22px;flex-wrap:wrap;margin-top:20px;opacity:.55;font-weight:700;font-size:11.5px;letter-spacing:.16em;color:var(--muted)}
@media(max-width:880px){.author{grid-template-columns:1fr}.author__photo{max-width:380px}}

/* TESTIMONIOS — carrusel autoplay */
.tcar{margin-top:clamp(40px,6vw,64px);overflow:hidden;position:relative;-webkit-mask:linear-gradient(90deg,transparent,#000 6%,#000 94%,transparent);mask:linear-gradient(90deg,transparent,#000 6%,#000 94%,transparent)}
.ttrack{display:flex;width:max-content;animation:tscroll 75s linear infinite}
.tcar:hover .ttrack{animation-play-state:paused}
@keyframes tscroll{to{transform:translateX(-50%)}}
.tq{flex:0 0 clamp(290px,78vw,390px);margin-right:20px;background:linear-gradient(180deg,rgba(255,255,255,.028),rgba(255,255,255,.008));border:1px solid var(--line);border-radius:18px;padding:30px;display:flex;flex-direction:column;gap:16px;min-height:240px}
.tq__stars{color:var(--warm);letter-spacing:2px;font-size:13px}
.tq p{font-family:var(--serif);font-size:18px;line-height:1.5;color:var(--soft);font-style:italic;letter-spacing:-.01em}
.tq__who{margin-top:auto;display:flex;align-items:center;gap:12px}
.tq__av{width:42px;height:42px;border-radius:50%;background:linear-gradient(140deg,#13224a,#0a1230);border:1px solid var(--line2);display:flex;align-items:center;justify-content:center;font-family:var(--sans);font-weight:700;font-size:15px;color:var(--cyan2);flex:0 0 auto}
.tq__who b{display:block;font-family:var(--sans);font-weight:600;font-size:15px;color:var(--ink)}
.tq__who span{font-size:13px;color:var(--muted)}
@media(prefers-reduced-motion:reduce){.tcar{overflow-x:auto}.ttrack{animation:none}}

/* OFFER */
.offer{display:grid;grid-template-columns:1.25fr 1fr 1fr;gap:18px;margin-top:clamp(40px,5vw,64px);align-items:start}
.tier{border:1px solid var(--line);border-radius:20px;padding:clamp(26px,3vw,36px);background:rgba(255,255,255,.015)}
.tier--main{border-color:rgba(22,180,255,.55);background:linear-gradient(180deg,rgba(22,180,255,.10),rgba(22,180,255,.01));box-shadow:0 30px 80px rgba(0,0,0,.4),0 0 60px rgba(22,180,255,.12);position:relative}
.tier--main .badge{position:absolute;top:-12px;left:clamp(26px,3vw,36px);background:var(--cyan);color:#02101f;font-family:var(--sans);font-size:11px;font-weight:800;letter-spacing:.08em;padding:6px 14px;border-radius:999px}
.tier h3{font-family:var(--sans);font-weight:700;font-size:18px;letter-spacing:-.01em}
.tier .p{font-family:var(--serif);font-weight:600;font-size:clamp(38px,5vw,52px);margin:14px 0 4px;letter-spacing:-.02em}
.tier .p span{font-family:var(--sans);font-size:15px;color:var(--muted);font-weight:500}
.tier--main .p{color:var(--cyan2)}
.tier ul{list-style:none;margin:20px 0 26px;display:grid;gap:12px}
.tier li{font-size:15px;color:var(--muted);padding-left:26px;position:relative;line-height:1.45}
.tier li::before{content:"";position:absolute;left:2px;top:9px;width:8px;height:8px;border-radius:50%;background:var(--cyan2);opacity:.6}
.tier .btn{width:100%;justify-content:center}
@media(max-width:880px){.offer{grid-template-columns:1fr}}

/* FAQ */
.faq{margin-top:clamp(36px,5vw,56px);max-width:840px}
.faq details{border-top:1px solid var(--line);padding:24px 0}
.faq details:last-child{border-bottom:1px solid var(--line)}
.faq summary{font-family:var(--serif);font-size:clamp(20px,2.4vw,25px);font-weight:500;cursor:pointer;list-style:none;display:flex;justify-content:space-between;gap:20px;letter-spacing:-.01em}
.faq summary::-webkit-details-marker{display:none}
.faq summary::after{content:"+";color:var(--cyan2);font-family:var(--sans);font-weight:400;transition:transform .3s var(--ease)}
.faq details[open] summary::after{transform:rotate(45deg)}
.faq p{color:var(--muted);margin-top:14px;max-width:72ch;font-size:16.5px}

/* FINAL */
.final{text-align:center;background:radial-gradient(900px 420px at 50% -10%,rgba(22,180,255,.2),transparent 66%)}
.final h2{font-size:clamp(38px,6.4vw,82px);max-width:13ch;margin:18px auto 22px}
.final .lead{max-width:48ch;margin:0 auto 34px}
.leadform{display:flex;gap:10px;max-width:470px;margin:0 auto;flex-wrap:wrap;justify-content:center}
.leadform input{flex:1;min-width:240px;background:rgba(255,255,255,.03);border:1px solid var(--line2);border-radius:999px;padding:16px 22px;color:var(--ink);font-family:var(--sans);font-size:15px}
.leadform input:focus{outline:none;border-color:var(--cyan)}
.or{margin:26px 0 16px;font-size:13px;color:var(--muted);letter-spacing:.1em;text-transform:uppercase}
.micro{margin-top:16px;font-size:13px;color:var(--muted)}

footer{border-top:1px solid var(--line);padding:48px 0 64px;color:var(--muted);font-size:14px}
.foot{display:flex;justify-content:space-between;gap:20px;flex-wrap:wrap;align-items:center}

.reveal{opacity:0;transform:translateY(22px);transition:opacity .8s var(--ease),transform .8s var(--ease)}
.reveal.in{opacity:1;transform:none}
@media(prefers-reduced-motion:reduce){*{animation:none!important;transition:none!important}.reveal{opacity:1;transform:none}}
`;
