---
title: NPM Security Cheat Sheet
hide_title: true
---

<div className="docHero" data-category="asvs-v13">
  <h1>NPM セキュリティチートシート</h1>
  <div className="docMeta">
    <span className="docPill">最終更新: 2026-05-20</span>
    <span className="docPill">読了時間: 準備中</span>
    <span className="docPill">カテゴリ: 設定</span>
  </div>
</div>

<p className="docLead">NPM セキュリティチートシートを、原文・翻訳・対比表示で確認できます。ASVS Index 対応の文脈で、公式原文と日本語訳を確認しやすく整理しています。</p>

<div className="tabbedContent">
  <input className="tabInput" type="radio" name="npm-security-view" id="npm-security-original" />
  <input className="tabInput" type="radio" name="npm-security-view" id="npm-security-translation" defaultChecked />
  <input className="tabInput" type="radio" name="npm-security-view" id="npm-security-bilingual" />

  <div className="contentTabs">
    <label htmlFor="npm-security-original" title="OWASP 原文">原文</label>
    <label htmlFor="npm-security-translation" title="日本語訳">翻訳</label>
    <label htmlFor="npm-security-bilingual" title="原文と翻訳を並べて確認">対比表示</label>
  </div>

<section id="npm-security-original-panel" className="tabPanel originalPanel contentPanel">

