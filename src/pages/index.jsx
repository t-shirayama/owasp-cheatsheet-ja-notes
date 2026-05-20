import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import {
  HOME_CHEAT_SHEETS,
  HOME_FEATURES,
  REPOSITORY_URL,
  SITE_DESCRIPTION,
  SITE_TITLE,
} from '@site/src/data/site';

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
              ASVS Index 対応
              <span>{SITE_TITLE}</span>
            </h1>
            <p>
              OWASP Cheat Sheet Series の ASVS Index に対応する原文と日本語訳を、パラグラフ単位で比較しながら読める非公式の日本語訳サイトです。
            </p>
            <div className="heroActions">
              <Link className="button button--primary" to="/cheatsheets/">
                対訳を見る
              </Link>
              <Link className="button button--secondary" to="/cheatsheets/asvs/v1">
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

        <section className="homeSection featureSection">
          <div className="featureGrid">
            {HOME_FEATURES.map((item) => (
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
            {HOME_CHEAT_SHEETS.map((item) => (
              <Link className="pilotCard" to={item.href} key={item.href}>
                <div className="cardTopline">
                  <span>{item.category}</span>
                  <small>{item.asvs}</small>
                </div>
                <strong>{item.title}</strong>
                <p>{item.ja}</p>
                <div className="cardBadges">
                  <span>原文</span>
                  <span>翻訳</span>
                  <span>対比表示</span>
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
