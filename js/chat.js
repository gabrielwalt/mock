// chat.js — Chat mode switcher, task progress, textarea autogrow, and prompt queue

document.querySelectorAll('.chat-mode-btn').forEach(btn => {
  btn.addEventListener('click', function() {
    const switcher = this.closest('.chat-mode-switcher');
    switcher.querySelectorAll('.chat-mode-btn').forEach(b => b.classList.remove('active'));
    this.classList.add('active');
    const chat = document.querySelector('.exmod-chat');
    if (chat) chat.setAttribute('data-mode', this.getAttribute('aria-label')?.toLowerCase().includes('plan') ? 'plan' : 'execute');
  });
});
var taskProgress = document.getElementById('task-progress');
var taskProgressToggle = document.getElementById('task-progress-toggle');
var panelPending = { tasks: null, queue: null };
var taskProgressContent = document.getElementById('task-progress-content');
var progressBarFill = document.getElementById('progress-fill');
var chatMessages = document.querySelector('.chat-messages');
var clearChatBtn = document.getElementById('clear-chat-btn');
var taskStopped = false;
function resetTaskProgress() {
  if (taskProgressToggle) {
    var label = taskProgressToggle.querySelector('.chat-status-tasks-label');
    if (label) label.textContent = 'Tasks';
    taskProgressToggle.classList.add('task-progress-header-stopped', 'hidden');
    taskProgressToggle.removeAttribute('role');
    taskProgressToggle.removeAttribute('tabindex');
    taskProgressToggle.removeAttribute('aria-expanded');
    taskProgressToggle.removeAttribute('aria-controls');
    taskProgressToggle.removeAttribute('aria-label');
  }
  if (taskProgressContent) taskProgressContent.innerHTML = '';
  if (progressBarFill) progressBarFill.style.width = '0%';
  if (taskProgress) taskProgress.classList.add('collapsed');
}
function updateSendInterruptButton() {
  var sendBtn = document.getElementById('chat-send-btn');
  var interruptBtn = document.getElementById('interrupt-task-btn');
  var textarea = document.getElementById('chat-prompt-textarea');
  var hasText = textarea && textarea.value.trim().length > 0;
  var showSend = taskStopped || hasText;
  if (sendBtn) {
    sendBtn.classList.toggle('hidden', !showSend);
    sendBtn.setAttribute('data-tooltip', hasText ? 'Add to queue' : 'Send');
    sendBtn.setAttribute('aria-label', hasText ? 'Add to queue' : 'Send');
  }
  if (interruptBtn) {
    interruptBtn.classList.toggle('hidden', showSend);
  }
}
function interruptTask() {
  if (taskStopped) return;
  taskStopped = true;
  updateSendInterruptButton();
  var statusThinking = document.getElementById('chat-status-thinking');
  if (statusThinking) statusThinking.classList.add('hidden');
  if (clearChatBtn) {
    clearChatBtn.disabled = false;
    clearChatBtn.classList.remove('chat-toolbar-btn--disabled');
  }
  resetTaskProgress();
}
function clearChatAndTask() {
  if (chatMessages) chatMessages.innerHTML = '<div class="chat-empty-state" aria-live="polite">Hi, I can help you migrate your website to Edge Delivery Services.</div>';
  resetTaskProgress();
  if (clearChatBtn) {
    clearChatBtn.disabled = true;
    clearChatBtn.classList.add('chat-toolbar-btn--disabled');
  }
}
document.getElementById('interrupt-task-btn')?.addEventListener('click', interruptTask);
updateSendInterruptButton();
if (chatMessages) {
  chatMessages.addEventListener('click', function(e) {
    var copyBtn = e.target.closest('.chat-msg-copy-btn');
    if (!copyBtn) return;
    var msg = copyBtn.closest('.chat-msg');
    if (!msg) return;
    var body = msg.querySelector('.chat-msg-body');
    var text = body ? body.innerText || body.textContent || '' : '';
    if (text && navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text);
    }
  });
}
if (clearChatBtn) clearChatBtn.addEventListener('click', function() {
  if (!this.disabled) clearChatAndTask();
});
if (taskProgress && taskProgressToggle) {
  var PANEL_TRANSITION_MS = 250;
  function toggleTaskProgress() {
    if (taskStopped) return;
    var q = document.getElementById('prompt-queue');
    var qBtn = document.getElementById('prompt-queue-toggle');
    var queueOpen = q && !q.classList.contains('collapsed');
    var willExpand = taskProgress.classList.contains('collapsed');
    if (willExpand && queueOpen) {
      if (panelPending.queue) clearTimeout(panelPending.queue);
      panelPending.queue = null;
      q.classList.add('collapsed');
      if (qBtn) qBtn.setAttribute('aria-expanded', 'false');
      panelPending.tasks = setTimeout(function() {
        panelPending.tasks = null;
        taskProgress.classList.remove('collapsed');
        taskProgressToggle.setAttribute('aria-expanded', 'true');
      }, PANEL_TRANSITION_MS);
    } else {
      if (panelPending.tasks) { clearTimeout(panelPending.tasks); panelPending.tasks = null; }
      taskProgress.classList.toggle('collapsed');
      taskProgressToggle.setAttribute('aria-expanded', !taskProgress.classList.contains('collapsed'));
    }
  }
  taskProgressToggle.addEventListener('click', toggleTaskProgress);
  taskProgressToggle.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleTaskProgress();
    }
  });
}
document.addEventListener('keydown', function(e) {
  if (e.ctrlKey && e.key.toLowerCase() === 't') {
    e.preventDefault();
    var btn = document.getElementById('task-progress-toggle');
    if (btn && !btn.classList.contains('hidden')) btn.click();
  }
  if (e.ctrlKey && e.key.toLowerCase() === 'm') {
    e.preventDefault();
    var btn = document.getElementById('prompt-queue-toggle');
    if (btn && !btn.classList.contains('hidden')) btn.click();
  }
});
/* Keep chat scroll position fixed when task list opens/closes */
if (chatMessages) {
  var lastChatHeight = chatMessages.clientHeight;
  var lastScrollTop = chatMessages.scrollTop;
  chatMessages.addEventListener('scroll', function() {
    lastScrollTop = chatMessages.scrollTop;
  }, { passive: true });
  var chatResizeObserver = new ResizeObserver(function() {
    var newHeight = chatMessages.clientHeight;
    if (newHeight < lastChatHeight) {
      /* Shrinking (opening): keep bottom of visible content fixed — use current scrollTop */
      var delta = lastChatHeight - newHeight;
      chatMessages.scrollTop = Math.min(chatMessages.scrollTop + delta, chatMessages.scrollHeight - newHeight);
    } else if (newHeight > lastChatHeight) {
      /* Growing (closing): keep top of visible content fixed */
      chatMessages.scrollTop = Math.min(lastScrollTop, chatMessages.scrollHeight - newHeight);
    }
    lastChatHeight = newHeight;
    lastScrollTop = chatMessages.scrollTop;
  });
  chatResizeObserver.observe(chatMessages);
}
var taskCompletedSection = document.getElementById('task-completed-section');
var taskCompletedToggle = document.getElementById('task-completed-toggle');
if (taskCompletedSection && taskCompletedToggle) {
  taskCompletedToggle.addEventListener('click', function() {
    taskCompletedSection.classList.toggle('collapsed');
    taskCompletedToggle.setAttribute('aria-expanded', !taskCompletedSection.classList.contains('collapsed'));
  });
  taskCompletedToggle.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      taskCompletedToggle.click();
    }
  });
}
if (chatMessages) {
  function scrollToBottom() {
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }
  requestAnimationFrame(function() {
    requestAnimationFrame(scrollToBottom);
  });
  setTimeout(scrollToBottom, 100);
}
/* Chat textarea: auto-grow 1–12 lines, then scroll */
(function() {
  var textarea = document.getElementById('chat-prompt-textarea');
  if (!textarea) return;
  var maxHeight = parseInt(getComputedStyle(textarea).getPropertyValue('max-height'), 10);
  function resize() {
    textarea.style.height = 'auto';
    var h = textarea.scrollHeight;
    if (h >= maxHeight) {
      textarea.style.height = maxHeight + 'px';
      textarea.classList.add('overflowing');
    } else {
      textarea.style.height = h + 'px';
      textarea.classList.remove('overflowing');
    }
  }
  textarea.addEventListener('input', resize);
  resize();
})();

