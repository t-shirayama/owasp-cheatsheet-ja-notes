import React from 'react';
import {useDoc} from '@docusaurus/plugin-content-docs/client';
import DocItemPaginator from '@theme/DocItem/Paginator';
import DocVersionBanner from '@theme/DocVersionBanner';
import DocVersionBadge from '@theme/DocVersionBadge';
import DocItemContent from '@theme/DocItem/Content';
import DocBreadcrumbs from '@theme/DocBreadcrumbs';
import ContentVisibility from '@theme/ContentVisibility';
import styles from './styles.module.css';

function SiteInfoBlock() {
  return (
    <div className={styles.siteInfoBlock}>
      <div className={styles.siteInfoColumns}>
        <div>
          <h2>Repository</h2>
          <a href="https://github.com/t-shirayama/owasp-cheatsheet-ja-notes">GitHub</a>
          <a href="https://github.com/t-shirayama/owasp-cheatsheet-ja-notes/blob/main/references/source-map.md">Source map</a>
          <a href="https://github.com/t-shirayama/owasp-cheatsheet-ja-notes/blob/main/references/bilingual-map.md">Bilingual map</a>
        </div>
        <div>
          <h2>Official Sources</h2>
          <a href="https://cheatsheetseries.owasp.org/">OWASP Cheat Sheet Series</a>
          <a href="https://owasp.org/www-project-application-security-verification-standard/">OWASP ASVS</a>
          <a href="https://creativecommons.org/licenses/by-sa/4.0/">CC BY-SA 4.0</a>
        </div>
      </div>
      <p>
        This is an unofficial Japanese notes site. OWASP content is attributed
        on each page and reused under CC BY-SA 4.0 where applicable.
      </p>
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
