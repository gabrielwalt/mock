// code-tree.js — Code tree builder with expand/collapse and file selection

// Code tree: build from file list, expand/collapse and selection
(function() {
  var CODE_TREE_PATHS = [
    'blocks/article-header/article-header.css','blocks/article-header/article-header.js',
    'blocks/cards-stories/cards-stories.js','blocks/cards-stories/metadata.json','blocks/cards-stories/cards-stories.css',
    'blocks/hero-featured/hero-featured.css','blocks/hero-featured/metadata.json','blocks/hero-featured/hero-featured.js',
    'blocks/footer/footer.css','blocks/footer/footer.js',
    'blocks/social-share/social-share.js','blocks/social-share/social-share.css',
    'blocks/form/form.css','blocks/form/form.js',
    'blocks/embed/embed.js','blocks/embed/embed.css',
    'blocks/cards/cards.js','blocks/cards/cards.css',
    'blocks/cards-awards/cards-awards.css','blocks/cards-awards/metadata.json','blocks/cards-awards/cards-awards.js',
    'blocks/columns-quote/metadata.json','blocks/columns-quote/columns-quote.js','blocks/columns-quote/columns-quote.css',
    'blocks/contact-card/contact-card.js','blocks/contact-card/contact-card.css',
    'blocks/cards-reports/cards-reports.css','blocks/cards-reports/cards-reports.js',
    'blocks/navigation-tabs/navigation-tabs.js','blocks/navigation-tabs/navigation-tabs.css',
    'blocks/fact-sheets/fact-sheets.css','blocks/fact-sheets/fact-sheets.js',
    'blocks/fragment/fragment.js','blocks/fragment/fragment.css',
    'blocks/awards-list/awards-list.css','blocks/awards-list/awards-list.js',
    'blocks/cards-leadership/cards-leadership.js','blocks/cards-leadership/cards-leadership.css',
    'blocks/columns/columns.css','blocks/columns/columns.js',
    'blocks/breadcrumb/breadcrumb.js','blocks/breadcrumb/breadcrumb.css',
    'blocks/columns-stats/metadata.json','blocks/columns-stats/columns-stats.js','blocks/columns-stats/columns-stats.css',
    'blocks/hero/hero.css',
    'blocks/columns-media/columns-media.css','blocks/columns-media/columns-media.js',
    'blocks/timeline/timeline.js','blocks/timeline/timeline.css',
    'blocks/header/header.js','blocks/header/header.css',
    'blocks/columns-feature/metadata.json','blocks/columns-feature/columns-feature.js','blocks/columns-feature/columns-feature.css',
    'blocks/data-table/data-table.js','blocks/data-table/data-table.css',
    'favicon.ico',
    'tools/importer/parsers/contact-card.js','tools/importer/parsers/cards-stories.js','tools/importer/parsers/navigation-tabs.js',
    'tools/importer/parsers/embed.js','tools/importer/parsers/columns-stats.js','tools/importer/parsers/cards-leadership.js',
    'tools/importer/parsers/timeline.js','tools/importer/parsers/columns-feature.js','tools/importer/parsers/columns-quote.js',
    'tools/importer/parsers/article-header.js','tools/importer/parsers/cards-reports.js','tools/importer/parsers/hero-featured.js',
    'tools/importer/parsers/awards-list.js','tools/importer/parsers/social-share.js','tools/importer/parsers/form.js',
    'tools/importer/parsers/fact-sheets.js','tools/importer/parsers/columns-media.js','tools/importer/parsers/cards-awards.js',
    'tools/importer/page-templates.json','tools/importer/utils/image-utils.js','tools/importer/utils/text-utils.js',
    'tools/importer/transformers/ups-cleanup.js','tools/importer/import-universal.js',
    'PROJECT.md','README.md','styles/styles.css','styles/lazy-styles.css','styles/fonts.css',
    'package-lock.json','package.json','icons/search.svg','icons/ups-logo.svg',
    'scripts/scripts.js','scripts/delayed.js','scripts/aem.js','AGENTS.md',
    'fonts/roboto-regular.woff2','fonts/upspricons-x.woff','fonts/roboto-medium.woff2','fonts/roboto-bold.woff2',
    'fonts/roboto-condensed-bold.woff2','fonts/upspricons.woff','CLAUDE.md'
  ];
  var CHEVRON_SVG = '<svg viewBox="0 0 20 20" width="10" height="10" focusable="false" aria-hidden="true"><use href="#icon-chevron-up"></use></svg>';
  var FOLDER_SVG = '<svg viewBox="0 0 20 20" focusable="false" aria-label="Folder" role="img"><use href="#icon-folder"></use></svg>';
  var FILE_SVG = '<svg viewBox="0 0 20 20" focusable="false" aria-label="File" role="img"><use href="#icon-file"></use></svg>';
  function buildTree(paths) {
    var root = {};
    paths.forEach(function(p) {
      var parts = p.split('/');
      var cur = root;
      for (var i = 0; i < parts.length; i++) {
        var name = parts[i];
        if (i === parts.length - 1) {
          if (!cur.files) cur.files = [];
          cur.files.push(name);
        } else {
          if (!cur.dirs) cur.dirs = {};
          if (!cur.dirs[name]) cur.dirs[name] = {};
          cur = cur.dirs[name];
        }
      }
    });
    return root;
  }
  function renderNode(name, node, path, level, expanded) {
    var html = '';
    if (node.dirs) {
      var keys = Object.keys(node.dirs).sort();
      keys.forEach(function(k) {
        var subPath = path ? path + '/' + k : k;
        var sub = node.dirs[k];
        var hasChildren = (sub.dirs && Object.keys(sub.dirs).length) || (sub.files && sub.files.length);
        var isExpanded = expanded && (k === 'blocks' || k === 'article-header');
        var collapsedClass = isExpanded ? '' : ' collapsed';
        html += '<div class="code-tree-folder' + collapsedClass + '" data-key="' + subPath + '">';
        html += '<div class="code-tree-item folder' + collapsedClass + '" data-level="' + level + '" role="treeitem" aria-expanded="' + isExpanded + '" aria-label="' + k + '">';
        html += '<span class="code-tree-chevron" aria-hidden="true">' + CHEVRON_SVG + '</span>' + FOLDER_SVG + '<span class="code-tree-name">' + k + '</span></div>';
        html += '<div class="code-tree-children">' + renderNode('', sub, subPath, level + 1, isExpanded) + '</div></div>';
      });
    }
    if (node.files) {
      node.files.sort().forEach(function(f) {
        var filePath = path ? path + '/' + f : f;
        var selected = filePath === 'blocks/article-header/article-header.css' ? ' selected' : '';
        html += '<div class="code-tree-item file' + selected + '" data-level="' + level + '" role="treeitem" aria-label="' + f + '" data-path="' + filePath + '">';
        html += '<span class="code-tree-chevron" aria-hidden="true">' + CHEVRON_SVG + '</span>' + FILE_SVG + '<span class="code-tree-name">' + f + '</span></div>';
      });
    }
    return html;
  }
  var codeTreeList = document.getElementById('code-tree-list');
  var codeEditorContent = document.getElementById('code-editor-content');
  if (!codeTreeList || !codeEditorContent) return;
  var tree = buildTree(CODE_TREE_PATHS);
  codeTreeList.innerHTML = renderNode('', tree, '', 1, true);
  function getMockContent(path, name) {
    var ext = (name.match(/\.([^.]+)$/) || [])[1] || '';
    if (ext === 'css') return '/* ' + name + ' */\n.' + name.replace('.css','') + ' {\n  /* styles */\n}';
    if (ext === 'js') return '// ' + name + '\nimport { decorateBlock } from \'../../scripts/lib-franklin.js\';\n\nexport default function decorate(block) {\n  // Block logic\n}';
    if (ext === 'json') return '{\n  "metadata": {}\n}';
    if (ext === 'svg') return '<!-- ' + name + ' -->\n<svg>...</svg>';
    if (ext === 'md') return '# ' + name + '\n\nDocumentation content.';
    if (ext === 'woff2' || ext === 'woff') return '/* Binary font file */';
    return '// ' + name + '\n// Source code';
  }
  function selectFile(item) {
    codeTreeList.querySelectorAll('.code-tree-item.file').forEach(function(i) { i.classList.remove('selected'); });
    item.classList.add('selected');
    var path = item.getAttribute('data-path');
    var name = item.querySelector('.code-tree-name').textContent;
    codeEditorContent.textContent = getMockContent(path, name);
    var pt = document.querySelector('.page-title');
    var exmod = document.getElementById('exmod-preview');
    if (pt && exmod && exmod.classList.contains('content-mode-code')) pt.textContent = name;
    var contentToolbar = document.querySelector('.content-toolbar');
    if (contentToolbar && exmod && exmod.classList.contains('content-mode-code')) contentToolbar.classList.add('code-file-selected');
  }
  codeTreeList.addEventListener('click', function(e) {
    var folder = e.target.closest('.code-tree-item.folder');
    var file = e.target.closest('.code-tree-item.file');
    if (folder) {
      e.stopPropagation();
      var folderEl = folder.closest('.code-tree-folder');
      if (folderEl) {
        folderEl.classList.toggle('collapsed');
        folder.classList.toggle('collapsed');
        folder.setAttribute('aria-expanded', !folderEl.classList.contains('collapsed'));
      }
    } else if (file) {
      e.stopPropagation();
      selectFile(file);
    }
  });
  var initialSelected = codeTreeList.querySelector('.code-tree-item.file.selected');
  if (initialSelected) selectFile(initialSelected);
})();
