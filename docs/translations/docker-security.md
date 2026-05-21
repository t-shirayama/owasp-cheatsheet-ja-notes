# Docker セキュリティチートシート 日本語訳

## Attribution

- Original: Docker Security Cheat Sheet
- Source: https://cheatsheetseries.owasp.org/cheatsheets/Docker_Security_Cheat_Sheet.html
- Copyright: Cheat Sheets Series Team
- License: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
- License URL: https://creativecommons.org/licenses/by-sa/4.0/
- Changes: Japanese translation added.
- Retrieved: 2026-05-21

## 日本語訳

# Docker セキュリティチートシート

## はじめに

Docker は最も普及しているコンテナ化技術です。正しく使用すれば、ホストシステム上でアプリケーションを直接実行する場合と比べてセキュリティを高められます。しかし、特定の設定ミスはセキュリティレベルを下げたり、新しい脆弱性を持ち込んだりする可能性があります。

このチートシートの目的は、Docker コンテナの保護を支援するために、一般的なセキュリティ上の誤りとベストプラクティスを簡潔な一覧として提供することです。

## ルール

### ルール #0 - ホストと Docker を最新の状態に保つ

攻撃者がホストの root アクセスを得る結果になりやすい [Leaky Vessels](https://snyk.io/blog/cve-2024-21626-runc-process-cwd-container-breakout/) のような既知のコンテナエスケープ脆弱性から保護するには、ホストと Docker の両方を最新の状態に保つことが重要です。これには、ホストカーネルと Docker Engine を定期的に更新することが含まれます。

これは、コンテナがホストのカーネルを共有しているためです。ホストのカーネルに脆弱性がある場合、コンテナも脆弱になります。たとえば、カーネル権限昇格エクスプロイトである [Dirty COW](https://github.com/scumjr/dirtycow-vdso) は、十分に隔離されたコンテナ内で実行されても、脆弱なホストでは root アクセスにつながります。

### ルール #1 - Docker デーモンソケットを公開しない (コンテナに対しても公開しない)

Docker ソケット _/var/run/docker.sock_ は、Docker が待ち受けている UNIX ソケットです。これは Docker API の主要な入口です。このソケットの所有者は root です。誰かにこのソケットへのアクセスを与えることは、ホストへの無制限の root アクセスを与えることと同等です。

**_tcp_ Docker デーモンソケットを有効にしないでください。** Docker デーモンを `-H tcp://0.0.0.0:XXX` または類似の指定で実行している場合、Docker デーモンへの暗号化も認証もない直接アクセスを公開しています。ホストがインターネットに接続されている場合、あなたのコンピューター上の Docker デーモンをパブリックインターネット上の誰でも使用できることを意味します。
本当に、**本当に**そうしなければならない場合は、保護すべきです。その方法については [Docker 公式ドキュメント](https://docs.docker.com/engine/reference/commandline/dockerd/#daemon-socket-option) を確認してください。

**_/var/run/docker.sock_ を他のコンテナに公開しないでください**。Docker イメージを `-v /var/run/docker.sock://var/run/docker.sock` または類似の指定で実行している場合は、変更すべきです。ソケットを読み取り専用でマウントすることは解決策ではなく、悪用を少し難しくするだけであることを覚えておいてください。docker compose ファイルでの同等の設定は、次のようなものです。

```yaml
volumes:
  - "/var/run/docker.sock:/var/run/docker.sock"
```bash

### ルール #2 - ユーザーを設定する

コンテナが非特権ユーザーを使用するように設定することは、権限昇格攻撃を防ぐ最善の方法です。これは次の三つの方法で実現できます。

1. 実行時に `docker run` コマンドの `-u` オプションを使用します。例:

```bash
docker run -u 4000 alpine
```text

2. ビルド時に行います。Dockerfile にユーザーを追加し、それを使用します。例:

```docker
FROM alpine
RUN groupadd -r myuser && useradd -r -g myuser myuser
#    <HERE DO WHAT YOU HAVE TO DO AS A ROOT USER LIKE INSTALLING PACKAGES ETC.>
USER myuser
```text

3. [Docker デーモン](https://docs.docker.com/engine/security/userns-remap/#enable-userns-remap-on-the-daemon)でユーザー名前空間サポート (`--userns-remap=default`) を有効にします。

このトピックの詳細は [Docker 公式ドキュメント](https://docs.docker.com/engine/security/userns-remap/)で確認できます。追加のセキュリティとして、[ルール #11](#ルール-11---rootless-モードで-docker-を実行する)で説明する rootless モードで実行することもできます。

Kubernetes では、[Security Context](https://kubernetes.io/docs/tasks/configure-pod-container/security-context/) の `runAsUser` フィールドにユーザー ID を指定して設定できます。例:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: example
spec:
  containers:
    - name: example
      image: gcr.io/google-samples/node-hello:1.0
      securityContext:
        runAsUser: 4000 # <-- This is the pod user ID
```bash

Kubernetes クラスター管理者は、組み込みの [Pod Security admission controller](https://kubernetes.io/docs/concepts/security/pod-security-admission/) と [`Restricted` レベル](https://kubernetes.io/docs/concepts/security/pod-security-standards/#restricted)を使用して堅牢化されたデフォルトを設定できます。より細かなカスタマイズが必要な場合は、[Admission Webhooks](https://kubernetes.io/docs/reference/access-authn-authz/extensible-admission-controllers/#what-are-admission-webhooks) または [サードパーティの代替手段](https://kubernetes.io/docs/concepts/security/pod-security-standards/#alternatives)の使用を検討してください。

### ルール #3 - ケイパビリティを制限する (コンテナに必要な特定のケイパビリティのみを付与する)

[Linux カーネルケイパビリティ](http://man7.org/linux/man-pages/man7/capabilities.7.html)は、特権で使用できる権限の集合です。Docker はデフォルトで、ケイパビリティのサブセットのみを持って実行されます。
`--cap-drop` を使用して一部のケイパビリティを削除し Docker コンテナを堅牢化したり、必要に応じて `--cap-add` を使用してケイパビリティを追加したりできます。
コンテナを `--privileged` フラグ付きで実行しないことを覚えておいてください。このフラグはすべての Linux カーネルケイパビリティをコンテナに追加します。

最も安全な設定は、`--cap-drop all` ですべてのケイパビリティを削除し、必要なものだけを追加することです。例:

```bash
docker run --cap-drop all --cap-add CHOWN alpine
```text

**そして忘れないでください: _--privileged_ フラグ付きでコンテナを実行しないでください!!!**

Kubernetes では、[Security Context](https://kubernetes.io/docs/tasks/configure-pod-container/security-context/) の `capabilities` フィールドを使用して設定できます。例:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: example
spec:
  containers:
    - name: example
      image: gcr.io/google-samples/node-hello:1.0
      securityContext:
        capabilities:
          drop:
            - ALL
          add: ["CHOWN"]
```text

Kubernetes クラスター管理者は、組み込みの [Pod Security admission controller](https://kubernetes.io/docs/concepts/security/pod-security-admission/) と [`Restricted` レベル](https://kubernetes.io/docs/concepts/security/pod-security-standards/#restricted)を使用して堅牢化されたデフォルトを設定できます。より細かなカスタマイズが必要な場合は、[Admission Webhooks](https://kubernetes.io/docs/reference/access-authn-authz/extensible-admission-controllers/#what-are-admission-webhooks) または [サードパーティの代替手段](https://kubernetes.io/docs/concepts/security/pod-security-standards/#alternatives)の使用を検討してください。

### ルール #4 - コンテナ内の権限昇格を防ぐ

権限昇格を防ぐため、Docker イメージは常に `--security-opt=no-new-privileges` を付けて実行してください。これにより、コンテナが `setuid` または `setgid` バイナリを通じて新しい権限を得ることを防止できます。

Kubernetes では、[Security Context](https://kubernetes.io/docs/tasks/configure-pod-container/security-context/) の `allowPrivilegeEscalation` フィールドを使用して設定できます。例:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: example
spec:
  containers:
    - name: example
      image: gcr.io/google-samples/node-hello:1.0
      securityContext:
        allowPrivilegeEscalation: false
```bash

Kubernetes クラスター管理者は、組み込みの [Pod Security admission controller](https://kubernetes.io/docs/concepts/security/pod-security-admission/) と [`Restricted` レベル](https://kubernetes.io/docs/concepts/security/pod-security-standards/#restricted)を使用して堅牢化されたデフォルトを設定できます。より細かなカスタマイズが必要な場合は、[Admission Webhooks](https://kubernetes.io/docs/reference/access-authn-authz/extensible-admission-controllers/#what-are-admission-webhooks) または [サードパーティの代替手段](https://kubernetes.io/docs/concepts/security/pod-security-standards/#alternatives)の使用を検討してください。

### ルール #5 - コンテナ間接続に注意する

コンテナ間接続 (Inter-Container Connectivity: icc) はデフォルトで有効であり、すべてのコンテナが [`docker0` ブリッジネットワーク](https://docs.docker.com/network/drivers/bridge/)を通じて相互に通信できます。コンテナ間通信を完全に無効化する Docker デーモンの `--icc=false` フラグを使う代わりに、具体的なネットワーク構成を定義することを検討してください。これは、カスタム Docker ネットワークを作成し、どのコンテナをそこに接続するかを指定することで実現できます。この方法は、コンテナ通信をよりきめ細かく制御できます。

コンテナ通信のために Docker ネットワークを設定する詳細なガイダンスについては、[Docker Documentation](https://docs.docker.com/network/#communication-between-containers) を参照してください。

Kubernetes 環境では、[Network Policies](https://kubernetes.io/docs/concepts/services-networking/network-policies/) を使用してクラスター内の Pod 間通信を規制するルールを定義できます。これらのポリシーは、Pod 同士および他のネットワークエンドポイントとの通信方法を制御するための堅牢なフレームワークを提供します。さらに、[Network Policy Editor](https://networkpolicy.io/) は、複雑なネットワークルールをユーザーフレンドリーなインターフェースで定義できるようにし、ネットワークポリシーの作成と管理を簡素化します。

### ルール #5a - UFW のようなファイアウォールを使用している場合、コンテナポートをホストへマッピングするときは注意する

[UFW (Uncomplicated Firewall)](https://help.ubuntu.com/community/UFW) は Linux でよく使われるホストベースのファイアウォールです。よくある誤解は、ファイアウォールルールが Docker コンテナ宛てのトラフィックを含むすべての受信トラフィックを保護する、というものです。しかし、**Docker は独自の `iptables` および `nftables` ルールを直接管理し、UFW を完全に迂回します**。`iptables` または `nftables` を使用する他のツールも、UFW と同様の競合を起こす可能性がある点に注意してください。他のファイアウォールツールを使用している場合は、それらが正しく機能しているか確認すべきです。

`-p 8000:8000` でポートを公開すると、Docker はそのポートを**すべてのインターフェースとすべての送信元アドレス**に開放する `iptables` ルールを挿入します。これらのルールは通常、明示的なファイアウォールの `DENY` ルールが適用される前に受け入れられます。その結果、設定した `DENY` ルールにかかわらずトラフィックが許可され、コンテナサービスが意図せずパブリックインターネットへ公開される可能性があります。

#### 推奨される緩和策

**オプション 1 - 公開ポートを localhost のみにバインドする:**

ポートマッピングのホスト側を `127.0.0.1` にバインドし、外部ネットワークからではなくローカルからのみサービスへ到達できるようにします。

```bash
# Vulnerable: exposes port on all interfaces
docker run -p 8000:8000 myimage

# Safe: binds only to localhost
docker run -p 127.0.0.1:8000:8000 myimage
```text

Docker Compose ファイルでは次のようにします。

```yaml
services:
  web:
    image: myimage
    ports:
      - "127.0.0.1:8000:8000"  # safe — localhost only
```text

**オプション 2 - `ufw-docker` (または同等のもの) を使用して Docker ネットワーク上でファイアウォールルールを適用する:**

UFW については、[ufw-docker](https://github.com/chaifeng/ufw-docker) プロジェクトが、Docker ネットワークをパッチして UFW ポリシーを尊重させるスクリプトと補助的な `iptables` ルールを提供しています。これにより、標準の UFW コマンドを使用してコンテナへのトラフィックを制御できます。

```bash
# Install ufw-docker integration rules
sudo ufw-docker install

# Allow external access to a specific container port
sudo ufw-docker allow mycontainer 8000/tcp
```bash

Docker がホストファイアウォールとどのように相互作用するかの詳しい説明については、[Docker and iptables documentation](https://docs.docker.com/engine/network/packet-filtering-firewalls/) を参照してください。

### ルール #6 - ランタイムセキュリティのため Linux Security Module (seccomp、AppArmor、SELinux) を使用する

**まず何より、デフォルトのセキュリティプロファイルを無効化しないでください!** 常に Docker またはホストのデフォルトプロファイルをベースラインとして開始してください。

**セキュリティプロファイルの推奨事項:**

- **Seccomp**: コンテナに必要な最小限までシステムコールを制限します。Docker のデフォルト seccomp プロファイルを出発点として使用し、ワークロードごとにカスタマイズします。[Docker Seccomp](https://docs.docker.com/engine/security/seccomp/)

- **AppArmor**: コンテナごとの AppArmor プロファイルを適用し、強制アクセス制御を実施します。[Docker AppArmor](https://docs.docker.com/engine/security/apparmor/)

- **SELinux**: ホストで SELinux を有効にし、コンテナが適切にラベル付けされるようにします。SELinux ポリシーを適用し、ホストリソースへの不正アクセスを防ぎます。[SELinux Guide for Docker](https://docs.docker.com/engine/security/selinux/)

**ランタイムセキュリティの改善:**

- **振る舞い監視**: [Falco](https://falco.org/)、[Tetragon](https://tetragon.io/)、[Cilium eBPF](https://cilium.io/) のようなツールを使用して、予期しない、または悪意のあるコンテナ活動を検出します。例: 予期しない exec 呼び出し、権限昇格の試み、通常と異なるネットワーク接続。

- **異常検知**: コンテナプロセス、ファイルシステム変更、ネットワーク活動を継続的に監視し、異常なパターンをリアルタイムで特定します。

- **Kubernetes Security Context**: Kubernetes で Pod またはコンテナに seccomp と AppArmor プロファイルを設定します。[Configure a Security Context for a Pod or Container](https://kubernetes.io/docs/tutorials/security/seccomp/)

### ルール #7 - リソースを制限する (メモリ、CPU、ファイルディスクリプタ、プロセス、再起動)

DoS 攻撃を回避する最善の方法は、リソースを制限することです。[メモリ](https://docs.docker.com/config/containers/resource_constraints/#memory)、[CPU](https://docs.docker.com/config/containers/resource_constraints/#cpu)、最大再起動回数 (`--restart=on-failure:<number_of_restarts>`)、最大ファイルディスクリプタ数 (`--ulimit nofile=<number>`)、最大プロセス数 (`--ulimit nproc=<number>`) を制限できます。

[ulimits の詳細についてはドキュメントを確認してください](https://docs.docker.com/engine/reference/commandline/run/#set-ulimits-in-container---ulimit)

Kubernetes でも同様に実施できます: [Assign Memory Resources to Containers and Pods](https://kubernetes.io/docs/tasks/configure-pod-container/assign-memory-resource/)、[Assign CPU Resources to Containers and Pods](https://kubernetes.io/docs/tasks/configure-pod-container/assign-cpu-resource/)、[Assign Extended Resources to a Container](https://kubernetes.io/docs/tasks/configure-pod-container/extended-resource/)

### ルール #8 - ファイルシステムとボリュームを読み取り専用に設定する

`--read-only` フラグを使用して、**読み取り専用ファイルシステムでコンテナを実行します**。例:

```bash
docker run --read-only alpine sh -c 'echo "whatever" > /tmp'
```bash

コンテナ内のアプリケーションが一時的に何かを保存する必要がある場合は、次のように `--read-only` フラグと `--tmpfs` を組み合わせます。

```bash
docker run --read-only --tmpfs /tmp alpine sh -c 'echo "whatever" > /tmp/file'
```text

Docker Compose の `compose.yml` での同等の設定は次のとおりです。

```yaml
version: "3"
services:
  alpine:
    image: alpine
    read_only: true
```text

Kubernetes では [Security Context](https://kubernetes.io/docs/tasks/configure-pod-container/security-context/) で同等の設定を行います。

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: example
spec:
  containers:
    - name: example
      image: gcr.io/google-samples/node-hello:1.0
      securityContext:
        readOnlyRootFilesystem: true
```bash

さらに、ボリュームを読み取り目的でのみマウントする場合は、**読み取り専用としてマウントします**。
これは次のように `-v` に `:ro` を付けることで実施できます。

```bash
docker run -v volume-name:/path/in/container:ro alpine
```bash

または、`--mount` オプションを使用します。

```bash
docker run --mount source=volume-name,destination=/path/in/container,readonly alpine
```text

### ルール #9 - コンテナスキャンツールを CI/CD パイプラインに統合する

[CI/CD パイプライン](https://cheatsheetseries.owasp.org/cheatsheets/CI_CD_Security_Cheat_Sheet.html)はソフトウェア開発ライフサイクルの重要な部分であり、lint チェック、静的コード解析、コンテナスキャンなど、さまざまなセキュリティチェックを含めるべきです。

Dockerfile 作成時にいくつかのベストプラクティスに従うことで、多くの問題を防止できます。しかし、ビルドパイプラインのステップとしてセキュリティ linter を追加することは、さらなる悩みを避けるうえで大いに役立ちます。一般的にチェックされる問題には次のものがあります。

- `USER` ディレクティブが指定されていることを確認する
- ベースイメージのバージョンが固定されていることを確認する
- OS パッケージのバージョンが固定されていることを確認する
- `ADD` の使用を避け、`COPY` を使用する
- `RUN` ディレクティブで curl bashing を避ける

参考資料:

- [Docker Baselines on DevSec](https://dev-sec.io/baselines/docker/)
- [Use the Docker command line](https://docs.docker.com/engine/reference/commandline/cli/)
- [Overview of Docker Compose v2 CLI](https://docs.docker.com/compose/reference/overview/)
- [Configuring Logging Drivers](https://docs.docker.com/config/containers/logging/configure/)
- [View logs for a container or service](https://docs.docker.com/config/containers/logging/)
- [Dockerfile Security Best Practices](https://cloudberry.engineering/article/dockerfile-security-best-practices/)

コンテナスキャンツールは、成功するセキュリティ戦略の一部として特に重要です。これらはコンテナイメージ内の既知の脆弱性、シークレット、設定ミスを検出し、修正方法の推奨事項を含む検出結果レポートを提供できます。一般的なコンテナスキャンツールの例は次のとおりです。

- 無償
    - [Clair](https://github.com/quay/clair)
    - [Grype](https://github.com/anchore/grype)
    - [Trivy](https://github.com/aquasecurity/trivy)
- 商用
    - [Snyk](https://snyk.io/) **(open source and free option available)**
    - [Anchore](https://github.com/anchore/grype/) **(open source and free option available)**
    - [Docker Scout](https://www.docker.com/products/docker-scout/) **(open source and free option available)**
    - [JFrog XRay](https://jfrog.com/xray/)
    - [Qualys](https://www.qualys.com/apps/container-security/)

イメージ内のシークレットを検出するには:

- [ggshield](https://github.com/GitGuardian/ggshield) **(open source and free option available)**
- [Gitleaks](https://github.com/gitleaks/gitleaks) **(open source)**
- [TruffleHog](https://github.com/trufflesecurity/trufflehog) **(open source)**

Kubernetes の設定ミスを検出するには:

- [kubeaudit](https://github.com/Shopify/kubeaudit)
- [kubesec.io](https://kubesec.io/)
- [kube-bench](https://github.com/aquasecurity/kube-bench)

Docker の設定ミスを検出するには:

- [inspec.io](https://www.inspec.io/docs/reference/resources/docker/)
- [dev-sec.io](https://dev-sec.io/baselines/docker/)
- [Docker Bench for Security](https://github.com/docker/docker-bench-security)

### ルール #10 - Docker デーモンのログレベルを `info` に保つ

デフォルトでは、Docker デーモンは基本ログレベルが `info` になるように設定されています。これは、デーモン設定ファイル `/etc/docker/daemon.json` の `log-level` キーを確認することで検証できます。キーが存在しない場合、デフォルトのログレベルは `info` です。さらに、docker デーモンが `--log-level` オプション付きで起動されている場合、設定ファイルの `log-level` キーの値は上書きされます。Docker デーモンが異なるログレベルで実行されているか確認するには、次のコマンドを使用できます。

```bash
ps aux | grep '[d]ockerd.*--log-level' | awk '{for(i=1;i<=NF;i++) if ($i ~ /--log-level/) print $i}'
```bash

適切なログレベルを設定すると、後で確認したいイベントを Docker デーモンがログに記録するようになります。基本ログレベルが 'info' 以上であれば、debug ログを除くすべてのログを取得できます。必要な場合を除き、docker デーモンを 'debug' ログレベルで実行すべきではありません。

### ルール #11 - rootless モードで Docker を実行する

Rootless モードは、Docker デーモンとコンテナが非特権ユーザーとして実行されることを保証します。つまり、攻撃者がコンテナから脱出してもホスト上の root 権限を持たず、結果として攻撃対象領域が大幅に制限されます。これは、デーモンが依然として root 権限で動作する [userns-remap](#ルール-2---ユーザーを設定する) モードとは異なります。

環境の[具体的な要件](https://cheatsheetseries.owasp.org/cheatsheets/Attack_Surface_Analysis_Cheat_Sheet.html)と[セキュリティ体制](https://cheatsheetseries.owasp.org/cheatsheets/Threat_Modeling_Cheat_Sheet.html)を評価し、rootless モードが最適な選択かどうかを判断してください。セキュリティが最重要であり、[rootless モードの制限](https://docs.docker.com/engine/security/rootless/#known-limitations)が運用要件と衝突しない環境では、強く推奨される設定です。代替案として、Docker の代わりに [Podman](#docker-の代替としての-podman) を使用することも検討してください。

> Rootless mode allows running the Docker daemon and containers as a non-root user to mitigate potential vulnerabilities in the daemon and the container runtime.
> Rootless mode does not require root privileges even during the installation of the Docker daemon, as long as the [prerequisites](https://docs.docker.com/engine/security/rootless/#prerequisites) are met.

Rootless モードとその制限、インストールおよび使用手順の詳細は、[Docker documentation](https://docs.docker.com/engine/security/rootless/) ページで確認してください。

### ルール #12 - 機微データ管理に Docker Secrets を活用する

Docker Secrets は、パスワード、トークン、SSH キーなどの機微データを保存および管理する安全な方法を提供します。Docker Secrets を使用すると、コンテナイメージやランタイムコマンド内で機微データが露出することを避けやすくなります。

```bash
docker secret create my_secret /path/to/super-secret-data.txt
docker service create --name web --secret my_secret nginx:latest
```text

または Docker Compose では次のようにします。

```yaml
version: "3.8"
secrets:
  my_secret:
    file: ./super-secret-data.txt
services:
  web:
    image: nginx:latest
    secrets:
      - my_secret
```

Docker Secrets は一般に Docker 環境で機微データを管理する安全な方法を提供しますが、Kubernetes では secrets がデフォルトで平文として保存されるため、このアプローチは推奨されません。Kubernetes では、etcd 暗号化やサードパーティツールなど、追加のセキュリティ対策を検討してください。詳細については [Secrets Management Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html) を参照してください。

### ルール #13 - サプライチェーンセキュリティを強化する

[ルール #9](#ルール-9---コンテナスキャンツールを-cicd-パイプラインに統合する)の原則を踏まえると、サプライチェーンセキュリティの強化には、コンテナイメージの作成からデプロイまでのライフサイクル全体を保護する追加対策の実装が含まれます。主な実践事項には次のものがあります。

- [Image Provenance](https://slsa.dev/spec/v1.0/provenance): コンテナイメージの出所と履歴を文書化し、追跡可能性と完全性を確保します。
- [SBOM Generation](https://cyclonedx.org/guides/CycloneDX%20One%20Pager.pdf): 各イメージについて Software Bill of Materials (SBOM) を作成し、透明性と脆弱性管理のために、すべてのコンポーネント、ライブラリ、依存関係を詳述します。
- [Image Signing](https://github.com/notaryproject/notary): イメージにデジタル署名し、その完全性と真正性を検証して、セキュリティへの信頼を確立します。
- [Trusted Registry](https://snyk.io/learn/container-security/container-registry-security/): 文書化され署名されたイメージとその SBOM を、厳格な[アクセス制御](https://cheatsheetseries.owasp.org/cheatsheets/Access_Control_Cheat_Sheet.html)を実施しメタデータ管理をサポートする安全なレジストリに保存します。
- [Secure Deployment](https://www.openpolicyagent.org/docs/latest/#overview): イメージ検証、ランタイムセキュリティ、継続的監視などの安全なデプロイポリシーを実装し、デプロイされたイメージのセキュリティを確保します。

## Docker の代替としての Podman

[Podman](https://podman.io/) は、[Red Hat](https://www.redhat.com/en) が開発した OCI 準拠のオープンソースコンテナ管理ツールであり、Docker 互換のコマンドラインインターフェースと、コンテナを管理するためのデスクトップアプリケーションを提供します。これは、特にセキュアなデフォルトが望まれる環境において、Docker より安全で軽量な代替手段となるよう設計されています。Podman のセキュリティ上の利点には次のものがあります。

1. デーモンレスアーキテクチャ: コンテナの作成、実行、管理に中央デーモン (dockerd) を必要とする Docker とは異なり、Podman は fork-exec モデルを直接使用します。ユーザーがコンテナの起動を要求すると、Podman は現在のプロセスから fork し、その後子プロセスがコンテナのランタイムへ exec します。
2. Rootless コンテナ: fork-exec モデルは、root 権限を必要とせずにコンテナを実行する Podman の能力を支えています。非 root ユーザーがコンテナ起動を開始すると、Podman はそのユーザーの権限で fork および exec します。
3. SELinux 統合: Podman は SELinux と連携するよう構築されています。SELinux は、コンテナおよびホストシステムとの相互作用に強制アクセス制御を適用することで、追加のセキュリティ層を提供します。

## References and Further Reading

[OWASP Docker Top 10](https://github.com/OWASP/Docker-Security)
[Docker Security Best Practices](https://docs.docker.com/develop/security-best-practices/)
[Docker Engine Security](https://docs.docker.com/engine/security/)
[Kubernetes Security Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Kubernetes_Security_Cheat_Sheet.html)
[SLSA - Supply Chain Levels for Software Artifacts](https://slsa.dev/)
[Sigstore](https://sigstore.dev/)
[Docker Build Attestation](https://docs.docker.com/build/attestations/)
[Docker Content Trust](https://docs.docker.com/engine/security/trust/)

## ASVS との対応

| ASVS 項目 | 関連内容 |
| --- | --- |
| V13.2 | Docker コンテナ、ランタイム、ネットワーク、シークレット、サプライチェーンの堅牢化 |
