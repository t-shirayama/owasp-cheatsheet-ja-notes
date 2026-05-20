import React, {useEffect, useMemo, useState} from 'react';
import clsx from 'clsx';
import TOCItems from '@theme/TOCItems';

const LINK_CLASS_NAME = 'table-of-contents__link toc-highlight';
const LINK_ACTIVE_CLASS_NAME = 'table-of-contents__link--active';

function getActivePanelHeadingIds() {
  const checkedInput = document.querySelector('.tabbedContent .tabInput:checked');
  if (!checkedInput) {
    return null;
  }

  const panel = document.getElementById(`${checkedInput.id}-panel`);
  if (!panel) {
    return new Set();
  }

  return new Set(
    [...panel.querySelectorAll('h2[id], h3[id], h4[id], h5[id], h6[id]')]
      .map((heading) => heading.id),
  );
}

function filterToc(toc, activeIds) {
  if (activeIds === null) {
    return toc;
  }

  return toc
    .map((item) => {
      const children = item.children ? filterToc(item.children, activeIds) : [];
      if (activeIds.has(item.id) || children.length > 0) {
        return {...item, children};
      }
      return null;
    })
    .filter(Boolean);
}

export default function TOC({className, toc, ...props}) {
  const [activeIds, setActiveIds] = useState(null);

  useEffect(() => {
    const updateActiveIds = () => {
      setActiveIds(getActivePanelHeadingIds());
    };

    updateActiveIds();
    document.addEventListener('change', updateActiveIds);
    return () => document.removeEventListener('change', updateActiveIds);
  }, [toc]);

  const visibleToc = useMemo(() => filterToc(toc, activeIds), [toc, activeIds]);

  return (
    <div className={clsx('thin-scrollbar', className)}>
      <TOCItems
        {...props}
        toc={visibleToc}
        linkClassName={LINK_CLASS_NAME}
        linkActiveClassName={LINK_ACTIVE_CLASS_NAME}
      />
    </div>
  );
}
