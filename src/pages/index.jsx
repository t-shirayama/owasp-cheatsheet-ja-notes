import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';

const pilotItems = [
  {
    title: 'Cross-Site Request Forgery Prevention',
    ja: 'CSRF防止',
    href: '/cheatsheets/v1/csrf-prevention',
    category: 'Encoding and Sanitization',
  },
  {
    title: 'Bean Validation',
    ja: 'Bean Validation',
    href: '/cheatsheets/v1/bean-validation',
    category: 'Encoding and Sanitization',
  },
  {
    title: 'Cryptographic Storage',
    ja: '暗号化ストレージ',
    href: '/cheatsheets/v11/cryptographic-storage',
    category: 'Cryptographic Storage',
  },
];

export default function Home() {
  return (
    <Layout
      title="OWASP Cheat Sheet 日本語ノート"
      description="Unofficial Japanese bilingual notes for OWASP Cheat Sheet Series"
    >
      <main className="siteHome">
        <section className="homeHero">
          <div className="heroCopy">
            <span className="versionPill">v2026.05.20 pilot</span>
            <h1>OWASP Cheat Sheet 日本語ノート</h1>
            <p>
              OWASP Cheat Sheet Series の原文と日本語訳をパラグラフごとに比較できる、非公式の日本語ノートです。
            </p>
            <div className="heroActions">
              <Link className="button button--primary" to="/cheatsheets/">
                対訳を見る
              </Link>
              <Link className="button button--secondary" to="https://github.com/t-shirayama/owasp-cheatsheet-ja-notes">
                GitHub
              </Link>
            </div>
          </div>
          <div className="heroVisual" aria-hidden="true">
            <div className="heroShield">OWASP</div>
            <div className="heroLock">CS</div>
          </div>
        </section>

        <section className="homeSection">
          <div className="sectionHeading">
            <p>pilot documents</p>
            <h2>対訳表示を先行実装した Cheat Sheets</h2>
          </div>
          <div className="pilotGrid">
            {pilotItems.map((item) => (
              <Link className="pilotCard" to={item.href} key={item.href}>
                <span>{item.category}</span>
                <strong>{item.title}</strong>
                <small>{item.ja}</small>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </Layout>
  );
}
