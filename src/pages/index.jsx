import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import {
  HOME_ASVS_CATEGORIES,
  HOME_CHEAT_SHEETS,
  REPOSITORY_URL,
  SITE_DESCRIPTION,
  SITE_TITLE,
} from '@site/src/data/site';

const recommendedSheets = [
  {
    icon: 'lock',
    title: 'Authentication',
    body: '認証イベント、トークン処理、復旧フローのベストプラクティスを確認します。',
    href: '/cheatsheets/authentication',
    asvs: 'ASVS V6',
  },
  {
    icon: 'shield',
    title: 'Access Control',
    body: '認可の設計、実装、検証のポイントを確認します。',
    href: '/cheatsheets/authorization',
    asvs: 'ASVS V8',
  },
  {
    icon: 'key',
    title: 'Session Management',
    body: 'セッション ID の管理や有効期限などの推奨事項を確認します。',
    href: '/cheatsheets/session-management',
    asvs: 'ASVS V7',
  },
  {
    icon: 'input',
    title: 'Input Validation',
    body: '入力の検証とサニタイズの実践ガイドを確認します。',
    href: '/cheatsheets/input-validation',
    asvs: 'ASVS V1',
  },
];

export default function Home() {
  return (
    <Layout
      title={SITE_TITLE}
      description={SITE_DESCRIPTION}
    >
      <main className="siteHome">
        <section className="homeHero">
          <div className="heroCopy">
            <span className="versionPill">ASVS Index focused</span>
            <h1>
              {SITE_TITLE}
            </h1>
            <p>
              OWASP Cheat Sheet Series の ASVS Index に対応する原文と日本語訳を、パラグラフ単位で比較しながら読める非公式の日本語版です。
            </p>
            <div className="heroActions">
              <Link className="button button--primary" to="/cheatsheets/">
                ASVS 対応一覧を見る
              </Link>
              <Link className="button button--secondary button--outline" to={REPOSITORY_URL}>
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
              <span>原文</span>
              <span>翻訳</span>
              <span>対比表示</span>
            </div>
            <div className="visualLock">
              <span />
            </div>
          </div>
        </section>

        <section className="homeExplorer" aria-label="Cheat Sheet navigation">
          <div className="homeContent">
            <section className="homeSection" id="recommended">
              <div className="sectionHeading">
                <div>
                  <h2>おすすめの Cheat Sheet</h2>
                  <p>まずはよく参照される Cheat Sheet からご覧ください。</p>
                </div>
                <Link to="/cheatsheets/">すべての Cheat Sheetを見る</Link>
              </div>
              <div className="recommendGrid">
                {recommendedSheets.map((item) => (
                  <Link className="recommendCard" to={item.href} key={item.title}>
                    <span className={`homeIcon homeIcon--${item.icon}`} aria-hidden="true" />
                    <strong>{item.title}</strong>
                    <p>{item.body}</p>
                    <div>
                      <span>{item.asvs}</span>
                      <em>→</em>
                    </div>
                  </Link>
                ))}
              </div>
            </section>

            <section className="homeSection" id="asvs-categories">
              <div className="sectionHeading">
                <div>
                  <h2>ASVS対応カテゴリ</h2>
                  <p>ASVS Index のカテゴリ別に関連する Cheat Sheet を探せます。</p>
                </div>
              </div>
              <div className="asvsCategoryGrid">
                {HOME_ASVS_CATEGORIES.map((item) => (
                  <Link className="asvsCategoryCard" to={item.href} key={item.title}>
                    <strong>{item.title}</strong>
                    <p>{item.body}</p>
                    <em>›</em>
                  </Link>
                ))}
              </div>
            </section>

            <section className="homeSection homeSectionCompact">
              <div className="sectionHeading">
                <div>
                  <h2>ASVS Index 対応チートシート</h2>
                  <p>更新済みの対訳ページから直接開けます。</p>
                </div>
              </div>
              <div className="pilotGrid">
                {HOME_CHEAT_SHEETS.slice(0, 6).map((item) => (
                  <Link className="pilotCard" to={item.href} key={item.href}>
                    <div className="cardTopline">
                      <span>{item.category}</span>
                      <small>{item.asvs}</small>
                    </div>
                    <strong>{item.title}</strong>
                    <p>{item.ja}</p>
                  </Link>
                ))}
              </div>
            </section>
          </div>
        </section>
      </main>
    </Layout>
  );
}
