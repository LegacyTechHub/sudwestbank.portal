const API_BASE = window.location.origin.includes('3000') ? '' : 'http://localhost:3000';

function getToken() {
  return localStorage.getItem('swb_token');
}

function setSession(token, user) {
  localStorage.setItem('swb_token', token);
  localStorage.setItem('isLoggedIn', 'true');
  localStorage.setItem('loggedIn', 'true');
  if (user) {
    localStorage.setItem('swb_user', JSON.stringify(user));
    localStorage.setItem('currentUser', JSON.stringify(user));
  }
}

function clearSession() {
  localStorage.removeItem('swb_token');
  localStorage.removeItem('swb_user');
  localStorage.removeItem('isLoggedIn');
  localStorage.removeItem('loggedIn');
  localStorage.removeItem('currentUser');
}

async function apiFetch(endpoint, options = {}) {
  const token = getToken();
  const headers = options.headers || {};
  if (token) headers['Authorization'] = `Bearer ${token}`;
  if (!(options.body instanceof FormData) && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }
  const res = await fetch(`${API_BASE}${endpoint}`, { ...options, headers });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Request failed');
  return data;
}

document.addEventListener('DOMContentLoaded', async () => {
  const path = window.location.pathname;

  // 1. Registration Form Handler
  if (path.includes('register.html')) {
    const oldForm = document.querySelector('form');
    if (oldForm) {
      const form = oldForm.cloneNode(true);
      oldForm.parentNode.replaceChild(form, oldForm);

      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(form);
        const pw = formData.get('password');
        const cpw = formData.get('confirm_password') || formData.get('confirmPassword');
        if (cpw && pw !== cpw) {
          alert('Passwords do not match.');
          return;
        }
        try {
          const data = await apiFetch('/api/register', { method: 'POST', body: formData });
          setSession(data.token, data.user);
          window.location.href = 'dashboard.html';
        } catch (err) {
          alert(err.message);
        }
      });
    }
  }

  // 2. Login Form Handler
  if (path.includes('online-banking.html')) {
    const oldForm = document.querySelector('form');
    if (oldForm) {
      const form = oldForm.cloneNode(true);
      oldForm.parentNode.replaceChild(form, oldForm);

      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const textInputs = Array.from(form.querySelectorAll('input')).filter(
          (i) => i.type !== 'hidden' && i.type !== 'checkbox' && i.type !== 'submit'
        );
        const identifier = textInputs[0]?.value.trim();
        const password = textInputs[1]?.value;
        if (!identifier || !password) {
          alert('Please enter your Email/Account Number and Password.');
          return;
        }
        try {
          const data = await apiFetch('/api/login', {
            method: 'POST',
            body: JSON.stringify({ identifier, password })
          });
          setSession(data.token, data.user);
          window.location.href = 'dashboard.html';
        } catch (err) {
          alert(err.message);
        }
      });
    }
  }

  // 3. Logout Links
  document.querySelectorAll('a[href*="online-banking.html"]').forEach((link) => {
    if (link.textContent.toLowerCase().includes('logout') || link.textContent.toLowerCase().includes('abmelden')) {
      link.addEventListener('click', () => clearSession());
    }
  });

  // 4. Protected Portal Pages
  const protectedPages = [
    'dashboard.html',
    'transfers.html',
    'transactions.html',
    'beneficiaries.html',
    'cards-statements.html',
    'profile-settings.html',
    'support.html'
  ];

  if (protectedPages.some((p) => path.includes(p))) {
    if (!getToken()) {
      window.location.href = 'online-banking.html';
      return;
    }

    try {
      const { user } = await apiFetch('/api/dashboard');
      const fullName = `${user.first_name} ${user.last_name}`;

      document.querySelectorAll('[data-user-name], .user-name').forEach((el) => (el.textContent = fullName));
      document.querySelectorAll('[data-user-iban]').forEach((el) => (el.textContent = user.iban));
      document.querySelectorAll('[data-user-balance]').forEach((el) => {
        el.dataset.realBalance = `${user.currency} ${Number(user.balance).toLocaleString('de-DE', { minimumFractionDigits: 2 })}`;
        el.textContent = el.dataset.realBalance;
      });

      // Handle Transfers Page
      if (path.includes('transfers.html')) {
        const oldForm = document.querySelector('form');
        if (oldForm) {
          const form = oldForm.cloneNode(true);
          oldForm.parentNode.replaceChild(form, oldForm);

          form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const payload = {
              recipient_name: form.querySelector('[name="recipient_name"], [placeholder*="Recipient"], [placeholder*="Empfänger"]')?.value,
              recipient_iban: form.querySelector('[name="recipient_iban"], [placeholder*="IBAN"], [placeholder*="Account"]')?.value,
              bank_name: form.querySelector('[name="bank_name"], [placeholder*="Bank"]')?.value || '',
              amount: form.querySelector('[name="amount"], [type="number"]')?.value,
              description: form.querySelector('[name="description"], [placeholder*="Reference"], [placeholder*="Verwendungszweck"]')?.value || ''
            };
            try {
              const res = await apiFetch('/api/transfers', { method: 'POST', body: JSON.stringify(payload) });
              alert(`${res.message}\nReference: ${res.receipt.reference_id}`);
              window.location.href = 'transactions.html';
            } catch (err) {
              alert(err.message);
            }
          });
        }
      }
    } catch (err) {
      clearSession();
      window.location.href = 'online-banking.html';
    }
  }
});