'use client'

/**
 * Birdman — landing portada 1:1 desde birdman-landing.html (Operador Logístico
 * Corporativo, Grupo ORVIA).
 *
 * Fidelidad visual 100%: el bloque <style> del HTML original se inyecta TAL CUAL
 * vía <style dangerouslySetInnerHTML> (sin Tailwind, sin CSS modules, sin tocar
 * selectores ni CSS vars). El logo <symbol id="birdman-logo"> se define una vez
 * y se referencia con <use href="#birdman-logo"/> en nav + footer. Todo el texto
 * editable llega por la prop `content` (BirdmanContent); el JSX lo lee, nunca lo
 * hardcodea. Los 4 scripts (smooth-scroll, calculadora, validación del form,
 * reveal-on-scroll) se portan a useEffect manteniendo el comportamiento exacto.
 */

import { useEffect } from 'react'

import type { BirdmanContent } from './content'

// CSS EXACTO del <style> del HTML original. No tocar selectores ni valores.
const CSS = `
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
`

// Iconos de las 6 tarjetas de "Qué hacemos", por índice (se quedan en el JSX).
const queHacemosIcons = [
  <svg key="0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 7h18M3 12h18M3 17h18" /></svg>,
  <svg key="1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="9" /><path d="M12 3v9l6 3" /></svg>,
  <svg key="2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 17l6-6 4 4 8-8" /><path d="M21 7v5h-5" /></svg>,
  <svg key="3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3" /><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" /></svg>,
  <svg key="4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 21V8l9-5 9 5v13" /><path d="M9 21v-6h6v6" /></svg>,
  <svg key="5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2l2.4 7.4H22l-6 4.6 2.3 7-6.3-4.6L5.7 21 8 14 2 9.4h7.6z" /></svg>,
]

// Tick (check) reutilizado en Tecnología y Diagnóstico.
function Tick() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
      <path d="M20 6L9 17l-5-5" />
    </svg>
  )
}

