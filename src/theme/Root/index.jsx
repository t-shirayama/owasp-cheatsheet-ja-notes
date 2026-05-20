import React, {useEffect} from 'react';

const SEARCH_PLACEHOLDER = 'XSS、JWT、CSRF などで検索';

function updateSearchInputs() {
  document.querySelectorAll('.navbar__search-input').forEach((input) => {
    input.setAttribute('placeholder', SEARCH_PLACEHOLDER);
    input.setAttribute('aria-label', SEARCH_PLACEHOLDER);
    input.setAttribute('title', SEARCH_PLACEHOLDER);
  });
}

function getTabInput(label) {
  const tabId = label.getAttribute('for');
  return tabId ? document.getElementById(tabId) : null;
}

function activateTab(label) {
  const input = getTabInput(label);
  if (input && !input.checked) {
    input.checked = true;
    input.dispatchEvent(new Event('change', {bubbles: true}));
  }
  label.focus();
}

function updateContentTabs() {
  document.querySelectorAll('.contentTabs').forEach((tablist) => {
    tablist.setAttribute('role', 'tablist');
    tablist.setAttribute('aria-label', '表示モード');

    const labels = Array.from(tablist.querySelectorAll('label[for]'));

    const selectedIndex = labels.findIndex((label) => getTabInput(label)?.checked);

    labels.forEach((label, index) => {
      const input = getTabInput(label);
      if (!input) {
        return;
      }

      const panelId = input.id.replace(
        /-(original|translation|bilingual)$/,
        '-$1-panel',
      );
      const labelId = `${input.id}-tab`;
      const selected = input.checked;
      const panel = document.getElementById(panelId);

      label.id = labelId;
      label.setAttribute('role', 'tab');
      label.setAttribute('aria-controls', panelId);
      label.setAttribute('aria-selected', selected ? 'true' : 'false');
      label.setAttribute(
        'tabindex',
        selected || (selectedIndex === -1 && index === 0) ? '0' : '-1',
      );

      if (panel) {
        panel.setAttribute('role', 'tabpanel');
        panel.setAttribute('aria-labelledby', labelId);
        panel.toggleAttribute('hidden', !selected);
      }
    });
  });
}

function handleTabKeyDown(event) {
  const label = event.target.closest?.('.contentTabs label[role="tab"]');
  if (!label) {
    return;
  }

  const labels = Array.from(label.parentElement.querySelectorAll('label[role="tab"]'));
  const currentIndex = labels.indexOf(label);
  const lastIndex = labels.length - 1;
  let nextIndex = currentIndex;

  if (event.key === 'ArrowRight') {
    nextIndex = currentIndex === lastIndex ? 0 : currentIndex + 1;
  } else if (event.key === 'ArrowLeft') {
    nextIndex = currentIndex === 0 ? lastIndex : currentIndex - 1;
  } else if (event.key === 'Home') {
    nextIndex = 0;
  } else if (event.key === 'End') {
    nextIndex = lastIndex;
  } else if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    activateTab(label);
    return;
  } else {
    return;
  }

  event.preventDefault();
  activateTab(labels[nextIndex]);
}

function enhanceDocumentUi() {
  updateSearchInputs();
  updateContentTabs();
}

export default function Root({children}) {
  useEffect(() => {
    enhanceDocumentUi();

    document.addEventListener('change', updateContentTabs);
    document.addEventListener('keydown', handleTabKeyDown);

    const observer = new MutationObserver(enhanceDocumentUi);
    observer.observe(document.body, {childList: true, subtree: true});

    return () => {
      observer.disconnect();
      document.removeEventListener('change', updateContentTabs);
      document.removeEventListener('keydown', handleTabKeyDown);
    };
  }, []);

  return <>{children}</>;
}
