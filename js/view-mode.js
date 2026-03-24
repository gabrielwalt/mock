// view-mode.js — File list sort/title, file selection, tree toggle, view mode dropdown

// File list: sort by folder/file then name; set title from data-full-title for tooltip when CSS truncates
(function() {
  var fileList = document.querySelector('.file-list');
  if (fileList) {
    var items = Array.from(fileList.querySelectorAll('.file-item'));
    items.sort(function(a, b) {
      var aFolder = a.querySelector('svg[aria-label="Folder"]') ? 1 : 0;
      var bFolder = b.querySelector('svg[aria-label="Folder"]') ? 1 : 0;
      if (aFolder !== bFolder) return bFolder - aFolder;
      var aName = (a.querySelector('.file-name').getAttribute('data-full-title') || '').toLowerCase();
      var bName = (b.querySelector('.file-name').getAttribute('data-full-title') || '').toLowerCase();
      return aName.localeCompare(bName);
    });
    items.forEach(function(item) { fileList.appendChild(item); });
  }
})();

var fileList = document.querySelector('.file-list');
// File list: selection and page title sync
if (fileList) {
  fileList.addEventListener('click', function(e) {
    var item = e.target.closest('.file-item');
    if (!item) return;
    fileList.querySelectorAll('.file-item').forEach(function(i) { i.classList.remove('selected'); });
    item.classList.add('selected');
    var nameEl = item.querySelector('.file-name');
    var pageTitle = document.querySelector('.page-title');
    if (nameEl && pageTitle) {
      var name = nameEl.getAttribute('data-full-title') || nameEl.textContent;
      pageTitle.textContent = name;
    }
  });
}

// Document tree / Code tree toggle (browser panel)
var documentTreeToggle = document.getElementById('toggle-browser-btn');
var previewContent = document.getElementById('preview-content');
var previewCode = document.getElementById('preview-code');
var codeTree = document.querySelector('.code-tree');
if (documentTreeToggle && previewCode && codeTree) {
  codeTree.addEventListener('transitionend', function(e) {
    if (e.propertyName === 'width' && previewCode.classList.contains('code-tree-collapsed')) {
      codeTree.classList.add('code-tree-fully-hidden');
    }
  });
  documentTreeToggle.addEventListener('click', function() {
    var exmod = document.getElementById('exmod-preview');
    if (exmod && exmod.classList.contains('content-mode-code')) {
      if (previewCode.classList.contains('code-tree-collapsed')) {
        codeTree.classList.remove('code-tree-fully-hidden');
        requestAnimationFrame(function() {
          previewCode.classList.remove('code-tree-collapsed');
          documentTreeToggle.setAttribute('aria-expanded', 'true');
        });
      } else {
        previewCode.classList.add('code-tree-collapsed');
        documentTreeToggle.setAttribute('aria-expanded', 'false');
      }
    } else if (previewContent) {
      var collapsed = previewContent.classList.toggle('tree-collapsed');
      documentTreeToggle.setAttribute('aria-expanded', !collapsed);
    }
  });
  documentTreeToggle.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      documentTreeToggle.click();
    }
  });
}
// View mode dropdown – Content/Code + sub-options
var contentToolbar = document.querySelector('.content-toolbar');
var exmodPreview = document.getElementById('exmod-preview');
var previewSlot = document.getElementById('preview-slot');
var previewPool = document.getElementById('preview-panels-pool');
var pageTitle = document.querySelector('.page-title');
var viewModeDropdown = document.getElementById('view-mode-dropdown');
var viewModeTrigger = document.getElementById('view-mode-dropdown-trigger');
var viewModeLabel = document.getElementById('view-mode-dropdown-label');
var viewModeTriggerIcon = document.getElementById('view-mode-dropdown-trigger-icon');
var viewModeOverlay = document.getElementById('view-mode-dropdown-overlay');

var VIEW_MODE_LABELS = {
  'content-preview': 'Preview',
  'content-document': 'Document',
  'code-files': 'Files',
  'code-changes': 'Changes'
};
var VIEW_MODE_KEYS = ['content-preview', 'content-document', 'code-files', 'code-changes'];

function swapPreviewPanel(toCode) {
  if (!previewSlot || !previewPool) return;
  var contentPanel = document.getElementById('preview-content');
  var codePanel = document.getElementById('preview-code');
  if (!contentPanel || !codePanel) return;
  var currentInSlot = previewSlot.firstElementChild;
  if (toCode && currentInSlot === contentPanel) {
    previewSlot.removeChild(contentPanel);
    previewPool.appendChild(contentPanel);
    previewPool.removeChild(codePanel);
    previewSlot.appendChild(codePanel);
  } else if (!toCode && currentInSlot === codePanel) {
    previewSlot.removeChild(codePanel);
    previewPool.appendChild(codePanel);
    previewPool.removeChild(contentPanel);
    previewSlot.appendChild(contentPanel);
  }
}