export function BirdmanLanding({ content }: { content: BirdmanContent }) {
  useEffect(() => {
    const cleanups: Array<() => void> = []

    // ── Anchor links internos: scroll con offset por el nav sticky.
    {
      const NAV = 68 // alto del header sticky
      const onClick = (e: MouseEvent) => {
        const a = (e.target as Element | null)?.closest('a[href^="#"]') as HTMLAnchorElement | null
        if (!a) return
        const id = a.getAttribute('href')
        if (!id) return
        if (id === '#') {
          e.preventDefault()
          return
        } // placeholders del blog
        const t = id === '#top' ? document.body : document.querySelector(id)
        if (!t) return
        e.preventDefault()
        const y = id === '#top' ? 0 : (t as HTMLElement).getBoundingClientRect().top + window.scrollY - NAV
        window.scrollTo({ top: y, behavior: 'smooth' })
        history.replaceState(null, '', id)
      }
      document.addEventListener('click', onClick)
      cleanups.push(() => document.removeEventListener('click', onClick))
    }

    // ── Calculadora de ahorro.
    {
      const fmt = new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 })
      const RATE = content.calculadora.rate // punto medio del rango 12-18% de casos típicos
      const envios = document.getElementById('c-envios') as HTMLInputElement | null
      const costo = document.getElementById('c-costo') as HTMLInputElement | null
      const ops = document.getElementById('c-ops') as HTMLInputElement | null
      const oA = document.getElementById('out-annual')
      const oS = document.getElementById('out-save')
      const oM = document.getElementById('out-month')
      if (envios && costo && ops && oA && oS && oM) {
        const n = (el: HTMLInputElement) => {
          const v = parseFloat(el.value)
          return isFinite(v) && v > 0 ? v : 0
        }
        const calc = () => {
          const annual = n(envios) * 12 * n(costo)
          const save = annual * RATE
          oA.textContent = fmt.format(annual)
          oS.textContent = fmt.format(save)
          oM.textContent = fmt.format(save / 12)
        }
        const inputs = [envios, costo, ops]
        inputs.forEach((el) => el.addEventListener('input', calc))
        calc()
        cleanups.push(() => inputs.forEach((el) => el.removeEventListener('input', calc)))
      }
    }

    // ── Formulario de diagnóstico: validación cliente + estado de éxito.
    {
      const form = document.getElementById('lead') as HTMLFormElement | null
      if (form) {
        const email = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        const onSubmit = (e: Event) => {
          e.preventDefault()
          let ok = true
          let first: HTMLInputElement | HTMLSelectElement | null = null
          form.querySelectorAll<HTMLInputElement | HTMLSelectElement>('[required]').forEach((el) => {
            const fld = el.closest('.fld')
            let bad = false
            if (!el.value.trim()) bad = true
            else if ((el as HTMLInputElement).type === 'email' && !email.test(el.value)) bad = true
            else if (el.id === 'f-tel' && el.value.replace(/\D/g, '').length < 10) bad = true
            fld?.classList.toggle('bad', bad)
            el.setAttribute('aria-invalid', bad ? 'true' : 'false')
            if (bad && !first) {
              first = el
              ok = false
            } else if (bad) {
              ok = false
            }
          })
          if (!ok) {
            ;(first as HTMLInputElement | HTMLSelectElement | null)?.focus()
            return
          }
          form.classList.add('sent')
          const ok2 = form.querySelector('.form__ok') as HTMLElement | null
          if (ok2) {
            ok2.setAttribute('tabindex', '-1')
            ok2.focus()
          }
        }
        form.addEventListener('submit', onSubmit)
        cleanups.push(() => form.removeEventListener('submit', onSubmit))

        // limpia el error al corregir
        const inps = form.querySelectorAll<HTMLInputElement | HTMLSelectElement>('.inp')
        const onInput = (ev: Event) => {
          const el = ev.currentTarget as HTMLElement
          el.closest('.fld')?.classList.remove('bad')
          el.setAttribute('aria-invalid', 'false')
        }
        const onChange = (ev: Event) => {
          const el = ev.currentTarget as HTMLElement
          el.closest('.fld')?.classList.remove('bad')
        }
        inps.forEach((el) => {
          el.addEventListener('input', onInput)
          el.addEventListener('change', onChange)
        })
        cleanups.push(() =>
          inps.forEach((el) => {
            el.removeEventListener('input', onInput)
            el.removeEventListener('change', onChange)
          })
        )
      }
    }

    // ── Reveal on scroll.
    {
      const rm = window.matchMedia('(prefers-reduced-motion:reduce)').matches
      const els = document.querySelectorAll('.reveal')
      if (rm || !('IntersectionObserver' in window)) {
        els.forEach((el) => el.classList.add('in'))
      } else {
        const io = new IntersectionObserver(
          (ent) => {
            ent.forEach((en) => {
              if (en.isIntersecting) {
                en.target.classList.add('in')
                io.unobserve(en.target)
              }
            })
          },
          { rootMargin: '0px 0px -10% 0px' }
        )
        els.forEach((el) => io.observe(el))
        cleanups.push(() => io.disconnect())
      }
    }

    return () => cleanups.forEach((fn) => fn())
  }, [content])

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      {/* Logo real Birdman · definido una vez, reusado en nav + footer vía <use>. */}
      <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true" focusable="false">
        <symbol id="birdman-logo" viewBox="28 344 708 124">
          <path fill="#ff8400" d="M 162.804688 391.695312 C 166.480469 380.578125 165.113281 370.769531 157.753906 362.125 C 150.109375 353.144531 140.113281 349.050781 128.429688 349.066406 C 96.59375 349.09375 71.148438 349.148438 39.3125 349.226562 C 38.015625 349.226562 36.734375 349.417969 34.625 349.566406 C 36.773438 352.535156 38.691406 354.859375 40.257812 357.398438 C 47.320312 368.867188 57.707031 374.984375 70.90625 374.730469 C 91.664062 374.324219 106.050781 374.554688 126.824219 374.554688 C 135.683594 374.554688 138.480469 375.242188 139.261719 383.765625 C 143.207031 384.667969 147.257812 385.292969 151.09375 386.574219 C 154.917969 387.84375 158.511719 389.789062 162.804688 391.707031 Z M 162.804688 391.695312 " />
          <path fill="#ff8400" d="M 173.976562 436.386719 C 176.785156 422.785156 173.21875 408.96875 164.074219 400.363281 C 155.078125 391.894531 144.125 389.25 132.160156 389.277344 C 109.007812 389.316406 91.339844 389.328125 68.191406 389.382812 C 66.757812 389.382812 65.328125 389.289062 63.8125 389.382812 C 63.988281 390.152344 63.976562 390.695312 64.152344 390.9375 C 65.421875 392.746094 66.839844 397.203125 68 399.082031 C 75.589844 411.25 86.613281 417.074219 100.808594 416.585938 C 114.921875 416.113281 123.582031 416.546875 137.710938 416.453125 C 153.335938 416.355469 166.722656 419.355469 173.976562 436.386719 Z M 173.976562 436.386719 " />
          <path fill="#ff8400" d="M 95.5 433.902344 C 99.40625 439.101562 102.417969 447.058594 105.710938 451.125 C 110.074219 456.511719 115.9375 460.117188 122.703125 460.523438 C 131.132812 461.023438 137.089844 461.117188 145.300781 459.496094 C 151.351562 458.308594 157.269531 454.730469 162.453125 451.082031 C 170.328125 443.101562 169.410156 438.535156 164.859375 431.011719 C 161.144531 425.433594 155.242188 422.828125 148.476562 421.828125 C 152.957031 429.417969 144.746094 433.753906 132.238281 433.78125 C 119.503906 433.808594 109.519531 433.863281 95.515625 433.890625 Z M 95.5 433.902344 " />
          <path fill="#ffffff" d="M 276.234375 382.320312 C 276.222656 371.3125 267.292969 365.152344 250.75 365.179688 L 213.660156 365.246094 L 213.589844 365.585938 C 196.574219 365.585938 213.984375 365.585938 195.695312 365.625 C 194.9375 365.625 194.183594 365.734375 192.953125 365.828125 C 194.207031 367.570312 195.328125 368.921875 196.25 370.40625 C 199.734375 376.066406 204.59375 379.484375 210.671875 380.335938 L 199.113281 438.644531 L 239.457031 438.574219 C 258.324219 438.546875 273.089844 431.1875 273.0625 415.25 C 273.0625 408.441406 269.484375 403.417969 263.1875 400.703125 C 271.144531 397.339844 276.277344 391.140625 276.261719 382.347656 Z M 240.578125 423.554688 L 222.558594 423.582031 L 225.464844 408.699219 L 243.804688 408.671875 C 248.832031 408.671875 252.410156 410.441406 252.410156 414.84375 C 252.410156 420.707031 247.816406 423.542969 240.578125 423.554688 Z M 243.253906 394.3125 L 228.367188 394.339844 L 231.175781 380.183594 L 245.84375 380.160156 C 251.289062 380.160156 254.542969 381.929688 254.558594 385.914062 C 254.558594 391.355469 250.585938 394.300781 243.253906 394.3125 Z M 243.253906 394.3125 " />
          <path fill="#ffffff" d="M 291.621094 365.113281 L 277.074219 438.480469 L 297.820312 438.453125 L 312.367188 365.070312 Z M 291.621094 365.113281 " />
          <path fill="#ffffff" d="M 385.453125 388.316406 C 385.425781 373.648438 374.621094 364.964844 355.859375 365.003906 L 324.523438 365.058594 L 309.976562 438.441406 L 330.722656 438.398438 L 334.570312 418.910156 L 345.054688 418.910156 C 345.054688 418.910156 355.980469 438.359375 355.980469 438.359375 L 377.671875 438.320312 L 365.164062 416.328125 C 377.941406 411.914062 385.464844 401.835938 385.453125 388.316406 Z M 350.050781 402.835938 L 337.679688 402.835938 C 337.679688 402.835938 342.042969 381.375 342.042969 381.375 L 352.941406 381.375 C 360.074219 381.347656 364.476562 384.171875 364.488281 390.34375 C 364.488281 398.40625 359.167969 402.824219 350.050781 402.835938 Z M 350.050781 402.835938 " />
          <path fill="#ffffff" d="M 431.308594 364.867188 L 399.445312 364.921875 L 384.898438 438.304688 L 422.421875 438.238281 C 449.351562 438.199219 468.183594 421.609375 468.140625 395.609375 C 468.113281 376.648438 454.148438 364.828125 431.308594 364.867188 Z M 423.027344 421.679688 L 408.980469 421.707031 L 416.882812 381.457031 L 429.039062 381.457031 C 440.980469 381.414062 447.179688 387.167969 447.191406 396.921875 C 447.21875 410.96875 438.535156 421.664062 423.027344 421.691406 Z M 423.027344 421.679688 " />
          <path fill="#ffffff" d="M 550.777344 364.679688 L 517.523438 407.171875 L 500.273438 364.761719 L 483.402344 364.789062 L 468.84375 438.171875 L 487.929688 438.128906 L 495.613281 399.445312 L 508.972656 430.863281 L 518.089844 430.851562 L 542.457031 399.378906 L 534.972656 438.046875 L 554.152344 438.023438 L 568.484375 364.640625 Z M 550.777344 364.679688 " />
          <path fill="#ffffff" d="M 604.332031 364.585938 L 557.394531 438.023438 L 579.300781 437.980469 L 587.769531 423.71875 L 619 423.664062 L 621.957031 437.914062 L 642.59375 437.875 L 624.765625 364.542969 L 604.332031 364.570312 Z M 596.863281 408.402344 L 610.867188 384.589844 L 615.839844 408.375 L 596.875 408.402344 Z M 596.863281 408.402344 " />
          <path fill="#ffffff" d="M 709.859375 364.410156 L 701.972656 404.550781 L 677.589844 364.464844 L 660.503906 364.492188 L 645.957031 437.875 L 666.285156 437.832031 L 674.296875 397.582031 L 698.566406 437.777344 L 715.640625 437.75 L 730.1875 364.367188 Z M 709.859375 364.410156 " />
        </symbol>
      </svg>

      {/* ░░░ NAV ░░░ */}
      <header className="nav">
        <div className="wrap nav__row">
          <a className="brand" href="#top" aria-label="Birdman, inicio">
            <svg className="logo" viewBox="0 0 708 124" aria-hidden="true">
              <use href="#birdman-logo" />
            </svg>
            <small>{content.nav.brand}</small>
          </a>
          <nav className="nav__links" aria-label="Principal">
            {content.nav.links.map((l) => (
              <a key={l.href + l.label} href={l.href}>
                {l.label}
              </a>
            ))}
          </nav>
          <a
            className="btn btn--primary nav__cta"
            href={content.nav.cta.href}
            style={{ minHeight: '42px', padding: '0 20px', fontSize: '15px' }}
          >
            {content.nav.cta.label}
          </a>
        </div>
      </header>

      <main id="top">
        {/* ░░░ HERO ░░░ */}
        <section className="hero">
          <div className="wrap hero__grid">
            <div>
              <span className="tag">
                <span className="dot" />
                {content.hero.tag}
              </span>
              <h1>
                {content.hero.headlineBefore}
                <em>{content.hero.headlineEm}</em>
                {content.hero.headlineAfter}
              </h1>
              <p className="sub">{content.hero.sub}</p>
              <div className="hero__cta">
                {content.hero.ctas.map((c) => (
                  <a key={c.label} className={`btn ${c.style === 'ghost' ? 'btn--ghost' : 'btn--primary'}`} href={c.href}>
                    {c.label}
                  </a>
                ))}
              </div>
              <p className="hero__note">
                {content.hero.note}
                <strong>{content.hero.noteStrong}</strong>
              </p>
            </div>

            {/* Centro de monitoreo */}
            <div className="panel reveal" aria-hidden="true">
              <div className="panel__bar">
                <div className="lights">
                  <i />
                  <i />
                  <i />
                </div>
                <span className="ttl">{content.hero.panel.ttl}</span>
                <span className="live">{content.hero.panel.live}</span>
              </div>
              <div className="kpis">
                {content.hero.panel.kpis.map((kpi) => (
                  <div className="kpi" key={kpi.k}>
                    <p className="k">{kpi.k}</p>
                    <p className="v num">{kpi.v}</p>
                    <p className={kpi.warn ? 'd warn' : 'd'}>{kpi.d}</p>
                  </div>
                ))}
              </div>
              <div className="chartcard">
                <div className="ch-h">
                  <span>{content.hero.panel.chart.label}</span>
                  <b>{content.hero.panel.chart.delta}</b>
                </div>
                <svg viewBox="0 0 320 96" preserveAspectRatio="none" style={{ width: '100%', height: '96px' }}>
                  <defs>
                    <linearGradient id="ar" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0" stopColor="#ff8400" stopOpacity=".34" />
                      <stop offset="1" stopColor="#ff8400" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <path d="M0,26 L46,30 L92,22 L138,40 L184,48 L230,58 L276,66 L320,78 L320,96 L0,96 Z" fill="url(#ar)" />
                  <path d="M0,26 L46,30 L92,22 L138,40 L184,48 L230,58 L276,66 L320,78" fill="none" stroke="#ff8400" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  <circle cx="320" cy="78" r="4" fill="#ff8400" />
                </svg>
              </div>
              <div className="track">
                {content.hero.panel.tracking.map((row) => (
                  <div className="row" key={row.id}>
                    <span className="id">{row.id}</span>
                    <span className="dest">{row.dest}</span>
                    <span className={`pill-s ${row.type}`}>{row.status}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ░░░ QUÉ HACEMOS ░░░ */}
        <section id="que-hacemos">
          <div className="wrap">
            <p className="eyebrow">{content.queHacemos.eyebrow}</p>
            <h2 className="title">{content.queHacemos.title}</h2>
            <p className="lead">{content.queHacemos.lead}</p>
            <div className="grid g3 reveal">
              {content.queHacemos.items.map((item, i) => (
                <div className="card" key={item.title}>
                  <div className="ico">{queHacemosIcons[i]}</div>
                  <h3>{item.title}</h3>
                  <p>{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ░░░ PROBLEMAS ░░░ */}
        <section id="problemas" style={{ background: 'var(--surface)' }}>
          <div className="wrap">
            <p className="eyebrow">{content.problemas.eyebrow}</p>
            <h2 className="title">{content.problemas.title}</h2>
            <p className="lead">{content.problemas.lead}</p>
            <div className="prob-grid reveal">
              {content.problemas.items.map((p) => (
                <div className="prob" key={p}>
                  <span className="x">!</span>
                  <p>{p}</p>
                </div>
              ))}
            </div>
            <div className="cta-band reveal">
              <p>{content.problemas.ctaBand.text}</p>
              <a className="btn btn--primary" href={content.problemas.ctaBand.cta.href}>
                {content.problemas.ctaBand.cta.label}
              </a>
            </div>
          </div>
        </section>

        {/* ░░░ SOLUCIONES ░░░ */}
        <section id="soluciones">
          <div className="wrap">
            <p className="eyebrow">{content.soluciones.eyebrow}</p>
            <h2 className="title">{content.soluciones.title}</h2>
            <div className="reveal">
              {content.soluciones.items.map((s) => (
                <div className="sol" key={s.title}>
                  <h3>{s.title}</h3>
                  <div className="body">
                    <span dangerouslySetInnerHTML={{ __html: s.body }} />
                    {s.chips && (
                      <div className="chips">
                        {s.chips.map((chip) => (
                          <span className="chip" key={chip}>
                            {chip}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ░░░ INDUSTRIAS ░░░ */}
        <section id="industrias" style={{ background: 'var(--surface)' }}>
          <div className="wrap">
            <p className="eyebrow">{content.industrias.eyebrow}</p>
            <h2 className="title">{content.industrias.title}</h2>
            <div className="ind reveal">
              {content.industrias.items.map((item) => (
                <span className="item" key={item}>
                  {item}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* ░░░ BENEFICIOS ░░░ */}
        <section id="beneficios">
          <div className="wrap">
            <p className="eyebrow">{content.beneficios.eyebrow}</p>
            <h2 className="title">{content.beneficios.title}</h2>
            <div className="ben reveal">
              {content.beneficios.items.map((b) => (
                <div className="b" key={b.label}>
                  <div className={`big ${b.dir}`}>{b.label}</div>
                  <p>{b.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ░░░ TECNOLOGÍA ░░░ */}
        <section id="tecnologia" style={{ background: 'var(--surface)' }}>
          <div className="wrap">
            <div className="hero__grid">
              <div>
                <p className="eyebrow">{content.tecnologia.eyebrow}</p>
                <h2 className="title">{content.tecnologia.title}</h2>
                <p className="lead">{content.tecnologia.lead}</p>
                <ul className="ticks">
                  {content.tecnologia.ticks.map((t) => (
                    <li key={t}>
                      <Tick />
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="panel reveal" aria-hidden="true">
                <div className="panel__bar">
                  <div className="lights">
                    <i />
                    <i />
                    <i />
                  </div>
                  <span className="ttl">{content.tecnologia.panel.ttl}</span>
                  <span className="live">{content.tecnologia.panel.live}</span>
                </div>
                <div className="kpis">
                  {content.tecnologia.panel.kpis.map((kpi) => (
                    <div className="kpi" key={kpi.k}>
                      <p className="k">{kpi.k}</p>
                      <p className="v num">{kpi.v}</p>
                      <p className={kpi.warn ? 'd warn' : 'd'}>{kpi.d}</p>
                    </div>
                  ))}
                </div>
                <div className="chartcard">
                  <div className="ch-h">
                    <span>{content.tecnologia.panel.chart.label}</span>
                    <b>{content.tecnologia.panel.chart.delta}</b>
                  </div>
                  <svg viewBox="0 0 320 96" preserveAspectRatio="none" style={{ width: '100%', height: '96px' }}>
                    <defs>
                      <linearGradient id="ar2" x1="0" x2="0" y1="0" y2="1">
                        <stop offset="0" stopColor="#25d366" stopOpacity=".30" />
                        <stop offset="1" stopColor="#25d366" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    <path d="M0,70 L46,62 L92,64 L138,50 L184,44 L230,34 L276,28 L320,20 L320,96 L0,96 Z" fill="url(#ar2)" />
                    <path d="M0,70 L46,62 L92,64 L138,50 L184,44 L230,34 L276,28 L320,20" fill="none" stroke="#25d366" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                    <circle cx="320" cy="20" r="4" fill="#25d366" />
                  </svg>
                </div>
                <div className="track">
                  {content.tecnologia.panel.tracking.map((row) => (
                    <div className="row" key={row.id}>
                      <span className="id">{row.id}</span>
                      <span className="dest">{row.dest}</span>
                      <span className={`pill-s ${row.type}`}>{row.status}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ░░░ METODOLOGÍA ░░░ */}
        <section id="metodologia">
          <div className="wrap">
            <p className="eyebrow">{content.metodologia.eyebrow}</p>
            <h2 className="title">{content.metodologia.title}</h2>
            <div className="method-wrap reveal">
              <div className="method">
                {content.metodologia.steps.map((step) => (
                  <div className="step" key={step}>
                    <div className="node" />
                    <h4>{step}</h4>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ░░░ CASOS ░░░ */}
        <section id="casos" style={{ background: 'var(--surface)' }}>
          <div className="wrap">
            <p className="eyebrow">{content.casos.eyebrow}</p>
            <h2 className="title">{content.casos.title}</h2>
            <div className="grid g3 reveal">
              {content.casos.items.map((c) => (
                <div className="case" key={c.industry}>
                  <span className="ind-tag">{c.industry}</span>
                  <div className="qa">
                    <b>Problema</b>
                    {c.problem}
                  </div>
                  <div className="qa">
                    <b>Solución</b>
                    {c.solution}
                  </div>
                  <div className="res">
                    {c.results.map((r) => (
                      <div className="r" key={r.l}>
                        <div className="n num">{r.n}</div>
                        <div className="l">{r.l}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <p style={{ fontSize: '12px', color: 'var(--faint)', marginTop: '18px' }}>{content.casos.disclaimer}</p>
          </div>
        </section>

        {/* ░░░ CALCULADORA ░░░ */}
        <section id="calculadora">
          <div className="wrap">
            <p className="eyebrow">{content.calculadora.eyebrow}</p>
            <h2 className="title">{content.calculadora.title}</h2>
            <p className="lead">{content.calculadora.lead}</p>
            <div className="calc reveal">
              <form className="calc__form" id="calc" noValidate>
                <div className="field">
                  <label htmlFor="c-envios">{content.calculadora.fields.enviosLabel}</label>
                  <div className="control">
                    <input id="c-envios" type="number" inputMode="numeric" min="0" defaultValue={content.calculadora.fields.enviosDefault} />
                  </div>
                </div>
                <div className="field">
                  <label htmlFor="c-costo">{content.calculadora.fields.costoLabel}</label>
                  <div className="control">
                    <span className="pre">$</span>
                    <input id="c-costo" type="number" inputMode="numeric" min="0" defaultValue={content.calculadora.fields.costoDefault} />
                  </div>
                </div>
                <div className="field">
                  <label htmlFor="c-ops">{content.calculadora.fields.opsLabel}</label>
                  <div className="control">
                    <input id="c-ops" type="number" inputMode="numeric" min="0" defaultValue={content.calculadora.fields.opsDefault} />
                  </div>
                  <span className="hint">{content.calculadora.fields.opsHint}</span>
                </div>
              </form>
              <div className="calc__out">
                <p className="k">{content.calculadora.labels.annualK}</p>
                <p className="annual num" id="out-annual">
                  $5,100,000
                </p>
                <p className="save-k">{content.calculadora.labels.saveK}</p>
                <p className="save num" id="out-save">
                  $714,000
                </p>
                <p className="per">
                  {content.calculadora.labels.perBefore}
                  <span className="num" id="out-month">
                    $59,500
                  </span>
                  {content.calculadora.labels.perAfter}
                </p>
                <p className="assume" dangerouslySetInnerHTML={{ __html: content.calculadora.assume }} />
                <a className="btn btn--primary btn--block" href={content.calculadora.cta.href}>
                  {content.calculadora.cta.label}
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ░░░ DIAGNÓSTICO (FORM) ░░░ */}
        <section id="diagnostico" style={{ background: 'var(--surface)' }}>
          <div className="wrap diag">
            <div className="diag__copy">
              <p className="eyebrow">{content.diagnostico.eyebrow}</p>
              <h2 className="title">{content.diagnostico.title}</h2>
              <p className="lead">{content.diagnostico.lead}</p>
              <ul className="ticks">
                {content.diagnostico.ticks.map((t) => (
                  <li key={t}>
                    <Tick />
                    {t}
                  </li>
                ))}
              </ul>
            </div>

            <form className="form" id="lead" noValidate>
              <div className="form__inner">
                <div className="row2">
                  <div className="fld">
                    <label htmlFor="f-empresa">{content.diagnostico.form.empresaLabel}</label>
                    <input className="inp" id="f-empresa" name="empresa" required placeholder={content.diagnostico.form.empresaPlaceholder} />
                    <span className="err-msg">{content.diagnostico.form.empresaError}</span>
                  </div>
                  <div className="fld">
                    <label htmlFor="f-industria">{content.diagnostico.form.industriaLabel}</label>
                    <select className="inp" id="f-industria" name="industria" required defaultValue="">
                      <option value="" disabled>
                        {content.diagnostico.form.industriaPlaceholder}
                      </option>
                      {content.diagnostico.form.industriaOptions.map((o) => (
                        <option key={o}>{o}</option>
                      ))}
                    </select>
                    <span className="err-msg">{content.diagnostico.form.industriaError}</span>
                  </div>
                </div>
                <div className="row2">
                  <div className="fld">
                    <label htmlFor="f-volumen">{content.diagnostico.form.volumenLabel}</label>
                    <select className="inp" id="f-volumen" name="volumen" required defaultValue="">
                      <option value="" disabled>
                        {content.diagnostico.form.volumenPlaceholder}
                      </option>
                      {content.diagnostico.form.volumenOptions.map((o) => (
                        <option key={o}>{o}</option>
                      ))}
                    </select>
                    <span className="err-msg">{content.diagnostico.form.volumenError}</span>
                  </div>
                  <div className="fld">
                    <label htmlFor="f-estado">{content.diagnostico.form.estadoLabel}</label>
                    <input className="inp" id="f-estado" name="estado" required placeholder={content.diagnostico.form.estadoPlaceholder} />
                    <span className="err-msg">{content.diagnostico.form.estadoError}</span>
                  </div>
                </div>
                <div className="row2">
                  <div className="fld">
                    <label htmlFor="f-correo">{content.diagnostico.form.correoLabel}</label>
                    <input className="inp" id="f-correo" name="correo" type="email" required placeholder={content.diagnostico.form.correoPlaceholder} />
                    <span className="err-msg">{content.diagnostico.form.correoError}</span>
                  </div>
                  <div className="fld">
                    <label htmlFor="f-tel">{content.diagnostico.form.telLabel}</label>
                    <input className="inp" id="f-tel" name="telefono" type="tel" required placeholder={content.diagnostico.form.telPlaceholder} inputMode="tel" />
                    <span className="err-msg">{content.diagnostico.form.telError}</span>
                  </div>
                </div>
                <button className="btn btn--primary btn--block" type="submit" style={{ marginTop: '8px' }}>
                  {content.diagnostico.form.submit}
                </button>
                <p className="legal">{content.diagnostico.form.legal}</p>
              </div>
              <div className="form__ok" role="status">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M8 12l3 3 5-6" />
                </svg>
                <h3>{content.diagnostico.form.success.title}</h3>
                <p>{content.diagnostico.form.success.text}</p>
              </div>
            </form>
          </div>
        </section>

        {/* ░░░ RECURSOS ░░░ */}
        <section id="recursos">
          <div className="wrap">
            <p className="eyebrow">{content.recursos.eyebrow}</p>
            <h2 className="title">{content.recursos.title}</h2>
            <div className="grid g3 reveal">
              {content.recursos.items.map((r) => (
                <a className="res-card" href={r.href} key={r.title}>
                  <span className="type">{r.type}</span>
                  <h3>{r.title}</h3>
                  <p>{r.desc}</p>
                  <span className="go">{r.cta}</span>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* ░░░ BLOG ░░░ */}
        <section id="blog" style={{ background: 'var(--surface)' }}>
          <div className="wrap">
            <p className="eyebrow">{content.blog.eyebrow}</p>
            <h2 className="title">{content.blog.title}</h2>
            <div className="grid g3 reveal">
              {content.blog.items.map((b) => (
                <a className="res-card" href={b.href} key={b.title}>
                  <span className="type">{b.type}</span>
                  <h3>{b.title}</h3>
                  <p>{b.desc}</p>
                  <span className="go">Leer</span>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* ░░░ FAQ ░░░ */}
        <section id="faq">
          <div className="wrap" style={{ maxWidth: '840px' }}>
            <p className="eyebrow center">{content.faq.eyebrow}</p>
            <h2 className="title center" style={{ maxWidth: 'none' }}>
              {content.faq.title}
            </h2>
            <div className="faq" style={{ marginTop: 'var(--s7)' }}>
              {content.faq.items.map((item) => (
                <details key={item.q} open={item.open}>
                  <summary>
                    {item.q}
                    <span className="plus" />
                  </summary>
                  <p>{item.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* ░░░ FOOTER ░░░ */}
      <footer>
        <div className="wrap">
          <div className="foot">
            <div>
              <a className="brand" href="#top" aria-label="Birdman">
                <svg className="logo" viewBox="0 0 708 124" aria-hidden="true">
                  <use href="#birdman-logo" />
                </svg>
              </a>
              <p className="orvia">{content.footer.brandText}</p>
            </div>
            {content.footer.columns.map((col) => (
              <div key={col.title}>
                <h5>{col.title}</h5>
                {col.links.map((l) => {
                  const external = l.href.startsWith('http')
                  return external ? (
                    <a key={l.label} href={l.href} target="_blank" rel="noopener">
                      {l.label}
                    </a>
                  ) : (
                    <a key={l.label} href={l.href}>
                      {l.label}
                    </a>
                  )
                })}
              </div>
            ))}
          </div>
          <div className="foot-bottom">
            <div className="brands">
              {content.footer.brands.map((b, i) => (
                <span className={i === 0 ? 'me' : undefined} key={b}>
                  {b}
                </span>
              ))}
            </div>
            <small>{content.footer.copyright}</small>
          </div>
        </div>
      </footer>

      <a className="wa" href={content.footer.waHref} target="_blank" rel="noopener" aria-label={content.footer.waLabel}>
        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M12 2a10 10 0 0 0-8.5 15.3L2 22l4.8-1.3A10 10 0 1 0 12 2zm0 18a8 8 0 0 1-4.1-1.1l-.3-.2-2.8.7.8-2.7-.2-.3A8 8 0 1 1 12 20zm4.4-5.9c-.2-.1-1.4-.7-1.6-.8s-.4-.1-.5.1-.6.8-.8 1-.3.2-.5.1a6.5 6.5 0 0 1-1.9-1.2 7.2 7.2 0 0 1-1.3-1.7c-.1-.2 0-.4.1-.5l.4-.4.2-.4a.5.5 0 0 0 0-.4l-.8-1.9c-.2-.5-.4-.4-.5-.4h-.5a.9.9 0 0 0-.7.3 2.8 2.8 0 0 0-.9 2.1 4.9 4.9 0 0 0 1 2.6 11 11 0 0 0 4.3 3.8c1.9.8 1.9.6 2.3.5a2.5 2.5 0 0 0 1.6-1.1 2 2 0 0 0 .1-1.1c0-.1-.2-.2-.4-.3z" />
        </svg>
      </a>
    </>
  )
}
