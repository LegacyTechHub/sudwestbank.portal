document.addEventListener("DOMContentLoaded", () => {
  const header = document.querySelector("#global-header");
  if (header) {
    header.innerHTML = `
      <div class="utility-bar"><div class="container utility-inner">
        <a class="utility-link" href="kontakt.html">Filialen</a>
        <a class="utility-link" href="index.html#ueber-uns">Über uns</a>
        <a class="utility-link" href="online-banking.html">Online-Filiale</a>
        <div class="utility-actions">
          <button class="search-toggle" type="button" aria-expanded="false" aria-controls="search-panel"><span class="search-icon" aria-hidden="true"></span><span>Suche</span></button>
          <div class="access-wrap"><button class="access-toggle" type="button" aria-expanded="false">Online Zugänge</button><div class="access-menu">
            <a href="online-banking.html">Online-Banking</a><a href="online-banking.html">Für Qlick Kunden</a>
            <a href="service.html">Kreditkarten PayLife</a><a href="service.html">Fernwartung</a>
          </div></div>
          <div class="header-auth header-auth--desktop"><a class="auth-login" href="online-banking.html">Anmelden</a><a href="register.html">Registrieren</a></div>
        </div>
      </div></div>
      <div class="masthead"><div class="container masthead-inner">
        <a class="brand" href="index.html" aria-label="SÜDWESTBANK Startseite"><img src="https://www.suedwestbank.de/resource/crblob/102714/b3d7f587a8b135c7839ee761a534a16e/swb-on-rgb-100mm-data.svg" alt="SÜDWESTBANK"></a>
        <nav class="main-nav" aria-label="Hauptnavigation"><ul class="main-nav-list">
          <li class="nav-item"><a class="nav-link" href="privatkunden.html">Privatkunden</a><div class="mega-menu"><div class="mega-content">
            <section class="mega-group"><h2>Konten &amp; Karten</h2><a href="privatkunden.html#konten-karten">GiroPrivat</a><a href="privatkunden.html#konten-karten">girocard</a></section>
            <section class="mega-group"><h2>Sparen &amp; Anlegen</h2><a href="privatkunden.html#sparen">RentaAnlage</a><a href="privatkunden.html#sparen">AnlageInvest</a></section>
            <section class="mega-group"><h2>Kredite</h2><a href="privatkunden.html#kredite">Ratenkredit</a><a href="privatkunden.html#kredite">Baufinanzierung</a></section>
            <section class="mega-group"><h2>Direkt zu</h2><a href="kontakt.html">Kontakt</a><a href="service.html">Service</a></section>
          </div></div></li>
          <li class="nav-item"><a class="nav-link" href="private-banking.html">Private Banking</a><div class="mega-menu"><div class="mega-content">
            <section class="mega-group"><h2>Beratung</h2><a href="private-banking.html#ansprechpartner">Ansprechpartner</a><a href="private-banking.html#vermoegensbetreuung">Vermögensbetreuung</a></section>
            <section class="mega-group"><h2>Anlegen</h2><a href="private-banking.html#wertpapierdepots">Wertpapierdepots</a></section>
            <section class="mega-group"><h2>Planung</h2><a href="private-banking.html#nachfolgeplanung">Nachfolgeplanung</a></section>
            <section class="mega-group"><h2>Mehr</h2><a href="private-banking.html#stiftungen">Stiftungen</a></section>
          </div></div></li>
          <li class="nav-item"><a class="nav-link" href="unternehmenskunden.html">Unternehmenskunden</a><div class="mega-menu"><div class="mega-content">
            <section class="mega-group"><h2>Zahlungsverkehr</h2><a href="unternehmenskunden.html#konto">Konto &amp; Zahlungsverkehr</a></section>
            <section class="mega-group"><h2>Finanzierung</h2><a href="unternehmenskunden.html#finanzierung">Finanzierung und Fördermittel</a></section>
            <section class="mega-group"><h2>Leasing &amp; Factoring</h2><a href="unternehmenskunden.html#leasing">Leasing &amp; Factoring</a></section>
            <section class="mega-group"><h2>Absicherung</h2><a href="unternehmenskunden.html#absicherung">Versichern &amp; Absichern</a></section>
          </div></div></li>
          <li class="nav-item"><a class="nav-link" href="service.html">Service</a><div class="mega-menu"><div class="mega-content">
            <section class="mega-group"><h2>Vor Ort</h2><a href="kontakt.html">Filialen in Ihrer Nähe</a><a href="kontakt.html">Geldautomatensuche</a></section>
            <section class="mega-group"><h2>Anliegen</h2><a href="kontakt.html">Beschwerdemanagement</a></section>
            <section class="mega-group"><h2>Online</h2><a href="service.html">Service-Portal</a><a href="service.html">Downloadcenter</a></section>
            <section class="mega-group"><h2>Kontakt</h2><a href="kontakt.html">Wir sind für Sie da</a></section>
          </div></div></li>
        </ul></nav>
        <div class="header-auth header-auth--mobile"><a class="auth-login" href="online-banking.html">Anmelden</a><a href="register.html">Registrieren</a></div>
        <button class="menu-toggle" type="button" aria-label="Menü öffnen" aria-expanded="false" aria-controls="mobile-menu"><span></span><span></span><span></span></button>
      </div></div>
      <div class="search-panel" id="search-panel"><form class="container search-form" role="search"><input type="search" placeholder="Wonach suchen Sie?" aria-label="Suchbegriff"><button type="submit">Suchen</button></form></div>
      <div class="mobile-menu" id="mobile-menu" aria-label="Mobiles Menü">
        <div class="mobile-menu-head"><a class="brand" href="index.html" aria-label="SÜDWESTBANK Startseite"><img src="https://www.suedwestbank.de/resource/crblob/102714/b3d7f587a8b135c7839ee761a534a16e/swb-on-rgb-100mm-data.svg" alt="SÜDWESTBANK"></a><button class="mobile-menu-close" type="button" aria-label="Menü schließen"></button></div>
        <form class="mobile-search" role="search"><input type="search" placeholder="Suchbegriff" aria-label="Suchbegriff"><button type="submit" aria-label="Suchen">⌕</button></form>
        <div class="mobile-auth"><a class="auth-login" href="online-banking.html">Anmelden</a><a href="register.html">Registrieren</a></div>
        <nav aria-label="Mobile Navigation"><ul class="mobile-links">
          <li><a href="privatkunden.html">Privatkunden</a></li><li><a href="private-banking.html">Private Banking</a></li>
          <li><a href="unternehmenskunden.html">Unternehmenskunden</a></li><li><a href="service.html">Service</a></li>
          <li><a href="index.html#ueber-uns">Über uns</a></li><li><a href="kontakt.html">Filialen</a></li><li><a href="online-banking.html">Online-Filiale</a></li>
        </ul></nav>
      </div>`;
  }

  const actualHeader = document.querySelector(".site-header");
  if (actualHeader && !actualHeader.querySelector("#mobile-menu")) {
    actualHeader.insertAdjacentHTML("beforeend", `
      <div class="mobile-menu" id="mobile-menu" aria-label="Mobiles Menü">
        <div class="mobile-menu-head"><a class="brand" href="index.html" aria-label="SÜDWESTBANK Startseite"><img src="https://www.suedwestbank.de/resource/crblob/102714/b3d7f587a8b135c7839ee761a534a16e/swb-on-rgb-100mm-data.svg" alt="SÜDWESTBANK"></a><button class="mobile-menu-close" type="button" aria-label="Menü schließen"></button></div>
        <form class="mobile-search" role="search"><input type="search" placeholder="Suchbegriff" aria-label="Suchbegriff"><button type="submit" aria-label="Suchen">⌕</button></form>
        <div class="mobile-auth"><a class="auth-login" href="online-banking.html">Anmelden</a><a href="register.html">Registrieren</a></div>
        <nav aria-label="Mobile Navigation"><ul class="mobile-links">
          <li><a href="privatkunden.html">Privatkunden</a></li><li><a href="private-banking.html">Private Banking</a></li>
          <li><a href="unternehmenskunden.html">Unternehmenskunden</a></li><li><a href="service.html">Service</a></li>
          <li><a href="index.html#ueber-uns">Über uns</a></li><li><a href="kontakt.html">Filialen</a></li><li><a href="online-banking.html">Online-Filiale</a></li>
        </ul></nav>
      </div>`);
  }

  const footer = document.querySelector("#global-footer");
  if (footer) {
    footer.innerHTML = `
      <div class="container footer-main">
        <section><h2>Über uns</h2><div class="footer-links"><a href="index.html#ueber-uns">Nachhaltigkeit</a><a href="index.html#ueber-uns">Compliance</a><a href="index.html#ueber-uns">Management</a><a href="index.html#ueber-uns">Partner</a><a href="index.html#ueber-uns">Karriere</a></div></section>
        <section><h2>Unsere Partner</h2><div class="partner-links"><a href="https://www.bawaggroup.com/">bawaggroup.com ↗</a><a href="https://www.healthag.de/">healthag.de ↗</a><a href="https://www.zakag.ch/">zakag.ch ↗</a><a href="https://www.bfl-leasing.de/">bfl-leasing.de ↗</a><a href="https://www.paylife.at/">paylife.at ↗</a></div></section>
      </div>
      <div class="footer-bottom"><div class="container footer-bottom-inner"><span class="copyright">© SÜDWESTBANK</span><nav aria-label="Rechtliche Informationen"><ul class="legal-links"><li><a href="kontakt.html">Impressum</a></li><li><a href="kontakt.html">Rechtliche Hinweise</a></li><li><a href="kontakt.html">Barrierefreiheit</a></li><li><a href="kontakt.html">Datenschutz</a></li><li><a href="kontakt.html">Beschwerde</a></li><li><a href="https://bawag.integrityline.app/">Whistleblowing</a></li></ul></nav></div></div>`;
  }

  const main = document.querySelector("main");
  const footerElement = document.querySelector("#global-footer");
  if (main && footerElement && !document.querySelector(".contact-strip:not(.index-contact)") && !main.querySelector(".contact-strip")) {
    footerElement.insertAdjacentHTML("beforebegin", `
      <section class="contact-strip" aria-labelledby="contact-title"><div class="container contact-strip-inner">
        <div class="contact-heading"><h2 id="contact-title">Wir sind für Sie da</h2><p>Wenden Sie sich einfach und direkt an uns.</p></div>
        <div class="contact-table"><div><strong>Telefon:</strong><a href="tel:+4971166446644">0711/664 466 44 →</a></div><div><strong>Email:</strong><a href="mailto:inforsuedwestbank@gmail.com">inforsuedwestbank@gmail.com →</a></div><div class="contact-hours"><span><strong>Montag bis Donnerstag</strong> von 9:00 Uhr bis 16:30 Uhr</span><span><strong>Freitag</strong> von 9:00 Uhr bis 15:00 Uhr</span></div></div>
      </div></section>`);
  }

  const menuToggle = document.querySelector(".menu-toggle");
  const mobileMenu = document.querySelector("#mobile-menu");
  const closeButton = document.querySelector(".mobile-menu-close");
  menuToggle?.addEventListener("click", () => {
    const open = !mobileMenu.classList.contains("is-open");
    mobileMenu.classList.toggle("is-open", open);
    menuToggle.setAttribute("aria-expanded", String(open));
    document.body.classList.toggle("menu-open", open);
  });
  closeButton?.addEventListener("click", () => {
    mobileMenu.classList.remove("is-open");
    menuToggle.setAttribute("aria-expanded", "false");
    document.body.classList.remove("menu-open");
  });

  const searchToggle = document.querySelector(".search-toggle");
  const searchPanel = document.querySelector(".search-panel");
  searchToggle?.addEventListener("click", () => {
    const open = !searchPanel.classList.contains("is-open");
    searchToggle.setAttribute("aria-expanded", String(open));
    searchPanel.classList.toggle("is-open", open);
  });

  const accessWrap = document.querySelector(".access-wrap");
  const accessToggle = document.querySelector(".access-toggle");
  accessToggle?.addEventListener("click", event => {
    event.stopPropagation();
    const open = !accessWrap.classList.contains("is-open");
    accessWrap.classList.toggle("is-open", open);
    accessToggle.setAttribute("aria-expanded", String(open));
  });
  document.addEventListener("click", event => {
    if (!accessWrap?.contains(event.target)) {
      accessWrap?.classList.remove("is-open");
      accessToggle?.setAttribute("aria-expanded", "false");
    }
  });

  const hero = document.querySelector(".home-hero");
  if (hero) {
    const slides = [
      ["Sparen mit RentaAnlage", "3,00% p.a. für 13 Monate Laufzeit", "ab 5.000 Euro möglich."],
      ["AnlageInvest", "Im Duo zu mehr Power", "50% Festgeld und 50% ausgewählte Fonds"],
      ["PayLife Gold Mastercard®", "Sicherheit und Komfort sind Gold wert.", "Jetzt informieren"],
      ["Vorsorgen leicht gemacht.", "Heute vorsorgen. Morgen genießen.", "Jetzt informieren"],
      ["Zum 18. Mal in Folge", "In der Elite der Vermögensverwalter.", "Elite Report"]
    ];
    const dots = [...hero.querySelectorAll(".hero-dot")];
    dots.forEach((dot, index) => {
      dot.addEventListener("click", () => {
        hero.className = `home-hero slide-${index}`;
        dots.forEach((item, dotIndex) => {
          item.classList.toggle("active", dotIndex === index);
          item.toggleAttribute("aria-current", dotIndex === index);
        });
        hero.querySelector(".hero-eyebrow").textContent = slides[index][0];
        hero.querySelector("h1").textContent = slides[index][1];
        hero.querySelector(".hero-subtitle").textContent = slides[index][2];
      });
    });
  }
});
