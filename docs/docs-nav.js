/**
 * PasteSuiteAI Documentation — Sidebar Navigation (SSoT)
 *
 * This file is the single source of truth for the docs navigation structure.
 * It dynamically injects the sidebar into every doc page and handles
 * current-page highlighting + mobile toggle.
 */
(function () {
  var sections = [
    {
      title: 'Get Started',
      items: [
        { label: 'Welcome', href: 'index.html' },
        { label: 'Getting Started', href: 'getting-started.html' }
      ]
    },
    {
      title: 'Core Features',
      items: [
        { label: 'Main Window', href: 'main-window.html' },
        { label: 'PromptBar & Quick Prompts', href: 'promptbar.html' },
        { label: 'Actions', href: 'actions.html' },
        { label: 'Prompt Library', href: 'prompt-library.html' },
        { label: 'Speech to Text', href: 'speech-to-text.html' },
        { label: 'Result Pop-Up Window', href: 'result-overlay.html' }
      ]
    },
    {
      title: 'Configuration',
      items: [
        { label: 'Connections', href: 'connections.html' },
        { label: 'Settings', href: 'settings.html' },
        { label: 'Clipboard History', href: 'history.html' }
      ]
    },
    {
      title: 'Guides',
      items: [
        { label: 'Local AI Models', href: 'local-ai.html' }
      ]
    },
    {
      title: 'Reference',
      items: [
        { label: 'Keyboard Shortcuts', href: 'keyboard-shortcuts.html' },
        { label: 'Mouse Configuration', href: 'mouse-configuration.html' },
        { label: 'Licensing & Trial', href: 'licensing.html' }
      ]
    }
  ];

  /* Detect current page */
  var path = window.location.pathname;
  var currentPage = path.substring(path.lastIndexOf('/') + 1) || 'index.html';

  /* Build sidebar HTML */
  var sidebar = document.getElementById('docs-sidebar');
  if (!sidebar) return;

  var html = '';
  sections.forEach(function (section) {
    html += '<div class="sidebar-section">';
    html += '<div class="sidebar-section-title">' + section.title + '</div>';
    html += '<ul class="sidebar-links">';
    section.items.forEach(function (item) {
      var active = currentPage === item.href ? ' active' : '';
      html += '<li><a href="' + item.href + '" class="sidebar-link' + active + '">' + item.label + '</a></li>';
    });
    html += '</ul></div>';
  });

  sidebar.innerHTML = html;

  /* Mobile toggle */
  var toggle = document.getElementById('sidebar-toggle');
  var backdrop = document.getElementById('sidebar-backdrop');

  function closeSidebar() {
    sidebar.classList.remove('open');
    if (backdrop) backdrop.classList.remove('open');
  }

  if (toggle) {
    toggle.addEventListener('click', function () {
      var isOpen = sidebar.classList.toggle('open');
      if (backdrop) backdrop.classList.toggle('open', isOpen);
    });
  }

  if (backdrop) {
    backdrop.addEventListener('click', closeSidebar);
  }

  /* Close sidebar on navigation (mobile) */
  sidebar.addEventListener('click', function (e) {
    if (e.target.tagName === 'A' && window.innerWidth < 768) {
      closeSidebar();
    }
  });
})();
