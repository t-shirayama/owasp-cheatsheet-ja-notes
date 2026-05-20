import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';

const cheatSheets = [
  {
    title: 'Bean Validation Cheat Sheet',
    ja: 'Bean Validation チートシート',
    href: '/cheatsheets/bean-validation',
    category: 'Encoding and Sanitization',
    asvs: 'V1',
  },
  {
    title: 'Cross-Site Request Forgery Prevention Cheat Sheet',
    ja: 'CSRF防止チートシート',
    href: '/cheatsheets/csrf-prevention',
    category: 'Encoding and Sanitization',
    asvs: 'V1 / V3 / V4',
  },
  {
    title: 'Authentication Cheat Sheet',
    ja: '認証チートシート',
    href: '/cheatsheets/authentication',
    category: 'Authentication',
    asvs: 'V6',
  },
  {
    title: 'Authorization Cheat Sheet',
    ja: '認可チートシート',
    href: '/cheatsheets/authorization',
    category: 'Authorization',
    asvs: 'V8 / V16',
  },
  {
    title: 'Credential Stuffing Prevention Cheat Sheet',
    ja: 'クレデンシャルスタッフィング防止チートシート',
    href: '/cheatsheets/credential-stuffing-prevention',
    category: 'Authentication',
    asvs: 'V6',
  },
  {
    title: 'Forgot Password Cheat Sheet',
    ja: 'パスワード忘れ対応チートシート',
    href: '/cheatsheets/forgot-password',
    category: 'Authentication',
    asvs: 'V6',
  },
  {
    title: 'Logging Cheat Sheet',
    ja: 'ロギングチートシート',
    href: '/cheatsheets/logging',
    category: 'Security Logging and Error Handling',
    asvs: 'V10 / V16',
  },
  {
    title: 'Multifactor Authentication Cheat Sheet',
    ja: '多要素認証チートシート',
    href: '/cheatsheets/multifactor-authentication',
    category: 'Authentication',
    asvs: 'V6',
  },
  {
    title: 'OAuth 2.0 Protocol Cheat Sheet',
    ja: 'OAuth 2.0 プロトコルチートシート',
    href: '/cheatsheets/oauth2',
    category: 'OAuth and OIDC',
    asvs: 'V10',
  },
  {
    title: 'Cryptographic Storage Cheat Sheet',
    ja: '暗号化ストレージチートシート',
    href: '/cheatsheets/cryptographic-storage',
    category: 'Cryptography',
    asvs: 'V11 / V13 / V14',
  },
  {
    title: 'Password Storage Cheat Sheet',
    ja: 'パスワード保存チートシート',
    href: '/cheatsheets/password-storage',
    category: 'Cryptography',
    asvs: 'V6 / V11',
  },
  {
    title: 'REST Security Cheat Sheet',
    ja: 'REST セキュリティチートシート',
    href: '/cheatsheets/rest-security',
    category: 'API and Web Service',
    asvs: 'V4 / V9',
  },
  {
    title: 'Session Management Cheat Sheet',
    ja: 'セッション管理チートシート',
    href: '/cheatsheets/session-management',
    category: 'Session Management',
    asvs: 'V7 / V16',
  },
];

const featureItems = [
  {
    title: '原文と翻訳を比較',
    body: '英語原文と日本語訳を同じ流れで読み、解釈のずれを確認できます。',
  },
  {
    title: '要点を先に把握',
    body: '長い Cheat Sheet でも、実装上の要点を短く確認してから本文に入れます。',
  },
  {
    title: 'チェックリストで確認',
    body: '開発・レビュー時に使える確認項目へ落とし込んで、実務の抜け漏れを減らします。',
  },
];

export default function Home() {
  return (
    <Layout
      title="OWASP ASVS Cheat Sheet 日本語ノート"
      description="Unofficial Japanese ASVS-focused bilingual notes for OWASP Cheat Sheet Series"
    >
      <main className="siteHome">
        <section className="homeHero">
          <div className="heroCopy">
            <span className="versionPill">ASVS Index focused</span>
            <h1>
              ASVS Index 対応
              <span>OWASP Cheat Sheet 日本語ノート</span>
            </h1>
            <p>
              OWASP Cheat Sheet Series の ASVS Index に対応する原文と日本語訳を、パラグラフ単位で比較しながら読める非公式の日本語ノートです。要点整理とチェックリストで、理解と実務確認を支援します。
            </p>
            <div className="heroActions">
              <Link className="button button--primary" to="/cheatsheets/">
                対訳を見る
              </Link>
              <Link className="button button--secondary" to="/cheatsheets/asvs/v1">
                ASVS 対応一覧を見る
              </Link>
              <Link className="button button--secondary button--outline" to="https://github.com/t-shirayama/owasp-cheatsheet-ja-notes">
                GitHub で見る
              </Link>
            </div>
          </div>
          <div className="heroBilingualVisual" aria-hidden="true">
            <div className="visualHeader">
              <span>ASVS V6</span>
              <strong>Authentication Cheat Sheet</strong>
            </div>
            <div className="comparisonStack">
              <div className="comparisonBlock english">
                <span>English original</span>
                <p>Verify authentication events, token handling, and recovery flows.</p>
              </div>
              <div className="comparisonBlock japanese">
                <span>日本語訳</span>
                <p>認証イベント、トークン処理、復旧フローを確認します。</p>
              </div>
            </div>
            <div className="visualFooter">
              <span>対訳あり</span>
              <span>要点あり</span>
              <span>チェックリストあり</span>
            </div>
            <div className="visualLock">
              <span />
            </div>
          </div>
        </section>

        <section className="homeSection featureSection">
          <div className="featureGrid">
            {featureItems.map((item) => (
              <div className="featureCard" key={item.title}>
                <strong>{item.title}</strong>
                <p>{item.body}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="homeSection">
          <div className="sectionHeading">
            <p>ASVS mapped documents</p>
            <h2>ASVS Index 対応 Cheat Sheets</h2>
          </div>
          <div className="pilotGrid">
            {cheatSheets.map((item) => (
              <Link className="pilotCard" to={item.href} key={item.href}>
                <div className="cardTopline">
                  <span>{item.category}</span>
                  <small>{item.asvs}</small>
                </div>
                <strong>{item.title}</strong>
                <p>{item.ja}</p>
                <div className="cardBadges">
                  <span>対訳あり</span>
                  <span>要点あり</span>
                  <span>チェックリストあり</span>
                </div>
                <em>開く</em>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </Layout>
  );
}
