/* CSS verbatim del HTML birdman original. NO editar: garantiza fidelidad 100%. */
export const BIRDMAN_CSS = `
  :root{
    /* Color · design system (dark) */
    --bg:#000000;
    --surface:#121212;
    --surface-2:oklch(17% 0 0);
    --surface-3:oklch(21% 0 0);
    --text:#ffffff;
    --muted:oklch(72% 0 0);
    --faint:oklch(55% 0 0);
    --accent:#ff8400;
    --accent-hover:oklch(80% 0.16 62);
    --accent-soft:oklch(58% 0.16 62 / .12);
    --on-accent:#141414;
    --success:#25d366;
    --on-success:#07210f;
    --danger:oklch(64% 0.21 25);
    --border:oklch(28% 0 0);
    --border-2:oklch(34% 0 0);
    --border-strong:#d5d8dc;

    --font:'BlauerNue-Medium','Helvetica Neue',Helvetica,Arial,sans-serif;
    --mono:ui-monospace,'SF Mono',Menlo,Consolas,monospace;
    --w-body:500; --w-strong:700;

    --s1:2.5px; --s2:8px; --s3:10px; --s4:12px; --s5:20px; --s6:24px; --s7:32px; --s8:48px;
    --radius:10px; --pill:50px;
    --dur:200ms; --dur2:300ms; --ease:cubic-bezier(.2,.6,.2,1);
    --focus:0 0 0 2px var(--bg),0 0 0 4px var(--border-strong);
    --maxw:1200px;
  }
  *,*::before,*::after{ box-sizing:border-box; }
  @media (prefers-reduced-motion:reduce){ *{ transition:none!important; animation:none!important; scroll-behavior:auto!important; } }
  html{ scroll-behavior:smooth; }
  body{
    margin:0; background:var(--bg); color:var(--text);
    font-family:var(--font); font-weight:var(--w-body);
    font-size:17px; line-height:1.6; -webkit-font-smoothing:antialiased; text-rendering:optimizeLegibility;
    overflow-x:hidden;
  }
  ::selection{ background:var(--accent); color:var(--on-accent); }
  a{ color:inherit; text-decoration:none; }
  :focus-visible{ outline:none; box-shadow:var(--focus); border-radius:6px; }
  img,svg{ max-width:100%; display:block; }
  .num{ font-variant-numeric:tabular-nums; }
  .mono{ font-family:var(--mono); }

  .wrap{ max-width:var(--maxw); margin:0 auto; padding:0 var(--s6); }
  section{ padding:96px 0; position:relative; }
  .eyebrow{ font-size:13px; font-weight:var(--w-strong); text-transform:uppercase; letter-spacing:.14em; color:var(--accent); margin:0 0 var(--s4); }
  h2.title{ font-size:clamp(28px,3.4vw,38px); line-height:1.12; font-weight:var(--w-strong); letter-spacing:-.02em; margin:0 0 var(--s5); text-wrap:balance; max-width:18ch; }
  .lead{ font-size:19px; color:var(--muted); max-width:60ch; margin:0 0 var(--s7); }
  .center{ text-align:center; }
  .center .title,.center .lead{ margin-left:auto; margin-right:auto; }

  /* Buttons */
  .btn{ font-family:inherit; font-size:16px; font-weight:var(--w-strong); line-height:1;
    display:inline-flex; align-items:center; justify-content:center; gap:var(--s2);
    min-height:50px; padding:0 26px; border-radius:var(--pill); border:1px solid transparent; cursor:pointer;
    transition:background var(--dur) var(--ease),border-color var(--dur) var(--ease),transform var(--dur) var(--ease); }
  .btn--primary{ background:var(--accent); color:var(--on-accent); }
  .btn--primary:hover{ background:var(--accent-hover); }
  .btn--primary:active{ transform:translateY(1px); }
  .btn--ghost{ background:transparent; color:var(--text); border-color:var(--border-2); }
  .btn--ghost:hover{ background:var(--surface-2); border-color:var(--border-strong); }
  .btn--block{ width:100%; }
  .btn[disabled]{ opacity:.45; cursor:not-allowed; }

  /* Nav */
  header.nav{ position:sticky; top:0; z-index:50; background:oklch(0% 0 0 / .72); backdrop-filter:blur(14px); border-bottom:1px solid var(--border); }
  .nav__row{ display:flex; align-items:center; gap:var(--s6); height:68px; }
  .brand{ display:flex; align-items:center; gap:10px; font-weight:var(--w-strong); font-size:20px; letter-spacing:-.01em; }
  .brand .logo{ height:24px; width:auto; display:block; }
  .brand small{ font-weight:var(--w-body); font-size:11px; color:var(--faint); letter-spacing:.08em; text-transform:uppercase; margin-left:2px; }
  .nav__links{ display:flex; gap:var(--s3); margin-left:auto; }
  .nav__links a{ color:var(--muted); padding:9px 12px; border-radius:8px; font-size:15px; font-weight:var(--w-strong); }
  .nav__links a:hover{ color:var(--text); background:var(--surface-2); }
  .nav__cta{ margin-left:var(--s4); }

  /* Hero */
  .hero{ padding:72px 0 88px; }
  .hero__grid{ display:grid; grid-template-columns:1.05fr .95fr; gap:var(--s8); align-items:center; }
  .tag{ display:inline-flex; align-items:center; gap:8px; font-size:13px; font-weight:var(--w-strong); color:var(--muted);
    border:1px solid var(--border-2); border-radius:var(--pill); padding:6px 14px; margin-bottom:var(--s6); }
  .tag .dot{ width:7px; height:7px; border-radius:50%; background:var(--success); box-shadow:0 0 0 4px color-mix(in oklch,var(--success) 22%,transparent); }
  .hero h1{ font-size:clamp(34px,4.6vw,56px); line-height:1.06; font-weight:var(--w-strong); letter-spacing:-.025em; margin:0 0 var(--s5); text-wrap:balance; }
  .hero h1 em{ font-style:normal; color:var(--accent); }
  .hero p.sub{ font-size:20px; color:var(--muted); max-width:46ch; margin:0 0 var(--s7); }
  .hero__cta{ display:flex; gap:var(--s4); flex-wrap:wrap; }
  .hero__note{ margin-top:var(--s6); font-size:14px; color:var(--faint); max-width:44ch; }
  .hero__note strong{ color:var(--muted); font-weight:var(--w-strong); }

  /* Dashboard mock (hero + tech) */
  .panel{ background:linear-gradient(180deg,var(--surface-2),var(--surface)); border:1px solid var(--border-2); border-radius:16px; padding:18px; box-shadow:0 30px 80px -40px #000; }
  .panel__bar{ display:flex; align-items:center; gap:8px; margin-bottom:14px; }
  .panel__bar .lights{ display:flex; gap:6px; }
  .panel__bar .lights i{ width:10px; height:10px; border-radius:50%; background:var(--surface-3); }
  .panel__bar .ttl{ font-size:12px; color:var(--faint); margin-left:6px; letter-spacing:.04em; }
  .panel__bar .live{ margin-left:auto; font-size:11px; font-weight:var(--w-strong); color:var(--success); display:flex; align-items:center; gap:6px; }
  .panel__bar .live::before{ content:""; width:7px; height:7px; border-radius:50%; background:var(--success); }
  .kpis{ display:grid; grid-template-columns:repeat(3,1fr); gap:10px; margin-bottom:12px; }
  .kpi{ background:var(--bg); border:1px solid var(--border); border-radius:var(--radius); padding:12px; }
  .kpi .k{ font-size:11px; text-transform:uppercase; letter-spacing:.06em; color:var(--faint); margin:0 0 6px; }
  .kpi .v{ font-size:24px; font-weight:var(--w-strong); line-height:1; margin:0; }
  .kpi .d{ font-size:11px; margin:6px 0 0; color:var(--success); }
  .kpi .d.warn{ color:var(--accent); }
  .chartcard{ background:var(--bg); border:1px solid var(--border); border-radius:var(--radius); padding:12px 12px 6px; }
  .chartcard .ch-h{ display:flex; justify-content:space-between; align-items:baseline; margin-bottom:8px; }
  .chartcard .ch-h span{ font-size:12px; color:var(--faint); }
  .chartcard .ch-h b{ font-size:13px; color:var(--success); font-weight:var(--w-strong); }
  .track{ margin-top:12px; display:flex; flex-direction:column; gap:8px; }
  .track .row{ display:flex; align-items:center; gap:10px; font-size:12px; }
  .track .row .id{ font-family:var(--mono); color:var(--muted); width:84px; }
  .track .row .dest{ color:var(--muted); flex:1; }
  .pill-s{ font-size:11px; font-weight:var(--w-strong); padding:2px 9px; border-radius:var(--pill); border:1px solid var(--border-2); color:var(--muted); }
  .pill-s.ok{ color:var(--success); border-color:color-mix(in oklch,var(--success) 40%,transparent); }
  .pill-s.go{ color:var(--accent); border-color:color-mix(in oklch,var(--accent) 40%,transparent); }

  /* Generic grids + cards */
  .grid{ display:grid; gap:18px; }
  .g3{ grid-template-columns:repeat(3,1fr); }
  .g2{ grid-template-columns:repeat(2,1fr); }
  .card{ background:var(--surface); border:1px solid var(--border); border-radius:14px; padding:26px; transition:border-color var(--dur) var(--ease),background var(--dur) var(--ease); }
  .card:hover{ border-color:var(--border-2); background:var(--surface-2); }
  .card h3{ font-size:20px; font-weight:var(--w-strong); margin:14px 0 8px; letter-spacing:-.01em; }
  .card p{ margin:0; color:var(--muted); font-size:16px; }
  .ico{ width:42px; height:42px; border-radius:11px; display:grid; place-items:center; background:var(--accent-soft); color:var(--accent); border:1px solid color-mix(in oklch,var(--accent) 30%,transparent); }
  .ico svg{ width:22px; height:22px; }

  /* Problems */
  .prob-grid{ display:grid; grid-template-columns:repeat(2,1fr); gap:12px; margin-bottom:var(--s8); }
  .prob{ display:flex; align-items:flex-start; gap:14px; background:var(--surface); border:1px solid var(--border); border-radius:12px; padding:18px 20px; }
  .prob .x{ flex:none; width:26px; height:26px; border-radius:8px; display:grid; place-items:center; background:color-mix(in oklch,var(--danger) 16%,transparent); color:var(--danger); border:1px solid color-mix(in oklch,var(--danger) 35%,transparent); font-weight:var(--w-strong); }
  .prob p{ margin:0; font-size:16px; color:var(--text); }
  .cta-band{ background:linear-gradient(120deg,var(--surface-2),var(--surface)); border:1px solid var(--border-2); border-radius:16px; padding:28px 32px; display:flex; align-items:center; gap:var(--s6); flex-wrap:wrap; }
  .cta-band p{ margin:0; font-size:20px; font-weight:var(--w-strong); flex:1; min-width:240px; }

  /* Solutions list */
  .sol{ display:grid; grid-template-columns:220px 1fr; gap:var(--s6); padding:28px 0; border-top:1px solid var(--border); }
  .sol:first-of-type{ border-top:0; }
  .sol h3{ font-size:22px; font-weight:var(--w-strong); margin:0; letter-spacing:-.01em; }
  .sol .body{ color:var(--muted); font-size:17px; }
  .sol .body strong{ color:var(--text); }
  .chips{ display:flex; flex-wrap:wrap; gap:10px; margin-top:14px; }
  .chip{ font-size:13px; font-weight:var(--w-strong); color:var(--muted); border:1px solid var(--border-2); border-radius:var(--pill); padding:7px 14px; }

  /* Industries */
  .ind{ display:flex; flex-wrap:wrap; gap:12px; }
  .ind .item{ font-size:16px; font-weight:var(--w-strong); color:var(--text); background:var(--surface); border:1px solid var(--border); border-radius:var(--pill); padding:12px 22px; transition:border-color var(--dur),color var(--dur); }
  .ind .item:hover{ border-color:var(--accent); color:var(--accent); }

  /* Benefits */
  .ben{ display:grid; grid-template-columns:repeat(3,1fr); gap:14px; }
  .ben .b{ background:var(--surface); border:1px solid var(--border); border-radius:14px; padding:26px; }
  .ben .b .big{ font-size:34px; font-weight:var(--w-strong); letter-spacing:-.02em; }
  .ben .b .big.up{ color:var(--success); }
  .ben .b .big.down{ color:var(--accent); }
  .ben .b p{ margin:6px 0 0; color:var(--muted); font-size:16px; }

  /* Methodology */
  .method{ display:grid; grid-template-columns:repeat(7,1fr); gap:0; counter-reset:step; }
  .step{ position:relative; padding:22px 16px; text-align:center; }
  .step::before{ counter-increment:step; content:counter(step,decimal-leading-zero); font-family:var(--mono); font-size:12px; color:var(--accent); display:block; margin-bottom:10px; }
  .step .node{ width:14px; height:14px; border-radius:50%; background:var(--accent); margin:0 auto 14px; box-shadow:0 0 0 5px var(--accent-soft); position:relative; z-index:2; }
  .step::after{ content:""; position:absolute; top:calc(22px + 12px + 7px); left:50%; width:100%; height:2px; background:var(--border-2); z-index:1; }
  .step:last-child::after{ display:none; }
  .step h4{ font-size:15px; font-weight:var(--w-strong); margin:0; }
  .method-wrap{ position:relative; }

  /* Cases */
  .case{ background:var(--surface); border:1px solid var(--border); border-radius:16px; padding:28px; display:flex; flex-direction:column; gap:16px; }
  .case .ind-tag{ font-size:12px; font-weight:var(--w-strong); text-transform:uppercase; letter-spacing:.08em; color:var(--accent); }
  .case .qa{ font-size:15px; color:var(--muted); }
  .case .qa b{ color:var(--text); font-weight:var(--w-strong); display:block; margin-bottom:2px; font-size:13px; text-transform:uppercase; letter-spacing:.05em; }
  .case .res{ display:grid; grid-template-columns:repeat(3,1fr); gap:10px; margin-top:auto; padding-top:16px; border-top:1px solid var(--border); }
  .case .res .r{ text-align:center; }
  .case .res .r .n{ font-size:26px; font-weight:var(--w-strong); color:var(--success); line-height:1; }
  .case .res .r .l{ font-size:11px; color:var(--faint); margin-top:6px; }

  /* Calculator */
  .calc{ display:grid; grid-template-columns:1fr 1fr; gap:var(--s8); align-items:stretch; }
  .calc__form{ background:var(--surface); border:1px solid var(--border); border-radius:16px; padding:30px; }
  .field{ display:flex; flex-direction:column; gap:7px; margin-bottom:18px; }
  .field label{ font-size:13px; font-weight:var(--w-strong); text-transform:uppercase; letter-spacing:.05em; color:var(--muted); }
  .field .hint{ font-size:12px; color:var(--faint); }
  .control{ display:flex; align-items:center; background:var(--bg); border:1px solid var(--border); border-radius:var(--radius); transition:border-color var(--dur); }
  .control:focus-within{ border-color:var(--accent); }
  .control .pre{ padding:0 0 0 14px; color:var(--faint); font-weight:var(--w-strong); }
  .control input{ font-family:inherit; font-size:17px; color:var(--text); background:transparent; border:0; outline:0; padding:13px 14px; width:100%; }
  .control input::-webkit-outer-spin-button,.control input::-webkit-inner-spin-button{ -webkit-appearance:none; }
  .calc__out{ background:linear-gradient(160deg,var(--surface-2),var(--surface)); border:1px solid var(--border-2); border-radius:16px; padding:30px; display:flex; flex-direction:column; }
  .calc__out .k{ font-size:13px; text-transform:uppercase; letter-spacing:.06em; color:var(--muted); margin:0; }
  .calc__out .annual{ font-size:24px; font-weight:var(--w-strong); margin:6px 0 22px; }
  .calc__out .save-k{ font-size:13px; text-transform:uppercase; letter-spacing:.06em; color:var(--success); margin:0; }
  .calc__out .save{ font-size:clamp(40px,6vw,60px); font-weight:var(--w-strong); color:var(--success); letter-spacing:-.03em; line-height:1; margin:8px 0 4px; }
  .calc__out .per{ font-size:14px; color:var(--faint); margin:0 0 auto; }
  .calc__out .assume{ font-size:12px; color:var(--faint); border-top:1px solid var(--border); padding-top:14px; margin:22px 0 18px; }

  /* Diagnostic form */
  .diag{ display:grid; grid-template-columns:.9fr 1.1fr; gap:var(--s8); align-items:start; }
  .diag__copy .lead{ margin-bottom:var(--s6); }
  .ticks{ list-style:none; padding:0; margin:0; }
  .ticks li{ display:flex; gap:12px; align-items:flex-start; padding:9px 0; color:var(--muted); font-size:16px; }
  .ticks li svg{ flex:none; width:20px; height:20px; color:var(--success); margin-top:2px; }
  .form{ background:var(--surface); border:1px solid var(--border); border-radius:16px; padding:30px; }
  .form .row2{ display:grid; grid-template-columns:1fr 1fr; gap:14px; }
  .inp{ font-family:inherit; font-size:16px; color:var(--text); background:var(--bg); border:1px solid var(--border); border-radius:var(--radius); padding:13px 14px; width:100%; transition:border-color var(--dur); }
  .inp::placeholder{ color:var(--faint); }
  .inp:focus-visible{ border-color:var(--accent); box-shadow:none; }
  .inp[aria-invalid="true"]{ border-color:var(--danger); }
  select.inp{ appearance:none; background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='none' stroke='%23999' stroke-width='2'%3E%3Cpath d='M2 4l4 4 4-4'/%3E%3C/svg%3E"); background-repeat:no-repeat; background-position:right 14px center; padding-right:34px; }
  .form .fld{ margin-bottom:14px; }
  .form .fld label{ display:block; font-size:13px; font-weight:var(--w-strong); color:var(--muted); margin-bottom:6px; }
  .err-msg{ font-size:12px; color:var(--danger); margin-top:6px; display:none; }
  .form .fld.bad .err-msg{ display:block; }
  .form .legal{ font-size:12px; color:var(--faint); margin-top:14px; text-align:center; }
  .form__ok{ display:none; text-align:center; padding:30px 10px; }
  .form__ok svg{ width:54px; height:54px; color:var(--success); margin:0 auto 16px; }
  .form__ok h3{ font-size:22px; font-weight:var(--w-strong); margin:0 0 8px; }
  .form__ok p{ color:var(--muted); margin:0; }
  .form.sent .form__inner{ display:none; }
  .form.sent .form__ok{ display:block; }

  /* Resources + blog */
  .res-card{ background:var(--surface); border:1px solid var(--border); border-radius:14px; padding:22px; display:flex; flex-direction:column; gap:10px; transition:border-color var(--dur),transform var(--dur); }
  .res-card:hover{ border-color:var(--accent); transform:translateY(-2px); }
  .res-card .type{ font-size:12px; font-weight:var(--w-strong); text-transform:uppercase; letter-spacing:.08em; color:var(--accent); }
  .res-card h3{ font-size:18px; margin:0; font-weight:var(--w-strong); }
  .res-card p{ margin:0; color:var(--muted); font-size:15px; flex:1; }
  .res-card .go{ font-size:14px; font-weight:var(--w-strong); color:var(--text); }
  .res-card .go::after{ content:" →"; color:var(--accent); }

  /* FAQ */
  .faq details{ border-bottom:1px solid var(--border); }
  .faq summary{ list-style:none; cursor:pointer; padding:22px 4px; font-size:18px; font-weight:var(--w-strong); display:flex; justify-content:space-between; align-items:center; gap:16px; }
  .faq summary::-webkit-details-marker{ display:none; }
  .faq summary .plus{ flex:none; width:24px; height:24px; position:relative; }
  .faq summary .plus::before,.faq summary .plus::after{ content:""; position:absolute; background:var(--accent); transition:transform var(--dur); }
  .faq summary .plus::before{ top:11px; left:3px; width:18px; height:2px; }
  .faq summary .plus::after{ top:3px; left:11px; width:2px; height:18px; }
  .faq details[open] summary .plus::after{ transform:scaleY(0); }
  .faq details p{ margin:0 4px 22px; color:var(--muted); font-size:16px; max-width:70ch; }

  /* Footer */
  footer{ border-top:1px solid var(--border); padding:64px 0 40px; background:var(--surface); }
  .foot{ display:grid; grid-template-columns:1.4fr 1fr 1fr 1fr; gap:var(--s7); }
  .foot h5{ font-size:12px; text-transform:uppercase; letter-spacing:.1em; color:var(--faint); margin:0 0 16px; }
  .foot a{ display:block; color:var(--muted); padding:6px 0; font-size:15px; }
  .foot a:hover{ color:var(--text); }
  .foot .orvia{ font-size:14px; color:var(--muted); max-width:34ch; margin:14px 0 0; }
  .foot-bottom{ display:flex; justify-content:space-between; align-items:center; gap:var(--s5); margin-top:48px; padding-top:24px; border-top:1px solid var(--border); flex-wrap:wrap; }
  .foot-bottom small{ color:var(--faint); font-size:13px; }
  .brands{ display:flex; gap:18px; align-items:center; }
  .brands span{ font-weight:var(--w-strong); font-size:15px; color:var(--muted); }
  .brands span.me{ color:var(--accent); }

  /* WhatsApp float */
  .wa{ position:fixed; right:22px; bottom:22px; z-index:60; width:58px; height:58px; border-radius:50%; background:var(--success); color:var(--on-success); display:grid; place-items:center; box-shadow:0 14px 36px -10px color-mix(in oklch,var(--success) 60%,transparent); transition:transform var(--dur); }
  .wa:hover{ transform:scale(1.06); }
  .wa svg{ width:30px; height:30px; }

  /* Reveal */
  .reveal{ opacity:0; transform:translateY(16px); transition:opacity .6s var(--ease),transform .6s var(--ease); }
  .reveal.in{ opacity:1; transform:none; }

  @media (max-width:960px){
    .hero__grid,.calc,.diag{ grid-template-columns:1fr; }
    .g3,.ben,.method{ grid-template-columns:1fr 1fr; }
    .method .step::after{ display:none; }
    .sol{ grid-template-columns:1fr; gap:10px; }
    .foot{ grid-template-columns:1fr 1fr; }
    .nav__links{ display:none; }
    .case .res{ grid-template-columns:repeat(3,1fr); }
  }
  @media (max-width:560px){
    section{ padding:64px 0; }
    .g3,.g2,.ben,.method,.prob-grid,.form .row2,.case .res{ grid-template-columns:1fr; }
    .hero h1{ font-size:34px; }
    .ind .item{ font-size:14px; padding:10px 16px; }
  }
`;
