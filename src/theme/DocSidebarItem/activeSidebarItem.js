import {isSamePath} from '@docusaurus/theme-common/internal';

function isDuplicateSidebarDoc(item) {
  return item.customProps?.sidebarDuplicate === true;
}

function isActivePath(href, activePath) {
  return typeof href !== 'undefined' && isSamePath(href, activePath);
}

export function isScopedActiveSidebarItem(item, activePath) {
  if (item.type === 'link') {
    return !isDuplicateSidebarDoc(item) && isActivePath(item.href, activePath);
  }

  if (item.type === 'category') {
    return (
      isActivePath(item.href, activePath) ||
      item.items.some((subItem) =>
        isScopedActiveSidebarItem(subItem, activePath),
      )
    );
  }

  return false;
}
