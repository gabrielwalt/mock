// dropdowns.js — closeAllDropdowns, viewport, keyboard shortcuts (Ctrl+R/L/F), breadcrumb, actions, and GitHub actions menu

// Shared: close all open dropdown menus (optionally exclude one being opened)
function closeAllDropdowns(excludeEl) {
  document.querySelectorAll('.viewport-dropdown.open, .breadcrumb-path-dropdown.open, .actions-dropdown.open, .view-mode-dropdown.open').forEach(function(d) {
    if (d === excludeEl) return;
    d.classList.remove('open');
    var t = d.querySelector('[aria-expanded]');
    if (t) t.setAttribute('aria-expanded', 'false');
    var overlay = d.querySelector('.view-mode-dropdown-overlay');
    if (overlay) overlay.setAttribute('aria-hidden', 'true');
  });
}

// Viewport dropdown (Desktop / Tablet / Phone)
(function() {
  var dropdown = document.getElementById('viewport-dropdown');
  if (!dropdown) return;
  var trigger = dropdown.querySelector('.viewport-dropdown-trigger');
  var options = dropdown.querySelectorAll('.viewport-dropdown-option');
  var icons = {
    desktop: '<svg viewBox="0 0 20 20" focusable="false" aria-hidden="true"><use href="#icon-desktop"></use></svg>',
    tablet: '<svg viewBox="0 0 20 20" focusable="false" aria-hidden="true"><use href="#icon-tablet"></use></svg>',
    phone: '<svg viewBox="0 0 20 20" focusable="false" aria-hidden="true"><use href="#icon-phone"></use></svg>'
  };
  function setViewport(v) {
    trigger.setAttribute('data-viewport', v);
    trigger.setAttribute('aria-label', 'Viewport');
    trigger.setAttribute('data-tooltip', 'Viewport');
    var svg = trigger.querySelector('svg');
    if (svg) svg.outerHTML = icons[v];
  }
  trigger.addEventListener('click', function(e) {
    e.stopPropagation();
    closeAllDropdowns(dropdown);
    dropdown.classList.toggle('open');
    trigger.setAttribute('aria-expanded', dropdown.classList.contains('open'));
  });
  options.forEach(function(opt) {
    opt.addEventListener('click', function() {
      setViewport(this.getAttribute('data-viewport'));
      dropdown.classList.remove('open');
      trigger.setAttribute('aria-expanded', 'false');
    });
  });
  setViewport(trigger.getAttribute('data-viewport') || 'desktop');
  document.addEventListener('keydown', function(e) {
    if (e.ctrlKey && e.shiftKey && e.key >= '1' && e.key <= '3') {
      var v = { '1': 'desktop', '2': 'tablet', '3': 'phone' }[e.key];
      if (v) {
        setViewport(v);
        dropdown.classList.remove('open');
        trigger.setAttribute('aria-expanded', 'false');
        e.preventDefault();
      }
    }
  });
})();
// Keyboard shortcuts: Refresh (Ctrl+R), Add to chat (Ctrl+L), Toggle browser (Ctrl+F)
(function() {
  var refreshBtn = document.getElementById('refresh-btn');
  var addToChatBtn = document.getElementById('add-to-chat-btn');
  var toggleBrowserBtn = document.getElementById('toggle-browser-btn');
  document.addEventListener('keydown', function(e) {
    if (e.ctrlKey && !e.shiftKey && !e.altKey && !e.metaKey) {
      if (e.key === 'r' || e.key === 'R') {
        if (refreshBtn) {
          refreshBtn.click();
          e.preventDefault();
        }
      } else if (e.key === 'l' || e.key === 'L') {
        if (addToChatBtn) {
          addToChatBtn.click();
          e.preventDefault();
        }
      } else if (e.key === 'f' || e.key === 'F') {
        if (toggleBrowserBtn) {
          toggleBrowserBtn.click();
          e.preventDefault();
        }
      }
    }
  });
})();
// Breadcrumb path dropdown
var breadcrumbPathDropdown = document.getElementById('breadcrumb-path-dropdown');
if (breadcrumbPathDropdown) {
  var pathTrigger = breadcrumbPathDropdown.querySelector('.breadcrumb-path-trigger');
  if (pathTrigger) pathTrigger.addEventListener('click', function(e) {
    e.stopPropagation();
    closeAllDropdowns(breadcrumbPathDropdown);
    breadcrumbPathDropdown.classList.toggle('open');
    pathTrigger.setAttribute('aria-expanded', breadcrumbPathDropdown.classList.contains('open'));
  });
  breadcrumbPathDropdown.querySelectorAll('.breadcrumb-path-option').forEach(function(opt) {
    opt.addEventListener('click', function() {
      breadcrumbPathDropdown.classList.remove('open');
      pathTrigger.setAttribute('aria-expanded', 'false');
    });
  });
}
// Actions dropdowns (content: Upload/Sync/Delete; code: Sync/Push/Switch branch/etc.)
['actions-dropdown-content', 'actions-dropdown-code'].forEach(function(id) {
  var actionsDropdown = document.getElementById(id);
  if (actionsDropdown) {
    var actionsTrigger = actionsDropdown.querySelector('.btn-actions');
    if (actionsTrigger) {
      actionsTrigger.addEventListener('click', function(e) {
        e.stopPropagation();
        closeAllDropdowns(actionsDropdown);
        actionsDropdown.classList.toggle('open');
        actionsTrigger.setAttribute('aria-expanded', actionsDropdown.classList.contains('open'));
      });
    }
    actionsDropdown.querySelectorAll('.actions-dropdown-option').forEach(function(opt) {
      opt.addEventListener('click', function() {
        actionsDropdown.classList.remove('open');
        if (actionsTrigger) actionsTrigger.setAttribute('aria-expanded', 'false');
      });
    });
  }
});

// GitHub Actions menu: connection state and interactivity
(function() {
  var connected = true;
  var syncBtn = document.getElementById('github-action-sync');
  var pushBtn = document.getElementById('github-action-push');
  var reconnectBtn = document.getElementById('github-action-reconnect');
  var logoutBtn = document.getElementById('github-action-logout');
  var userLabel = document.getElementById('github-user-label');
  var actionsDropdown = document.getElementById('actions-dropdown-code');
  var actionsTrigger = actionsDropdown ? actionsDropdown.querySelector('.btn-actions') : null;
  function updateUI() {
    if (syncBtn) syncBtn.classList.toggle('disabled', !connected);
    if (pushBtn) pushBtn.classList.toggle('disabled', !connected);
    if (reconnectBtn) reconnectBtn.style.display = connected ? 'none' : 'flex';
    if (logoutBtn) logoutBtn.style.display = connected ? 'flex' : 'none';
    if (userLabel) {
      if (connected) {
        userLabel.innerHTML = 'User: <span class="actions-dropdown-value">gabrielwalt</span>';
      } else {
        userLabel.innerHTML = 'User: <span class="actions-dropdown-dot actions-dropdown-dot-red" aria-hidden="true"></span><span class="actions-dropdown-value">not connected</span>';
      }
    }
  }
  if (logoutBtn) {
    logoutBtn.addEventListener('click', function() {
      connected = false;
      updateUI();
    });
  }
  if (reconnectBtn) {
    reconnectBtn.addEventListener('click', function() {
      connected = true;
      updateUI();
      if (actionsDropdown) actionsDropdown.classList.remove('open');
      if (actionsTrigger) actionsTrigger.setAttribute('aria-expanded', 'false');
    });
  }
  updateUI();
})();

// Close all dropdowns on any outside click
document.addEventListener('click', function() { closeAllDropdowns(); });
