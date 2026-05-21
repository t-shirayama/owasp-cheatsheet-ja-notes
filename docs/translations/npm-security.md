# NPMセキュリティチートシート 日本語訳

## Attribution

- Original: NPM Security Cheat Sheet
- Source: https://cheatsheetseries.owasp.org/cheatsheets/NPM_Security_Cheat_Sheet.html
- Copyright: Cheat Sheets Series Team
- License: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
- License URL: https://creativecommons.org/licenses/by-sa/4.0/
- Changes: Japanese translation added.
- Retrieved: 2026-05-21

## 日本語訳

# NPM セキュリティのベストプラクティス

以下のチートシートでは、JavaScript および Node.js 開発者に役立つ npm セキュリティのベストプラクティスと生産性向上のヒントをいくつか扱います。この一覧は、もともと Snyk ブログの [10 npm security best practices](https://snyk.io/blog/ten-npm-security-best-practices) を基にしていました。

## 1) npm レジストリにシークレットを公開しない

API キー、パスワード、その他のシークレットを使用している場合、それらはソース管理や、公開 npm レジストリに公開されたパッケージに非常に簡単に漏えいする可能性があります。作業ディレクトリには `.env` などの専用ファイルにシークレットがあるかもしれません。これは SCM にコミットしないよう `.gitignore` に追加すべきです。しかし、プロジェクトのディレクトリから npm パッケージを公開するときはどうなるでしょうか。

npm CLI は、レジストリへプッシュするためにプロジェクトを tar アーカイブ (tarball) にまとめます。tarball に追加されるファイルとディレクトリは、次の条件で決まります。

- `.gitignore` または `.npmignore` ファイルのいずれかがある場合、そのファイルの内容が、公開用パッケージを準備するときの ignore パターンとして使用されます。
- 両方の ignore ファイルが存在する場合、`.npmignore` に含まれていないものはすべてレジストリに公開されます。この条件はよく混乱を招き、シークレット漏えいにつながる問題になります。

開発者は `.gitignore` を更新しても `.npmignore` の更新を忘れることがあります。その結果、機密性がある可能性のあるファイルはソース管理にはプッシュされない一方で、npm パッケージには含まれてしまうことがあります。

取り入れるべきもう一つの良いプラクティスは、`package.json` の `files` プロパティを使うことです。これは allowlist として機能し、作成およびインストールされるパッケージに含めるファイル配列を指定します。一方、ignore ファイルは denylist として機能します。`files` プロパティと ignore ファイルは併用でき、パッケージに明示的に含めるファイルと除外するファイルの両方を決定できます。両方を使用する場合、`package.json` の `files` プロパティが ignore ファイルより優先されます。

パッケージが公開されるとき、npm CLI は作成されるアーカイブを詳細に表示します。さらに慎重にするには、公開コマンドに `--dry-run` コマンドライン引数を追加し、実際にレジストリへ公開する前に tarball がどのように作成されるかを確認してください。

アクセストークンの取り消しの詳細は、公式ドキュメント [Revoking access tokens](https://docs.npmjs.com/revoking-access-tokens) を参照してください。

## 2) ロックファイルを強制する

私たちはパッケージロックファイルの登場を歓迎しました。ロックファイルにより、異なる環境間での決定論的なインストールと、チーム共同作業における依存関係の期待値の強制が導入されました。順調に見えます。しかし、もし私がプロジェクトの `package.json` ファイルに変更を入れたのに、そのロックファイルを一緒にコミットし忘れていたら何が起きるでしょうか。

Yarn と npm は、依存関係のインストール時に同じように動作します。プロジェクトの `package.json` とロックファイルの不整合を検出すると、`package.json` マニフェストに基づいてその変更を補正し、ロックファイルに記録されていたものとは異なるバージョンをインストールします。

このような状況は、ビルド環境や本番環境にとって危険です。意図しないパッケージバージョンを取り込み、ロックファイルの利点全体を無意味にしてしまう可能性があります。

幸い、Yarn と npm のどちらにも、ロックファイルを参照して指定された依存関係とそのバージョンの集合に従わせる方法があります。不整合があればインストールは中止されます。コマンドラインは次のとおりです。

- Yarn を使用している場合は、`yarn install --frozen-lockfile` を実行します。
- npm を使用している場合は、`npm ci` を実行します。

## 3) run-scripts を無視して攻撃面を最小化する

npm CLI はパッケージの run-scripts と連携します。`npm start` や `npm test` を実行したことがあるなら、パッケージ run-scripts も使用したことがあります。npm CLI は、パッケージが宣言できるスクリプトを基盤としており、プロジェクトへのインストール中の特定のエントリポイントで実行されるスクリプトをパッケージが定義できるようにしています。たとえば、これらの [script hook](https://docs.npmjs.com/misc/scripts) エントリには、インストールされるパッケージが後片付け作業を行うために実行する `postinstall` スクリプトなどがあります。

この機能により、悪意のある者はパッケージを作成または改変し、そのパッケージがインストールされるときに任意のコマンドを実行して悪意ある行為を行えます。すでに発生した事例としては、npm トークンを収集した有名な [eslint-scope incident](https://snyk.io/vuln/npm:eslint-scope:20180712) や、npm レジストリ上で typosquatting 攻撃を悪用した [crossenv incident](https://snyk.io/vuln/npm:crossenv:20170802) とその他 36 個のパッケージがあります。

悪意あるモジュールの攻撃面を最小化するため、次の npm セキュリティベストプラクティスを適用してください。

- インストールするサードパーティモジュールについては、常に精査し、健全性と信頼性を確認するためのデューデリジェンスを実施します。
- 新しいバージョンへ即時にアップグレードするのは控え、新しいパッケージバージョンが流通する時間を少し置いてから試します。
- アップグレード前に、アップグレード対象バージョンの changelog と release notes を必ず確認します。
- パッケージをインストールするときは、サードパーティパッケージによるスクリプト実行を無効化するため、必ず `--ignore-scripts` サフィックスを追加します。
- プロジェクトの `.npmrc` ファイル、またはグローバル npm 設定に `ignore-scripts=true` を追加することを検討します。

### lifecycle scripts の allowlist を使用する

`.npmrc` ファイルに `ignore-scripts=true` を追加して lifecycle scripts をデフォルトで無効化することが最も安全な選択肢です。正当な理由で lifecycle scripts に依存するパッケージを使用している場合は、[`@lavamoat/allow-scripts`](https://github.com/LavaMoat/LavaMoat/tree/main/packages/allow-scripts) のようなプラグインを使い、lifecycle scripts の実行を許可するパッケージの _allowlist_ を作成できます。

人気の画像処理パッケージ [sharp](https://www.npmjs.com/package/sharp) を使用するプロジェクトでは、`package.json` ファイル内の allowlist は次のようになります。

```json
{
  "lavamoat": {
    "allowScripts": {
      "sharp": true
    }
  }
}
```bash

## 4) npm プロジェクトの健全性を評価する

### npm outdated コマンド

リリースノート、コード変更、そして新しいアップグレードの包括的なテストを確認せずに、依存関係を常に最新リリースへ急いでアップグレードすることは、必ずしも良いプラクティスではありません。一方で、古いままにしてまったくアップグレードしないことや、長期間経ってからアップグレードすることも問題の原因になります。

npm CLI は、使用している依存関係の鮮度について、semantic versioning から見たずれの情報を提供できます。`npm outdated` を実行すると、古くなっているパッケージを確認できます。黄色で表示される依存関係は、`package.json` マニフェストで指定された semantic versioning に対応し、赤で表示される依存関係は更新が利用可能であることを意味します。さらに、出力には各依存関係の最新バージョンも表示されます。

### npm doctor コマンド

さまざまな Node.js パッケージマネージャや、パス上にインストールされている可能性のある複数バージョンの Node.js がある中で、健全な npm インストールと作業環境をどのように確認すればよいでしょうか。開発環境で npm CLI を使っている場合でも、CI 内で使っている場合でも、すべてが期待どおりに動作していることを評価することが重要です。

doctor を呼びましょう。npm CLI には、npm のやり取りが正常に機能する環境かどうかを診断する健全性評価ツールが組み込まれています。npm のセットアップを確認するには `npm doctor` を実行します。

- 公式 npm レジストリに到達可能か確認し、現在設定されているレジストリを表示します。
- Git が利用可能か確認します。
- インストール済みの npm と Node.js のバージョンを確認します。
- ローカルおよびグローバルの `node_modules`、パッケージキャッシュに使用されるフォルダなど、各種フォルダの権限チェックを実行します。
- ローカル npm モジュールキャッシュのチェックサムが正しいか確認します。

## 5) オープンソース依存関係の脆弱性を監査する

npm エコシステムは、他のすべての言語エコシステムの中でも最大のアプリケーションライブラリリポジトリです。レジストリとその中のライブラリは JavaScript 開発者の中核にあり、他者がすでに構築した成果を活用して自分たちのコードベースに取り込めます。一方で、アプリケーションでのオープンソースライブラリ採用が増えるにつれて、セキュリティ脆弱性を持ち込むリスクも増加します。

多くの人気 npm パッケージで脆弱性が見つかっており、プロジェクトの依存関係を適切にセキュリティ監査しなければ大きなリスクを伴う可能性があります。例として npm の [request](https://snyk.io/vuln/npm:request:20160119)、[superagent](https://snyk.io/vuln/search?q=superagent&type=npm)、[mongoose](https://snyk.io/vuln/search?q=mongoose&type=npm)、さらに [jsonwebtoken](https://snyk.io/vuln/npm:jsonwebtoken:20150331) や [validator](https://snyk.io/vuln/search?q=validator&type=npm) のようなセキュリティ関連パッケージさえ挙げられます。

セキュリティは、パッケージをインストールするときにセキュリティ脆弱性をスキャンするだけでは終わりません。ソフトウェア開発ライフサイクル全体で効果的に採用されるよう、開発者ワークフローに組み込み、コードがデプロイされた後も継続的に監視する必要があります。

- [third-party open source projects](https://owasp.org/www-community/Component_Analysis) のセキュリティ脆弱性をスキャンします。
- 新しい CVE が影響するときにアラートを受け取れるよう、プロジェクトのマニフェストのスナップショットを監視します。[OWASP Dependency-Track](https://owasp.org/www-project-dependency-track/)

## 6) アーティファクトガバナンスとサプライチェーン保護

### ローカル npm プロキシを使用する

npm レジストリは、すべての JavaScript 開発者が利用できる最大のパッケージ集合であり、Web 開発者向けのほとんどのオープンソースプロジェクトの拠点でもあります。しかし、セキュリティ、デプロイ、パフォーマンスの面で別の要件がある場合があります。そのような場合、npm では別のレジストリに切り替えられます。

`npm install` を実行すると、すべての依存関係を解決するためにメインレジストリとの通信が自動的に開始されます。別のレジストリを使いたい場合も非常に簡単です。

- `npm set registry` を設定してデフォルトレジストリを設定します。
- 単一のレジストリには `--registry` 引数を使用します。

[Verdaccio](https://verdaccio.org/) は、シンプルで軽量、設定不要のプライベートレジストリであり、インストールは `$ npm install --global verdaccio` のように簡単です。

自分のレジストリをホストすることが、これほど簡単になったことはありません。このツールの最も重要な機能を確認しましょう。

- プライベートパッケージ機能、scope サポート、パッケージアクセス制御、Web インターフェイスでの認証済みユーザーなど、npm レジストリ形式をサポートします。
- リモートレジストリをフックし、依存関係を異なるレジストリへルーティングし、それらの tarball をキャッシュする機能を提供します。ローカル開発サーバーや CI サーバーでの重複ダウンロードを減らし帯域幅を節約するには、すべての依存関係をプロキシすべきです。
- 認証プロバイダとしてデフォルトで htpasswd セキュリティを使用しますが、GitLab、Bitbucket、LDAP もサポートします。独自のものを使用することもできます。
- 別のストレージプロバイダを使用して簡単にスケールできます。
- プロジェクトが Docker ベースの場合、公式イメージの使用が最善の選択です。
- テスト環境の非常に高速な bootstrap を可能にし、大規模な mono-repo プロジェクトのテストにも便利です。

### ガバナンスと検証の手順

サプライチェーン攻撃は、ビルドアーティファクト、レジストリ、CI 認証情報をますます標的にしています。軽量なガバナンスと検証の手順を追加し、リスクを低減し、対応時間を改善してください。

- 来歴を追跡し、ビルド用の SBOM (CycloneDX/SPDX) を生成して、何がビルドされ、入力がどこから来たのかを追跡できるようにします。

  CycloneDX の例:

  ```bash
  # Generate SBOM
  npm install @cyclonedx/cyclonedx-npm
  npx @cyclonedx/cyclonedx-npm --validate > sbom.json # Use the flag `--omit dev` to exclude dev dependencies from SBOM if needed
  ```

- アーティファクトとビルド来歴に署名します。たとえば Sigstore / cosign または同様の署名ツールを使用し、利用者がインストール前に完全性を検証できるようにします。

  Sigstore の例:

  ```javascript
  // sign-and-verify.js
  // npm install sigstore fs

  import * as fs from 'fs';
  import * as sigstore from 'sigstore';

  // Path to your built npm package (via `npm pack`)
  const artifact = 'my-lib-1.0.0.tgz';

  // --- Sign ---
  const payload = fs.readFileSync(artifact);
  const bundle = await sigstore.sign(payload);
  fs.writeFileSync(`${artifact}.sigstore.json`, JSON.stringify(bundle, null, 2));
  console.log('Signed:', artifact);

  // --- Verify ---
  await sigstore.verify(payload, bundle);
  console.log('Verified OK!');
  ```

- 不変でアクセス制御されたレジストリ、または精査済みミラーを優先します。例として、プライベートレジストリ、上流キャッシュ付き Verdaccio、または [approved mirrors](#ローカル-npm-プロキシを使用する) があり、利用可能な場合は保持ポリシーや不変性ポリシーを有効にします。
- CI トークンと公開者トークンを制限、scope 化、ローテーションします。公開者トークンをワークフローまたは IP 範囲に結び付け、権限を最小化します。
- CI 中にパッケージを検証します。署名または来歴を確認し、SBOM を検証し、[SCA と静的解析を実行](#5-オープンソース依存関係の脆弱性を監査する)し、[固定されたロックファイル解決からインストール](#2-ロックファイルを強制する)します。
- 異常な公開、トークン使用、依存関係変更の監視とアラートを自動化し、文書化された修復 playbook を維持します。これには、トークンの取り消し、侵害されたパッケージの非推奨化/削除、修正版の公開、利用者への通知が含まれます。

これらの対策は段階的で導入リスクが低いものです。組み合わせることで、サプライチェーン攻撃を困難にし、侵害が発生した場合の識別と復旧を迅速化します。

## 7) セキュリティ脆弱性を責任を持って開示する

セキュリティ脆弱性が見つかった場合、事前の警告や、自力で防御できない利用者のための適切な是正措置なしに公表されると、潜在的に深刻な脅威になります。

セキュリティ研究者には、責任ある開示プログラムに従うことが推奨されます。これは、脆弱な資産のベンダーまたはメンテナと研究者を結び付け、脆弱性、その影響、適用可能性を伝えることを目的としたプロセスとガイドラインの集合です。脆弱性が正しくトリアージされると、ベンダーと研究者は修正と公開日を調整し、セキュリティ問題が公になる前に、影響を受ける利用者へアップグレードパスまたは修復策を提供できるようにします。

## 8) 2FA を有効化する

二要素認証 (2FA) の有効化は、重要な npm セキュリティベストプラクティスです。npm レジストリは、ユーザーアカウントで 2FA を有効化するために二つのモードをサポートしています。

- Authorization-only - ユーザーが Web サイトまたは CLI 経由で npm にログインするとき、またはプロフィール情報の変更などその他の一連の操作を行うとき。
- Authorization and write-mode - プロフィールとログイン操作に加え、トークンやパッケージの管理などの書き込み操作、およびチームやパッケージ可視性情報への限定的なサポート。

開始するには、公式ドキュメント [Requiring 2FA](https://docs.npmjs.com/requiring-2fa-for-package-publishing-and-settings-modification) を参照してください。

Google Authenticator のような認証アプリケーションを用意し、モバイルデバイスにインストールすれば準備は整います。アカウントに対する 2FA の拡張保護を始める簡単な方法の一つは npm のユーザーインターフェイスを使用することで、非常に簡単に有効化できます。コマンドライン派の場合も、サポートされている npm クライアントバージョン (>=5.5.1) を使用していれば 2FA を簡単に有効化できます。

```bash
npm profile enable-2fa auth-and-writes
```bash

コマンドラインの指示に従って 2FA を有効化し、緊急用認証コードを保存してください。ログインとプロフィール変更のみの 2FA モードを有効化したい場合は、上記コードの `auth-and-writes` を `auth-only` に置き換えます。

## Additional Security Resources

- [About secret scanning](https://docs.github.com/en/code-security/secret-scanning/introduction/about-secret-scanning)
- [Best practices for securing accounts](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure)

## 9) npm author tokens を使用する

npm CLI でログインするたびに、ユーザー用のトークンが生成され、npm レジストリに対する認証に使用されます。トークンにより、CI や自動化手順の中で npm レジストリ関連の操作を簡単に実行できます。たとえば、レジストリ上のプライベートモジュールへのアクセスや、ビルドステップからの新しいバージョン公開などです。

トークンは npm レジストリの Web サイトでも、npm コマンドラインクライアントでも管理できます。CLI を使用して、特定の IPv4 アドレス範囲に制限された読み取り専用トークンを作成する例は次のとおりです。

```bash
npm token create --read-only --cidr=192.0.2.0/24
```

ユーザーに作成されているトークンを確認する場合や、緊急時にトークンを取り消す場合は、それぞれ `npm token list` または `npm token revoke` を使用できます。

npm トークンを保護し、その露出を最小化することで、この npm セキュリティベストプラクティスに従ってください。

## 10) typosquatting と slopsquatting 攻撃を理解する

### Typosquatting 攻撃

Typosquatting は、タイプミスなどユーザーの誤りに依存する攻撃です。typosquatting では、悪意のある者が、既存の人気モジュールによく似た名前の悪意あるモジュールを npm レジストリに公開します。これらの悪意あるパッケージは、一般的な入力ミスや視覚的な類似性を悪用し、開発者が意図した正規パッケージの代わりにそれらをインストールするよう誘導します。

Snyk セキュリティチームは、npm エコシステム内で typosquatting を使ってユーザーをだましてインストールさせる悪意あるパッケージを数十個追跡しています。同様の攻撃は PyPi Python レジストリでも観測されています。特に注目すべきインシデントには、[cross-env](https://snyk.io/vuln/npm:crossenv:20170802)、[event-stream](https://snyk.io/vuln/SNYK-JS-EVENTSTREAM-72638)、[eslint-scope](https://snyk.io/vuln/npm:eslint-scope:20180712) があります。

typosquatting 攻撃の主な標的の一つはユーザー認証情報です。どのパッケージもグローバル変数 `process.env` を通じて環境変数へアクセスできるためです。他の例として event-stream の事例があり、攻撃者はアプリケーションのソースコードに[悪意あるコードを注入](https://snyk.io/blog/a-post-mortem-of-the-malicious-event-stream-backdoor)することを期待して開発者を標的にしました。

### Slopsquatting 攻撃

Slopsquatting は、AI コーディングアシスタントを悪用する比較的新しい攻撃ベクトルです。開発者が ChatGPT や GitHub Copilot のような AI ツールにパッケージを提案させると、これらのモデルは実際には存在しないパッケージ名を幻覚として生成することがあります。攻撃者はこれらの幻覚を監視し、開発者が AI によって提案されたパッケージを盲目的に信頼してインストールする可能性があることを知ったうえで、その正確な名前の悪意あるパッケージを公開します。

人間のタイプミスを悪用する typosquatting とは異なり、slopsquatting は、もっともらしく見えるが存在しないパッケージ名を生成しがちな AI の傾向を悪用します。提案された名前が完全に正当に見えるため、検出がより困難になります。

たとえば、AI アシスタントが実際のパッケージ `node-fetch` の代わりに `node-fetch-promise` を提案するかもしれません。攻撃者がその幻覚名で悪意あるパッケージをすでに公開していた場合、それをインストールするとシステムは静かに侵害されます。

slopsquatting から保護するには、次を行います。

- AI が提案したパッケージをインストールする前に、`npm view <package-name>` を実行して存在を確認します。
- パッケージのダウンロード数を確認します。正規パッケージは数千から数百万のダウンロードがありますが、新しく公開された悪意あるパッケージは非常に少数です。
- そのパッケージに、本物のコード、コミット、コントリビューターを持つ実際の GitHub リポジトリがあることを確認します。
- ごく最近作成され、リリース履歴のないパッケージを疑います。
- 独立した検証なしに、AI ツールが提案したパッケージに対して `npm install` を盲目的に実行してはいけません。
- チーム環境では、新しい AI 提案依存関係が本番に到達する前に、`npm view <package-name>` を CI チェックとして追加します。

## 11) 安全なパッケージ公開のため trusted publishers を使用する

従来の npm 公開は、侵害されたり誤って露出したりする可能性のある長寿命トークンに依存しています。OpenID Connect (OIDC) を使用した trusted publishing は、CI/CD プロセス中に自動生成される短寿命でワークフロー固有の認証情報を使うことで、より安全な代替手段を提供します。trusted publishing は現在、GitHub Actions と GitLab CI/CD Pipelines をサポートしています。

### trusted publishing の仕組み

trusted publishing は、OIDC を使用して npm と CI/CD プロバイダの間に信頼関係を作成します。パッケージに trusted publisher を設定すると、npm は npm トークンや手動公開のような従来の認証方法に加えて、承認した特定のワークフローからの公開を受け入れます。npm CLI は OIDC 環境を自動的に検出し、従来のトークンへフォールバックする前に、それらを認証に使用します。

このアプローチにより、侵害、ログへの誤露出、手動ローテーションが必要になるといった、長寿命の書き込みトークンに関連するセキュリティリスクを排除できます。代わりに、各公開では、ワークフローに固有で抽出や再利用ができない、短寿命で暗号学的に署名されたトークンが使用されます。

### 自動 provenance 生成

trusted publishing 経由で公開すると、npm はパッケージ真正性の暗号学的証明を提供する provenance attestations を自動生成します。これにより、利用者はパッケージが正当なソースから来ており、改ざんされていないことを検証しやすくなります。

詳細は [npm trusted publishing documentation](https://docs.npmjs.com/trusted-publishers) を参照してください。

## 12) dependency confusion 攻撃を防ぐ

dependency confusion 攻撃は、攻撃者が内部プライベートパッケージと同じ名前の悪意あるパッケージを、より高いバージョン番号で公開 npm レジストリに公開することで発生します。`npm install` を実行すると、npm はバージョンが高いため、内部パッケージの代わりに公開された悪意あるパッケージを解決する可能性があります。

攻撃者は通常、次のような経路で内部パッケージ名を発見します。

- 公開 GitHub リポジトリへ誤ってプッシュされた `package.json` ファイル
- 内部ツールやパッケージ名に言及している求人情報
- 内部依存関係名を明らかにするエラーメッセージやスタックトレース

dependency confusion から保護するには、次を行います。

- 内部パッケージには常に **scoped package names** を使用します。例: `package-name` ではなく `@yourorg/package-name`
- scoped package がプライベートレジストリを明示的に指すように、`.npmrc` で `@yourorg:registry=https://your-private-registry.example.com` を設定します。
- 攻撃者に取得されるのを防ぐため、空の placeholder を公開して、公開 npm レジストリ上で内部パッケージ名を予約します。

## 13) 本番にコピーする前にドキュメント例を検証する

ライブラリの README ファイルや公式例は、本番コードへ直接コピーされることがよくあります。ライブラリ自体は内部で安全なデフォルトを使用していても、そのドキュメント例が、そのデフォルトを損なう安全でないパターンを示していることがあります。これにより「documentation attack surface」が生まれます。これは、セキュリティリスクがライブラリのコードではなく、そのドキュメントが開発者に使い方を教える方法から生じる脆弱性の一種です。

### パターン

ライブラリは内部で強固なセキュリティを実装している一方で、README の例では簡潔さや後方互換性のために弱い設定を使っています。開発者はこれらの例をそのままコピーし、ライブラリが防ぐよう設計されていた脆弱性を知らずに導入してしまいます。サプライチェーン攻撃とは異なり、ライブラリコード自体は安全であるため、これらの脆弱性はすべての監査ツールを通過します。安全でないのはコピー&ペーストされた使用パターンだけです。

### 実例

このパターンは、週次ダウンロード数の合計が 1 億 9500 万を超える人気 npm パッケージ群で文書化されています。

- **弱い鍵導出**: 広く使われている暗号化ライブラリの README 例では、MD5 と 1 回の反復 (EVP_BytesToKey) を使用してパスフレーズから AES 鍵を導出しており、GPU が 1 秒あたり数十億の候補パスフレーズを試せるようになります。ライブラリ自身の PBKDF2 モジュールはより強いデフォルトを使用していますが、目立つ AES 例ではそれを使用していません。
- **リダイレクト時の認証情報露出**: ある HTTP クライアントライブラリの README は、プロトコルダウングレード (HTTPS から HTTP) 中にライブラリがすでに削除した authorization ヘッダーを、`beforeRedirect` コールバックで再注入する例を示しています。これは実質的にライブラリ自身のセキュリティ機構を迂回します。
- **Regex anchoring**: 検証用の regex パターンを受け取るライブラリ (JWT audience matching、CORS origin matching など) が、`/example\.com/` のような anchor されていないパターンを例として示すことがあります。これは `malicious-example.com` にも一致します。修正は `^https:\/\/example\.com$` ですが、ドキュメントは anchoring を示していません。
- **安全でないランダム性**: ファイルアップロードライブラリの README が `Math.random()` でファイル名を生成している一方で、ライブラリ自身のデフォルトは `crypto.randomBytes(16)` を使用しています。README 例に従ってファイル名をカスタマイズした開発者は、暗号学的なランダム性から予測可能なランダム性へダウングレードしてしまいます。

### 自分を守る方法

- **セキュリティレビューなしに README 例を本番へコピーしてはいけません。** ドキュメントコードは Stack Overflow のコードと同じように扱い、本番対応済みの解決策ではなく出発点とみなしてください。
- **ライブラリのソースコードで安全なデフォルトを確認してください。** ライブラリ内部では `crypto.randomBytes()`、`PBKDF2`、anchor された regex パターンを使用しているのに、README 例が `Math.random()`、`MD5`、anchor されていないパターンを使用している場合は、ライブラリ内部のアプローチを優先してください。
- **セキュリティに敏感なパラメータを検証してください。** ライブラリがパターン、鍵、認証情報を入力として受け取る場合、使用方法がそのパラメータタイプのセキュリティベストプラクティス (anchor された regex、認証付き暗号、HTTPS のみの認証情報) に合っていることを確認します。
- **安全でないドキュメントを報告してください。** README 例が安全でないパターンを教えていることを見つけたら、メンテナに issue を提出してください。ドキュメント脆弱性は、その例をコピーするすべての開発者に影響します。

このパターンの詳細な背景は、[Node.js Security Working Group](https://github.com/nodejs/security-wg/issues/1560) の議論を参照してください。

## 最終推奨事項

npm セキュリティベストプラクティスの一覧の締めくくりとして、このような攻撃のリスクを低減するためのヒントを示します。

- パッケージインストール手順をターミナルへコピー&ペーストするときは、特に慎重にしてください。ソースコードリポジトリと npm レジストリの両方で、それが本当にインストールしようとしているパッケージであることを必ず確認します。`npm info` でパッケージのメタデータを確認し、コントリビューターや最新バージョンについて追加情報を取得できます。
- 日常作業では npm からログアウトしたユーザーをデフォルトにし、認証情報がアカウントを簡単に侵害する弱点にならないようにします。
- パッケージをインストールするときは、任意コマンド実行のリスクを減らすために `--ignore-scripts` を追加します。例: `npm install my-malicious-package --ignore-scripts`

## ASVS との対応

| ASVS 項目 | 関連内容 |
| --- | --- |
| V15.1 | npm 依存関係、ロックファイル、SBOM、パッケージ来歴、レジストリ、アーティファクト署名の管理 |
| V15.2 | 脆弱な npm 依存関係、インストールスクリプト、トークン、公開権限、typosquatting、slopsquatting、dependency confusion への対策 |
