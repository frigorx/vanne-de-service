(function attachVanneRotalock(root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root) root.VanneRotalock = api;
})(typeof window !== "undefined" ? window : globalThis, function createApi() {
  "use strict";

  const POSITION_LABELS = {
    back: "Fermée sur l’arrière",
    mid: "Position intermédiaire — lecture / service",
    front: "Fermée sur l’avant"
  };

  const POSITION_SHORT = {
    back: "Arrière",
    mid: "Intermédiaire",
    front: "Avant"
  };

  function safeId(value) {
    return String(value || "vr")
      .replace(/[^a-zA-Z0-9_-]/g, "-")
      .replace(/^-+/, "") || "vr";
  }

  function esc(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function movingAssemblyMarkup(extraClass) {
    return `
      <g class="vr-moving-assembly ${extraClass}" aria-label="Pointeau, tige et carré : ensemble mobile de longueur constante">
        <path class="vr-pointer" d="M530 360 L570 316 H630 L680 360 L630 404 H570 Z" />
        <rect class="vr-stem-rod" x="666" y="343" width="424" height="34" rx="12" />
        <g class="vr-square-rotor">
          <rect class="vr-square" x="1090" y="325" width="64" height="70" rx="8" />
          <path class="vr-square-cross" d="M1104 341 L1140 379 M1140 341 L1104 379" />
          <g class="vr-valve-key">
            <circle class="vr-key-ring" cx="1122" cy="360" r="47" />
            <path class="vr-key-handle" d="M1122 313 V246 H1164 Q1180 246 1180 262 V280 H1150 V272 H1140 V313 Z" />
          </g>
        </g>
        <text class="vr-key-label" x="1122" y="225" text-anchor="middle">CLÉ DE VANNE</text>
      </g>`;
  }

  function pulse(path, id, duration, reverse) {
    const pathData = reverse ? path.split("|")[1] : path.split("|")[0];
    return `
      <circle class="mobile vr-flow-pulse" r="8" visibility="hidden" aria-hidden="true">
        <set attributeName="visibility" to="visible" begin="0s" />
        <animateMotion dur="${duration || 2.6}s" repeatCount="indefinite" path="${pathData}" />
      </circle>
      <circle class="mobile vr-flow-pulse vr-flow-pulse-late" r="8" visibility="hidden" aria-hidden="true">
        <set attributeName="visibility" to="visible" begin="0s" />
        <animateMotion begin="-1.3s" dur="${duration || 2.6}s" repeatCount="indefinite" path="${pathData}" />
      </circle>`;
  }

  function portsAndBody() {
    return `
      <g class="vr-body-shape" aria-label="Corps de vanne en coupe">
        <rect class="vr-body" x="250" y="230" width="830" height="260" rx="52" />
        <path class="vr-body" d="M145 302 H280 V418 H145 Q130 418 130 403 V317 Q130 302 145 302 Z" />
        <path class="vr-body" d="M640 246 V98 Q640 76 662 76 H738 Q760 76 760 98 V246 Z" />
        <path class="vr-body" d="M880 246 V98 Q880 76 902 76 H938 Q960 76 960 98 V246 Z" />
        <path class="vr-body" d="M560 474 V608 Q560 630 582 630 H678 Q700 630 700 608 V474 Z" />
        <path class="vr-bonnet" d="M1010 270 H1098 L1120 300 V420 L1098 450 H1010 Z" />
      </g>

      <g class="vr-cavities" aria-label="Passages internes">
        <rect class="vr-cavity" x="138" y="326" width="406" height="68" rx="18" />
        <path class="vr-cavity" d="M530 286 H1048 V434 H530 Q508 434 508 412 V308 Q508 286 530 286 Z" />
        <path class="vr-cavity" d="M654 286 V104 H746 V286 Z" />
        <path class="vr-cavity" d="M894 286 V104 H946 V286 Z" />
        <path class="vr-cavity" d="M576 434 V614 H684 V434 Z" />
        <path class="vr-cavity" d="M1036 322 H1104 V398 H1036 Z" />
      </g>

      <g class="vr-seats" aria-label="Sièges avant et arrière">
        <path class="vr-seat vr-seat-front" d="M508 286 H546 V326 H530 L516 344 V376 L530 394 H546 V434 H508 Z" />
        <path class="vr-seat vr-seat-back" d="M784 286 H816 V326 H800 L786 344 V376 L800 394 H816 V434 H784 Z" />
      </g>

      ${movingAssemblyMarkup("vr-assembly-static")}
      ${movingAssemblyMarkup("mobile vr-assembly-mobile")}

      <g class="vr-presse-etoupe" aria-label="Presse-étoupe fixe assurant l’étanchéité autour de la tige">
        <rect class="vr-gland-body" x="1028" y="296" width="70" height="128" rx="16" />
        <rect class="vr-gland-seal" x="1045" y="308" width="36" height="104" rx="10" />
        <path class="vr-gland-lines" d="M1036 314 H1090 M1036 406 H1090" />
      </g>
      `;
  }

  function flowMarkup(ids) {
    const bpPath = "M158 360 H530 Q630 360 630 470 V606|M630 606 V470 Q630 360 530 360 H158";
    const hpPath = bpPath;
    const p1Path = "M630 606 V360 H700 V108|M700 108 V360 H630 V606";
    const pPath = "M630 606 V360 H920 V108|M920 108 V360 H630 V606";
    return `
      <g class="vr-fluid-layer" aria-label="Chemins du fluide et de la pression">
        <g class="vr-flow vr-flow-main vr-main-bp">
          <path class="vr-flow-line vr-main-line" d="M158 360 H530 Q630 360 630 470 V606" marker-end="url(#${ids.arrow})" />
          ${pulse(bpPath, "bp", 2.6, false)}
        </g>
        <g class="vr-flow vr-flow-main vr-main-hp">
          <path class="vr-flow-line vr-main-line vr-hp-line" d="M630 606 V470 Q630 360 530 360 H158" marker-end="url(#${ids.arrow})" />
          ${pulse(hpPath, "hp", 2.6, true)}
        </g>

        <g class="vr-flow vr-flow-p1">
          <path class="vr-pressure-line" d="M630 606 V360 H700 V108" marker-end="url(#${ids.pressureArrow})" />
          ${pulse(p1Path, "p1", 3.1, false)}
        </g>

        <g class="vr-flow vr-flow-p">
          <path class="vr-pressure-line" d="M630 606 V360 H920 V108" marker-end="url(#${ids.pressureArrow})" />
          ${pulse(pPath, "p", 3.3, false)}
        </g>

        <g class="vr-flow vr-flow-t-isolated">
          <path class="vr-isolated-line" d="M158 360 H494" marker-end="url(#${ids.stop})" />
          <text class="vr-isolated-word" x="250" y="346">T ISOLÉE</text>
        </g>

        <g class="vr-flow vr-flow-p-off">
          <path class="vr-isolated-line" d="M920 108 V270" marker-end="url(#${ids.stop})" />
          <text class="vr-isolated-word" x="940" y="184">P ISOLÉE</text>
        </g>
      </g>`;
  }

  function portLabels() {
    return `
      <g class="vr-port-labels" aria-label="Repères des raccords">
        <g transform="translate(112 258)">
          <rect class="vr-label-box" width="176" height="56" rx="13" />
          <text class="vr-label-code" x="16" y="24">T</text>
          <text class="vr-label-text" x="48" y="23">TUYAUTERIE</text>
          <text class="vr-label-sub" x="48" y="42">ligne frigorifique</text>
        </g>
        <g transform="translate(526 630)">
          <rect class="vr-label-box" width="210" height="58" rx="13" />
          <text class="vr-label-code" x="15" y="25">C</text>
          <text class="vr-label-text" x="49" y="24">COMPRESSEUR</text>
          <text class="vr-label-sub" x="49" y="44">raccord Rotalock</text>
        </g>
        <g transform="translate(590 12)">
          <rect class="vr-label-box vr-label-p1" width="218" height="64" rx="13" />
          <text class="vr-label-code" x="14" y="26">P1</text>
          <text class="vr-label-text" x="57" y="24">PRESSOSTAT</text>
          <text class="vr-label-sub" x="57" y="45">permanent · sous pression</text>
        </g>
        <g transform="translate(840 12)">
          <rect class="vr-label-box vr-label-p" width="192" height="64" rx="13" />
          <text class="vr-label-code" x="14" y="26">P</text>
          <text class="vr-label-text" x="48" y="24">VOIE DE SERVICE</text>
          <text class="vr-label-sub" x="48" y="45">flexible du manifold</text>
        </g>
      </g>`;
  }

  function stateNotes() {
    return `
      <g class="vr-state-note vr-note-back" transform="translate(262 646)">
        <rect width="780" height="58" rx="16" />
        <text x="20" y="24"><tspan class="vr-note-strong">T ↔ C : passage ouvert.</tspan> P : isolée par le siège arrière.</text>
        <text x="20" y="45">P1 ↔ C : pression permanente vers le pressostat.</text>
      </g>
      <g class="vr-state-note vr-note-mid" transform="translate(262 646)">
        <rect width="780" height="58" rx="16" />
        <text x="20" y="24"><tspan class="vr-note-strong">T ↔ C : passage ouvert.</tspan> P ↔ C : lecture ou intervention.</text>
        <text x="20" y="45">P1 ↔ C : pression permanente vers le pressostat.</text>
      </g>
      <g class="vr-state-note vr-note-front" transform="translate(262 646)">
        <rect width="780" height="58" rx="16" />
        <text x="20" y="24"><tspan class="vr-note-strong">T : isolée du compresseur.</tspan> P ↔ C : communication ouverte.</text>
        <text x="20" y="45">P1 ↔ C : pression permanente vers le pressostat.</text>
      </g>`;
  }

  function partsCallouts() {
    return `
      <g class="vr-parts" aria-label="Éléments constituants">
        <path class="vr-callout-line" d="M570 316 L500 188" />
        <g transform="translate(352 138)">
          <rect class="vr-callout-box" width="230" height="52" rx="12" />
          <text x="14" y="22" class="vr-callout-title">POINTEAU / BOISSEAU</text>
          <text x="14" y="41" class="vr-callout-sub">pièce mobile d’obturation</text>
        </g>

        <path class="vr-callout-line" d="M526 288 L500 114" />
        <g transform="translate(308 72)">
          <rect class="vr-callout-box" width="176" height="52" rx="12" />
          <text x="14" y="22" class="vr-callout-title">SIÈGE AVANT</text>
          <text x="14" y="41" class="vr-callout-sub">isole T de C</text>
        </g>

        <path class="vr-callout-line" d="M800 288 L798 184" />
        <g transform="translate(786 138)">
          <rect class="vr-callout-box" width="188" height="52" rx="12" />
          <text x="14" y="22" class="vr-callout-title">SIÈGE ARRIÈRE</text>
          <text x="14" y="41" class="vr-callout-sub">isole la voie de service P</text>
        </g>

        <path class="vr-callout-line" d="M810 377 L814 548" />
        <g transform="translate(718 540)">
          <rect class="vr-callout-box" width="242" height="52" rx="12" />
          <text x="14" y="22" class="vr-callout-title">TIGE — LONGUEUR CONSTANTE</text>
          <text x="14" y="41" class="vr-callout-sub">se déplace avec le carré</text>
        </g>

        <path class="vr-callout-line" d="M1064 424 L1082 548" />
        <g transform="translate(1030 540)">
          <rect class="vr-callout-box" width="222" height="52" rx="12" />
          <text x="14" y="22" class="vr-callout-title">PRESSE-ÉTOUPE FIXE</text>
          <text x="14" y="41" class="vr-callout-sub">étanchéité autour de la tige</text>
        </g>
      </g>`;
  }

  function safetyOverlay() {
    return `
      <g class="vr-safety-overlay" aria-label="Alerte prise P1">
        <rect class="vr-danger-halo" x="632" y="64" width="136" height="238" rx="30" />
        <path class="vr-danger-line" d="M660 78 L536 130" />
        <g transform="translate(130 84)">
          <rect class="vr-danger-box" width="390" height="90" rx="16" />
          <text class="vr-danger-title" x="18" y="30">DANGER — P1 RESTE SOUS PRESSION</text>
          <text class="vr-danger-text" x="18" y="55">Ne pas défaire son bouchon sur une</text>
          <text class="vr-danger-text" x="18" y="76">installation chargée. P1 = pressostat.</text>
        </g>
        <rect class="vr-safe-halo" x="872" y="64" width="96" height="238" rx="30" />
      </g>`;
  }

  function createValveSvg(options) {
    const opts = options || {};
    const position = POSITION_LABELS[opts.position] ? opts.position : "back";
    const circuit = opts.circuit === "hp" ? "hp" : "bp";
    const mode = ["parts", "flow", "safety"].includes(opts.mode) ? opts.mode : "flow";
    const isStatic = opts.static === true;
    const prefix = safeId(opts.idPrefix || `valve-${position}-${circuit}-${mode}`);
    const ids = {
      arrow: `${prefix}-arrow`,
      pressureArrow: `${prefix}-pressure-arrow`,
      stop: `${prefix}-stop`,
      clip: `${prefix}-clip`,
      hatch: `${prefix}-hatch`
    };
    const title = opts.title || (mode === "parts" ? "Vanne de service Rotalock — repérage" : POSITION_LABELS[position]);
    const desc = opts.description || "Coupe pédagogique d’une vanne de service. La voie de service P reçoit le flexible du manifold. P1 reste reliée au compresseur pour le pressostat.";
    const showTitle = opts.showTitle !== false;
    const bodyOffset = showTitle ? 52 : 4;

    return `
<svg xmlns="http://www.w3.org/2000/svg" class="vr-valve-svg" viewBox="0 0 1300 720" role="img"
     aria-labelledby="${prefix}-title ${prefix}-desc" data-position="${position}" data-circuit="${circuit}" data-mode="${mode}" data-static="${isStatic}">
  <title id="${prefix}-title">${esc(title)}</title>
  <desc id="${prefix}-desc">${esc(desc)}</desc>
  <defs>
    <marker id="${ids.arrow}" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="4.5" markerHeight="4.5" orient="auto-start-reverse">
      <path d="M0 0 L10 5 L0 10 Z" fill="context-stroke" />
    </marker>
    <marker id="${ids.pressureArrow}" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="4.5" markerHeight="4.5" orient="auto-start-reverse">
      <path d="M0 0 L10 5 L0 10 Z" fill="#C9451A" />
    </marker>
    <marker id="${ids.stop}" viewBox="0 0 12 12" refX="6" refY="6" markerWidth="10" markerHeight="10" orient="auto">
      <path d="M2 2 L10 10 M10 2 L2 10" stroke="#637285" stroke-width="2.5" />
    </marker>
    <clipPath id="${ids.clip}"><rect x="320" y="270" width="820" height="180" rx="16" /></clipPath>
    <pattern id="${ids.hatch}" width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
      <path d="M0 0 V10" stroke="#637285" stroke-width="3" opacity=".42" />
    </pattern>
  </defs>
  <style>
    .vr-valve-svg{font-family:Calibri,'Segoe UI',Arial,sans-serif;color:#10233c;overflow:visible}
    .vr-svg-title{font-family:'Trebuchet MS',Calibri,Arial,sans-serif;font-size:31px;font-weight:700;fill:#1b3a63}
    .vr-svg-subtitle{font-size:15px;font-weight:700;letter-spacing:.08em;fill:#637285}
    .vr-body,.vr-bonnet{fill:#dfe7ea;stroke:#1b3a63;stroke-width:5;stroke-linejoin:round}
    .vr-bonnet{fill:#cbd7dc}
    .vr-cavity{fill:#fffdf8;stroke:#1b3a63;stroke-width:4;stroke-linejoin:round}
    .vr-seat{fill:#b06a00;stroke:#1b3a63;stroke-width:3}
    .vr-pointer,.vr-stem-rod,.vr-square{fill:#ff6b35;stroke:#1b3a63;stroke-width:4;stroke-linejoin:round}
    .vr-moving-assembly{transition:transform 1.35s cubic-bezier(.2,.75,.25,1)}
    [data-position='front'] .vr-moving-assembly{transform:translateX(0)}
    [data-position='mid'] .vr-moving-assembly{transform:translateX(60px)}
    [data-position='back'] .vr-moving-assembly{transform:translateX(120px)}
    .vr-assembly-static{display:none}
    .vr-square-cross{stroke:#fffdf8;stroke-width:5;stroke-linecap:round}
    .vr-square-rotor{transform-origin:1122px 360px;transition:transform 1.35s cubic-bezier(.2,.75,.25,1)}
    [data-position='front'] .vr-square-rotor{transform:rotate(0deg)}
    [data-position='mid'] .vr-square-rotor{transform:rotate(-180deg)}
    [data-position='back'] .vr-square-rotor{transform:rotate(-360deg)}
    .vr-key-ring{fill:none;stroke:#637285;stroke-width:11}
    .vr-key-handle{fill:#637285;stroke:#10233c;stroke-width:3;stroke-linejoin:round}
    .vr-key-label{font-size:13px;font-weight:900;letter-spacing:.08em;fill:#637285}
    .vr-gland-body{fill:#fff4e0;stroke:#1b3a63;stroke-width:4}
    .vr-gland-seal{fill:#10233c;stroke:#1b3a63;stroke-width:3}
    .vr-gland-lines{fill:none;stroke:#b06a00;stroke-width:7;stroke-linecap:round}
    [data-static='true'] .mobile{display:none!important}
    [data-static='true'] .vr-assembly-static{display:block!important}
    .vr-flow{opacity:0;transition:opacity .28s ease}
    [data-position='back'] .vr-flow-main,[data-position='mid'] .vr-flow-main{opacity:1}
    [data-position='back'] .vr-flow-p1,[data-position='mid'] .vr-flow-p1,[data-position='front'] .vr-flow-p1{opacity:1}
    [data-position='mid'] .vr-flow-p,[data-position='front'] .vr-flow-p{opacity:1}
    [data-position='front'] .vr-flow-t-isolated,[data-position='back'] .vr-flow-p-off{opacity:1}
    .vr-main-bp,.vr-main-hp{display:none}
    [data-circuit='bp'] .vr-main-bp{display:inline}
    [data-circuit='hp'] .vr-main-hp{display:inline}
    .vr-flow-line{fill:none;stroke:#3d7fca;stroke-width:17;stroke-linecap:round;stroke-linejoin:round;opacity:.9}
    .vr-hp-line{stroke:#c0392b;stroke-dasharray:28 10}
    .vr-pressure-line{fill:none;stroke:#c9451a;stroke-width:10;stroke-dasharray:8 11;stroke-linecap:round;stroke-linejoin:round}
    .vr-flow-pulse{fill:#fffdf8;stroke:#3d7fca;stroke-width:4;opacity:.92}
    [data-circuit='hp'] .vr-flow-pulse{stroke:#c0392b}
    .vr-pressure-line~.vr-flow-pulse,.vr-flow-p1 .vr-flow-pulse,.vr-flow-p .vr-flow-pulse{stroke:#c9451a}
    .vr-flow-pulse-late{opacity:.65}
    .vr-isolated-line{fill:none;stroke:#637285;stroke-width:10;stroke-dasharray:4 12;stroke-linecap:round}
    .vr-isolated-word{font-size:15px;font-weight:800;letter-spacing:.08em;fill:#637285}
    .vr-label-box{fill:#fffdf8;stroke:#1b3a63;stroke-width:2}
    .vr-label-p1{stroke:#c9451a;stroke-dasharray:8 5;stroke-width:4}
    .vr-label-p{stroke:#1e7e54;stroke-width:4;stroke-dasharray:14 4 3 4}
    .vr-label-code{font-family:'Trebuchet MS',Calibri,Arial,sans-serif;font-size:25px;font-weight:800;fill:#1b3a63}
    .vr-label-text{font-size:15px;font-weight:800;fill:#10233c}
    .vr-label-sub{font-size:12px;font-weight:700;fill:#637285}
    .vr-state-note{display:none}
    [data-position='back'] .vr-note-back,[data-position='mid'] .vr-note-mid,[data-position='front'] .vr-note-front{display:block}
    .vr-state-note rect{fill:#fffdf8;stroke:#1b3a63;stroke-width:2}
    .vr-state-note text{font-size:15px;fill:#10233c}
    .vr-note-strong{font-weight:800;fill:#1b3a63}
    .vr-callout-line{fill:none;stroke:#3d7fca;stroke-width:2.5;stroke-dasharray:5 5}
    .vr-callout-box{fill:#fffdf8;stroke:#3d7fca;stroke-width:2}
    .vr-callout-title{font-size:14px;font-weight:800;fill:#1b3a63}
    .vr-callout-sub{font-size:12px;font-weight:700;fill:#637285}
    [data-mode='parts'] .vr-fluid-layer,[data-mode='parts'] .vr-state-note{display:none}
    [data-mode='flow'] .vr-parts,[data-mode='safety'] .vr-parts{display:none}
    .vr-safety-overlay{display:none}
    [data-mode='safety'] .vr-safety-overlay{display:block}
    .vr-danger-halo{fill:none;stroke:#c0392b;stroke-width:7;stroke-dasharray:12 8}
    .vr-danger-line{fill:none;stroke:#c0392b;stroke-width:4;stroke-dasharray:8 6}
    .vr-danger-box{fill:#fffdf8;stroke:#c0392b;stroke-width:5;stroke-dasharray:12 7}
    .vr-danger-title{font-size:15px;font-weight:900;fill:#c0392b}
    .vr-danger-text{font-size:14px;font-weight:700;fill:#10233c}
    .vr-safe-halo{fill:none;stroke:#1e7e54;stroke-width:6;stroke-dasharray:18 5 4 5}
    @media print{.mobile{display:none!important}.vr-assembly-static{display:block!important}.vr-body,.vr-bonnet,.vr-cavity,.vr-label-box,.vr-state-note rect,.vr-callout-box,.vr-danger-box{fill:#fff!important}}
  </style>
  <rect class="vr-background" width="1300" height="720" fill="#fffdf8" />
  ${showTitle ? `<text class="vr-svg-title" x="38" y="34">${esc(title)}</text><text class="vr-svg-subtitle" x="38" y="60">COUPE PÉDAGOGIQUE · SCHÉMA DE PRINCIPE</text>` : ""}
  <g transform="translate(0 ${bodyOffset}) scale(1 ${showTitle ? 0.91 : 0.99})">
    ${portsAndBody()}
    ${flowMarkup(ids)}
    ${portLabels()}
    ${mode === "parts" ? partsCallouts() : ""}
    ${mode === "safety" ? safetyOverlay() : ""}
    ${mode !== "parts" ? stateNotes() : ""}
  </g>
</svg>`;
  }

  function ratchetKeyMarkup(interactive) {
    const action = interactive
      ? 'data-key-control role="button" tabindex="0" aria-label="Lancer l’animation des trois positions avec la clé à cliquet"'
      : 'aria-hidden="true"';
    return `
      <g class="vv-key" ${action}>
        <g transform="rotate(34 1565 545)">
          <path class="vv-key-shadow" d="M1182 504 C1145 504 1118 522 1118 552 C1118 582 1145 602 1182 602 L1508 602 C1534 622 1583 620 1611 584 C1629 562 1629 536 1611 513 C1583 478 1534 477 1508 497 Z" />
          <path class="vv-key-plate" d="M1182 494 C1145 494 1118 514 1118 544 C1118 574 1145 594 1182 594 L1510 594 C1536 614 1581 611 1607 578 C1623 558 1623 532 1607 512 C1581 479 1536 476 1510 496 Z" />

          <circle class="vv-key-teeth" cx="1182" cy="544" r="52" />
          <circle class="vv-key-ring" cx="1182" cy="544" r="43" />
          <circle class="vv-key-hub" cx="1182" cy="544" r="30" />
          <rect class="vv-key-hole-small" x="1164" y="526" width="36" height="36" rx="4" />

          <circle class="vv-key-teeth" cx="1565" cy="545" r="65" />
          <circle class="vv-key-ring" cx="1565" cy="545" r="55" />
          <circle class="vv-key-hub" cx="1565" cy="545" r="40" />
          <rect class="vv-key-hole" x="1538" y="518" width="54" height="54" rx="5" />

          <circle class="vv-key-rivet" cx="1286" cy="544" r="10" />
          <circle class="vv-key-rivet" cx="1410" cy="544" r="10" />
          <path class="vv-key-paddle" d="M1490 502 L1518 490 L1528 514 L1499 525 Z" />
          <path class="vv-key-paddle" d="M1236 578 L1210 590 L1200 568 L1228 555 Z" />
          <text class="vv-key-size" x="1348" y="535">1/4</text>
          <text class="vv-key-size" x="1348" y="565">3/8</text>
        </g>
        <circle class="vv-key-focus" cx="1565" cy="545" r="82" />
      </g>`;
  }

  function validatedMovingAssembly(showKey) {
    return `
      <g class="vv-moving" aria-label="Pointeau, tige et carré : ensemble rigide mobile de longueur constante">
        <path class="vv-pointer" d="M800 545 L845 500 H905 L950 545 L905 590 H845 Z" />
        <line class="vv-stem" x1="938" y1="545" x2="1510" y2="545" />
        <g class="vv-rotor">
          <rect class="vv-square" x="1510" y="480" width="110" height="130" rx="16" />
          <path class="vv-square-cross" d="M1532 506 L1598 584 M1598 506 L1532 584" />
          ${showKey ? ratchetKeyMarkup(true) : ""}
        </g>
      </g>`;
  }

  function createValidatedValveSvg(options) {
    const opts = options || {};
    const position = POSITION_LABELS[opts.position] ? opts.position : "back";
    const circuit = opts.circuit === "hp" ? "hp" : "bp";
    const showKey = opts.showKey !== false;
    const safety = opts.mode === "safety";
    const prefix = safeId(opts.idPrefix || `validated-${position}-${circuit}`);
    const ids = {
      arrowBp: `${prefix}-arrow-bp`,
      arrowHp: `${prefix}-arrow-hp`,
      hatch: `${prefix}-hatch`
    };
    const title = opts.title || POSITION_LABELS[position];
    const desc = opts.description || "Coupe pédagogique validée de la vanne Rotalock. La tige orange, le pointeau et le carré se déplacent ensemble. P est la voie de service proche du carré. P1, à l’opposé, reçoit le pressostat.";
    const bpPath = "M300 545 H760 C860 545 920 600 920 675 V800|M920 800 V675 C920 600 860 545 760 545 H300";

    return `
<svg xmlns="http://www.w3.org/2000/svg" class="vr-valve-svg vv-svg" viewBox="0 0 1920 980" role="img"
     aria-labelledby="${prefix}-title ${prefix}-desc" data-position="${position}" data-circuit="${circuit}" data-mode="${safety ? "safety" : "flow"}">
  <title id="${prefix}-title">${esc(title)}</title>
  <desc id="${prefix}-desc">${esc(desc)}</desc>
  <defs>
    <pattern id="${ids.hatch}" width="22" height="22" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
      <rect width="22" height="22" fill="#edf1f3" />
      <line x1="0" y1="0" x2="0" y2="22" stroke="#9aaab4" stroke-width="8" />
    </pattern>
    <marker id="${ids.arrowBp}" viewBox="0 0 50 50" refX="44" refY="25" markerWidth="50" markerHeight="50" markerUnits="userSpaceOnUse" orient="auto">
      <path d="M3 4 L47 25 L3 46 Z" fill="#3d7fca" />
    </marker>
    <marker id="${ids.arrowHp}" viewBox="0 0 50 50" refX="44" refY="25" markerWidth="50" markerHeight="50" markerUnits="userSpaceOnUse" orient="auto">
      <path d="M3 4 L47 25 L3 46 Z" fill="#c0392b" />
    </marker>
  </defs>
  <style>
    .vv-svg{font-family:Calibri,'Segoe UI',Arial,sans-serif;overflow:visible}
    .vv-bg{fill:#fffdf8}
    .vv-body{fill:#dfe7ea;stroke:#10233c;stroke-width:9}
    .vv-cavity{fill:#fffdf8;stroke:#10233c;stroke-width:6}
    .vv-fluid-state{display:none}
    [data-position='front'] .vv-fluid-front,[data-position='mid'] .vv-fluid-mid,[data-position='back'] .vv-fluid-back{display:block}
    .vv-fluid{fill:#84b7ec}
    [data-circuit='hp'] .vv-fluid{fill:#efaaa3}
    .vv-isolated{fill:url(#${ids.hatch})}
    .vv-seat{fill:#4f5f68}
    .vv-moving{transition:transform 1.35s cubic-bezier(.2,.75,.25,1)}
    [data-position='front'] .vv-moving{transform:translateX(0)}
    [data-position='mid'] .vv-moving{transform:translateX(135px)}
    [data-position='back'] .vv-moving{transform:translateX(270px)}
    .vv-pointer,.vv-square{fill:#ff6b35;stroke:#10233c;stroke-width:8;stroke-linejoin:round}
    .vv-stem{stroke:#ff6b35;stroke-width:30;stroke-linecap:square}
    .vv-rotor{transform-origin:1565px 545px;transition:transform 1.35s cubic-bezier(.2,.75,.25,1)}
    [data-position='front'] .vv-rotor{transform:rotate(0deg)}
    [data-position='mid'] .vv-rotor{transform:rotate(-180deg)}
    [data-position='back'] .vv-rotor{transform:rotate(-360deg)}
    .vv-square-cross{fill:none;stroke:#fffdf8;stroke-width:9;stroke-linecap:round}
    .vv-gland-outer{fill:#b7c2c8;stroke:#10233c;stroke-width:8}
    .vv-gland-inner{fill:#f2b544;stroke:#10233c;stroke-width:5}
    .vv-label-box{fill:#1b3a63;stroke:#1b3a63;stroke-width:4}
    .vv-label-box-service{fill:#fffdf8;stroke:#1e7e54;stroke-width:6;stroke-dasharray:18 7 4 7}
    .vv-label-box-p1{fill:#fffdf8;stroke:#c0392b;stroke-width:6;stroke-dasharray:14 9}
    .vv-code{font-size:43px;font-weight:900;fill:#fffdf8;text-anchor:middle}
    .vv-code-dark{font-size:36px;font-weight:900;fill:#1b3a63;text-anchor:middle}
    .vv-label{font-size:25px;font-weight:850;fill:#10233c;text-anchor:middle}
    .vv-small{font-size:24px;font-weight:850;fill:#10233c}
    .vv-flow-main{opacity:0;transition:opacity .25s ease}
    [data-position='back'] .vv-flow-main,[data-position='mid'] .vv-flow-main{opacity:1}
    .vv-bp,.vv-hp{display:none}
    [data-circuit='bp'] .vv-bp{display:block}
    [data-circuit='hp'] .vv-hp{display:block}
    .vv-flow-line{fill:none;stroke:#3d7fca;stroke-width:24;stroke-linecap:round;stroke-linejoin:round}
    .vv-hp-line{stroke:#c0392b;stroke-dasharray:46 24}
    .vr-flow-pulse{fill:#fffdf8;stroke:#3d7fca;stroke-width:5}
    [data-circuit='hp'] .vr-flow-pulse{stroke:#c0392b}
    .vr-flow-pulse-late{opacity:.62}
    .vv-stop{display:none}
    [data-position='front'] .vv-stop-t,[data-position='back'] .vv-stop-p{display:block}
    .vv-stop path{stroke:#637285;stroke-width:13;stroke-linecap:round}
    .vv-stop text{font-size:26px;font-weight:900;fill:#637285}
    .vv-key{cursor:pointer}
    .vv-key:focus{outline:none}
    .vv-key-shadow{fill:#121923;stroke:#10233c;stroke-width:8}
    .vv-key-plate{fill:#e8ecef;stroke:#10233c;stroke-width:8}
    .vv-key-teeth{fill:#111923;stroke:#10233c;stroke-width:12;stroke-dasharray:5 3}
    .vv-key-ring{fill:#202b38;stroke:#05080d;stroke-width:5}
    .vv-key-hub{fill:#d9dee3;stroke:#10233c;stroke-width:6}
    .vv-key-hole,.vv-key-hole-small{fill:#ff6b35;stroke:#10233c;stroke-width:7}
    .vv-key-rivet{fill:#aeb8c0;stroke:#10233c;stroke-width:5}
    .vv-key-paddle{fill:#202b38;stroke:#10233c;stroke-width:4}
    .vv-key-size{font-size:20px;font-weight:900;fill:#5e6872;text-anchor:middle}
    .vv-key-focus{fill:none;stroke:transparent;stroke-width:10}
    .vv-key:focus .vv-key-focus{stroke:#ff6b35;stroke-dasharray:14 8}
    .vv-safety-layer{display:none}
    [data-mode='safety'] .vv-flow-main{display:none}
    [data-mode='safety'] .vv-safety-layer{display:block}
    .vv-safe-box{fill:#fffdf8;stroke:#1e7e54;stroke-width:6;stroke-dasharray:18 7 4 7}
    .vv-danger-box{fill:#fffdf8;stroke:#c0392b;stroke-width:7;stroke-dasharray:16 10}
    .vv-safe-title{font-size:30px;font-weight:900;fill:#1e7e54;text-anchor:middle}
    .vv-danger-title{font-size:30px;font-weight:900;fill:#c0392b;text-anchor:middle}
    .vv-safety-text{font-size:24px;font-weight:800;fill:#10233c;text-anchor:middle}
    @media print{.vr-flow-pulse{display:none}.vv-bg,.vv-cavity,.vv-label-box-service,.vv-label-box-p1,.vv-safe-box,.vv-danger-box{fill:#fff!important}}
  </style>
  <rect class="vv-bg" width="1920" height="980" />

  <g aria-label="Corps de vanne en coupe">
    <rect class="vv-body" x="140" y="455" width="710" height="180" rx="88" />
    <rect class="vv-body" x="850" y="630" width="140" height="250" rx="30" />
    <rect class="vv-body" x="995" y="210" width="130" height="250" rx="28" />
    <rect class="vv-body" x="1285" y="210" width="130" height="250" rx="28" />
    <rect class="vv-body" x="250" y="350" width="1290" height="400" rx="115" />
    <rect class="vv-cavity" x="160" y="480" width="1330" height="130" rx="65" />
  </g>

  <g class="vv-fluid-state vv-fluid-front" aria-label="Position fermée sur l’avant">
    <rect class="vv-isolated" x="163" y="483" width="637" height="124" rx="61" />
    <path class="vv-fluid" d="M800 483 H1426 A61 61 0 0 1 1487 544 V546 A61 61 0 0 1 1426 607 H800 Z" />
    <rect class="vv-fluid" x="887" y="545" width="66" height="312" />
    <rect class="vv-fluid" x="1027" y="240" width="66" height="305" />
    <rect class="vv-fluid" x="1317" y="240" width="66" height="305" />
  </g>
  <g class="vv-fluid-state vv-fluid-mid" aria-label="Position intermédiaire">
    <rect class="vv-fluid" x="163" y="483" width="1324" height="124" rx="61" />
    <rect class="vv-fluid" x="887" y="545" width="66" height="312" />
    <rect class="vv-fluid" x="1027" y="240" width="66" height="305" />
    <rect class="vv-fluid" x="1317" y="240" width="66" height="305" />
  </g>
  <g class="vv-fluid-state vv-fluid-back" aria-label="Position fermée sur l’arrière">
    <path class="vv-fluid" d="M224 483 H1220 V607 H224 A61 61 0 0 1 163 546 V544 A61 61 0 0 1 224 483 Z" />
    <path class="vv-isolated" d="M1220 483 H1426 A61 61 0 0 1 1487 544 V546 A61 61 0 0 1 1426 607 H1220 Z" />
    <rect class="vv-fluid" x="887" y="545" width="66" height="312" />
    <rect class="vv-fluid" x="1027" y="240" width="66" height="305" />
    <rect class="vv-isolated" x="1317" y="240" width="66" height="305" />
  </g>

  <g aria-label="Sièges avant et arrière">
    <path class="vv-seat" d="M800 476 L838 510 H800 Z" />
    <path class="vv-seat" d="M800 614 L838 580 H800 Z" />
    <path class="vv-seat" d="M1220 476 L1182 510 H1220 Z" />
    <path class="vv-seat" d="M1220 614 L1182 580 H1220 Z" />
  </g>

  ${validatedMovingAssembly(showKey)}

  <g class="vv-flow-main vv-bp" aria-label="BP : le fluide va de T vers C">
    <path class="vv-flow-line" d="M300 545 H760 C860 545 920 600 920 675 V800" marker-end="url(#${ids.arrowBp})" />
    ${pulse(bpPath, "validated-bp", 2.8, false)}
  </g>
  <g class="vv-flow-main vv-hp" aria-label="HP : le fluide va de C vers T">
    <path class="vv-flow-line vv-hp-line" d="M920 800 V675 C920 600 860 545 760 545 H300" marker-end="url(#${ids.arrowHp})" />
    ${pulse(bpPath, "validated-hp", 2.8, true)}
  </g>

  <g aria-label="Presse-étoupe fixe">
    <rect class="vv-gland-outer" x="1435" y="455" width="90" height="180" rx="23" />
    <rect class="vv-gland-inner" x="1456" y="468" width="48" height="154" rx="13" />
    <text class="vv-small" x="1480" y="700" text-anchor="middle">PRESSE-ÉTOUPE FIXE</text>
    <path d="M1480 674 V640" stroke="#10233c" stroke-width="5" />
  </g>

  <g aria-label="Repères des raccords">
    <rect class="vv-label-box" x="147" y="475" width="110" height="78" rx="20" />
    <text class="vv-code" x="202" y="529">T</text>
    <rect class="vv-label-box" x="865" y="812" width="110" height="78" rx="20" />
    <text class="vv-code" x="920" y="866">C</text>
    <rect class="vv-label-box-p1" x="965" y="110" width="190" height="100" rx="20" />
    <text class="vv-code-dark" x="1060" y="151">P1</text>
    <text class="vv-label" x="1060" y="184">PRESSOSTAT</text>
    <rect class="vv-label-box-service" x="1220" y="110" width="260" height="100" rx="20" />
    <text class="vv-code-dark" x="1350" y="151">P</text>
    <text class="vv-label" x="1350" y="184">VOIE DE SERVICE</text>
  </g>

  <g class="vv-stop vv-stop-t" aria-label="T isolée">
    <path d="M765 510 L835 580 M835 510 L765 580" />
    <text x="585" y="465">T ISOLÉE</text>
  </g>
  <g class="vv-stop vv-stop-p" aria-label="P isolée">
    <path d="M1285 500 L1350 565 M1350 500 L1285 565" />
    <text x="1290" y="650">P ISOLÉE</text>
  </g>

  <g class="vv-safety-layer" aria-label="Raccordements et sécurité">
    <path d="M1060 110 C980 52 830 58 750 118" fill="none" stroke="#c0392b" stroke-width="7" stroke-dasharray="16 10" />
    <g transform="translate(365 24)">
      <rect class="vv-danger-box" width="420" height="118" rx="24" />
      <text class="vv-danger-title" x="210" y="43">À L’OPPOSÉ DU CARRÉ : P1</text>
      <text class="vv-safety-text" x="210" y="79">Pressostat · ne jamais défaire</text>
      <text class="vv-safety-text" x="210" y="105">le bouchon sur installation chargée</text>
    </g>
    <path d="M1350 110 C1460 58 1580 78 1640 134" fill="none" stroke="#1e7e54" stroke-width="7" stroke-dasharray="18 7 4 7" />
    <g transform="translate(1490 78)">
      <rect class="vv-safe-box" width="380" height="112" rx="24" />
      <text class="vv-safe-title" x="190" y="43">PRÈS DU CARRÉ : P</text>
      <text class="vv-safety-text" x="190" y="82">Flexible du manifold</text>
    </g>
    <path d="M1600 862 C1690 826 1760 748 1810 664" fill="none" stroke="#1b3a63" stroke-width="6" />
    <text x="1590" y="888" font-size="29" font-weight="900" fill="#1b3a63" text-anchor="middle">CLÉ À CLIQUET DE FRIGORISTE</text>
    <text x="1590" y="922" font-size="24" font-weight="800" fill="#637285" text-anchor="middle">douilles carrées · sens réversible</text>
  </g>
</svg>`;
  }

  function gauge(cx, label, color, dashed) {
    return `
      <g transform="translate(${cx} 164)">
        <circle class="cn-gauge" r="72" />
        <path d="M-42 22 A48 48 0 1 1 42 22" fill="none" stroke="${color}" stroke-width="7" ${dashed ? 'stroke-dasharray="12 7"' : ""}/>
        <path d="M0 12 L30 -26" stroke="#10233c" stroke-width="7" stroke-linecap="round" />
        <circle r="8" fill="#10233c" />
        <text class="cn-gauge-label" x="0" y="48">${label}</text>
      </g>`;
  }

  function simpleValve(x, y, side, type) {
    const isBp = type === "bp";
    const color = isBp ? "#3d7fca" : "#c0392b";
    const dash = isBp ? "" : 'stroke-dasharray="16 8"';
    const flowText = isBp ? "BP — ASPIRATION : T → C" : "HP — REFOULEMENT : C → T";
    return `
      <g transform="translate(${x} ${y})">
        <rect class="cn-valve" x="0" y="46" width="292" height="126" rx="34" />
        <path class="cn-port" d="M106 50 V0 H166 V50 M195 50 V0 H255 V50 M106 168 V222 H166 V168" />
        <path d="${isBp ? "M-28 110 H96 Q136 110 136 190" : "M136 190 Q136 110 96 110 H-28"}" fill="none" stroke="${color}" stroke-width="13" stroke-linecap="round" marker-end="url(#connections-flow-arrow)" ${dash}/>
        <text class="cn-valve-title" x="0" y="254">VANNE ${isBp ? "BP" : "HP"}</text>
        <text class="cn-valve-flow" x="0" y="278" fill="${color}">${flowText}</text>
        <g transform="translate(196 -32)">
          <rect class="cn-port-label cn-port-p" width="106" height="42" rx="11" />
          <text x="13" y="27"><tspan class="cn-code">P</tspan> · SERVICE</text>
        </g>
        <g transform="translate(58 -32)">
          <rect class="cn-port-label cn-port-p1" width="126" height="42" rx="11" />
          <text x="12" y="27"><tspan class="cn-code">P1</tspan> · PRESSOSTAT</text>
        </g>
        <text class="cn-small" x="111" y="218">C</text>
        <text class="cn-small" x="-22" y="100">T</text>
      </g>`;
  }

  function createConnectionsSvg(options) {
    const opts = options || {};
    const title = opts.title || "Raccorder le manifold et les pressostats";
    const prefix = safeId(opts.idPrefix || "connections");
    return `
<svg xmlns="http://www.w3.org/2000/svg" class="vr-connections-svg" viewBox="0 0 1280 720" role="img" aria-labelledby="${prefix}-title ${prefix}-desc">
  <title id="${prefix}-title">${esc(title)}</title>
  <desc id="${prefix}-desc">Le flexible bleu du manifold se raccorde à la voie de service P de la vanne BP. Le flexible rouge se raccorde à la voie de service P de la vanne HP. La prise P1 de chaque vanne reste réservée au pressostat et demeure sous pression.</desc>
  <defs>
    <marker id="connections-flow-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto">
      <path d="M0 0 L10 5 L0 10 Z" fill="context-stroke" />
    </marker>
  </defs>
  <style>
    .vr-connections-svg{font-family:Calibri,'Segoe UI',Arial,sans-serif}
    .cn-title{font-family:'Trebuchet MS',Calibri,Arial,sans-serif;font-size:31px;font-weight:800;fill:#1b3a63}
    .cn-sub{font-size:14px;font-weight:800;letter-spacing:.08em;fill:#637285}
    .cn-panel{fill:#fffdf8;stroke:#1b3a63;stroke-width:4}
    .cn-gauge{fill:#fffdf8;stroke:#1b3a63;stroke-width:7}
    .cn-gauge-label{font-size:20px;font-weight:900;text-anchor:middle;fill:#10233c}
    .cn-bar{fill:#f7f1e7;stroke:#1b3a63;stroke-width:5}
    .cn-knob{fill:#ff6b35;stroke:#1b3a63;stroke-width:4}
    .cn-hose-bp{fill:none;stroke:#3d7fca;stroke-width:14;stroke-linecap:round}
    .cn-hose-hp{fill:none;stroke:#c0392b;stroke-width:14;stroke-linecap:round;stroke-dasharray:22 10}
    .cn-hose-service{fill:none;stroke:#b06a00;stroke-width:13;stroke-linecap:round;stroke-dasharray:3 12}
    .cn-valve{fill:#fff4e0;stroke:#1b3a63;stroke-width:5}
    .cn-port{fill:#fffdf8;stroke:#1b3a63;stroke-width:5;stroke-linejoin:round}
    .cn-valve-title{font-family:'Trebuchet MS',Calibri,Arial,sans-serif;font-size:24px;font-weight:900;fill:#1b3a63}
    .cn-valve-flow{font-size:15px;font-weight:900}
    .cn-port-label{fill:#fffdf8;stroke-width:4}
    .cn-port-p{stroke:#1e7e54;stroke-dasharray:15 5 3 5}
    .cn-port-p1{stroke:#c0392b;stroke-dasharray:9 6}
    .cn-port-label text{font-size:13px;font-weight:800;fill:#10233c}
    .cn-code{font-size:18px;fill:#1b3a63}
    .cn-small{font-size:17px;font-weight:900;fill:#1b3a63}
    .cn-pressostat{fill:#fffdf8;stroke:#c0392b;stroke-width:5;stroke-dasharray:10 6}
    .cn-pressostat-title{font-size:14px;font-weight:900;fill:#c0392b;text-anchor:middle}
    .cn-pressostat-sub{font-size:12px;font-weight:700;fill:#10233c;text-anchor:middle}
    .cn-permanent{fill:none;stroke:#c9451a;stroke-width:8;stroke-dasharray:7 9}
    .cn-service-unit{fill:#fffdf8;stroke:#b06a00;stroke-width:5;stroke-dasharray:3 9}
    .cn-service-title{font-size:15px;font-weight:900;fill:#10233c;text-anchor:middle}
    .cn-service-sub{font-size:12px;font-weight:700;fill:#637285;text-anchor:middle}
    .cn-legend{fill:#fffdf8;stroke:#1b3a63;stroke-width:2}
    .cn-legend-text{font-size:14px;font-weight:800;fill:#10233c}
    @media print{.cn-panel,.cn-gauge,.cn-bar,.cn-valve,.cn-port,.cn-port-label,.cn-pressostat,.cn-service-unit,.cn-legend{fill:#fff!important}}
  </style>
  <rect class="cn-background" width="1280" height="720" fill="#fffdf8" />
  <text class="cn-title" x="36" y="38">${esc(title)}</text>
  <text class="cn-sub" x="36" y="64">P = FLEXIBLE TEMPORAIRE · P1 = PRESSOSTAT PERMANENT</text>

  <g aria-label="Manifold" transform="translate(432 68)">
    <rect class="cn-panel" width="416" height="260" rx="28" />
    ${gauge(112, "BP · BLEU", "#3d7fca", false)}
    ${gauge(304, "HP · ROUGE", "#c0392b", true)}
    <rect class="cn-bar" x="62" y="208" width="292" height="54" rx="18" />
    <circle class="cn-knob" cx="108" cy="235" r="19" />
    <circle class="cn-knob" cx="308" cy="235" r="19" />
    <text class="cn-small" x="181" y="241">MANIFOLD</text>
  </g>

  ${simpleValve(92, 410, "left", "bp")}
  ${simpleValve(896, 410, "right", "hp")}

  <path class="cn-hose-bp" d="M628 330 C540 374 438 360 340 410" />
  <path class="cn-hose-hp" d="M742 330 C822 374 932 360 1090 410" />
  <path class="cn-hose-service" d="M640 330 C640 414 640 454 640 520" />

  <g transform="translate(36 312)">
    <rect class="cn-pressostat" width="180" height="86" rx="15" />
    <text class="cn-pressostat-title" x="90" y="31">PRESSOSTAT BP</text>
    <text class="cn-pressostat-sub" x="90" y="55">branché sur P1</text>
    <text class="cn-pressostat-sub" x="90" y="73">toujours sous pression</text>
  </g>
  <path class="cn-permanent" d="M216 355 C242 355 242 410 256 410" />

  <g transform="translate(1064 312)">
    <rect class="cn-pressostat" width="180" height="86" rx="15" />
    <text class="cn-pressostat-title" x="90" y="31">PRESSOSTAT HP</text>
    <text class="cn-pressostat-sub" x="90" y="55">branché sur P1</text>
    <text class="cn-pressostat-sub" x="90" y="73">toujours sous pression</text>
  </g>
  <path class="cn-permanent" d="M1064 355 C1036 355 1036 410 1032 410" />

  <g transform="translate(530 526)">
    <rect class="cn-service-unit" width="220" height="126" rx="18" />
    <text class="cn-service-title" x="110" y="38">FLEXIBLE JAUNE</text>
    <text class="cn-service-sub" x="110" y="65">vers l’équipement de service :</text>
    <text class="cn-service-sub" x="110" y="86">pompe à vide, station de</text>
    <text class="cn-service-sub" x="110" y="107">récupération ou bouteille</text>
  </g>

  <g transform="translate(430 668)">
    <rect class="cn-legend" width="420" height="38" rx="11" />
    <text class="cn-legend-text" x="16" y="25">Bleu plein : BP · Rouge tireté : HP · Ocre pointillé : service</text>
  </g>
</svg>`;
  }

  return {
    POSITION_LABELS,
    POSITION_SHORT,
    createValveSvg: createValidatedValveSvg,
    createConnectionsSvg
  };
});
