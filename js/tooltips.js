// tooltips.js — Tooltip positioning (fixed/escaped overflow) and shortcut tooltips

// Tooltip positioning (fixed to escape overflow/header) – event delegation for dynamically created elements
document.addEventListener('mouseover', function(e) {
  var el = e.target.closest('[data-tooltip]');
  if (!el) return;
  var r = el.getBoundingClientRect();
  if (el.closest('.exmod-nav') || el.getAttribute('data-tooltip-position') === 'right') {
    el.style.setProperty('--tt-x', (r.right + 8) + 'px');
    el.style.setProperty('--tt-y', (r.top + r.height / 2) + 'px');
  } else {
    el.style.setProperty('--tt-x', (r.left + r.width / 2) + 'px');
    el.style.setProperty('--tt-y', r.top + 'px');
  }
});
// Tooltips with shortcut: show shortcut in a slightly lighter box, with modifier key icons (⌃ ⌘ ⇧)
(function() {
  var tooltipEl = null;
  var lastTarget = null;
  var MODIFIER_SYMBOLS = { Ctrl: '\u2303', Control: '\u2303', Cmd: '\u2318', Command: '\u2318', Shift: '\u21E7', Alt: '\u2325', Option: '\u2325' };
  function formatShortcut(str) {
    if (!str) return '';
    var parts = str.split('+').map(function(p) { return p.trim(); });
    var out = '';
    var key = '';
    for (var i = 0; i < parts.length; i++) {
      var p = parts[i];
      var sym = MODIFIER_SYMBOLS[p];
      if (sym) out += sym;
      else key = p;
    }
    return out + key;
  }
  function escapeHtml(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
  function hideTooltip() {
    if (tooltipEl && tooltipEl.parentNode) tooltipEl.parentNode.removeChild(tooltipEl);
    tooltipEl = null;
  }
  document.addEventListener('mouseover', function(e) {
    var el = e.target.closest('[data-tooltip][data-tooltip-shortcut]');
    if (!el) {
      hideTooltip();
      lastTarget = null;
      return;
    }
    if (el === lastTarget) return; // still hovering the same element — skip DOM work
    lastTarget = el;
    hideTooltip();
    var label = el.getAttribute('data-tooltip');
    var shortcut = el.getAttribute('data-tooltip-shortcut');
    if (!label || !shortcut) return;
    var shortcutFormatted = formatShortcut(shortcut);
    var r = el.getBoundingClientRect();
    var rightPos = el.closest('.exmod-nav') || el.getAttribute('data-tooltip-position') === 'right';
    tooltipEl = document.createElement('div');
    tooltipEl.className = 'tooltip-with-shortcut' + (rightPos ? ' tooltip-right' : '');
    tooltipEl.innerHTML = '<span class="tooltip-label">' + escapeHtml(label) + '</span><span class="tooltip-shortcut">' + escapeHtml(shortcutFormatted) + '</span>';
    document.body.appendChild(tooltipEl);
    var tr = tooltipEl.getBoundingClientRect();
    if (rightPos) {
      tooltipEl.style.left = (r.right + 8) + 'px';
      tooltipEl.style.top = (r.top + r.height / 2 - tr.height / 2) + 'px';
      tooltipEl.style.transform = 'none';
    } else {
      tooltipEl.style.left = (r.left + r.width / 2) + 'px';
      tooltipEl.style.top = (r.top - tr.height - 10) + 'px';
      tooltipEl.style.transform = 'translateX(-50%)';
    }
  });
  document.addEventListener('mouseout', function(e) {
    var el = e.target.closest('[data-tooltip][data-tooltip-shortcut]');
    var related = e.relatedTarget;
    if (!el || (related && el.contains(related))) return;
    if (related && tooltipEl && (related === tooltipEl || tooltipEl.contains(related))) return;
    lastTarget = null;
    hideTooltip();
  });
})();