/* Prompt queue: Enter adds to queue, Shift+Enter new line */
(function() {
  var textarea = document.getElementById('chat-prompt-textarea');
  var sendBtn = document.querySelector('.chat-send-btn');
  var inputWrap = document.querySelector('.chat-input-wrap');
  var queueContainer = document.getElementById('prompt-queue');
  var queueLabel = document.getElementById('prompt-queue-label');
  var queueToggle = document.getElementById('prompt-queue-toggle');
  var queueItems = document.getElementById('prompt-queue-items');
  var statusBar = document.getElementById('chat-status-bar');
  var statusThinking = document.getElementById('chat-status-thinking');
  var promptQueue = [];
  var expandedItems = [];

  function addToQueue(text) {
    var trimmed = text.trim();
    if (!trimmed) return;
    promptQueue.push(trimmed);
    expandedItems.push(false);
    renderQueue();
    textarea.value = '';
    if (textarea.dispatchEvent) {
      textarea.dispatchEvent(new Event('input', { bubbles: true }));
    }
  }

  function removeFromQueue(index) {
    promptQueue.splice(index, 1);
    expandedItems.splice(index, 1);
    renderQueue();
  }

  function toggleExpanded(index) {
    if (expandedItems[index] !== undefined) {
      expandedItems[index] = !expandedItems[index];
      renderQueue();
    }
  }

  var copyBtnSvg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18" fill="currentColor"><use href="#icon-copy"></use></svg>';
  function sendFromQueue(index) {
    var text = promptQueue[index];
    if (text === undefined) return;
    var msg = document.createElement('div');
    msg.className = 'chat-msg user';
    msg.innerHTML = '<div class="chat-msg-body"></div><div class="chat-msg-copy-wrap"><button class="chat-msg-copy-btn" type="button" aria-label="Copy" data-tooltip="Copy">' + copyBtnSvg + '</button></div>';
    msg.querySelector('.chat-msg-body').textContent = text;
    if (chatMessages) {
      chatMessages.appendChild(msg);
    }
    if (chatMessages) chatMessages.scrollTop = chatMessages.scrollHeight;
    promptQueue.splice(index, 1);
    expandedItems.splice(index, 1);
    renderQueue();
  }

  function updateStatusBar() {
    var hasQueue = promptQueue.length > 0;
    if (queueToggle) {
      if (hasQueue) queueToggle.classList.remove('hidden');
      else queueToggle.classList.add('hidden');
    }
  }
  function renderQueue() {
    queueItems.innerHTML = '';
    if (queueLabel) queueLabel.textContent = 'Queue (' + promptQueue.length + ')';
    if (queueToggle) {
      var n = promptQueue.length;
      queueToggle.setAttribute('aria-label', 'Queue (' + n + ')');
      queueToggle.setAttribute('data-tooltip', 'Toggle message queue');
    }
    if (promptQueue.length === 0) {
      queueContainer.classList.add('empty');
    } else {
      queueContainer.classList.remove('empty');
    }
    updateStatusBar();
    promptQueue.forEach(function(text, i) {
      var item = document.createElement('div');
      var expanded = expandedItems[i];
      item.className = 'prompt-queue-item' + (expanded ? ' expanded' : ' folded');
      var hasLineBreaks = text.indexOf('\n') >= 0;
      var displayText = (!expanded && hasLineBreaks) ? text.split(/\r?\n/)[0] + '\u2026' : text;
      var escaped = displayText.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/\n/g, '<br>');
      item.innerHTML = '<span class="prompt-queue-item-text" title="' + text.replace(/"/g, '&quot;') + '">' + escaped + '</span><div class="chat-msg-queue-wrap"><button type="button" class="prompt-queue-item-unfold" aria-label="' + (expanded ? 'Collapse' : 'Expand') + '" data-tooltip="' + (expanded ? 'Collapse' : 'Expand') + '" data-index="' + i + '"><span class="prompt-queue-item-unfold-icon-expand"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" width="16" height="16" style="transform:rotate(180deg)"><use href="#icon-chevron-up"></use></svg></span><span class="prompt-queue-item-unfold-icon-collapse"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" width="16" height="16"><use href="#icon-chevron-up"></use></svg></span></button><button type="button" class="prompt-queue-item-copy" aria-label="Copy" data-tooltip="Copy" data-index="' + i + '">' + copyBtnSvg + '</button><button type="button" class="prompt-queue-item-send" aria-label="Send now" data-tooltip="Send now" data-index="' + i + '"><svg viewBox="0 0 20 20" focusable="false" aria-hidden="true" role="img"><use href="#icon-send"></use></svg></button><button type="button" class="prompt-queue-item-remove" aria-label="Remove from queue" data-tooltip="Remove from queue" data-index="' + i + '"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18" focusable="false" aria-hidden="true"><use href="#icon-close-sm"></use></svg></button></div>';
      queueItems.appendChild(item);
      if (text.indexOf('\n') >= 0) {
        item.classList.add('multi-line');
      } else {
        var textWidth = Math.max(200, (queueItems.offsetWidth || 300) - 120);
        var measureEl = document.createElement('div');
        measureEl.style.cssText = 'position:absolute;left:-9999px;top:0;width:' + textWidth + 'px;font-size:var(--spectrum-font-size-100);line-height:1.5;font-family:var(--spectrum-sans-serif-font-family);white-space:pre-wrap;word-wrap:break-word;';
        measureEl.textContent = text;
        document.body.appendChild(measureEl);
        var lineHeight = parseFloat(getComputedStyle(measureEl).lineHeight) || 21;
        if (measureEl.offsetHeight > lineHeight * 1.3) item.classList.add('multi-line');
        document.body.removeChild(measureEl);
      }
    });
    queueItems.querySelectorAll('.prompt-queue-item-remove').forEach(function(btn) {
      btn.addEventListener('click', function(e) {
        e.stopPropagation();
        removeFromQueue(parseInt(this.getAttribute('data-index'), 10));
      });
    });
    queueItems.querySelectorAll('.prompt-queue-item-unfold').forEach(function(btn) {
      btn.addEventListener('click', function(e) {
        e.stopPropagation();
        toggleExpanded(parseInt(this.getAttribute('data-index'), 10));
      });
    });
    queueItems.querySelectorAll('.prompt-queue-item-send').forEach(function(btn) {
      btn.addEventListener('click', function(e) {
        e.stopPropagation();
        sendFromQueue(parseInt(this.getAttribute('data-index'), 10));
      });
    });
    queueItems.querySelectorAll('.prompt-queue-item-copy').forEach(function(btn) {
      btn.addEventListener('click', function(e) {
        e.stopPropagation();
        var idx = parseInt(this.getAttribute('data-index'), 10);
        var text = promptQueue[idx];
        if (text && navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(text);
        }
      });
    });
  }

  function submit() {
    addToQueue(textarea.value);
  }

  if (textarea) {
    textarea.addEventListener('keydown', function(e) {
      if (e.key === 'Enter') {
        if (e.shiftKey) {
          return;
        }
        e.preventDefault();
        submit();
      }
    });
    textarea.addEventListener('input', function() {
      if (typeof updateSendInterruptButton === 'function') updateSendInterruptButton();
    });
  }
  if (sendBtn) {
    sendBtn.addEventListener('click', function() {
      submit();
    });
  }
  var PANEL_TRANSITION_MS = 250;
  if (queueToggle && queueContainer) {
    queueToggle.addEventListener('click', function() {
      var tp = document.getElementById('task-progress');
      var tpBtn = document.getElementById('task-progress-toggle');
      var tasksOpen = tp && !tp.classList.contains('collapsed');
      var willExpand = queueContainer.classList.contains('collapsed');
      if (willExpand && tasksOpen) {
        if (panelPending.tasks) clearTimeout(panelPending.tasks);
        panelPending.tasks = null;
        tp.classList.add('collapsed');
        if (tpBtn) tpBtn.setAttribute('aria-expanded', 'false');
        panelPending.queue = setTimeout(function() {
          panelPending.queue = null;
          queueContainer.classList.remove('collapsed');
          queueToggle.setAttribute('aria-expanded', 'true');
        }, PANEL_TRANSITION_MS);
      } else {
        if (panelPending.queue) { clearTimeout(panelPending.queue); panelPending.queue = null; }
        queueContainer.classList.toggle('collapsed');
        queueToggle.setAttribute('aria-expanded', !queueContainer.classList.contains('collapsed'));
      }
    });
    queueToggle.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        queueToggle.click();
      }
    });
  }
  if (queueContainer) {
    queueContainer.classList.add('empty', 'collapsed');
    if (queueToggle) queueToggle.setAttribute('aria-expanded', 'false');
  }
  renderQueue();
})();
