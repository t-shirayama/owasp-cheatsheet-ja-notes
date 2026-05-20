import React, {useEffect} from 'react';

const SEARCH_PLACEHOLDER = 'XSS、JWT、CSRF などで検索';

function updateSearchInputs() {
  document.querySelectorAll('.navbar__search-input').forEach((input) => {
    input.setAttribute('placeholder', SEARCH_PLACEHOLDER);
    input.setAttribute('aria-label', SEARCH_PLACEHOLDER);
    input.setAttribute('title', SEARCH_PLACEHOLDER);
  });
}

export default function Root({children}) {
  useEffect(() => {
    updateSearchInputs();

    const observer = new MutationObserver(updateSearchInputs);
    observer.observe(document.body, {childList: true, subtree: true});

    return () => observer.disconnect();
  }, []);

  return <>{children}</>;
}
