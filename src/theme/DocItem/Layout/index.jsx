import React from 'react';
import {useDoc} from '@docusaurus/plugin-content-docs/client';
import DocItemPaginator from '@theme/DocItem/Paginator';
import DocVersionBanner from '@theme/DocVersionBanner';
import DocVersionBadge from '@theme/DocVersionBadge';
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

export default function DocItemLayout({children}) {
  const {metadata} = useDoc();

  return (
    <div className="row">
      <div className="col">
        <ContentVisibility metadata={metadata} />
        <DocVersionBanner />
        <div className={styles.docItemContainer}>
          <article>
            <DocBreadcrumbs />
            <DocVersionBadge />
            <DocItemContent>{children}</DocItemContent>
          </article>
          <DocItemPaginator />
          <SiteInfoBlock />
        </div>
      </div>
    </div>
  );
}
