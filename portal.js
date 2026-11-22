(() => {
  // Keep all legacy login flags synced if swb_token is present
  if (localStorage.getItem('swb_token')) {
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('loggedIn', 'true');
    sessionStorage.setItem('isLoggedIn', 'true');
    sessionStorage.setItem('loggedIn', 'true');
  }

  document.addEventListener('DOMContentLoaded', () => {
    // 1. Mobile portal navigation toggle
    const navToggle = document.querySelector('.portal-nav-toggle');
    const nav = document.getElementById('portal-navigation');
    if (navToggle && nav) {
      navToggle.addEventListener('click', () => {
        const expanded = navToggle.getAttribute('aria-expanded') === 'true';
        navToggle.setAttribute('aria-expanded', String(!expanded));
        nav.classList.toggle('is-open', !expanded);
      });
    }

    // 2. Balance show / hide toggle
    const balanceToggle = document.querySelector('[data-balance-toggle]');
    const balanceLabel = document.querySelector('[data-balance-label]');
    const balances = document.querySelectorAll('[data-balance]');
    let hidden = false;

    if (balanceToggle && balances.length > 0) {
      balanceToggle.addEventListener('click', () => {
        hidden = !hidden;
        balanceToggle.setAttribute('aria-pressed', String(hidden));
        if (balanceLabel) {
          balanceLabel.textContent = hidden ? 'Betrag anzeigen' : 'Betrag ausblenden';
        }
        balances.forEach((el) => {
          if (hidden) {
            el.dataset.realBalance = el.textContent;
            el.textContent = 'EUR ••••••';
          } else if (el.dataset.realBalance) {
            el.textContent = el.dataset.realBalance;
          }
        });
      });
    }

    // 3. Logout button cleanup
    document.querySelectorAll('.portal-logout').forEach((btn) => {
      btn.addEventListener('click', () => {
        localStorage.removeItem('swb_token');
        localStorage.removeItem('swb_user');
        localStorage.removeItem('currentUser');
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('loggedIn');
        sessionStorage.clear();
      });
    });
  });
})();
