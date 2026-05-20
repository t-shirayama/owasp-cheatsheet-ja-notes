import React from 'react';
import clsx from 'clsx';
import {useWindowSize} from '@docusaurus/theme-common';
import {useDoc} from '@docusaurus/plugin-content-docs/client';
import DocItemPaginator from '@theme/DocItem/Paginator';
import DocVersionBanner from '@theme/DocVersionBanner';
import DocVersionBadge from '@theme/DocVersionBadge';
import DocItemTOCMobile from '@theme/DocItem/TOC/Mobile';
import DocItemTOCDesktop from '@theme/DocItem/TOC/Desktop';
import DocItemContent from '@theme/DocItem/Content';
import DocBreadcrumbs from '@theme/DocBreadcrumbs';
import ContentVisibility from '@theme/ContentVisibility';
import {FOOTER_LINK_GROUPS, OFFICIAL_NOTICE} from '@site/src/data/site';
import styles from './styles.module.css';

function SiteInfoBlock() {
  return (
    <div className={styles.siteInfoBlock}>
      <div className={styles.siteInfoColumns}>
        {FOOTER_LINK_GROUPS.map((group) => (
          <div key={group.title}>
            <h2>{group.title}</h2>
            {group.links.map((link) => (
              <a href={link.href} key={link.href}>
                {link.label}
              </a>
            ))}
          </div>
        ))}
      </div>
      <p>{OFFICIAL_NOTICE}</p>
    </div>
  );
}

function useDocTOC() {
  const {frontMatter, toc} = useDoc();
  const windowSize = useWindowSize();
  const hidden = frontMatter.hide_table_of_contents;
  const canRender = !hidden && toc.length > 0;

  return {
    hidden,
    mobile: canRender ? <DocItemTOCMobile /> : undefined,
    desktop:
      canRender && (windowSize === 'desktop' || windowSize === 'ssr') ? (
        <DocItemTOCDesktop />
      ) : undefined,
  };
}

export default function DocItemLayout({children}) {
  const {metadata} = useDoc();
  const docTOC = useDocTOC();

  return (
    <div className={clsx('row', styles.docLayoutRow)}>
      <div className={clsx('col', !docTOC.hidden && styles.docItemCol)}>
        <ContentVisibility metadata={metadata} />
        <DocVersionBanner />
        <div className={styles.docItemContainer}>
          <article>
            <DocBreadcrumbs />
            <DocVersionBadge />
            {docTOC.mobile}
            <DocItemContent>{children}</DocItemContent>
          </article>
          <DocItemPaginator />
          <SiteInfoBlock />
        </div>
      </div>
      {docTOC.desktop && <div className={clsx('col', styles.docTocCol)}>{docTOC.desktop}</div>}
    </div>
  );
}