The following cheatsheet covers several npm security best practices and productivity tips, useful for JavaScript and Node.js developers. This list was originally based on the [10 npm security best practices](https://snyk.io/blog/ten-npm-security-best-practices) from the Snyk blog.

## 1) Avoid publishing secrets to the npm registry

Whether you’re making use of API keys, passwords or other secrets, they can very easily end up leaking into source control or even a published package on the public npm registry. You may have secrets in your working directory in designated files such as a `.env` which should be added to a `.gitignore` to avoid committing it to a SCM, but what happens when you publish an npm package from the project’s directory?

The npm CLI packs up a project into a tar archive (tarball) in order to push it to the registry. The following criteria determine which files and directories are added to the tarball:

- If there is either a `.gitignore` or a `.npmignore` file, the contents of the file are used as an ignore pattern when preparing the package for publication.
- If both ignore files exist, everything not located in `.npmignore` is published to the registry. This condition is a common source of confusion and is a problem that can lead to leaking secrets.

Developers may end up updating the `.gitignore` file, but forget to update `.npmignore` as well, which can lead to a potentially sensitive file not being pushed to source control, but still being included in the npm package.

Another good practice to adopt is making use of the `files` property in `package.json`, which works as an allowlist and specifies the array of files to be included in the package that is to be created and installed (while the ignore file functions as a denylist). The `files` property and an ignore file can both be used together to determine which files should explicitly be included, as well as excluded, from the package. When using both, the `files` property in `package.json` takes precedence over the ignore file.

When a package is published, the npm CLI will verbosely display the archive being created. To be extra careful, add a `--dry-run` command-line argument to your publish command in order to first review how the tarball is created without actually publishing it to the registry.

For details about revoking access token, see the official documentation: [Revoking access tokens](https://docs.npmjs.com/revoking-access-tokens).

## 2) Enforce the lockfile

We embraced the birth of package lockfiles with open arms, which introduced: deterministic installations across different environments, and enforced dependency expectations across team collaboration. Life is good! Or so I thought… what would have happened had I slipped a change into the project’s `package.json` file but had forgotten to commit the lockfile alongside of it?

Both Yarn and npm act the same during dependency installation. When they detect an inconsistency between the project’s `package.json` and the lockfile, they compensate for such change based on the `package.json` manifest by installing different versions than those that were recorded in the lockfile.

This kind of situation can be hazardous for build and production environments as they could pull in unintended package versions and render the entire benefit of a lockfile futile.

Luckily, there is a way to tell both Yarn and npm to adhere to a specified set of dependencies and their versions by referencing them from the lockfile. Any inconsistency will abort the installation. The command-line should read as follows:

- If you’re using Yarn, run `yarn install --frozen-lockfile`.
- If you’re using npm run `npm ci`.

## 3) Minimize attack surfaces by ignoring run-scripts

The npm CLI works with package run-scripts. If you’ve ever run `npm start` or `npm test` then you’ve used package run-scripts too. The npm CLI builds on scripts that a package can declare, and allows packages to define scripts to run at specific entry points during the package’s installation in a project. For example, some of these [script hook](https://docs.npmjs.com/misc/scripts) entries may be `postinstall` scripts that a package that is being installed will execute in order to perform housekeeping chores.

With this capability, bad actors may create or alter packages to perform malicious acts by running any arbitrary command when their package is installed. A couple of cases where we’ve seen this already happening is the popular [eslint-scope incident](https://snyk.io/vuln/npm:eslint-scope:20180712) that harvested npm tokens, and the [crossenv incident](https://snyk.io/vuln/npm:crossenv:20170802), along with 36 other packages that abused a typosquatting attack on the npm registry.

Apply these npm security best practices to minimize the malicious module attack surface:

- Always vet and perform due-diligence on third-party modules you install to confirm their health and credibility.
- Hold-off on upgrading immediately to new versions; allow new package versions some time to circulate before trying them out.
- Before upgrading, make sure to review changelog and release notes for the upgraded version.
- When installing packages make sure to add the `--ignore-scripts` suffix to disable the execution of any scripts by third-party packages.
- Consider adding `ignore-scripts=true` to your `.npmrc` project file, or to your global npm configuration.

### Using an allowlist for lifecycle scripts

Disabling lifecycle scripts by default by adding `ignore-scripts=true` to your `.npmrc` file is the safest option. If you use packages that rely on lifecycle scripts for legitimate reasons, you can use a plugin like [`@lavamoat/allow-scripts`](https://github.com/LavaMoat/LavaMoat/tree/main/packages/allow-scripts) to create an _allowlist_ of packages authorized to run lifecycle scripts.

Here's how the allowlist would look like in the `package.json` file on a project using the popular image processing package [sharp](https://www.npmjs.com/package/sharp):

```json
{
  "lavamoat": {
    "allowScripts": {
      "sharp": true
    }
  }
}
```

## 4) Assess npm project health

### npm outdated command

Rushing to constantly upgrade dependencies to their latest releases is not necessarily a good practice if it is done without reviewing release notes, the code changes, and generally testing new upgrades in a comprehensive manner. With that said, staying out of date and not upgrading at all, or after a long time, is a source for trouble as well.

The npm CLI can provide information about the freshness of dependencies you use with regards to their semantic versioning offset. By running `npm outdated`, you can see which packages are out of date. Dependencies in yellow correspond to the semantic versioning as specified in the `package.json` manifest, and dependencies colored in red mean an update is available. Furthermore, the output also shows the latest version for each dependency.

### npm doctor command

Between the variety of Node.js package managers and different versions of Node.js you may have installed in your path, how do you verify a healthy npm installation and working environment? Whether you’re working with the npm CLI in a development environment or within a CI, it is important to assess that everything is working as expected.

Call the doctor! The npm CLI incorporates a health assessment tool to diagnose your environment for a well-working npm interaction. Run `npm doctor` to review your npm setup:

- Check the official npm registry is reachable, and display the currently configured registry.
- Check that Git is available.
- Review installed npm and Node.js versions.
- Run permission checks on the various folders such as the local and global `node_modules`, and on the folder used for package cache.
- Check the local npm module cache for checksum correctness.

## 5) Audit for vulnerabilities in open source dependencies

The npm ecosystem is the single largest repository of application libraries amongst all the other language ecosystems. The registry and the libraries in it are at the core for JavaScript developers as they are able to leverage work that others have already built and incorporate it into their codebase. With that said, the increasing adoption of open source libraries in applications brings with it an increased risk of introducing security vulnerabilities.

Many popular npm packages have been found to be vulnerable and may carry a significant risk without proper security auditing of your project’s dependencies. Some examples are npm [request](https://snyk.io/vuln/npm:request:20160119), [superagent](https://snyk.io/vuln/search?q=superagent&type=npm), [mongoose](https://snyk.io/vuln/search?q=mongoose&type=npm), and even security-related packages like [jsonwebtoken](https://snyk.io/vuln/npm:jsonwebtoken:20150331), and [validator](https://snyk.io/vuln/search?q=validator&type=npm).

Security doesn’t end by just scanning for security vulnerabilities when installing a package but should also be streamlined with developer workflows to be effectively adopted throughout the entire lifecycle of software development, and monitored continuously when code is deployed:

- Scan for security vulnerabilities in [third-party open source projects](https://owasp.org/www-community/Component_Analysis)
- Monitor snapshots of your project's manifests so you can receive alerts when new CVEs impact them [OWASP Dependency-Track](https://owasp.org/www-project-dependency-track/)

## 6) Artifact governance and supply chain protections

### Use a local npm proxy

The npm registry is the biggest collection of packages that is available for all JavaScript developers and is also the home of most Open Source projects for web developers. But sometimes you might have different needs in terms of security, deployments or performance. When this is true, npm allows you to switch to a different registry:

When you run `npm install`, it automatically starts a communication with the main registry to resolve all your dependencies; if you wish to use a different registry, that too is pretty straightforward:

- Set `npm set registry` to set up a default registry.
- Use the argument `--registry` for one single registry.

[Verdaccio](https://verdaccio.org/) is a simple, lightweight zero-config-required private registry and installing it is as simple as follows: `$ npm install --global verdaccio`.

Hosting your own registry was never so easy! Let’s check the most important features of this tool:

- It supports the npm registry format including private package features, scope support, package access control and authenticated users in the web interface.
- It provides capabilities to hook remote registries and the power to route dependencies to different registries and cache their tarballs. To reduce duplicate downloads and save bandwidth in your local development and CI servers, you should proxy all dependencies.
- As an authentication provider it uses htpasswd security by default, but also supports GitLab, Bitbucket, and LDAP. You can also use your own.
- It’s easy to scale using a different storage provider.
- If your project is based in Docker, using the official image is the best choice.
- It enables really fast bootstrap for testing environments, and is handy for testing big mono-repo projects.

### Governance & Verification Steps

Supply-chain attacks increasingly target build artifacts, registries and CI credentials. Add lightweight governance and verification steps to reduce risk and improve response time:

- Track provenance and produce an SBOM for builds (CycloneDX/SPDX) so you can trace what was built and where inputs originated.

  CycloneDX Example:

  ```bash
  # Generate SBOM
  npm install @cyclonedx/cyclonedx-npm
  npx @cyclonedx/cyclonedx-npm --validate > sbom.json # Use the flag `--omit dev` to exclude dev dependencies from SBOM if needed
  ```

- Sign artifacts and build provenance (for example, use Sigstore / cosign or similar signing tools) so consumers can verify integrity before installing.

  Sigstore Example:

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

- Prefer immutable, access-controlled registries or vetted mirrors (private registries, Verdaccio with an upstream cache, or [approved mirrors](#use-a-local-npm-proxy)) and enable retention / immutability policies where available.
- Restrict, scope and rotate CI and publisher tokens. Bind publisher tokens to workflows or IP ranges and minimize privileges.
- Verify packages during CI: check signatures or provenance, validate the SBOM, [run SCA and static analysis](#5-audit-for-vulnerabilities-in-open-source-dependencies), and [install from pinned lockfile resolutions](#2-enforce-the-lockfile).
- Automate monitoring and alerts for unusual publishes, token usage or dependency changes and keep a documented remediation playbook (revoke tokens, deprecate/yank compromised packages, publish fixes and notify consumers).

These measures are incremental and low-risk to adopt. Combined they make supply-chain attacks harder and speed up identification and recovery if a compromise occurs.

## 7) Responsibly disclose security vulnerabilities

When security vulnerabilities are found, they pose a potentially serious threat if they are publicised without prior warning or appropriate remedial action for users who cannot protect themselves.

It is recommended that security researchers follow a responsible disclosure program, which is a set of processes and guidelines that aims to connect the researchers with the vendor or maintainer of the vulnerable asset, in order to convey the vulnerability, its impact and applicability. Once the vulnerability is correctly triaged, the vendor and researcher coordinate a fix and a publication date for the vulnerability in an effort to provide an upgrade-path or remediation for affected users before the security issue is made public.

## 8) Enable 2FA

Enabling two-factor authentication (2FA) is a critical npm security best practice. The npm registry supports two modes for enabling 2FA in a user’s account:

- Authorization-only—when a user logs in to npm via the website or the CLI, or performs other sets of actions such as changing profile information.
- Authorization and write-mode—profile and log-in actions, as well as write actions such as managing tokens and packages, and minor support for team and package visibility information.

To get started, see the official documentation: [Requiring 2FA](https://docs.npmjs.com/requiring-2fa-for-package-publishing-and-settings-modification).

Equip yourself with an authentication application, such as Google Authenticator, which you can install on a mobile device, and you’re ready to get started. One easy way to get started with the 2FA extended protection for your account is through npm’s user interface, which allows enabling it very easily. If you’re a command-line person, it’s also easy to enable 2FA when using a supported npm client version (>=5.5.1):

```sh
npm profile enable-2fa auth-and-writes
```

Follow the command-line instructions to enable 2FA, and to save emergency authentication codes. If you wish to enable 2FA mode for login and profile changes only, you may replace the `auth-and-writes` with `auth-only` in the code as it appears above.

## Additional Security Resources

- [About secret scanning](https://docs.github.com/en/code-security/secret-scanning/introduction/about-secret-scanning)
- [Best practices for securing accounts](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure)

## 9) Use npm author tokens

Every time you log in with the npm CLI, a token is generated for your user and authenticates you to the npm registry. Tokens make it easy to perform npm registry-related actions during CI and automated procedures, such as accessing private modules on the registry or publishing new versions from a build step.

Tokens can be managed through the npm registry website, as well as using the npm command-line client. An example of using the CLI to create a read-only token that is restricted to a specific IPv4 address range is as follows:

```sh
npm token create --read-only --cidr=192.0.2.0/24
```

To verify which tokens are created for your user or to revoke tokens in cases of emergency, you can use `npm token list` or `npm token revoke` respectively.

Ensure you are following this npm security best practice by protecting and minimizing the exposure of your npm tokens.

## 10) Understanding typosquatting and slopsquatting attacks

### Typosquatting attacks

Typosquatting is an attack that relies on mistakes made by users, such as typos. With typosquatting, bad actors publish malicious modules to the npm registry with names that look much like existing popular modules. These malicious packages exploit common typing errors or visual similarities to trick developers into installing them instead of the legitimate packages they intended to use.

The Snyk security team has tracked tens of malicious packages in the npm ecosystem that used typosquatting to trick users into installing them; similar attacks have been observed on the PyPi Python registry as well. Some of the most notable incidents include [cross-env](https://snyk.io/vuln/npm:crossenv:20170802), [event-stream](https://snyk.io/vuln/SNYK-JS-EVENTSTREAM-72638), and [eslint-scope](https://snyk.io/vuln/npm:eslint-scope:20180712).

One of the main targets for typosquatting attacks are user credentials, since any package has access to environment variables via the global variable `process.env`. Other examples include the event-stream case, where attackers targeted developers in the hopes of [injecting malicious code](https://snyk.io/blog/a-post-mortem-of-the-malicious-event-stream-backdoor) into an application's source code.

### Slopsquatting attacks

Slopsquatting is a newer attack vector that exploits AI coding assistants. When developers ask AI tools like ChatGPT or GitHub Copilot to suggest packages, these models may hallucinate package names that do not actually exist. Attackers monitor these hallucinations and publish malicious packages with those exact names, knowing developers may blindly trust and install AI-suggested packages.

Unlike typosquatting which exploits human typing errors, slopsquatting exploits AI's tendency to generate plausible-looking but non-existent package names — making it harder to detect since the suggested name looks completely legitimate.

For example, an AI assistant might suggest `node-fetch-promise` instead of the real package `node-fetch`. If an attacker has already published a malicious package under that hallucinated name, installing it compromises your system silently.

To protect against slopsquatting:

- Run `npm view <package-name>` before installing any AI-suggested package to confirm it exists.
- Check the package download count — legitimate packages have thousands or millions of downloads while newly published malicious ones have very few.
- Verify the package has a real GitHub repository with genuine code, commits and contributors.
- Be suspicious of packages created very recently with no release history.
- Never blindly run `npm install` on packages suggested by AI tools without independent verification.
- In team environments, add `npm view <package-name>` as a CI check for any new AI-suggested dependencies before they reach production.

## 11) Use trusted publishers for secure package publishing

Traditional npm publishing relies on long-lived tokens that can be compromised or accidentally exposed. Trusted publishing with OpenID Connect (OIDC) provides a more secure alternative by using short-lived, workflow-specific credentials that are automatically generated during CI/CD processes. Trusted publishing currently supports GitHub Actions and GitLab CI/CD Pipelines.

### How trusted publishing works

Trusted publishing creates a trust relationship between npm and your CI/CD provider using OIDC. When you configure a trusted publisher for your package, npm will accept publishes from the specific workflow you've authorized, in addition to traditional authentication methods like npm tokens and manual publishes. The npm CLI automatically detects OIDC environments and uses them for authentication before falling back to traditional tokens.

This approach eliminates the security risks associated with long-lived write tokens, which can be compromised, accidentally exposed in logs, or require manual rotation. Instead, each publish uses short-lived, cryptographically-signed tokens that are specific to your workflow and cannot be extracted or reused.

### Automatic provenance generation

When publishing via trusted publishing, npm automatically generates provenance attestations that provide cryptographic proof of package authenticity. This helps users verify that packages come from legitimate sources and haven't been tampered with.

For more information, see the [npm trusted publishing documentation](https://docs.npmjs.com/trusted-publishers).

## 12) Prevent dependency confusion attacks

A dependency confusion attack occurs when an attacker publishes a malicious package on the public npm registry using the same name as your internal private package, but with a higher version number. When you run `npm install`, npm may resolve the public malicious package instead of your internal one because of the higher version.

Attackers typically discover internal package names through:

- Leaked `package.json` files accidentally pushed to public GitHub repositories
- Job postings that mention internal tools or package names
- Error messages or stack traces that reveal internal dependency names

To protect against dependency confusion:

- Always use **scoped package names** for internal packages (e.g., `@yourorg/package-name` instead of `package-name`)
- Configure your `.npmrc` to explicitly point scoped packages to your private registry by setting `@yourorg:registry=https://your-private-registry.example.com`
- Reserve your internal package names on the public npm registry by publishing an empty placeholder to prevent attackers from claiming them.

## 13) Verify documentation examples before copying into production

Library README files and official examples are often copied directly into production code. While the libraries themselves may use secure defaults internally, their documentation examples sometimes demonstrate insecure patterns that undermine those very defaults. This creates a "documentation attack surface" — a class of vulnerability where the security risk comes not from the library's code, but from how its documentation teaches developers to use it.

### The pattern

A library implements strong security internally but its README examples use weaker configurations for brevity or backward compatibility. Developers copy these examples verbatim, unknowingly introducing vulnerabilities that the library was designed to prevent. Unlike supply chain attacks, these vulnerabilities pass every audit tool because the library code itself is safe — only the copy-pasted usage pattern is insecure.

### Real-world examples

This pattern has been documented across popular npm packages with combined weekly downloads exceeding 195 million:

- **Weak key derivation**: A widely-used encryption library's README examples derive AES keys from passphrases using MD5 with a single iteration (EVP_BytesToKey), allowing a GPU to test billions of candidate passphrases per second. The library's own PBKDF2 module uses stronger defaults, but the prominent AES examples do not use it.
- **Credential exposure on redirect**: An HTTP client library's README demonstrates a `beforeRedirect` callback that re-injects authorization headers after the library has already stripped them during protocol downgrades (HTTPS to HTTP), effectively bypassing the library's own security mechanism.
- **Regex anchoring**: Libraries that accept regex patterns for validation (e.g., JWT audience matching, CORS origin matching) show examples with unanchored patterns like `/example\\.com/`, which match `malicious-example.com`. The fix is `^https:\\/\\/example\\.com$`, but the documentation doesn't demonstrate anchoring.
- **Insecure randomness**: A file upload library's README generates filenames with `Math.random()` while the library's own default uses `crypto.randomBytes(16)`. Developers who customize the filename — following the README example — downgrade from cryptographic to predictable randomness.

### How to protect yourself

- **Never copy README examples into production without a security review.** Treat documentation code the same way you treat code from Stack Overflow — as a starting point, not a production-ready solution.
- **Check for secure defaults in the library's source code.** If the library internally uses `crypto.randomBytes()`, `PBKDF2`, or anchored regex patterns, but the README example uses `Math.random()`, `MD5`, or unanchored patterns, prefer the library's internal approach.
- **Validate security-sensitive parameters.** When a library accepts patterns, keys, or credentials as input, verify that your usage matches security best practices for that parameter type (anchored regex, authenticated encryption, HTTPS-only credentials).
- **Report insecure documentation.** If you find a README example that teaches an insecure pattern, file an issue with the maintainer. Documentation vulnerabilities affect every developer who copies the example.

For more context on this pattern, see the discussion at the [Node.js Security Working Group](https://github.com/nodejs/security-wg/issues/1560).

## Final Recommendations

Closing our list of npm security best practices are the following tips to reduce the risk of such attacks:

- Be extra-careful when copy-pasting package installation instructions into the terminal. Make sure to verify in the source code repository as well as on the npm registry that this is indeed the package you are intending to install. You might verify the metadata of the package with `npm info` to fetch more information about contributors and latest versions.
- Default to having an npm logged-out user in your daily work routines so your credentials won’t be the weak spot that would lead to easily compromising your account.
- When installing packages, append the `--ignore-scripts` to reduce the risk of arbitrary command execution. For example: `npm install my-malicious-package --ignore-scripts`

</section>

<section id="npm-security-translation-panel" className="tabPanel translationPanel contentPanel">

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
```

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

```sh
npm profile enable-2fa auth-and-writes
```

コマンドラインの指示に従って 2FA を有効化し、緊急用認証コードを保存してください。ログインとプロフィール変更のみの 2FA モードを有効化したい場合は、上記コードの `auth-and-writes` を `auth-only` に置き換えます。

## Additional Security Resources

- [About secret scanning](https://docs.github.com/en/code-security/secret-scanning/introduction/about-secret-scanning)
- [Best practices for securing accounts](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure)

## 9) npm author tokens を使用する

npm CLI でログインするたびに、ユーザー用のトークンが生成され、npm レジストリに対する認証に使用されます。トークンにより、CI や自動化手順の中で npm レジストリ関連の操作を簡単に実行できます。たとえば、レジストリ上のプライベートモジュールへのアクセスや、ビルドステップからの新しいバージョン公開などです。

トークンは npm レジストリの Web サイトでも、npm コマンドラインクライアントでも管理できます。CLI を使用して、特定の IPv4 アドレス範囲に制限された読み取り専用トークンを作成する例は次のとおりです。

```sh
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
- **Regex anchoring**: 検証用の regex パターンを受け取るライブラリ (JWT audience matching、CORS origin matching など) が、`/example\\.com/` のような anchor されていないパターンを例として示すことがあります。これは `malicious-example.com` にも一致します。修正は `^https:\\/\\/example\\.com$` ですが、ドキュメントは anchoring を示していません。
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

</section>

<section id="npm-security-bilingual-panel" className="tabPanel bilingualPanel">

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

The following cheatsheet covers several npm security best practices and productivity tips, useful for JavaScript and Node.js developers. This list was originally based on the [10 npm security best practices](https://snyk.io/blog/ten-npm-security-best-practices) from the Snyk blog.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

以下のチートシートでは、JavaScript および Node.js 開発者に役立つ npm セキュリティのベストプラクティスと生産性向上のヒントをいくつか扱います。この一覧は、もともと Snyk ブログの [10 npm security best practices](https://snyk.io/blog/ten-npm-security-best-practices) を基にしていました。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## 1) Avoid publishing secrets to the npm registry

Whether you’re making use of API keys, passwords or other secrets, they can very easily end up leaking into source control or even a published package on the public npm registry. You may have secrets in your working directory in designated files such as a `.env` which should be added to a `.gitignore` to avoid committing it to a SCM, but what happens when you publish an npm package from the project’s directory?

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## 1) npm レジストリにシークレットを公開しない

API キー、パスワード、その他のシークレットを使用している場合、それらはソース管理や、公開 npm レジストリに公開されたパッケージに非常に簡単に漏えいする可能性があります。作業ディレクトリには `.env` などの専用ファイルにシークレットがあるかもしれません。これは SCM にコミットしないよう `.gitignore` に追加すべきです。しかし、プロジェクトのディレクトリから npm パッケージを公開するときはどうなるでしょうか。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

The npm CLI packs up a project into a tar archive (tarball) in order to push it to the registry. The following criteria determine which files and directories are added to the tarball:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

npm CLI は、レジストリへプッシュするためにプロジェクトを tar アーカイブ (tarball) にまとめます。tarball に追加されるファイルとディレクトリは、次の条件で決まります。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

- If there is either a `.gitignore` or a `.npmignore` file, the contents of the file are used as an ignore pattern when preparing the package for publication.
- If both ignore files exist, everything not located in `.npmignore` is published to the registry. This condition is a common source of confusion and is a problem that can lead to leaking secrets.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

- `.gitignore` または `.npmignore` ファイルのいずれかがある場合、そのファイルの内容が、公開用パッケージを準備するときの ignore パターンとして使用されます。
- 両方の ignore ファイルが存在する場合、`.npmignore` に含まれていないものはすべてレジストリに公開されます。この条件はよく混乱を招き、シークレット漏えいにつながる問題になります。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Developers may end up updating the `.gitignore` file, but forget to update `.npmignore` as well, which can lead to a potentially sensitive file not being pushed to source control, but still being included in the npm package.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

開発者は `.gitignore` を更新しても `.npmignore` の更新を忘れることがあります。その結果、機密性がある可能性のあるファイルはソース管理にはプッシュされない一方で、npm パッケージには含まれてしまうことがあります。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Another good practice to adopt is making use of the `files` property in `package.json`, which works as an allowlist and specifies the array of files to be included in the package that is to be created and installed (while the ignore file functions as a denylist). The `files` property and an ignore file can both be used together to determine which files should explicitly be included, as well as excluded, from the package. When using both, the `files` property in `package.json` takes precedence over the ignore file.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

取り入れるべきもう一つの良いプラクティスは、`package.json` の `files` プロパティを使うことです。これは allowlist として機能し、作成およびインストールされるパッケージに含めるファイル配列を指定します。一方、ignore ファイルは denylist として機能します。`files` プロパティと ignore ファイルは併用でき、パッケージに明示的に含めるファイルと除外するファイルの両方を決定できます。両方を使用する場合、`package.json` の `files` プロパティが ignore ファイルより優先されます。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

When a package is published, the npm CLI will verbosely display the archive being created. To be extra careful, add a `--dry-run` command-line argument to your publish command in order to first review how the tarball is created without actually publishing it to the registry.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

パッケージが公開されるとき、npm CLI は作成されるアーカイブを詳細に表示します。さらに慎重にするには、公開コマンドに `--dry-run` コマンドライン引数を追加し、実際にレジストリへ公開する前に tarball がどのように作成されるかを確認してください。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

For details about revoking access token, see the official documentation: [Revoking access tokens](https://docs.npmjs.com/revoking-access-tokens).

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

アクセストークンの取り消しの詳細は、公式ドキュメント [Revoking access tokens](https://docs.npmjs.com/revoking-access-tokens) を参照してください。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## 2) Enforce the lockfile

We embraced the birth of package lockfiles with open arms, which introduced: deterministic installations across different environments, and enforced dependency expectations across team collaboration. Life is good! Or so I thought… what would have happened had I slipped a change into the project’s `package.json` file but had forgotten to commit the lockfile alongside of it?

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## 2) ロックファイルを強制する

私たちはパッケージロックファイルの登場を歓迎しました。ロックファイルにより、異なる環境間での決定論的なインストールと、チーム共同作業における依存関係の期待値の強制が導入されました。順調に見えます。しかし、もし私がプロジェクトの `package.json` ファイルに変更を入れたのに、そのロックファイルを一緒にコミットし忘れていたら何が起きるでしょうか。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Both Yarn and npm act the same during dependency installation. When they detect an inconsistency between the project’s `package.json` and the lockfile, they compensate for such change based on the `package.json` manifest by installing different versions than those that were recorded in the lockfile.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

Yarn と npm は、依存関係のインストール時に同じように動作します。プロジェクトの `package.json` とロックファイルの不整合を検出すると、`package.json` マニフェストに基づいてその変更を補正し、ロックファイルに記録されていたものとは異なるバージョンをインストールします。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

This kind of situation can be hazardous for build and production environments as they could pull in unintended package versions and render the entire benefit of a lockfile futile.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

このような状況は、ビルド環境や本番環境にとって危険です。意図しないパッケージバージョンを取り込み、ロックファイルの利点全体を無意味にしてしまう可能性があります。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Luckily, there is a way to tell both Yarn and npm to adhere to a specified set of dependencies and their versions by referencing them from the lockfile. Any inconsistency will abort the installation. The command-line should read as follows:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

幸い、Yarn と npm のどちらにも、ロックファイルを参照して指定された依存関係とそのバージョンの集合に従わせる方法があります。不整合があればインストールは中止されます。コマンドラインは次のとおりです。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

- If you’re using Yarn, run `yarn install --frozen-lockfile`.
- If you’re using npm run `npm ci`.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

- Yarn を使用している場合は、`yarn install --frozen-lockfile` を実行します。
- npm を使用している場合は、`npm ci` を実行します。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## 3) Minimize attack surfaces by ignoring run-scripts

The npm CLI works with package run-scripts. If you’ve ever run `npm start` or `npm test` then you’ve used package run-scripts too. The npm CLI builds on scripts that a package can declare, and allows packages to define scripts to run at specific entry points during the package’s installation in a project. For example, some of these [script hook](https://docs.npmjs.com/misc/scripts) entries may be `postinstall` scripts that a package that is being installed will execute in order to perform housekeeping chores.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## 3) run-scripts を無視して攻撃面を最小化する

npm CLI はパッケージの run-scripts と連携します。`npm start` や `npm test` を実行したことがあるなら、パッケージ run-scripts も使用したことがあります。npm CLI は、パッケージが宣言できるスクリプトを基盤としており、プロジェクトへのインストール中の特定のエントリポイントで実行されるスクリプトをパッケージが定義できるようにしています。たとえば、これらの [script hook](https://docs.npmjs.com/misc/scripts) エントリには、インストールされるパッケージが後片付け作業を行うために実行する `postinstall` スクリプトなどがあります。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

With this capability, bad actors may create or alter packages to perform malicious acts by running any arbitrary command when their package is installed. A couple of cases where we’ve seen this already happening is the popular [eslint-scope incident](https://snyk.io/vuln/npm:eslint-scope:20180712) that harvested npm tokens, and the [crossenv incident](https://snyk.io/vuln/npm:crossenv:20170802), along with 36 other packages that abused a typosquatting attack on the npm registry.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

この機能により、悪意のある者はパッケージを作成または改変し、そのパッケージがインストールされるときに任意のコマンドを実行して悪意ある行為を行えます。すでに発生した事例としては、npm トークンを収集した有名な [eslint-scope incident](https://snyk.io/vuln/npm:eslint-scope:20180712) や、npm レジストリ上で typosquatting 攻撃を悪用した [crossenv incident](https://snyk.io/vuln/npm:crossenv:20170802) とその他 36 個のパッケージがあります。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Apply these npm security best practices to minimize the malicious module attack surface:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

悪意あるモジュールの攻撃面を最小化するため、次の npm セキュリティベストプラクティスを適用してください。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

- Always vet and perform due-diligence on third-party modules you install to confirm their health and credibility.
- Hold-off on upgrading immediately to new versions; allow new package versions some time to circulate before trying them out.
- Before upgrading, make sure to review changelog and release notes for the upgraded version.
- When installing packages make sure to add the `--ignore-scripts` suffix to disable the execution of any scripts by third-party packages.
- Consider adding `ignore-scripts=true` to your `.npmrc` project file, or to your global npm configuration.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

- インストールするサードパーティモジュールについては、常に精査し、健全性と信頼性を確認するためのデューデリジェンスを実施します。
- 新しいバージョンへ即時にアップグレードするのは控え、新しいパッケージバージョンが流通する時間を少し置いてから試します。
- アップグレード前に、アップグレード対象バージョンの changelog と release notes を必ず確認します。
- パッケージをインストールするときは、サードパーティパッケージによるスクリプト実行を無効化するため、必ず `--ignore-scripts` サフィックスを追加します。
- プロジェクトの `.npmrc` ファイル、またはグローバル npm 設定に `ignore-scripts=true` を追加することを検討します。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Using an allowlist for lifecycle scripts

Disabling lifecycle scripts by default by adding `ignore-scripts=true` to your `.npmrc` file is the safest option. If you use packages that rely on lifecycle scripts for legitimate reasons, you can use a plugin like [`@lavamoat/allow-scripts`](https://github.com/LavaMoat/LavaMoat/tree/main/packages/allow-scripts) to create an _allowlist_ of packages authorized to run lifecycle scripts.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### lifecycle scripts の allowlist を使用する

`.npmrc` ファイルに `ignore-scripts=true` を追加して lifecycle scripts をデフォルトで無効化することが最も安全な選択肢です。正当な理由で lifecycle scripts に依存するパッケージを使用している場合は、[`@lavamoat/allow-scripts`](https://github.com/LavaMoat/LavaMoat/tree/main/packages/allow-scripts) のようなプラグインを使い、lifecycle scripts の実行を許可するパッケージの _allowlist_ を作成できます。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Here's how the allowlist would look like in the `package.json` file on a project using the popular image processing package [sharp](https://www.npmjs.com/package/sharp):

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

人気の画像処理パッケージ [sharp](https://www.npmjs.com/package/sharp) を使用するプロジェクトでは、`package.json` ファイル内の allowlist は次のようになります。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```json
{
  "lavamoat": {
    "allowScripts": {
      "sharp": true
    }
  }
}
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## 4) Assess npm project health

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## 4) npm プロジェクトの健全性を評価する

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### npm outdated command

Rushing to constantly upgrade dependencies to their latest releases is not necessarily a good practice if it is done without reviewing release notes, the code changes, and generally testing new upgrades in a comprehensive manner. With that said, staying out of date and not upgrading at all, or after a long time, is a source for trouble as well.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### npm outdated コマンド

リリースノート、コード変更、そして新しいアップグレードの包括的なテストを確認せずに、依存関係を常に最新リリースへ急いでアップグレードすることは、必ずしも良いプラクティスではありません。一方で、古いままにしてまったくアップグレードしないことや、長期間経ってからアップグレードすることも問題の原因になります。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

The npm CLI can provide information about the freshness of dependencies you use with regards to their semantic versioning offset. By running `npm outdated`, you can see which packages are out of date. Dependencies in yellow correspond to the semantic versioning as specified in the `package.json` manifest, and dependencies colored in red mean an update is available. Furthermore, the output also shows the latest version for each dependency.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

npm CLI は、使用している依存関係の鮮度について、semantic versioning から見たずれの情報を提供できます。`npm outdated` を実行すると、古くなっているパッケージを確認できます。黄色で表示される依存関係は、`package.json` マニフェストで指定された semantic versioning に対応し、赤で表示される依存関係は更新が利用可能であることを意味します。さらに、出力には各依存関係の最新バージョンも表示されます。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### npm doctor command

Between the variety of Node.js package managers and different versions of Node.js you may have installed in your path, how do you verify a healthy npm installation and working environment? Whether you’re working with the npm CLI in a development environment or within a CI, it is important to assess that everything is working as expected.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### npm doctor コマンド

さまざまな Node.js パッケージマネージャや、パス上にインストールされている可能性のある複数バージョンの Node.js がある中で、健全な npm インストールと作業環境をどのように確認すればよいでしょうか。開発環境で npm CLI を使っている場合でも、CI 内で使っている場合でも、すべてが期待どおりに動作していることを評価することが重要です。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Call the doctor! The npm CLI incorporates a health assessment tool to diagnose your environment for a well-working npm interaction. Run `npm doctor` to review your npm setup:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

doctor を呼びましょう。npm CLI には、npm のやり取りが正常に機能する環境かどうかを診断する健全性評価ツールが組み込まれています。npm のセットアップを確認するには `npm doctor` を実行します。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

- Check the official npm registry is reachable, and display the currently configured registry.
- Check that Git is available.
- Review installed npm and Node.js versions.
- Run permission checks on the various folders such as the local and global `node_modules`, and on the folder used for package cache.
- Check the local npm module cache for checksum correctness.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

- 公式 npm レジストリに到達可能か確認し、現在設定されているレジストリを表示します。
- Git が利用可能か確認します。
- インストール済みの npm と Node.js のバージョンを確認します。
- ローカルおよびグローバルの `node_modules`、パッケージキャッシュに使用されるフォルダなど、各種フォルダの権限チェックを実行します。
- ローカル npm モジュールキャッシュのチェックサムが正しいか確認します。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## 5) Audit for vulnerabilities in open source dependencies

The npm ecosystem is the single largest repository of application libraries amongst all the other language ecosystems. The registry and the libraries in it are at the core for JavaScript developers as they are able to leverage work that others have already built and incorporate it into their codebase. With that said, the increasing adoption of open source libraries in applications brings with it an increased risk of introducing security vulnerabilities.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## 5) オープンソース依存関係の脆弱性を監査する

npm エコシステムは、他のすべての言語エコシステムの中でも最大のアプリケーションライブラリリポジトリです。レジストリとその中のライブラリは JavaScript 開発者の中核にあり、他者がすでに構築した成果を活用して自分たちのコードベースに取り込めます。一方で、アプリケーションでのオープンソースライブラリ採用が増えるにつれて、セキュリティ脆弱性を持ち込むリスクも増加します。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Many popular npm packages have been found to be vulnerable and may carry a significant risk without proper security auditing of your project’s dependencies. Some examples are npm [request](https://snyk.io/vuln/npm:request:20160119), [superagent](https://snyk.io/vuln/search?q=superagent&type=npm), [mongoose](https://snyk.io/vuln/search?q=mongoose&type=npm), and even security-related packages like [jsonwebtoken](https://snyk.io/vuln/npm:jsonwebtoken:20150331), and [validator](https://snyk.io/vuln/search?q=validator&type=npm).

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

多くの人気 npm パッケージで脆弱性が見つかっており、プロジェクトの依存関係を適切にセキュリティ監査しなければ大きなリスクを伴う可能性があります。例として npm の [request](https://snyk.io/vuln/npm:request:20160119)、[superagent](https://snyk.io/vuln/search?q=superagent&type=npm)、[mongoose](https://snyk.io/vuln/search?q=mongoose&type=npm)、さらに [jsonwebtoken](https://snyk.io/vuln/npm:jsonwebtoken:20150331) や [validator](https://snyk.io/vuln/search?q=validator&type=npm) のようなセキュリティ関連パッケージさえ挙げられます。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Security doesn’t end by just scanning for security vulnerabilities when installing a package but should also be streamlined with developer workflows to be effectively adopted throughout the entire lifecycle of software development, and monitored continuously when code is deployed:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

セキュリティは、パッケージをインストールするときにセキュリティ脆弱性をスキャンするだけでは終わりません。ソフトウェア開発ライフサイクル全体で効果的に採用されるよう、開発者ワークフローに組み込み、コードがデプロイされた後も継続的に監視する必要があります。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

- Scan for security vulnerabilities in [third-party open source projects](https://owasp.org/www-community/Component_Analysis)
- Monitor snapshots of your project's manifests so you can receive alerts when new CVEs impact them [OWASP Dependency-Track](https://owasp.org/www-project-dependency-track/)

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

- [third-party open source projects](https://owasp.org/www-community/Component_Analysis) のセキュリティ脆弱性をスキャンします。
- 新しい CVE が影響するときにアラートを受け取れるよう、プロジェクトのマニフェストのスナップショットを監視します。[OWASP Dependency-Track](https://owasp.org/www-project-dependency-track/)

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## 6) Artifact governance and supply chain protections

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## 6) アーティファクトガバナンスとサプライチェーン保護

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Use a local npm proxy

The npm registry is the biggest collection of packages that is available for all JavaScript developers and is also the home of most Open Source projects for web developers. But sometimes you might have different needs in terms of security, deployments or performance. When this is true, npm allows you to switch to a different registry:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### ローカル npm プロキシを使用する

npm レジストリは、すべての JavaScript 開発者が利用できる最大のパッケージ集合であり、Web 開発者向けのほとんどのオープンソースプロジェクトの拠点でもあります。しかし、セキュリティ、デプロイ、パフォーマンスの面で別の要件がある場合があります。そのような場合、npm では別のレジストリに切り替えられます。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

When you run `npm install`, it automatically starts a communication with the main registry to resolve all your dependencies; if you wish to use a different registry, that too is pretty straightforward:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

`npm install` を実行すると、すべての依存関係を解決するためにメインレジストリとの通信が自動的に開始されます。別のレジストリを使いたい場合も非常に簡単です。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

- Set `npm set registry` to set up a default registry.
- Use the argument `--registry` for one single registry.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

- `npm set registry` を設定してデフォルトレジストリを設定します。
- 単一のレジストリには `--registry` 引数を使用します。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

[Verdaccio](https://verdaccio.org/) is a simple, lightweight zero-config-required private registry and installing it is as simple as follows: `$ npm install --global verdaccio`.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

[Verdaccio](https://verdaccio.org/) は、シンプルで軽量、設定不要のプライベートレジストリであり、インストールは `$ npm install --global verdaccio` のように簡単です。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Hosting your own registry was never so easy! Let’s check the most important features of this tool:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

自分のレジストリをホストすることが、これほど簡単になったことはありません。このツールの最も重要な機能を確認しましょう。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

- It supports the npm registry format including private package features, scope support, package access control and authenticated users in the web interface.
- It provides capabilities to hook remote registries and the power to route dependencies to different registries and cache their tarballs. To reduce duplicate downloads and save bandwidth in your local development and CI servers, you should proxy all dependencies.
- As an authentication provider it uses htpasswd security by default, but also supports GitLab, Bitbucket, and LDAP. You can also use your own.
- It’s easy to scale using a different storage provider.
- If your project is based in Docker, using the official image is the best choice.
- It enables really fast bootstrap for testing environments, and is handy for testing big mono-repo projects.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

- プライベートパッケージ機能、scope サポート、パッケージアクセス制御、Web インターフェイスでの認証済みユーザーなど、npm レジストリ形式をサポートします。
- リモートレジストリをフックし、依存関係を異なるレジストリへルーティングし、それらの tarball をキャッシュする機能を提供します。ローカル開発サーバーや CI サーバーでの重複ダウンロードを減らし帯域幅を節約するには、すべての依存関係をプロキシすべきです。
- 認証プロバイダとしてデフォルトで htpasswd セキュリティを使用しますが、GitLab、Bitbucket、LDAP もサポートします。独自のものを使用することもできます。
- 別のストレージプロバイダを使用して簡単にスケールできます。
- プロジェクトが Docker ベースの場合、公式イメージの使用が最善の選択です。
- テスト環境の非常に高速な bootstrap を可能にし、大規模な mono-repo プロジェクトのテストにも便利です。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Governance & Verification Steps

Supply-chain attacks increasingly target build artifacts, registries and CI credentials. Add lightweight governance and verification steps to reduce risk and improve response time:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### ガバナンスと検証の手順

サプライチェーン攻撃は、ビルドアーティファクト、レジストリ、CI 認証情報をますます標的にしています。軽量なガバナンスと検証の手順を追加し、リスクを低減し、対応時間を改善してください。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

- Track provenance and produce an SBOM for builds (CycloneDX/SPDX) so you can trace what was built and where inputs originated.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

- 来歴を追跡し、ビルド用の SBOM (CycloneDX/SPDX) を生成して、何がビルドされ、入力がどこから来たのかを追跡できるようにします。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

CycloneDX Example:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

CycloneDX の例:

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```bash
  # Generate SBOM
  npm install @cyclonedx/cyclonedx-npm
  npx @cyclonedx/cyclonedx-npm --validate > sbom.json # Use the flag `--omit dev` to exclude dev dependencies from SBOM if needed
  ```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

- Sign artifacts and build provenance (for example, use Sigstore / cosign or similar signing tools) so consumers can verify integrity before installing.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

- アーティファクトとビルド来歴に署名します。たとえば Sigstore / cosign または同様の署名ツールを使用し、利用者がインストール前に完全性を検証できるようにします。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Sigstore Example:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

Sigstore の例:

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

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

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

- Prefer immutable, access-controlled registries or vetted mirrors (private registries, Verdaccio with an upstream cache, or [approved mirrors](#use-a-local-npm-proxy)) and enable retention / immutability policies where available.
- Restrict, scope and rotate CI and publisher tokens. Bind publisher tokens to workflows or IP ranges and minimize privileges.
- Verify packages during CI: check signatures or provenance, validate the SBOM, [run SCA and static analysis](#5-audit-for-vulnerabilities-in-open-source-dependencies), and [install from pinned lockfile resolutions](#2-enforce-the-lockfile).
- Automate monitoring and alerts for unusual publishes, token usage or dependency changes and keep a documented remediation playbook (revoke tokens, deprecate/yank compromised packages, publish fixes and notify consumers).

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

- 不変でアクセス制御されたレジストリ、または精査済みミラーを優先します。例として、プライベートレジストリ、上流キャッシュ付き Verdaccio、または [approved mirrors](#ローカル-npm-プロキシを使用する) があり、利用可能な場合は保持ポリシーや不変性ポリシーを有効にします。
- CI トークンと公開者トークンを制限、scope 化、ローテーションします。公開者トークンをワークフローまたは IP 範囲に結び付け、権限を最小化します。
- CI 中にパッケージを検証します。署名または来歴を確認し、SBOM を検証し、[SCA と静的解析を実行](#5-オープンソース依存関係の脆弱性を監査する)し、[固定されたロックファイル解決からインストール](#2-ロックファイルを強制する)します。
- 異常な公開、トークン使用、依存関係変更の監視とアラートを自動化し、文書化された修復 playbook を維持します。これには、トークンの取り消し、侵害されたパッケージの非推奨化/削除、修正版の公開、利用者への通知が含まれます。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

These measures are incremental and low-risk to adopt. Combined they make supply-chain attacks harder and speed up identification and recovery if a compromise occurs.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

これらの対策は段階的で導入リスクが低いものです。組み合わせることで、サプライチェーン攻撃を困難にし、侵害が発生した場合の識別と復旧を迅速化します。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## 7) Responsibly disclose security vulnerabilities

When security vulnerabilities are found, they pose a potentially serious threat if they are publicised without prior warning or appropriate remedial action for users who cannot protect themselves.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## 7) セキュリティ脆弱性を責任を持って開示する

セキュリティ脆弱性が見つかった場合、事前の警告や、自力で防御できない利用者のための適切な是正措置なしに公表されると、潜在的に深刻な脅威になります。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

It is recommended that security researchers follow a responsible disclosure program, which is a set of processes and guidelines that aims to connect the researchers with the vendor or maintainer of the vulnerable asset, in order to convey the vulnerability, its impact and applicability. Once the vulnerability is correctly triaged, the vendor and researcher coordinate a fix and a publication date for the vulnerability in an effort to provide an upgrade-path or remediation for affected users before the security issue is made public.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

セキュリティ研究者には、責任ある開示プログラムに従うことが推奨されます。これは、脆弱な資産のベンダーまたはメンテナと研究者を結び付け、脆弱性、その影響、適用可能性を伝えることを目的としたプロセスとガイドラインの集合です。脆弱性が正しくトリアージされると、ベンダーと研究者は修正と公開日を調整し、セキュリティ問題が公になる前に、影響を受ける利用者へアップグレードパスまたは修復策を提供できるようにします。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## 8) Enable 2FA

Enabling two-factor authentication (2FA) is a critical npm security best practice. The npm registry supports two modes for enabling 2FA in a user’s account:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## 8) 2FA を有効化する

二要素認証 (2FA) の有効化は、重要な npm セキュリティベストプラクティスです。npm レジストリは、ユーザーアカウントで 2FA を有効化するために二つのモードをサポートしています。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

- Authorization-only—when a user logs in to npm via the website or the CLI, or performs other sets of actions such as changing profile information.
- Authorization and write-mode—profile and log-in actions, as well as write actions such as managing tokens and packages, and minor support for team and package visibility information.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

- Authorization-only - ユーザーが Web サイトまたは CLI 経由で npm にログインするとき、またはプロフィール情報の変更などその他の一連の操作を行うとき。
- Authorization and write-mode - プロフィールとログイン操作に加え、トークンやパッケージの管理などの書き込み操作、およびチームやパッケージ可視性情報への限定的なサポート。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

To get started, see the official documentation: [Requiring 2FA](https://docs.npmjs.com/requiring-2fa-for-package-publishing-and-settings-modification).

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

開始するには、公式ドキュメント [Requiring 2FA](https://docs.npmjs.com/requiring-2fa-for-package-publishing-and-settings-modification) を参照してください。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Equip yourself with an authentication application, such as Google Authenticator, which you can install on a mobile device, and you’re ready to get started. One easy way to get started with the 2FA extended protection for your account is through npm’s user interface, which allows enabling it very easily. If you’re a command-line person, it’s also easy to enable 2FA when using a supported npm client version (>=5.5.1):

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

Google Authenticator のような認証アプリケーションを用意し、モバイルデバイスにインストールすれば準備は整います。アカウントに対する 2FA の拡張保護を始める簡単な方法の一つは npm のユーザーインターフェイスを使用することで、非常に簡単に有効化できます。コマンドライン派の場合も、サポートされている npm クライアントバージョン (>=5.5.1) を使用していれば 2FA を簡単に有効化できます。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```sh
npm profile enable-2fa auth-and-writes
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Follow the command-line instructions to enable 2FA, and to save emergency authentication codes. If you wish to enable 2FA mode for login and profile changes only, you may replace the `auth-and-writes` with `auth-only` in the code as it appears above.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

コマンドラインの指示に従って 2FA を有効化し、緊急用認証コードを保存してください。ログインとプロフィール変更のみの 2FA モードを有効化したい場合は、上記コードの `auth-and-writes` を `auth-only` に置き換えます。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## Additional Security Resources

- [About secret scanning](https://docs.github.com/en/code-security/secret-scanning/introduction/about-secret-scanning)
- [Best practices for securing accounts](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure)

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## Additional Security Resources

- [About secret scanning](https://docs.github.com/en/code-security/secret-scanning/introduction/about-secret-scanning)
- [Best practices for securing accounts](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure)

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## 9) Use npm author tokens

Every time you log in with the npm CLI, a token is generated for your user and authenticates you to the npm registry. Tokens make it easy to perform npm registry-related actions during CI and automated procedures, such as accessing private modules on the registry or publishing new versions from a build step.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## 9) npm author tokens を使用する

npm CLI でログインするたびに、ユーザー用のトークンが生成され、npm レジストリに対する認証に使用されます。トークンにより、CI や自動化手順の中で npm レジストリ関連の操作を簡単に実行できます。たとえば、レジストリ上のプライベートモジュールへのアクセスや、ビルドステップからの新しいバージョン公開などです。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Tokens can be managed through the npm registry website, as well as using the npm command-line client. An example of using the CLI to create a read-only token that is restricted to a specific IPv4 address range is as follows:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

トークンは npm レジストリの Web サイトでも、npm コマンドラインクライアントでも管理できます。CLI を使用して、特定の IPv4 アドレス範囲に制限された読み取り専用トークンを作成する例は次のとおりです。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```sh
npm token create --read-only --cidr=192.0.2.0/24
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

To verify which tokens are created for your user or to revoke tokens in cases of emergency, you can use `npm token list` or `npm token revoke` respectively.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

ユーザーに作成されているトークンを確認する場合や、緊急時にトークンを取り消す場合は、それぞれ `npm token list` または `npm token revoke` を使用できます。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Ensure you are following this npm security best practice by protecting and minimizing the exposure of your npm tokens.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

npm トークンを保護し、その露出を最小化することで、この npm セキュリティベストプラクティスに従ってください。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## 10) Understanding typosquatting and slopsquatting attacks

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## 10) typosquatting と slopsquatting 攻撃を理解する

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Typosquatting attacks

Typosquatting is an attack that relies on mistakes made by users, such as typos. With typosquatting, bad actors publish malicious modules to the npm registry with names that look much like existing popular modules. These malicious packages exploit common typing errors or visual similarities to trick developers into installing them instead of the legitimate packages they intended to use.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### Typosquatting 攻撃

Typosquatting は、タイプミスなどユーザーの誤りに依存する攻撃です。typosquatting では、悪意のある者が、既存の人気モジュールによく似た名前の悪意あるモジュールを npm レジストリに公開します。これらの悪意あるパッケージは、一般的な入力ミスや視覚的な類似性を悪用し、開発者が意図した正規パッケージの代わりにそれらをインストールするよう誘導します。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

The Snyk security team has tracked tens of malicious packages in the npm ecosystem that used typosquatting to trick users into installing them; similar attacks have been observed on the PyPi Python registry as well. Some of the most notable incidents include [cross-env](https://snyk.io/vuln/npm:crossenv:20170802), [event-stream](https://snyk.io/vuln/SNYK-JS-EVENTSTREAM-72638), and [eslint-scope](https://snyk.io/vuln/npm:eslint-scope:20180712).

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

Snyk セキュリティチームは、npm エコシステム内で typosquatting を使ってユーザーをだましてインストールさせる悪意あるパッケージを数十個追跡しています。同様の攻撃は PyPi Python レジストリでも観測されています。特に注目すべきインシデントには、[cross-env](https://snyk.io/vuln/npm:crossenv:20170802)、[event-stream](https://snyk.io/vuln/SNYK-JS-EVENTSTREAM-72638)、[eslint-scope](https://snyk.io/vuln/npm:eslint-scope:20180712) があります。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

One of the main targets for typosquatting attacks are user credentials, since any package has access to environment variables via the global variable `process.env`. Other examples include the event-stream case, where attackers targeted developers in the hopes of [injecting malicious code](https://snyk.io/blog/a-post-mortem-of-the-malicious-event-stream-backdoor) into an application's source code.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

typosquatting 攻撃の主な標的の一つはユーザー認証情報です。どのパッケージもグローバル変数 `process.env` を通じて環境変数へアクセスできるためです。他の例として event-stream の事例があり、攻撃者はアプリケーションのソースコードに[悪意あるコードを注入](https://snyk.io/blog/a-post-mortem-of-the-malicious-event-stream-backdoor)することを期待して開発者を標的にしました。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Slopsquatting attacks

Slopsquatting is a newer attack vector that exploits AI coding assistants. When developers ask AI tools like ChatGPT or GitHub Copilot to suggest packages, these models may hallucinate package names that do not actually exist. Attackers monitor these hallucinations and publish malicious packages with those exact names, knowing developers may blindly trust and install AI-suggested packages.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### Slopsquatting 攻撃

Slopsquatting は、AI コーディングアシスタントを悪用する比較的新しい攻撃ベクトルです。開発者が ChatGPT や GitHub Copilot のような AI ツールにパッケージを提案させると、これらのモデルは実際には存在しないパッケージ名を幻覚として生成することがあります。攻撃者はこれらの幻覚を監視し、開発者が AI によって提案されたパッケージを盲目的に信頼してインストールする可能性があることを知ったうえで、その正確な名前の悪意あるパッケージを公開します。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Unlike typosquatting which exploits human typing errors, slopsquatting exploits AI's tendency to generate plausible-looking but non-existent package names — making it harder to detect since the suggested name looks completely legitimate.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

人間のタイプミスを悪用する typosquatting とは異なり、slopsquatting は、もっともらしく見えるが存在しないパッケージ名を生成しがちな AI の傾向を悪用します。提案された名前が完全に正当に見えるため、検出がより困難になります。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

For example, an AI assistant might suggest `node-fetch-promise` instead of the real package `node-fetch`. If an attacker has already published a malicious package under that hallucinated name, installing it compromises your system silently.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

たとえば、AI アシスタントが実際のパッケージ `node-fetch` の代わりに `node-fetch-promise` を提案するかもしれません。攻撃者がその幻覚名で悪意あるパッケージをすでに公開していた場合、それをインストールするとシステムは静かに侵害されます。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

To protect against slopsquatting:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

slopsquatting から保護するには、次を行います。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

- Run `npm view <package-name>` before installing any AI-suggested package to confirm it exists.
- Check the package download count — legitimate packages have thousands or millions of downloads while newly published malicious ones have very few.
- Verify the package has a real GitHub repository with genuine code, commits and contributors.
- Be suspicious of packages created very recently with no release history.
- Never blindly run `npm install` on packages suggested by AI tools without independent verification.
- In team environments, add `npm view <package-name>` as a CI check for any new AI-suggested dependencies before they reach production.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

- AI が提案したパッケージをインストールする前に、`npm view <package-name>` を実行して存在を確認します。
- パッケージのダウンロード数を確認します。正規パッケージは数千から数百万のダウンロードがありますが、新しく公開された悪意あるパッケージは非常に少数です。
- そのパッケージに、本物のコード、コミット、コントリビューターを持つ実際の GitHub リポジトリがあることを確認します。
- ごく最近作成され、リリース履歴のないパッケージを疑います。
- 独立した検証なしに、AI ツールが提案したパッケージに対して `npm install` を盲目的に実行してはいけません。
- チーム環境では、新しい AI 提案依存関係が本番に到達する前に、`npm view <package-name>` を CI チェックとして追加します。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## 11) Use trusted publishers for secure package publishing

Traditional npm publishing relies on long-lived tokens that can be compromised or accidentally exposed. Trusted publishing with OpenID Connect (OIDC) provides a more secure alternative by using short-lived, workflow-specific credentials that are automatically generated during CI/CD processes. Trusted publishing currently supports GitHub Actions and GitLab CI/CD Pipelines.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## 11) 安全なパッケージ公開のため trusted publishers を使用する

従来の npm 公開は、侵害されたり誤って露出したりする可能性のある長寿命トークンに依存しています。OpenID Connect (OIDC) を使用した trusted publishing は、CI/CD プロセス中に自動生成される短寿命でワークフロー固有の認証情報を使うことで、より安全な代替手段を提供します。trusted publishing は現在、GitHub Actions と GitLab CI/CD Pipelines をサポートしています。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### How trusted publishing works

Trusted publishing creates a trust relationship between npm and your CI/CD provider using OIDC. When you configure a trusted publisher for your package, npm will accept publishes from the specific workflow you've authorized, in addition to traditional authentication methods like npm tokens and manual publishes. The npm CLI automatically detects OIDC environments and uses them for authentication before falling back to traditional tokens.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### trusted publishing の仕組み

trusted publishing は、OIDC を使用して npm と CI/CD プロバイダの間に信頼関係を作成します。パッケージに trusted publisher を設定すると、npm は npm トークンや手動公開のような従来の認証方法に加えて、承認した特定のワークフローからの公開を受け入れます。npm CLI は OIDC 環境を自動的に検出し、従来のトークンへフォールバックする前に、それらを認証に使用します。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

This approach eliminates the security risks associated with long-lived write tokens, which can be compromised, accidentally exposed in logs, or require manual rotation. Instead, each publish uses short-lived, cryptographically-signed tokens that are specific to your workflow and cannot be extracted or reused.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

このアプローチにより、侵害、ログへの誤露出、手動ローテーションが必要になるといった、長寿命の書き込みトークンに関連するセキュリティリスクを排除できます。代わりに、各公開では、ワークフローに固有で抽出や再利用ができない、短寿命で暗号学的に署名されたトークンが使用されます。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Automatic provenance generation

When publishing via trusted publishing, npm automatically generates provenance attestations that provide cryptographic proof of package authenticity. This helps users verify that packages come from legitimate sources and haven't been tampered with.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### 自動 provenance 生成

trusted publishing 経由で公開すると、npm はパッケージ真正性の暗号学的証明を提供する provenance attestations を自動生成します。これにより、利用者はパッケージが正当なソースから来ており、改ざんされていないことを検証しやすくなります。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

For more information, see the [npm trusted publishing documentation](https://docs.npmjs.com/trusted-publishers).

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

詳細は [npm trusted publishing documentation](https://docs.npmjs.com/trusted-publishers) を参照してください。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## 12) Prevent dependency confusion attacks

A dependency confusion attack occurs when an attacker publishes a malicious package on the public npm registry using the same name as your internal private package, but with a higher version number. When you run `npm install`, npm may resolve the public malicious package instead of your internal one because of the higher version.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## 12) dependency confusion 攻撃を防ぐ

dependency confusion 攻撃は、攻撃者が内部プライベートパッケージと同じ名前の悪意あるパッケージを、より高いバージョン番号で公開 npm レジストリに公開することで発生します。`npm install` を実行すると、npm はバージョンが高いため、内部パッケージの代わりに公開された悪意あるパッケージを解決する可能性があります。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Attackers typically discover internal package names through:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

攻撃者は通常、次のような経路で内部パッケージ名を発見します。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

- Leaked `package.json` files accidentally pushed to public GitHub repositories
- Job postings that mention internal tools or package names
- Error messages or stack traces that reveal internal dependency names

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

- 公開 GitHub リポジトリへ誤ってプッシュされた `package.json` ファイル
- 内部ツールやパッケージ名に言及している求人情報
- 内部依存関係名を明らかにするエラーメッセージやスタックトレース

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

To protect against dependency confusion:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

dependency confusion から保護するには、次を行います。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

- Always use **scoped package names** for internal packages (e.g., `@yourorg/package-name` instead of `package-name`)
- Configure your `.npmrc` to explicitly point scoped packages to your private registry by setting `@yourorg:registry=https://your-private-registry.example.com`
- Reserve your internal package names on the public npm registry by publishing an empty placeholder to prevent attackers from claiming them.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

- 内部パッケージには常に **scoped package names** を使用します。例: `package-name` ではなく `@yourorg/package-name`
- scoped package がプライベートレジストリを明示的に指すように、`.npmrc` で `@yourorg:registry=https://your-private-registry.example.com` を設定します。
- 攻撃者に取得されるのを防ぐため、空の placeholder を公開して、公開 npm レジストリ上で内部パッケージ名を予約します。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## 13) Verify documentation examples before copying into production

Library README files and official examples are often copied directly into production code. While the libraries themselves may use secure defaults internally, their documentation examples sometimes demonstrate insecure patterns that undermine those very defaults. This creates a "documentation attack surface" — a class of vulnerability where the security risk comes not from the library's code, but from how its documentation teaches developers to use it.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## 13) 本番にコピーする前にドキュメント例を検証する

ライブラリの README ファイルや公式例は、本番コードへ直接コピーされることがよくあります。ライブラリ自体は内部で安全なデフォルトを使用していても、そのドキュメント例が、そのデフォルトを損なう安全でないパターンを示していることがあります。これにより「documentation attack surface」が生まれます。これは、セキュリティリスクがライブラリのコードではなく、そのドキュメントが開発者に使い方を教える方法から生じる脆弱性の一種です。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### The pattern

A library implements strong security internally but its README examples use weaker configurations for brevity or backward compatibility. Developers copy these examples verbatim, unknowingly introducing vulnerabilities that the library was designed to prevent. Unlike supply chain attacks, these vulnerabilities pass every audit tool because the library code itself is safe — only the copy-pasted usage pattern is insecure.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### パターン

ライブラリは内部で強固なセキュリティを実装している一方で、README の例では簡潔さや後方互換性のために弱い設定を使っています。開発者はこれらの例をそのままコピーし、ライブラリが防ぐよう設計されていた脆弱性を知らずに導入してしまいます。サプライチェーン攻撃とは異なり、ライブラリコード自体は安全であるため、これらの脆弱性はすべての監査ツールを通過します。安全でないのはコピー&ペーストされた使用パターンだけです。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Real-world examples

This pattern has been documented across popular npm packages with combined weekly downloads exceeding 195 million:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### 実例

このパターンは、週次ダウンロード数の合計が 1 億 9500 万を超える人気 npm パッケージ群で文書化されています。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

- **Weak key derivation**: A widely-used encryption library's README examples derive AES keys from passphrases using MD5 with a single iteration (EVP_BytesToKey), allowing a GPU to test billions of candidate passphrases per second. The library's own PBKDF2 module uses stronger defaults, but the prominent AES examples do not use it.
- **Credential exposure on redirect**: An HTTP client library's README demonstrates a `beforeRedirect` callback that re-injects authorization headers after the library has already stripped them during protocol downgrades (HTTPS to HTTP), effectively bypassing the library's own security mechanism.
- **Regex anchoring**: Libraries that accept regex patterns for validation (e.g., JWT audience matching, CORS origin matching) show examples with unanchored patterns like `/example\\.com/`, which match `malicious-example.com`. The fix is `^https:\\/\\/example\\.com$`, but the documentation doesn't demonstrate anchoring.
- **Insecure randomness**: A file upload library's README generates filenames with `Math.random()` while the library's own default uses `crypto.randomBytes(16)`. Developers who customize the filename — following the README example — downgrade from cryptographic to predictable randomness.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

- **弱い鍵導出**: 広く使われている暗号化ライブラリの README 例では、MD5 と 1 回の反復 (EVP_BytesToKey) を使用してパスフレーズから AES 鍵を導出しており、GPU が 1 秒あたり数十億の候補パスフレーズを試せるようになります。ライブラリ自身の PBKDF2 モジュールはより強いデフォルトを使用していますが、目立つ AES 例ではそれを使用していません。
- **リダイレクト時の認証情報露出**: ある HTTP クライアントライブラリの README は、プロトコルダウングレード (HTTPS から HTTP) 中にライブラリがすでに削除した authorization ヘッダーを、`beforeRedirect` コールバックで再注入する例を示しています。これは実質的にライブラリ自身のセキュリティ機構を迂回します。
- **Regex anchoring**: 検証用の regex パターンを受け取るライブラリ (JWT audience matching、CORS origin matching など) が、`/example\\.com/` のような anchor されていないパターンを例として示すことがあります。これは `malicious-example.com` にも一致します。修正は `^https:\\/\\/example\\.com$` ですが、ドキュメントは anchoring を示していません。
- **安全でないランダム性**: ファイルアップロードライブラリの README が `Math.random()` でファイル名を生成している一方で、ライブラリ自身のデフォルトは `crypto.randomBytes(16)` を使用しています。README 例に従ってファイル名をカスタマイズした開発者は、暗号学的なランダム性から予測可能なランダム性へダウングレードしてしまいます。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### How to protect yourself

- **Never copy README examples into production without a security review.** Treat documentation code the same way you treat code from Stack Overflow — as a starting point, not a production-ready solution.
- **Check for secure defaults in the library's source code.** If the library internally uses `crypto.randomBytes()`, `PBKDF2`, or anchored regex patterns, but the README example uses `Math.random()`, `MD5`, or unanchored patterns, prefer the library's internal approach.
- **Validate security-sensitive parameters.** When a library accepts patterns, keys, or credentials as input, verify that your usage matches security best practices for that parameter type (anchored regex, authenticated encryption, HTTPS-only credentials).
- **Report insecure documentation.** If you find a README example that teaches an insecure pattern, file an issue with the maintainer. Documentation vulnerabilities affect every developer who copies the example.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### 自分を守る方法

- **セキュリティレビューなしに README 例を本番へコピーしてはいけません。** ドキュメントコードは Stack Overflow のコードと同じように扱い、本番対応済みの解決策ではなく出発点とみなしてください。
- **ライブラリのソースコードで安全なデフォルトを確認してください。** ライブラリ内部では `crypto.randomBytes()`、`PBKDF2`、anchor された regex パターンを使用しているのに、README 例が `Math.random()`、`MD5`、anchor されていないパターンを使用している場合は、ライブラリ内部のアプローチを優先してください。
- **セキュリティに敏感なパラメータを検証してください。** ライブラリがパターン、鍵、認証情報を入力として受け取る場合、使用方法がそのパラメータタイプのセキュリティベストプラクティス (anchor された regex、認証付き暗号、HTTPS のみの認証情報) に合っていることを確認します。
- **安全でないドキュメントを報告してください。** README 例が安全でないパターンを教えていることを見つけたら、メンテナに issue を提出してください。ドキュメント脆弱性は、その例をコピーするすべての開発者に影響します。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

For more context on this pattern, see the discussion at the [Node.js Security Working Group](https://github.com/nodejs/security-wg/issues/1560).

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

このパターンの詳細な背景は、[Node.js Security Working Group](https://github.com/nodejs/security-wg/issues/1560) の議論を参照してください。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## Final Recommendations

Closing our list of npm security best practices are the following tips to reduce the risk of such attacks:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## 最終推奨事項

npm セキュリティベストプラクティスの一覧の締めくくりとして、このような攻撃のリスクを低減するためのヒントを示します。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

- Be extra-careful when copy-pasting package installation instructions into the terminal. Make sure to verify in the source code repository as well as on the npm registry that this is indeed the package you are intending to install. You might verify the metadata of the package with `npm info` to fetch more information about contributors and latest versions.
- Default to having an npm logged-out user in your daily work routines so your credentials won’t be the weak spot that would lead to easily compromising your account.
- When installing packages, append the `--ignore-scripts` to reduce the risk of arbitrary command execution. For example: `npm install my-malicious-package --ignore-scripts`

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

- パッケージインストール手順をターミナルへコピー&ペーストするときは、特に慎重にしてください。ソースコードリポジトリと npm レジストリの両方で、それが本当にインストールしようとしているパッケージであることを必ず確認します。`npm info` でパッケージのメタデータを確認し、コントリビューターや最新バージョンについて追加情報を取得できます。
- 日常作業では npm からログアウトしたユーザーをデフォルトにし、認証情報がアカウントを簡単に侵害する弱点にならないようにします。
- パッケージをインストールするときは、任意コマンド実行のリスクを減らすために `--ignore-scripts` を追加します。例: `npm install my-malicious-package --ignore-scripts`

</div>
</div>

</section>
</div>



## Attribution

<div className="attributionFooter">

- Original: NPM Security Cheat Sheet
- Source: https://cheatsheetseries.owasp.org/cheatsheets/NPM_Security_Cheat_Sheet.html
- Copyright: Cheat Sheets Series Team
- License: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
- License URL: https://creativecommons.org/licenses/by-sa/4.0/
- Changes: English original retained for comparison. Japanese translation added. Bilingual display generated from official source and local Japanese translation.
- Retrieved: 2026-05-20

</div>
