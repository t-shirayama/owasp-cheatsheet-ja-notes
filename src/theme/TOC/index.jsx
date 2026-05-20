import React, {useEffect, useMemo, useState} from 'react';
import clsx from 'clsx';
import TOCItems from '@theme/TOCItems';

const LINK_CLASS_NAME = 'table-of-contents__link toc-highlight';
const LINK_ACTIVE_CLASS_NAME = 'table-of-contents__link--active';

function getActivePanelHeadingState() {
  const tabbedContent = document.querySelector('.tabbedContent');
  if (!tabbedContent) {
    return {hasTabbedContent: false, ids: null};
  }

  const checkedInput =
    tabbedContent.querySelector('.tabInput:checked') ||
    tabbedContent.querySelector('.tabInput');
  if (!checkedInput) {
    return {hasTabbedContent: true, ids: new Set()};
  }

  const panel = document.getElementById(`${checkedInput.id}-panel`);
  if (!panel) {
    return {hasTabbedContent: true, ids: new Set()};
  }

  const headingIds = new Set(
    [...panel.querySelectorAll('h2[id], h3[id], h4[id], h5[id], h6[id]')]
      .map((heading) => heading.id),
  );
  return {hasTabbedContent: true, ids: headingIds};
}

function filterToc(toc, activeState) {
  if (!activeState?.hasTabbedContent) {
    return toc;
  }

  const activeIds = activeState.ids;
  if (!activeIds || activeIds.size === 0) {
    return [];
  }

  return toc
    .map((item) => {
      const children = item.children ? filterToc(item.children, activeState) : [];
      if (activeIds.has(item.id) || children.length > 0) {
        return {...item, children};
      }
      return null;
    })
    .filter(Boolean);
}

export default function TOC({className, toc, ...props}) {
  const [activeState, setActiveState] = useState(null);

  useEffect(() => {
    const updateActiveIds = () => {
      const nextState = getActivePanelHeadingState();
      setActiveState((previousState) => {
        const isWaitingForRenderedHeadings =
          nextState.hasTabbedContent &&
          nextState.ids.size === 0 &&
          previousState?.hasTabbedContent &&
          previousState.ids?.size > 0;

        return isWaitingForRenderedHeadings ? previousState : nextState;
      });
    };

    updateActiveIds();
    const timers = [0, 50, 250].map((delay) =>
      window.setTimeout(updateActiveIds, delay),
    );
    const frame = window.requestAnimationFrame(updateActiveIds);
    document.addEventListener('change', updateActiveIds);
    document.addEventListener('click', updateActiveIds);
    return () => {
      timers.forEach((timer) => window.clearTimeout(timer));
      window.cancelAnimationFrame(frame);
      document.removeEventListener('change', updateActiveIds);
      document.removeEventListener('click', updateActiveIds);
    };
  }, [toc]);

  const visibleToc = useMemo(() => {
    return filterToc(toc, activeState);
  }, [toc, activeState]);

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
