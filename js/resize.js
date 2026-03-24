// resize.js — Drag resize handlers for chat panel and document tree

var CHAT_MIN_WIDTH    = 500; // px — minimum chat panel width
var PREVIEW_MIN_WIDTH = 605; // px — minimum preview panel width (used to compute chat max)
var TREE_MIN_WIDTH    = 250; // px — minimum document/code tree width
var TREE_DEFAULT_WIDTH = 260; // px — initial document/code tree width
var TREE_CONTENT_BUFFER = 200; // px — min space to leave for content beside tree

// Chat panel resize (drag handle between chat and preview)
(function() {
  var grid = document.querySelector('.exmod-grid');
  var handle = document.getElementById('chat-resize-handle');
  var grip = document.getElementById('chat-resize-handle-grip');
  var chatPanel = document.querySelector('.exmod-chat');
  if (!grid || !handle || !grip || !chatPanel) return;
  var minWidth = CHAT_MIN_WIDTH;
  var startX, startWidth;
  function getMaxWidth() {
    return Math.max(minWidth, (grid.offsetWidth || 0) - PREVIEW_MIN_WIDTH);
  }
  function onMouseDown(e) {
    if (e.button !== 0) return;
    e.preventDefault();
    startX = e.clientX;
    startWidth = chatPanel.offsetWidth;
    handle.classList.add('dragging');
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  }
  function onMouseMove(e) {
    var delta = e.clientX - startX;
    var newWidth = Math.round(Math.max(minWidth, Math.min(getMaxWidth(), startWidth + delta)));
    grid.style.setProperty('--chat-width', newWidth + 'px');
  }
  function onMouseUp() {
    handle.classList.remove('dragging');
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
  }
  grip.addEventListener('mousedown', onMouseDown);
})();

// Document tree resize (drag handle between tree and content)
(function() {
  var preview = document.getElementById('exmod-preview');
  var handleContent = document.getElementById('document-tree-resize-handle');
  var handleCode = document.getElementById('document-tree-resize-handle-code');
  var gripContent = document.getElementById('document-tree-resize-handle-grip');
  var gripCode = document.getElementById('document-tree-resize-handle-grip-code');
  if (!preview || !handleContent || !handleCode || !gripContent || !gripCode) return;
  var minWidth = TREE_MIN_WIDTH;
  var defaultWidth = TREE_DEFAULT_WIDTH;
  function getMaxWidth() {
    return Math.max(minWidth, (preview.offsetWidth || 0) - TREE_CONTENT_BUFFER);
  }
  function initWidth() {
    var current = preview.style.getPropertyValue('--document-tree-width');
    if (!current) return defaultWidth;
    var n = parseInt(current, 10);
    return isNaN(n) ? defaultWidth : n;
  }
  function setupResize(handle, grip) {
    var startX, startWidth;
    var container;
    function onMouseDown(e) {
      if (e.button !== 0) return;
      e.preventDefault();
      startX = e.clientX;
      var tree = handle.previousElementSibling;
      startWidth = tree ? tree.offsetWidth : initWidth();
      handle.classList.add('dragging');
      container = handle.closest('.preview-content, .preview-code');
      if (container) container.classList.add('tree-resizing');
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    }
    function onMouseMove(e) {
      var delta = e.clientX - startX;
      var newWidth = Math.round(Math.max(minWidth, Math.min(getMaxWidth(), startWidth + delta)));
      preview.style.setProperty('--document-tree-width', newWidth + 'px');
    }
    function onMouseUp() {
      handle.classList.remove('dragging');
      if (container) container.classList.remove('tree-resizing');
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    }
    grip.addEventListener('mousedown', onMouseDown);
  }
  setupResize(handleContent, gripContent);
  setupResize(handleCode, gripCode);
})();
