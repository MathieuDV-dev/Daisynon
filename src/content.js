(function() {

  const root = document.documentElement.nodeName.toLowerCase();
  const isDaisy = ["book", "dtbook"].includes(root);
  console.log("❓Daisy, are you here ?", isDaisy);

  if (!isDaisy) return;

  console.log("🟢 Daisy is here ! 📖");

  const NS = document.documentElement.namespaceURI; // namespace DAISY
  const htmlNS = "http://www.w3.org/1999/xhtml";

  // On collecte bodymatter + rearmatter (le rearmatter peut contenir conclusion, annexes, etc.)
  const sectionContainers = [
    ...Array.from(document.getElementsByTagNameNS(NS, "bodymatter")),
    ...Array.from(document.getElementsByTagNameNS(NS, "rearmatter")),
  ];
  if (!sectionContainers.length) {
    console.warn("Pas de <bodymatter> ni <rearmatter> trouvé !");
    return;
  }

  const levels = [];

  // Certains fichiers utilisent <level> sans numéro au lieu de <level1>...<level6>
  for (const container of sectionContainers) {
    // Balises levelN numérotées (level1, level2...)
    for (let lvl = 1; lvl <= 6; lvl++) {
      const elems = Array.from(container.getElementsByTagNameNS(NS, "level" + lvl));
      elems.forEach(e => { if (e._level === undefined) e._level = lvl; });
      levels.push(...elems);
    }
    // Balise <level> sans numéro : profondeur déduite via la hiérarchie DOM
    const unnumbered = Array.from(container.getElementsByTagNameNS(NS, "level"));
    unnumbered.forEach(e => {
      if (e._level !== undefined) return; // déjà traité
      let depth = 1;
      let ancestor = e.parentElement;
      while (ancestor) {
        const localName = ancestor.localName || ancestor.tagName || "";
        if (/^level(\d*)$/.test(localName)) depth++;
        ancestor = ancestor.parentElement;
      }
      e._level = Math.min(depth, 6);
      levels.push(e);
    });
  }
  levels.sort((a, b) => {
    if (a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_PRECEDING) return 1;
    else return -1;
  });

  const nav = document.createElementNS(htmlNS, "nav");
  nav.setAttribute("aria-label", "Table des matières");
  const navH2 = document.createElementNS(htmlNS, "h2");
  navH2.textContent = "Sommaire";
  nav.appendChild(navH2);
  const tocRootUl = document.createElementNS(htmlNS, "ul");
  nav.appendChild(tocRootUl);

  const main = document.createElementNS(htmlNS, "main");

  const stack = [{level: 0, ul: tocRootUl}];

  levels.forEach((el, index) => {
    const lvl = el._level;

    if (!el.id) {
      el.id = `section-${index + 1}`;
    }

    // Cherche un vrai titre dans <hN> ou <hd> (utilisé avec les balises <level> sans numéro)
    const headingTagName = "h" + lvl;
    const titleElem = el.getElementsByTagNameNS(NS, headingTagName)[0]
      || el.getElementsByTagNameNS(NS, "hd")[0];

    let titleText = "";
    if (titleElem) {
      // Extraire le texte en remplacant <br> par un espace pour eviter les mots colles
      titleText = extractText(titleElem).trim();
    }
    if (!titleText) {
      titleText = `Section ${index + 1}`;
    }

    const li = document.createElementNS(htmlNS, "li");
    const a = document.createElementNS(htmlNS, "a");
    a.href = `#${el.id}`;
    a.textContent = titleText;
    li.appendChild(a);

    while (stack.length && stack[stack.length - 1].level >= lvl) {
      stack.pop();
    }
    stack[stack.length - 1].ul.appendChild(li);

    const newUl = document.createElementNS(htmlNS, "ul");
    li.appendChild(newUl);
    stack.push({level: lvl, ul: newUl});

    // Titre visible dans <main>
    const heading = document.createElementNS(htmlNS, headingTagName);
    heading.id = el.id;
    heading.textContent = titleText;
    style_title(heading);
    main.appendChild(heading);

    Array.from(el.childNodes).forEach(child => {
      if(child.tagName === 'pagenum') {
        child.setAttribute("page-num", child.innerText);
        child.innerText = 'page ' + child.innerText;
      }
      if (
        child.nodeType === Node.ELEMENT_NODE && 
        /^level[1-6]$/.test(child.localName)
      ) {
        // skip sublevels
      } else {
        main.appendChild(
          child.nodeType === Node.ELEMENT_NODE
            ? cloneAsHTML(child)
            : child.cloneNode(true)
        );
      }
    });
  });

  const body = document.body || document.documentElement;
  body.textContent = "";
  body.appendChild(nav);
  body.appendChild(main);

  // Améliorations NVDA
  main.setAttribute("role", "main");
  main.setAttribute("tabindex", "-1");
  style_font(main);

  // Stylise tous les paragraphes & sections de manière visible
  Array.from(main.getElementsByTagName("*")).forEach(el => {

    const tag = el.tagName.toLowerCase();
    if (tag === "p" || tag === "div" || tag === "section" || tag === "pagenum") {
      el.style.display = "block";
      el.style.margin = "0.5em 0";
    }
  });

  // Transform elem to HTML 
  function cloneAsHTML(xmlElem) {
    const htmlElem = document.createElementNS(htmlNS,xmlElem.localName); // ex: "p", "div"

    // Copier tous les attributs du noeud XML
    for (let attr of xmlElem.attributes) {
      htmlElem.setAttribute(attr.name, attr.value);
    }

    // Copie texte ou enfants
    Array.from(xmlElem.childNodes).forEach(child => {
      if(child.tagName === 'pagenum') {
        child.setAttribute("page-num", child.innerText);
        child.innerText = 'page '+ child.innerText;
      }
      htmlElem.appendChild(
        child.nodeType === Node.ELEMENT_NODE
          ? cloneAsHTML(child) // récursif pour nested XML
          : child.cloneNode(true)
      );
    });
    return htmlElem;
  }

  // Extrait le texte d'un element XML en inserant un espace a chaque <br>
  // pour eviter les mots colles ("IntroductionSous-titre" -> "Introduction Sous-titre")
  function extractText(node) {
    function walk(n) {
      let result = "";
      for (const child of n.childNodes) {
        if (child.nodeType === Node.TEXT_NODE) {
          result += child.textContent;
        } else if (child.localName === "br") {
          result += " ";
        } else {
          result += walk(child);
        }
      }
      return result;
    }
    return walk(node).replace(/\s+/g, " ");
  }

  // FÂ° Styles 
  function style_font(el) {
    el.style.fontFamily = "sans-serif";
    el.style.lineHeight = "1.6";
    return el;
  }

  function style_block(el) {
    el.style.display = "block";
    el.style.margin = "0";
    el.style.padding = "0";
    return el;
  }

  function style_p(el) {
    el.style.margin = "1em 0";
    return el;
  }

  function style_h1(el) {
    el.style.fontSize = "1.6em";
    return el;
  }

  function style_title(el) {
    switch (el.tagName.toLowerCase()) {
      case "h1":
        el.style.fontSize = "1.4em";
        break;
      case "h2":
        el.style.fontSize = "1.25em";
        break;
      case "h3":
        el.style.fontSize = "1.1em";
        break;
      default:
        el.style.fontSize = "1.05em";
    }
    return el;
  }

  // Gestion d'ID unique

  (async () => {
    const seen = new Map();

    async function sha1(text) {
      const encoder = new TextEncoder();
      const data = encoder.encode(text);
      const hashBuffer = await crypto.subtle.digest("SHA-1", data);
      return Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, "0")).join("");
    }

    const targetTags = ["p", "div", "section", "pagenum", "span", "i", "b", "nav", "li", "main"];
    const elements = Array.from(main.querySelectorAll(targetTags.join(",")));

    for (const el of elements) {
      const content = el.innerText.trim();
      if (!content) continue;

      const hash = await sha1(content);
      const baseId = hash;
      let id = baseId;
      let count = seen.get(baseId) || 0;

      if (count > 0) {
        id = `${baseId}_${count}`;
      }

      seen.set(baseId, count + 1);

      if (!el.id) {
        el.id = id;
      }
    }
  })();

  // Et c'est fini !
  body.setAttribute('data-daisy-ready', 'true');
  body.dispatchEvent(new CustomEvent('daisy-dom-ready'));

})();
