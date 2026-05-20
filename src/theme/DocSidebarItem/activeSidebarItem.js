import {useEffect, useState} from 'react';
import {isSamePath} from '@docusaurus/theme-common/internal';

const STORAGE_KEY = 'owaspCheatsheetActiveSidebarItem';
const CHANGE_EVENT = 'owaspCheatsheetActiveSidebarItemChange';

function isDuplicateSidebarDoc(item) {
  return item.customProps?.sidebarDuplicate === true;
}

function getSidebarOccurrence(item) {
  return item.customProps?.sidebarOccurrence;
}

function isActivePath(href, activePath) {
  return typeof href !== 'undefined' && isSamePath(href, activePath);
}

function getSelectionForItem(item) {
  const occurrence = getSidebarOccurrence(item);
  if (!occurrence || !item.href) {
    return undefined;
  }

  return {
    href: item.href,
    occurrence,
  };
}

function hasActiveSelectionForPath(activeSelection, activePath) {
  return (
    activeSelection?.href &&
    activeSelection?.occurrence &&
    isSamePath(activeSelection.href, activePath)
  );
}

export function readActiveSidebarSelection() {
  if (typeof window === 'undefined') {
    return undefined;
  }

  try {
    const rawSelection = window.sessionStorage.getItem(STORAGE_KEY);
    return rawSelection ? JSON.parse(rawSelection) : undefined;
  } catch {
    return undefined;
  }
}

export function rememberActiveSidebarItem(item) {
  const selection = getSelectionForItem(item);
  if (!selection || typeof window === 'undefined') {
    return;
  }

  try {
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(selection));
    window.dispatchEvent(new CustomEvent(CHANGE_EVENT));
  } catch {
    // Ignore storage failures; the sidebar still falls back to URL matching.
  }
}

export function useActiveSidebarSelection() {
  const [selection, setSelection] = useState(readActiveSidebarSelection);

  useEffect(() => {
    const syncSelection = () => {
      setSelection(readActiveSidebarSelection());
    };

    window.addEventListener(CHANGE_EVENT, syncSelection);
    window.addEventListener('storage', syncSelection);

    return () => {
      window.removeEventListener(CHANGE_EVENT, syncSelection);
      window.removeEventListener('storage', syncSelection);
    };
  }, []);

  return selection;
}

export function isScopedActiveSidebarItem(
  item,
  activePath,
  activeSelection,
) {
  if (item.type === 'link') {
    if (!isActivePath(item.href, activePath)) {
      return false;
    }

    if (hasActiveSelectionForPath(activeSelection, activePath)) {
      return getSidebarOccurrence(item) === activeSelection.occurrence;
    }

    return !isDuplicateSidebarDoc(item);
  }

  if (item.type === 'category') {
    return (
      isActivePath(item.href, activePath) ||
      item.items.some((subItem) =>
        isScopedActiveSidebarItem(subItem, activePath, activeSelection),
      )
    );
  }

  return false;
}