function setViewMode(mode) {
  if (!mode || !VIEW_MODE_LABELS[mode]) return;
  var toCode = mode.startsWith('code-');
  var isDocument = mode === 'content-document';
  var isChanges = mode === 'code-changes';

  document.querySelectorAll('.view-mode-dropdown-option').forEach(function(opt) {
    opt.classList.toggle('active', opt.getAttribute('data-view-mode') === mode);
  });
  if (viewModeLabel) viewModeLabel.textContent = VIEW_MODE_LABELS[mode];
  if (viewModeTriggerIcon) {
    var activeOpt = document.querySelector('.view-mode-dropdown-option[data-view-mode="' + mode + '"]');
    var iconSvg = activeOpt ? activeOpt.querySelector('.view-mode-dropdown-option-icon') : null;
    viewModeTriggerIcon.innerHTML = '';
    if (iconSvg) {
      var clone = iconSvg.cloneNode(true);
      clone.removeAttribute('class');
      viewModeTriggerIcon.appendChild(clone);
    }
  }

  if (exmodPreview) {
    swapPreviewPanel(toCode);
    if (toCode) {
      exmodPreview.classList.add('content-mode-code');
      var previewCode = document.getElementById('preview-code');
      if (previewCode) {
        previewCode.classList.toggle('code-view-changes', isChanges);
      }
      var documentTreeToggle = document.getElementById('toggle-browser-btn');
      if (documentTreeToggle && previewCode) {
        documentTreeToggle.setAttribute('aria-expanded', !previewCode.classList.contains('code-tree-collapsed'));
      }
      if (pageTitle) {
        var codeFile = document.querySelector('.code-tree-item.file.selected .code-tree-name');
        if (codeFile) pageTitle.textContent = codeFile.textContent;
      }
      if (contentToolbar && document.querySelector('.code-tree-item.file.selected')) contentToolbar.classList.add('code-file-selected');
    } else {
      exmodPreview.classList.remove('content-mode-code');
      if (contentToolbar) contentToolbar.classList.remove('code-file-selected');
      var documentTreeToggleContent = document.getElementById('toggle-browser-btn');
      if (documentTreeToggleContent && previewContent) {
        documentTreeToggleContent.setAttribute('aria-expanded', !previewContent.classList.contains('tree-collapsed'));
      }
      if (pageTitle) {
        var contentFile = document.querySelector('.file-item.selected .file-name');
        if (contentFile) pageTitle.textContent = (contentFile.getAttribute('data-full-title') || contentFile.textContent).trim();
      }
    }
  }
  if (contentToolbar) contentToolbar.classList.toggle('view-mode-document', isDocument);
}

if (viewModeTrigger && viewModeOverlay) {
  viewModeTrigger.addEventListener('click', function(e) {
    e.stopPropagation();
    closeAllDropdowns(viewModeDropdown);
    var isOpen = viewModeDropdown.classList.toggle('open');
    viewModeTrigger.setAttribute('aria-expanded', isOpen);
    viewModeOverlay.setAttribute('aria-hidden', !isOpen);
  });
  document.addEventListener('click', function() {
    if (viewModeDropdown) {
      viewModeDropdown.classList.remove('open');
      if (viewModeTrigger) viewModeTrigger.setAttribute('aria-expanded', 'false');
      if (viewModeOverlay) viewModeOverlay.setAttribute('aria-hidden', 'true');
    }
  });
  viewModeOverlay.addEventListener('click', function(e) { e.stopPropagation(); });
}

document.querySelectorAll('.view-mode-dropdown-option').forEach(function(btn) {
  btn.addEventListener('click', function(e) {
    e.stopPropagation();
    var mode = this.getAttribute('data-view-mode');
    setViewMode(mode);
    if (viewModeDropdown) viewModeDropdown.classList.remove('open');
    if (viewModeTrigger) viewModeTrigger.setAttribute('aria-expanded', 'false');
    if (viewModeOverlay) viewModeOverlay.setAttribute('aria-hidden', 'true');
  });
});

document.addEventListener('keydown', function(e) {
  var key = e.key;
  if (key >= '1' && key <= '4' && e.ctrlKey && e.metaKey) {
    var idx = parseInt(key, 10) - 1;
    var mode = VIEW_MODE_KEYS[idx];
    if (mode) {
      setViewMode(mode);
      e.preventDefault();
    }
  }
});

setViewMode('content-preview');
