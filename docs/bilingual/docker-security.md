---
title: Docker Security Cheat Sheet
hide_title: true
---

<div className="docHero" data-category="asvs-v13">
  <h1>Docker セキュリティチートシート</h1>
  <div className="docMeta">
    <span className="docPill">最終更新: 2026-05-20</span>
    <span className="docPill">読了時間: 準備中</span>
    <span className="docPill">カテゴリ: 設定</span>
  </div>
</div>

<p className="docLead">Docker セキュリティチートシートを、原文・翻訳・対比表示で確認できます。ASVS Index 対応の文脈で、公式原文と日本語訳を確認しやすく整理しています。</p>

<div className="tabbedContent">
  <input className="tabInput" type="radio" name="docker-security-view" id="docker-security-original" />
  <input className="tabInput" type="radio" name="docker-security-view" id="docker-security-translation" defaultChecked />
  <input className="tabInput" type="radio" name="docker-security-view" id="docker-security-bilingual" />

  <div className="contentTabs">
    <label htmlFor="docker-security-original" title="OWASP 原文">原文</label>
    <label htmlFor="docker-security-translation" title="日本語訳">翻訳</label>
    <label htmlFor="docker-security-bilingual" title="原文と翻訳を並べて確認">対比表示</label>
  </div>

<section id="docker-security-original-panel" className="tabPanel originalPanel contentPanel">

## Introduction

Docker is the most popular containerization technology. When used correctly, it can enhance security compared to running applications directly on the host system. However, certain misconfigurations can reduce security levels or introduce new vulnerabilities.

The aim of this cheat sheet is to provide a straightforward list of common security errors and best practices to assist in securing your Docker containers.

## Rules

### RULE \\#0 - Keep Host and Docker up to date

To protect against known container escape vulnerabilities like [Leaky Vessels](https://snyk.io/blog/cve-2024-21626-runc-process-cwd-container-breakout/), which typically result in the attacker gaining root access to the host, it's vital to keep both the host and Docker up to date. This includes regularly updating the host kernel as well as the Docker Engine.

This is due to the fact that containers share the host's kernel. If the host's kernel is vulnerable, the containers are also vulnerable. For example, the kernel privilege escalation exploit, [Dirty COW](https://github.com/scumjr/dirtycow-vdso), executed inside a well-insulated container would still result in root access on a vulnerable host.

### RULE \\#1 - Do not expose the Docker daemon socket (even to the containers)

Docker socket _/var/run/docker.sock_ is the UNIX socket that Docker is listening to. This is the primary entry point for the Docker API. The owner of this socket is root. Giving someone access to it is equivalent to giving unrestricted root access to your host.

**Do not enable _tcp_ Docker daemon socket.** If you are running docker daemon with `-H tcp://0.0.0.0:XXX` or similar you are exposing unencrypted and unauthenticated direct access to the Docker daemon, if the host is internet connected this means the docker daemon on your computer can be used by anyone from the public internet.
If you really, **really** have to do this, you should secure it. Check how to do this following [Docker official documentation](https://docs.docker.com/engine/reference/commandline/dockerd/#daemon-socket-option).

**Do not expose _/var/run/docker.sock_ to other containers**. If you are running your docker image with `-v /var/run/docker.sock://var/run/docker.sock` or similar, you should change it. Remember that mounting the socket read-only is not a solution but only makes it harder to exploit. Equivalent in the docker compose file is something like this:

```yaml
volumes:
  - "/var/run/docker.sock:/var/run/docker.sock"
```

### RULE \\#2 - Set a user

Configuring the container to use an unprivileged user is the best way to prevent privilege escalation attacks. This can be accomplished in three different ways as follows:

1. During runtime using `-u` option of `docker run` command e.g.:

```bash
docker run -u 4000 alpine
```

2. During build time. Simply add user in Dockerfile and use it. For example:

```docker
FROM alpine
RUN groupadd -r myuser && useradd -r -g myuser myuser
#    <HERE DO WHAT YOU HAVE TO DO AS A ROOT USER LIKE INSTALLING PACKAGES ETC.>
USER myuser
```

3. Enable user namespace support (`--userns-remap=default`) in [Docker daemon](https://docs.docker.com/engine/security/userns-remap/#enable-userns-remap-on-the-daemon)

More information about this topic can be found at [Docker official documentation](https://docs.docker.com/engine/security/userns-remap/). For additional security, you can also run in rootless mode, which is discussed in [Rule \\#11](#rule-11---run-docker-in-rootless-mode).

In Kubernetes, this can be configured in [Security Context](https://kubernetes.io/docs/tasks/configure-pod-container/security-context/) using the `runAsUser` field with the user ID e.g:

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
```

As a Kubernetes cluster administrator, you can configure a hardened default using the [`Restricted` level](https://kubernetes.io/docs/concepts/security/pod-security-standards/#restricted) with built-in [Pod Security admission controller](https://kubernetes.io/docs/concepts/security/pod-security-admission/), if greater customization is desired consider using [Admission Webhooks](https://kubernetes.io/docs/reference/access-authn-authz/extensible-admission-controllers/#what-are-admission-webhooks) or a [third party alternative](https://kubernetes.io/docs/concepts/security/pod-security-standards/#alternatives).

### RULE \\#3 - Limit capabilities (Grant only specific capabilities, needed by a container)

[Linux kernel capabilities](http://man7.org/linux/man-pages/man7/capabilities.7.html) are a set of privileges that can be used by privileged. Docker, by default, runs with only a subset of capabilities.
You can change it and drop some capabilities (using `--cap-drop`) to harden your docker containers, or add some capabilities (using `--cap-add`) if needed.
Remember not to run containers with the `--privileged` flag - this will add ALL Linux kernel capabilities to the container.

The most secure setup is to drop all capabilities `--cap-drop all` and then add only required ones. For example:

```bash
docker run --cap-drop all --cap-add CHOWN alpine
```

**And remember: Do not run containers with the _--privileged_ flag!!!**

In Kubernetes this can be configured in [Security Context](https://kubernetes.io/docs/tasks/configure-pod-container/security-context/) using `capabilities` field e.g:

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
```

As a Kubernetes cluster administrator, you can configure a hardened default using the [`Restricted` level](https://kubernetes.io/docs/concepts/security/pod-security-standards/#restricted) with built-in [Pod Security admission controller](https://kubernetes.io/docs/concepts/security/pod-security-admission/), if greater customization is desired consider using [Admission Webhooks](https://kubernetes.io/docs/reference/access-authn-authz/extensible-admission-controllers/#what-are-admission-webhooks) or a [third party alternative](https://kubernetes.io/docs/concepts/security/pod-security-standards/#alternatives).

### RULE \\#4 - Prevent in-container privilege escalation

Always run your docker images with `--security-opt=no-new-privileges` in order to prevent privilege escalation. This will prevent the container from gaining new privileges via `setuid` or `setgid` binaries.

In Kubernetes, this can be configured in [Security Context](https://kubernetes.io/docs/tasks/configure-pod-container/security-context/) using `allowPrivilegeEscalation` field e.g.:

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
```

As a Kubernetes cluster administrator, you can configure a hardened default using the [`Restricted` level](https://kubernetes.io/docs/concepts/security/pod-security-standards/#restricted) with built-in [Pod Security admission controller](https://kubernetes.io/docs/concepts/security/pod-security-admission/), if greater customization is desired consider using [Admission Webhooks](https://kubernetes.io/docs/reference/access-authn-authz/extensible-admission-controllers/#what-are-admission-webhooks) or a [third party alternative](https://kubernetes.io/docs/concepts/security/pod-security-standards/#alternatives).

### RULE \\#5 - Be mindful of Inter-Container Connectivity

Inter-Container Connectivity (icc) is enabled by default, allowing all containers to communicate with each other through the [`docker0` bridged network](https://docs.docker.com/network/drivers/bridge/). Instead of using the `--icc=false` flag with the Docker daemon, which completely disables inter-container communication, consider defining specific network configurations. This can be achieved by creating custom Docker networks and specifying which containers should be attached to them. This method provides more granular control over container communication.

For detailed guidance on configuring Docker networks for container communication, refer to the [Docker Documentation](https://docs.docker.com/network/#communication-between-containers).

In Kubernetes environments, [Network Policies](https://kubernetes.io/docs/concepts/services-networking/network-policies/) can be used to define rules that regulate pod interactions within the cluster. These policies provide a robust framework to control how pods communicate with each other and with other network endpoints. Additionally, [Network Policy Editor](https://networkpolicy.io/) simplifies the creation and management of network policies, making it more accessible to define complex networking rules through a user-friendly interface.

### RULE \\#5a - Be careful when mapping container ports to the host with firewalls like UFW

[UFW (Uncomplicated Firewall)](https://help.ubuntu.com/community/UFW) is a popular host-based firewall for Linux. A common misconception is that firewall rules protect all inbound traffic — including traffic destined for Docker containers. However, **Docker manages its own `iptables` and `nftables` rules directly and bypasses UFW entirely**. Note that other tools that use `iptables` or `nftables` can also have conflicts similar to UFW. If you are using other firewall tools, you should check if they are working correctly.

When you publish a port with `-p 8000:8000`, Docker inserts `iptables` rules that open that port to **all interfaces and all source addresses**, and these rules are typically accepted before explicit firewall `DENY` rules are applied. As a result, traffic may be allowed through regardless of any `DENY` rules you have set, which can unintentionally expose container services to the public internet.

#### Recommended Mitigations

**Option 1 — Bind published ports to localhost only:**

Bind the host side of the port mapping to `127.0.0.1` so the service is only reachable locally, not from external networks:

```bash
# Vulnerable: exposes port on all interfaces
docker run -p 8000:8000 myimage

# Safe: binds only to localhost
docker run -p 127.0.0.1:8000:8000 myimage
```

In a Docker Compose file:

```yaml
services:
  web:
    image: myimage
    ports:
      - "127.0.0.1:8000:8000"  # safe — localhost only
```

**Option 2 — Use `ufw-docker` (or equivalent) to enforce firewall rules over Docker networks:**

For UFW specifically, the [ufw-docker](https://github.com/chaifeng/ufw-docker) project provides a script and supplemental `iptables` rules that patch Docker's networking to respect UFW policies, allowing you to use standard UFW commands to control traffic to containers:

```bash
# Install ufw-docker integration rules
sudo ufw-docker install

# Allow external access to a specific container port
sudo ufw-docker allow mycontainer 8000/tcp
```

Refer to the [Docker and iptables documentation](https://docs.docker.com/engine/network/packet-filtering-firewalls/) for a deeper explanation of how Docker interacts with the host firewall.

### RULE \\#6 - Use Linux Security Module (seccomp, AppArmor, or SELinux) for Runtime Security

**First of all, do not disable default security profile!** Always start with Docker’s or your host’s default profile as a baseline.

**Security Profile Recommendations:**

- **Seccomp**: Restrict syscalls to the minimum required for your container. Use Docker’s default seccomp profile as a starting point and customize per workload. [Docker Seccomp](https://docs.docker.com/engine/security/seccomp/)

- **AppArmor**: Apply per-container AppArmor profiles to enforce mandatory access controls. [Docker AppArmor](https://docs.docker.com/engine/security/apparmor/)

- **SELinux**: Enable SELinux on the host and ensure containers are labeled properly. Enforce SELinux policies to prevent unauthorized access to host resources. [SELinux Guide for Docker](https://docs.docker.com/engine/security/selinux/)

**Runtime Security Improvements:**

- **Behavioral Monitoring**: Use tools like [Falco](https://falco.org/), [Tetragon](https://tetragon.io/), or [Cilium eBPF](https://cilium.io/) to detect unexpected or malicious container activity. Examples: Unexpected exec calls, privilege escalation attempts, unusual network connections.

- **Anomaly Detection**: Continuously monitor container processes, filesystem changes, and network activity to identify abnormal patterns in real time.

- **Kubernetes Security Context**: Configure pods or containers with seccomp and AppArmor profiles in Kubernetes. [Configure a Security Context for a Pod or Container](https://kubernetes.io/docs/tutorials/security/seccomp/)

### RULE \\#7 - Limit resources (memory, CPU, file descriptors, processes, restarts)

The best way to avoid DoS attacks is by limiting resources. You can limit [memory](https://docs.docker.com/config/containers/resource_constraints/#memory), [CPU](https://docs.docker.com/config/containers/resource_constraints/#cpu), maximum number of restarts (`--restart=on-failure:<number_of_restarts>`), maximum number of file descriptors (`--ulimit nofile=<number>`) and maximum number of processes (`--ulimit nproc=<number>`).

[Check documentation for more details about ulimits](https://docs.docker.com/engine/reference/commandline/run/#set-ulimits-in-container---ulimit)

You can also do this for Kubernetes: [Assign Memory Resources to Containers and Pods](https://kubernetes.io/docs/tasks/configure-pod-container/assign-memory-resource/), [Assign CPU Resources to Containers and Pods](https://kubernetes.io/docs/tasks/configure-pod-container/assign-cpu-resource/) and [Assign Extended Resources to a Container](https://kubernetes.io/docs/tasks/configure-pod-container/extended-resource/)

### RULE \\#8 - Set filesystem and volumes to read-only

**Run containers with a read-only filesystem** using `--read-only` flag. For example:

```bash
docker run --read-only alpine sh -c 'echo "whatever" > /tmp'
```

If an application inside a container has to save something temporarily, combine `--read-only` flag with `--tmpfs` like this:

```bash
docker run --read-only --tmpfs /tmp alpine sh -c 'echo "whatever" > /tmp/file'
```

The Docker Compose `compose.yml` equivalent would be:

```yaml
version: "3"
services:
  alpine:
    image: alpine
    read_only: true
```

Equivalent in Kubernetes in [Security Context](https://kubernetes.io/docs/tasks/configure-pod-container/security-context/):

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
```

In addition, if the volume is mounted only for reading **mount them as a read-only**
It can be done by appending `:ro` to the `-v` like this:

```bash
docker run -v volume-name:/path/in/container:ro alpine
```

Or by using `--mount` option:

```bash
docker run --mount source=volume-name,destination=/path/in/container,readonly alpine
```

### RULE \\#9 - Integrate container scanning tools into your CI/CD pipeline

[CI/CD pipelines](https://cheatsheetseries.owasp.org/cheatsheets/CI_CD_Security_Cheat_Sheet.html) are a crucial part of the software development lifecycle and should include various security checks such as lint checks, static code analysis, and container scanning.

Many issues can be prevented by following some best practices when writing the Dockerfile. However, adding a security linter as a step in the build pipeline can go a long way in avoiding further headaches. Some issues that are commonly checked are:

- Ensure a `USER` directive is specified
- Ensure the base image version is pinned
- Ensure the OS packages versions are pinned
- Avoid the use of `ADD` in favor of `COPY`
- Avoid curl bashing in `RUN` directives

References:

- [Docker Baselines on DevSec](https://dev-sec.io/baselines/docker/)
- [Use the Docker command line](https://docs.docker.com/engine/reference/commandline/cli/)
- [Overview of Docker Compose v2 CLI](https://docs.docker.com/compose/reference/overview/)
- [Configuring Logging Drivers](https://docs.docker.com/config/containers/logging/configure/)
- [View logs for a container or service](https://docs.docker.com/config/containers/logging/)
- [Dockerfile Security Best Practices](https://cloudberry.engineering/article/dockerfile-security-best-practices/)

Container scanning tools are especially important as part of a successful security strategy. They can detect known vulnerabilities, secrets and misconfigurations in container images and provide a report of the findings with recommendations on how to fix them. Some examples of popular container scanning tools are:

- Free
    - [Clair](https://github.com/quay/clair)
    - [Grype](https://github.com/anchore/grype)
    - [Trivy](https://github.com/aquasecurity/trivy)
- Commercial
    - [Snyk](https://snyk.io/) **(open source and free option available)**
    - [Anchore](https://github.com/anchore/grype/) **(open source and free option available)**
    - [Docker Scout](https://www.docker.com/products/docker-scout/) **(open source and free option available)**
    - [JFrog XRay](https://jfrog.com/xray/)
    - [Qualys](https://www.qualys.com/apps/container-security/)

To detect secrets in images:

- [ggshield](https://github.com/GitGuardian/ggshield) **(open source and free option available)**
- [Gitleaks](https://github.com/gitleaks/gitleaks) **(open source)**
- [TruffleHog](https://github.com/trufflesecurity/trufflehog) **(open source)**

To detect misconfigurations in Kubernetes:

- [kubeaudit](https://github.com/Shopify/kubeaudit)
- [kubesec.io](https://kubesec.io/)
- [kube-bench](https://github.com/aquasecurity/kube-bench)

To detect misconfigurations in Docker:

- [inspec.io](https://www.inspec.io/docs/reference/resources/docker/)
- [dev-sec.io](https://dev-sec.io/baselines/docker/)
- [Docker Bench for Security](https://github.com/docker/docker-bench-security)

### RULE \\#10 - Keep the Docker daemon logging level at `info`

By default, the Docker daemon is configured to have a base logging level of `info`. This can be verified by checking the daemon configuration file `/etc/docker/daemon.json` for the`log-level` key. If the key is not present, the default logging level is `info`. Additionally, if the docker daemon is started with the `--log-level` option, the value of the `log-level` key in the configuration file will be overridden. To check if the Docker daemon is running with a different log level, you can use the following command:

```bash
ps aux | grep '[d]ockerd.*--log-level' | awk '{for(i=1;i<=NF;i++) if ($i ~ /--log-level/) print $i}'
```

Setting an appropriate log level, configures the Docker daemon to log events that you would want to review later. A base log level of 'info' and above would capture all logs except the debug logs. Until and unless required, you should not run docker daemon at the 'debug' log level.

### Rule \\#11 - Run Docker in rootless mode

Rootless mode ensures that the Docker daemon and containers are running as an unprivileged user, which means that even if an attacker breaks out of the container, they will not have root privileges on the host, which in turn substantially limits the attack surface. This is different to [userns-remap](#rule-2---set-a-user) mode, where the daemon still operates with root privileges.

Evaluate the [specific requirements](https://cheatsheetseries.owasp.org/cheatsheets/Attack_Surface_Analysis_Cheat_Sheet.html) and [security posture](https://cheatsheetseries.owasp.org/cheatsheets/Threat_Modeling_Cheat_Sheet.html) of your environment to determine if rootless mode is the best choice for you. For environments where security is a paramount concern and the [limitations of rootless mode](https://docs.docker.com/engine/security/rootless/#known-limitations) do not interfere with operational requirements, it is a strongly recommended configuration. Alternatively consider using [Podman](#podman-as-an-alternative-to-docker) as an alternative to Docker.

> Rootless mode allows running the Docker daemon and containers as a non-root user to mitigate potential vulnerabilities in the daemon and the container runtime.
> Rootless mode does not require root privileges even during the installation of the Docker daemon, as long as the [prerequisites](https://docs.docker.com/engine/security/rootless/#prerequisites) are met.

Read more about rootless mode and its limitations, installation and usage instructions on [Docker documentation](https://docs.docker.com/engine/security/rootless/) page.

### RULE \\#12 - Utilize Docker Secrets for Sensitive Data Management

Docker Secrets provide a secure way to store and manage sensitive data such as passwords, tokens, and SSH keys. Using Docker Secrets helps in avoiding the exposure of sensitive data in container images or in runtime commands.

```bash
docker secret create my_secret /path/to/super-secret-data.txt
docker service create --name web --secret my_secret nginx:latest
```

Or for Docker Compose:

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

While Docker Secrets generally provide a secure way to manage sensitive data in Docker environments, this approach is not recommended for Kubernetes, where secrets are stored in plaintext by default. In Kubernetes, consider using additional security measures such as etcd encryption, or third-party tools. Refer to the [Secrets Management Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html) for more information.

### RULE \\#13 - Enhance Supply Chain Security

Building on the principles in [Rule \\#9](#rule-9---integrate-container-scanning-tools-into-your-cicd-pipeline), enhancing supply chain security involves implementing additional measures to secure the entire lifecycle of container images from creation to deployment. Some of the key practices include:

- [Image Provenance](https://slsa.dev/spec/v1.0/provenance): Document the origin and history of container images to ensure traceability and integrity.
- [SBOM Generation](https://cyclonedx.org/guides/CycloneDX%20One%20Pager.pdf): Create a Software Bill of Materials (SBOM) for each image, detailing all components, libraries, and dependencies for transparency and vulnerability management.
- [Image Signing](https://github.com/notaryproject/notary): Digitally sign images to verify their integrity and authenticity, establishing trust in their security.
- [Trusted Registry](https://snyk.io/learn/container-security/container-registry-security/): Store the documented, signed images with their SBOMs in a secure registry that enforces strict [access controls](https://cheatsheetseries.owasp.org/cheatsheets/Access_Control_Cheat_Sheet.html) and supports metadata management.
- [Secure Deployment](https://www.openpolicyagent.org/docs/latest/#overview): Implement secure deployment polices, such as image validation, runtime security, and continuous monitoring, to ensure the security of the deployed images.

## Podman as an alternative to Docker

[Podman](https://podman.io/) is an OCI-compliant, open-source container management tool developed by [Red Hat](https://www.redhat.com/en) that provides a Docker-compatible command-line interface and a desktop application for managing containers. It is designed to be a more secure and lightweight alternative to Docker, especially for environments where secure defaults are preferred. Some of the security benefits of Podman include:

1. Daemonless Architecture: Unlike Docker, which requires a central daemon (dockerd) to create, run, and manage containers, Podman directly employs the fork-exec model. When a user requests to start a container, Podman forks from the current process, then the child process execs into the container's runtime.
2. Rootless Containers: The fork-exec model facilitates Podman's ability to run containers without requiring root privileges. When a non-root user initiates a container start, Podman forks and execs under the user's permissions.
3. SELinux Integration: Podman is built to work with SELinux, which provides an additional layer of security by enforcing mandatory access controls on containers and their interactions with the host system.

</section>

<section id="docker-security-translation-panel" className="tabPanel translationPanel contentPanel">

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
```

### ルール #2 - ユーザーを設定する

コンテナが非特権ユーザーを使用するように設定することは、権限昇格攻撃を防ぐ最善の方法です。これは次の三つの方法で実現できます。

1. 実行時に `docker run` コマンドの `-u` オプションを使用します。例:

```bash
docker run -u 4000 alpine
```

2. ビルド時に行います。Dockerfile にユーザーを追加し、それを使用します。例:

```docker
FROM alpine
RUN groupadd -r myuser && useradd -r -g myuser myuser
#    <HERE DO WHAT YOU HAVE TO DO AS A ROOT USER LIKE INSTALLING PACKAGES ETC.>
USER myuser
```

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
```

Kubernetes クラスター管理者は、組み込みの [Pod Security admission controller](https://kubernetes.io/docs/concepts/security/pod-security-admission/) と [`Restricted` レベル](https://kubernetes.io/docs/concepts/security/pod-security-standards/#restricted)を使用して堅牢化されたデフォルトを設定できます。より細かなカスタマイズが必要な場合は、[Admission Webhooks](https://kubernetes.io/docs/reference/access-authn-authz/extensible-admission-controllers/#what-are-admission-webhooks) または [サードパーティの代替手段](https://kubernetes.io/docs/concepts/security/pod-security-standards/#alternatives)の使用を検討してください。

### ルール #3 - ケイパビリティを制限する (コンテナに必要な特定のケイパビリティのみを付与する)

[Linux カーネルケイパビリティ](http://man7.org/linux/man-pages/man7/capabilities.7.html)は、特権で使用できる権限の集合です。Docker はデフォルトで、ケイパビリティのサブセットのみを持って実行されます。
`--cap-drop` を使用して一部のケイパビリティを削除し Docker コンテナを堅牢化したり、必要に応じて `--cap-add` を使用してケイパビリティを追加したりできます。
コンテナを `--privileged` フラグ付きで実行しないことを覚えておいてください。このフラグはすべての Linux カーネルケイパビリティをコンテナに追加します。

最も安全な設定は、`--cap-drop all` ですべてのケイパビリティを削除し、必要なものだけを追加することです。例:

```bash
docker run --cap-drop all --cap-add CHOWN alpine
```

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
```

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
```

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
```

Docker Compose ファイルでは次のようにします。

```yaml
services:
  web:
    image: myimage
    ports:
      - "127.0.0.1:8000:8000"  # safe — localhost only
```

**オプション 2 - `ufw-docker` (または同等のもの) を使用して Docker ネットワーク上でファイアウォールルールを適用する:**

UFW については、[ufw-docker](https://github.com/chaifeng/ufw-docker) プロジェクトが、Docker ネットワークをパッチして UFW ポリシーを尊重させるスクリプトと補助的な `iptables` ルールを提供しています。これにより、標準の UFW コマンドを使用してコンテナへのトラフィックを制御できます。

```bash
# Install ufw-docker integration rules
sudo ufw-docker install

# Allow external access to a specific container port
sudo ufw-docker allow mycontainer 8000/tcp
```

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
```

コンテナ内のアプリケーションが一時的に何かを保存する必要がある場合は、次のように `--read-only` フラグと `--tmpfs` を組み合わせます。

```bash
docker run --read-only --tmpfs /tmp alpine sh -c 'echo "whatever" > /tmp/file'
```

Docker Compose の `compose.yml` での同等の設定は次のとおりです。

```yaml
version: "3"
services:
  alpine:
    image: alpine
    read_only: true
```

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
```

さらに、ボリュームを読み取り目的でのみマウントする場合は、**読み取り専用としてマウントします**。
これは次のように `-v` に `:ro` を付けることで実施できます。

```bash
docker run -v volume-name:/path/in/container:ro alpine
```

または、`--mount` オプションを使用します。

```bash
docker run --mount source=volume-name,destination=/path/in/container,readonly alpine
```

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
```

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
```

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

</section>

<section id="docker-security-bilingual-panel" className="tabPanel bilingualPanel">

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## Introduction

Docker is the most popular containerization technology. When used correctly, it can enhance security compared to running applications directly on the host system. However, certain misconfigurations can reduce security levels or introduce new vulnerabilities.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## はじめに

Docker は最も普及しているコンテナ化技術です。正しく使用すれば、ホストシステム上でアプリケーションを直接実行する場合と比べてセキュリティを高められます。しかし、特定の設定ミスはセキュリティレベルを下げたり、新しい脆弱性を持ち込んだりする可能性があります。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

The aim of this cheat sheet is to provide a straightforward list of common security errors and best practices to assist in securing your Docker containers.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

このチートシートの目的は、Docker コンテナの保護を支援するために、一般的なセキュリティ上の誤りとベストプラクティスを簡潔な一覧として提供することです。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## Rules

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## ルール

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### RULE \\#0 - Keep Host and Docker up to date

To protect against known container escape vulnerabilities like [Leaky Vessels](https://snyk.io/blog/cve-2024-21626-runc-process-cwd-container-breakout/), which typically result in the attacker gaining root access to the host, it's vital to keep both the host and Docker up to date. This includes regularly updating the host kernel as well as the Docker Engine.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### ルール #0 - ホストと Docker を最新の状態に保つ

攻撃者がホストの root アクセスを得る結果になりやすい [Leaky Vessels](https://snyk.io/blog/cve-2024-21626-runc-process-cwd-container-breakout/) のような既知のコンテナエスケープ脆弱性から保護するには、ホストと Docker の両方を最新の状態に保つことが重要です。これには、ホストカーネルと Docker Engine を定期的に更新することが含まれます。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

This is due to the fact that containers share the host's kernel. If the host's kernel is vulnerable, the containers are also vulnerable. For example, the kernel privilege escalation exploit, [Dirty COW](https://github.com/scumjr/dirtycow-vdso), executed inside a well-insulated container would still result in root access on a vulnerable host.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

これは、コンテナがホストのカーネルを共有しているためです。ホストのカーネルに脆弱性がある場合、コンテナも脆弱になります。たとえば、カーネル権限昇格エクスプロイトである [Dirty COW](https://github.com/scumjr/dirtycow-vdso) は、十分に隔離されたコンテナ内で実行されても、脆弱なホストでは root アクセスにつながります。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### RULE \\#1 - Do not expose the Docker daemon socket (even to the containers)

Docker socket _/var/run/docker.sock_ is the UNIX socket that Docker is listening to. This is the primary entry point for the Docker API. The owner of this socket is root. Giving someone access to it is equivalent to giving unrestricted root access to your host.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### ルール #1 - Docker デーモンソケットを公開しない (コンテナに対しても公開しない)

Docker ソケット _/var/run/docker.sock_ は、Docker が待ち受けている UNIX ソケットです。これは Docker API の主要な入口です。このソケットの所有者は root です。誰かにこのソケットへのアクセスを与えることは、ホストへの無制限の root アクセスを与えることと同等です。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

**Do not enable _tcp_ Docker daemon socket.** If you are running docker daemon with `-H tcp://0.0.0.0:XXX` or similar you are exposing unencrypted and unauthenticated direct access to the Docker daemon, if the host is internet connected this means the docker daemon on your computer can be used by anyone from the public internet.
If you really, **really** have to do this, you should secure it. Check how to do this following [Docker official documentation](https://docs.docker.com/engine/reference/commandline/dockerd/#daemon-socket-option).

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

**_tcp_ Docker デーモンソケットを有効にしないでください。** Docker デーモンを `-H tcp://0.0.0.0:XXX` または類似の指定で実行している場合、Docker デーモンへの暗号化も認証もない直接アクセスを公開しています。ホストがインターネットに接続されている場合、あなたのコンピューター上の Docker デーモンをパブリックインターネット上の誰でも使用できることを意味します。
本当に、**本当に**そうしなければならない場合は、保護すべきです。その方法については [Docker 公式ドキュメント](https://docs.docker.com/engine/reference/commandline/dockerd/#daemon-socket-option) を確認してください。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

**Do not expose _/var/run/docker.sock_ to other containers**. If you are running your docker image with `-v /var/run/docker.sock://var/run/docker.sock` or similar, you should change it. Remember that mounting the socket read-only is not a solution but only makes it harder to exploit. Equivalent in the docker compose file is something like this:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

**_/var/run/docker.sock_ を他のコンテナに公開しないでください**。Docker イメージを `-v /var/run/docker.sock://var/run/docker.sock` または類似の指定で実行している場合は、変更すべきです。ソケットを読み取り専用でマウントすることは解決策ではなく、悪用を少し難しくするだけであることを覚えておいてください。docker compose ファイルでの同等の設定は、次のようなものです。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```yaml
volumes:
  - "/var/run/docker.sock:/var/run/docker.sock"
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### RULE \\#2 - Set a user

Configuring the container to use an unprivileged user is the best way to prevent privilege escalation attacks. This can be accomplished in three different ways as follows:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### ルール #2 - ユーザーを設定する

コンテナが非特権ユーザーを使用するように設定することは、権限昇格攻撃を防ぐ最善の方法です。これは次の三つの方法で実現できます。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

1. During runtime using `-u` option of `docker run` command e.g.:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

1. 実行時に `docker run` コマンドの `-u` オプションを使用します。例:

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```bash
docker run -u 4000 alpine
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

2. During build time. Simply add user in Dockerfile and use it. For example:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

2. ビルド時に行います。Dockerfile にユーザーを追加し、それを使用します。例:

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```docker
FROM alpine
RUN groupadd -r myuser && useradd -r -g myuser myuser
#    <HERE DO WHAT YOU HAVE TO DO AS A ROOT USER LIKE INSTALLING PACKAGES ETC.>
USER myuser
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

3. Enable user namespace support (`--userns-remap=default`) in [Docker daemon](https://docs.docker.com/engine/security/userns-remap/#enable-userns-remap-on-the-daemon)

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

3. [Docker デーモン](https://docs.docker.com/engine/security/userns-remap/#enable-userns-remap-on-the-daemon)でユーザー名前空間サポート (`--userns-remap=default`) を有効にします。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

More information about this topic can be found at [Docker official documentation](https://docs.docker.com/engine/security/userns-remap/). For additional security, you can also run in rootless mode, which is discussed in [Rule \\#11](#rule-11---run-docker-in-rootless-mode).

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

このトピックの詳細は [Docker 公式ドキュメント](https://docs.docker.com/engine/security/userns-remap/)で確認できます。追加のセキュリティとして、[ルール #11](#ルール-11---rootless-モードで-docker-を実行する)で説明する rootless モードで実行することもできます。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

In Kubernetes, this can be configured in [Security Context](https://kubernetes.io/docs/tasks/configure-pod-container/security-context/) using the `runAsUser` field with the user ID e.g:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

Kubernetes では、[Security Context](https://kubernetes.io/docs/tasks/configure-pod-container/security-context/) の `runAsUser` フィールドにユーザー ID を指定して設定できます。例:

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

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
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

As a Kubernetes cluster administrator, you can configure a hardened default using the [`Restricted` level](https://kubernetes.io/docs/concepts/security/pod-security-standards/#restricted) with built-in [Pod Security admission controller](https://kubernetes.io/docs/concepts/security/pod-security-admission/), if greater customization is desired consider using [Admission Webhooks](https://kubernetes.io/docs/reference/access-authn-authz/extensible-admission-controllers/#what-are-admission-webhooks) or a [third party alternative](https://kubernetes.io/docs/concepts/security/pod-security-standards/#alternatives).

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

Kubernetes クラスター管理者は、組み込みの [Pod Security admission controller](https://kubernetes.io/docs/concepts/security/pod-security-admission/) と [`Restricted` レベル](https://kubernetes.io/docs/concepts/security/pod-security-standards/#restricted)を使用して堅牢化されたデフォルトを設定できます。より細かなカスタマイズが必要な場合は、[Admission Webhooks](https://kubernetes.io/docs/reference/access-authn-authz/extensible-admission-controllers/#what-are-admission-webhooks) または [サードパーティの代替手段](https://kubernetes.io/docs/concepts/security/pod-security-standards/#alternatives)の使用を検討してください。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### RULE \\#3 - Limit capabilities (Grant only specific capabilities, needed by a container)

[Linux kernel capabilities](http://man7.org/linux/man-pages/man7/capabilities.7.html) are a set of privileges that can be used by privileged. Docker, by default, runs with only a subset of capabilities.
You can change it and drop some capabilities (using `--cap-drop`) to harden your docker containers, or add some capabilities (using `--cap-add`) if needed.
Remember not to run containers with the `--privileged` flag - this will add ALL Linux kernel capabilities to the container.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### ルール #3 - ケイパビリティを制限する (コンテナに必要な特定のケイパビリティのみを付与する)

[Linux カーネルケイパビリティ](http://man7.org/linux/man-pages/man7/capabilities.7.html)は、特権で使用できる権限の集合です。Docker はデフォルトで、ケイパビリティのサブセットのみを持って実行されます。
`--cap-drop` を使用して一部のケイパビリティを削除し Docker コンテナを堅牢化したり、必要に応じて `--cap-add` を使用してケイパビリティを追加したりできます。
コンテナを `--privileged` フラグ付きで実行しないことを覚えておいてください。このフラグはすべての Linux カーネルケイパビリティをコンテナに追加します。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

The most secure setup is to drop all capabilities `--cap-drop all` and then add only required ones. For example:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

最も安全な設定は、`--cap-drop all` ですべてのケイパビリティを削除し、必要なものだけを追加することです。例:

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```bash
docker run --cap-drop all --cap-add CHOWN alpine
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

**And remember: Do not run containers with the _--privileged_ flag!!!**

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

**そして忘れないでください: _--privileged_ フラグ付きでコンテナを実行しないでください!!!**

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

In Kubernetes this can be configured in [Security Context](https://kubernetes.io/docs/tasks/configure-pod-container/security-context/) using `capabilities` field e.g:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

Kubernetes では、[Security Context](https://kubernetes.io/docs/tasks/configure-pod-container/security-context/) の `capabilities` フィールドを使用して設定できます。例:

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

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
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

As a Kubernetes cluster administrator, you can configure a hardened default using the [`Restricted` level](https://kubernetes.io/docs/concepts/security/pod-security-standards/#restricted) with built-in [Pod Security admission controller](https://kubernetes.io/docs/concepts/security/pod-security-admission/), if greater customization is desired consider using [Admission Webhooks](https://kubernetes.io/docs/reference/access-authn-authz/extensible-admission-controllers/#what-are-admission-webhooks) or a [third party alternative](https://kubernetes.io/docs/concepts/security/pod-security-standards/#alternatives).

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

Kubernetes クラスター管理者は、組み込みの [Pod Security admission controller](https://kubernetes.io/docs/concepts/security/pod-security-admission/) と [`Restricted` レベル](https://kubernetes.io/docs/concepts/security/pod-security-standards/#restricted)を使用して堅牢化されたデフォルトを設定できます。より細かなカスタマイズが必要な場合は、[Admission Webhooks](https://kubernetes.io/docs/reference/access-authn-authz/extensible-admission-controllers/#what-are-admission-webhooks) または [サードパーティの代替手段](https://kubernetes.io/docs/concepts/security/pod-security-standards/#alternatives)の使用を検討してください。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### RULE \\#4 - Prevent in-container privilege escalation

Always run your docker images with `--security-opt=no-new-privileges` in order to prevent privilege escalation. This will prevent the container from gaining new privileges via `setuid` or `setgid` binaries.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### ルール #4 - コンテナ内の権限昇格を防ぐ

権限昇格を防ぐため、Docker イメージは常に `--security-opt=no-new-privileges` を付けて実行してください。これにより、コンテナが `setuid` または `setgid` バイナリを通じて新しい権限を得ることを防止できます。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

In Kubernetes, this can be configured in [Security Context](https://kubernetes.io/docs/tasks/configure-pod-container/security-context/) using `allowPrivilegeEscalation` field e.g.:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

Kubernetes では、[Security Context](https://kubernetes.io/docs/tasks/configure-pod-container/security-context/) の `allowPrivilegeEscalation` フィールドを使用して設定できます。例:

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

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
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

As a Kubernetes cluster administrator, you can configure a hardened default using the [`Restricted` level](https://kubernetes.io/docs/concepts/security/pod-security-standards/#restricted) with built-in [Pod Security admission controller](https://kubernetes.io/docs/concepts/security/pod-security-admission/), if greater customization is desired consider using [Admission Webhooks](https://kubernetes.io/docs/reference/access-authn-authz/extensible-admission-controllers/#what-are-admission-webhooks) or a [third party alternative](https://kubernetes.io/docs/concepts/security/pod-security-standards/#alternatives).

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

Kubernetes クラスター管理者は、組み込みの [Pod Security admission controller](https://kubernetes.io/docs/concepts/security/pod-security-admission/) と [`Restricted` レベル](https://kubernetes.io/docs/concepts/security/pod-security-standards/#restricted)を使用して堅牢化されたデフォルトを設定できます。より細かなカスタマイズが必要な場合は、[Admission Webhooks](https://kubernetes.io/docs/reference/access-authn-authz/extensible-admission-controllers/#what-are-admission-webhooks) または [サードパーティの代替手段](https://kubernetes.io/docs/concepts/security/pod-security-standards/#alternatives)の使用を検討してください。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### RULE \\#5 - Be mindful of Inter-Container Connectivity

Inter-Container Connectivity (icc) is enabled by default, allowing all containers to communicate with each other through the [`docker0` bridged network](https://docs.docker.com/network/drivers/bridge/). Instead of using the `--icc=false` flag with the Docker daemon, which completely disables inter-container communication, consider defining specific network configurations. This can be achieved by creating custom Docker networks and specifying which containers should be attached to them. This method provides more granular control over container communication.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### ルール #5 - コンテナ間接続に注意する

コンテナ間接続 (Inter-Container Connectivity: icc) はデフォルトで有効であり、すべてのコンテナが [`docker0` ブリッジネットワーク](https://docs.docker.com/network/drivers/bridge/)を通じて相互に通信できます。コンテナ間通信を完全に無効化する Docker デーモンの `--icc=false` フラグを使う代わりに、具体的なネットワーク構成を定義することを検討してください。これは、カスタム Docker ネットワークを作成し、どのコンテナをそこに接続するかを指定することで実現できます。この方法は、コンテナ通信をよりきめ細かく制御できます。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

For detailed guidance on configuring Docker networks for container communication, refer to the [Docker Documentation](https://docs.docker.com/network/#communication-between-containers).

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

コンテナ通信のために Docker ネットワークを設定する詳細なガイダンスについては、[Docker Documentation](https://docs.docker.com/network/#communication-between-containers) を参照してください。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

In Kubernetes environments, [Network Policies](https://kubernetes.io/docs/concepts/services-networking/network-policies/) can be used to define rules that regulate pod interactions within the cluster. These policies provide a robust framework to control how pods communicate with each other and with other network endpoints. Additionally, [Network Policy Editor](https://networkpolicy.io/) simplifies the creation and management of network policies, making it more accessible to define complex networking rules through a user-friendly interface.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

Kubernetes 環境では、[Network Policies](https://kubernetes.io/docs/concepts/services-networking/network-policies/) を使用してクラスター内の Pod 間通信を規制するルールを定義できます。これらのポリシーは、Pod 同士および他のネットワークエンドポイントとの通信方法を制御するための堅牢なフレームワークを提供します。さらに、[Network Policy Editor](https://networkpolicy.io/) は、複雑なネットワークルールをユーザーフレンドリーなインターフェースで定義できるようにし、ネットワークポリシーの作成と管理を簡素化します。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### RULE \\#5a - Be careful when mapping container ports to the host with firewalls like UFW

[UFW (Uncomplicated Firewall)](https://help.ubuntu.com/community/UFW) is a popular host-based firewall for Linux. A common misconception is that firewall rules protect all inbound traffic — including traffic destined for Docker containers. However, **Docker manages its own `iptables` and `nftables` rules directly and bypasses UFW entirely**. Note that other tools that use `iptables` or `nftables` can also have conflicts similar to UFW. If you are using other firewall tools, you should check if they are working correctly.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### ルール #5a - UFW のようなファイアウォールを使用している場合、コンテナポートをホストへマッピングするときは注意する

[UFW (Uncomplicated Firewall)](https://help.ubuntu.com/community/UFW) は Linux でよく使われるホストベースのファイアウォールです。よくある誤解は、ファイアウォールルールが Docker コンテナ宛てのトラフィックを含むすべての受信トラフィックを保護する、というものです。しかし、**Docker は独自の `iptables` および `nftables` ルールを直接管理し、UFW を完全に迂回します**。`iptables` または `nftables` を使用する他のツールも、UFW と同様の競合を起こす可能性がある点に注意してください。他のファイアウォールツールを使用している場合は、それらが正しく機能しているか確認すべきです。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

When you publish a port with `-p 8000:8000`, Docker inserts `iptables` rules that open that port to **all interfaces and all source addresses**, and these rules are typically accepted before explicit firewall `DENY` rules are applied. As a result, traffic may be allowed through regardless of any `DENY` rules you have set, which can unintentionally expose container services to the public internet.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

`-p 8000:8000` でポートを公開すると、Docker はそのポートを**すべてのインターフェースとすべての送信元アドレス**に開放する `iptables` ルールを挿入します。これらのルールは通常、明示的なファイアウォールの `DENY` ルールが適用される前に受け入れられます。その結果、設定した `DENY` ルールにかかわらずトラフィックが許可され、コンテナサービスが意図せずパブリックインターネットへ公開される可能性があります。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

#### Recommended Mitigations

**Option 1 — Bind published ports to localhost only:**

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

#### 推奨される緩和策

**オプション 1 - 公開ポートを localhost のみにバインドする:**

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Bind the host side of the port mapping to `127.0.0.1` so the service is only reachable locally, not from external networks:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

ポートマッピングのホスト側を `127.0.0.1` にバインドし、外部ネットワークからではなくローカルからのみサービスへ到達できるようにします。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```bash
# Vulnerable: exposes port on all interfaces
docker run -p 8000:8000 myimage

# Safe: binds only to localhost
docker run -p 127.0.0.1:8000:8000 myimage
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

In a Docker Compose file:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

Docker Compose ファイルでは次のようにします。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```yaml
services:
  web:
    image: myimage
    ports:
      - "127.0.0.1:8000:8000"  # safe — localhost only
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

**Option 2 — Use `ufw-docker` (or equivalent) to enforce firewall rules over Docker networks:**

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

**オプション 2 - `ufw-docker` (または同等のもの) を使用して Docker ネットワーク上でファイアウォールルールを適用する:**

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

For UFW specifically, the [ufw-docker](https://github.com/chaifeng/ufw-docker) project provides a script and supplemental `iptables` rules that patch Docker's networking to respect UFW policies, allowing you to use standard UFW commands to control traffic to containers:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

UFW については、[ufw-docker](https://github.com/chaifeng/ufw-docker) プロジェクトが、Docker ネットワークをパッチして UFW ポリシーを尊重させるスクリプトと補助的な `iptables` ルールを提供しています。これにより、標準の UFW コマンドを使用してコンテナへのトラフィックを制御できます。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```bash
# Install ufw-docker integration rules
sudo ufw-docker install

# Allow external access to a specific container port
sudo ufw-docker allow mycontainer 8000/tcp
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Refer to the [Docker and iptables documentation](https://docs.docker.com/engine/network/packet-filtering-firewalls/) for a deeper explanation of how Docker interacts with the host firewall.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

Docker がホストファイアウォールとどのように相互作用するかの詳しい説明については、[Docker and iptables documentation](https://docs.docker.com/engine/network/packet-filtering-firewalls/) を参照してください。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### RULE \\#6 - Use Linux Security Module (seccomp, AppArmor, or SELinux) for Runtime Security

**First of all, do not disable default security profile!** Always start with Docker’s or your host’s default profile as a baseline.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### ルール #6 - ランタイムセキュリティのため Linux Security Module (seccomp、AppArmor、SELinux) を使用する

**まず何より、デフォルトのセキュリティプロファイルを無効化しないでください!** 常に Docker またはホストのデフォルトプロファイルをベースラインとして開始してください。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

**Security Profile Recommendations:**

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

**セキュリティプロファイルの推奨事項:**

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

- **Seccomp**: Restrict syscalls to the minimum required for your container. Use Docker’s default seccomp profile as a starting point and customize per workload. [Docker Seccomp](https://docs.docker.com/engine/security/seccomp/)

- **AppArmor**: Apply per-container AppArmor profiles to enforce mandatory access controls. [Docker AppArmor](https://docs.docker.com/engine/security/apparmor/)

- **SELinux**: Enable SELinux on the host and ensure containers are labeled properly. Enforce SELinux policies to prevent unauthorized access to host resources. [SELinux Guide for Docker](https://docs.docker.com/engine/security/selinux/)

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

- **Seccomp**: コンテナに必要な最小限までシステムコールを制限します。Docker のデフォルト seccomp プロファイルを出発点として使用し、ワークロードごとにカスタマイズします。[Docker Seccomp](https://docs.docker.com/engine/security/seccomp/)

- **AppArmor**: コンテナごとの AppArmor プロファイルを適用し、強制アクセス制御を実施します。[Docker AppArmor](https://docs.docker.com/engine/security/apparmor/)

- **SELinux**: ホストで SELinux を有効にし、コンテナが適切にラベル付けされるようにします。SELinux ポリシーを適用し、ホストリソースへの不正アクセスを防ぎます。[SELinux Guide for Docker](https://docs.docker.com/engine/security/selinux/)

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

**Runtime Security Improvements:**

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

**ランタイムセキュリティの改善:**

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

- **Behavioral Monitoring**: Use tools like [Falco](https://falco.org/), [Tetragon](https://tetragon.io/), or [Cilium eBPF](https://cilium.io/) to detect unexpected or malicious container activity. Examples: Unexpected exec calls, privilege escalation attempts, unusual network connections.

- **Anomaly Detection**: Continuously monitor container processes, filesystem changes, and network activity to identify abnormal patterns in real time.

- **Kubernetes Security Context**: Configure pods or containers with seccomp and AppArmor profiles in Kubernetes. [Configure a Security Context for a Pod or Container](https://kubernetes.io/docs/tutorials/security/seccomp/)

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

- **振る舞い監視**: [Falco](https://falco.org/)、[Tetragon](https://tetragon.io/)、[Cilium eBPF](https://cilium.io/) のようなツールを使用して、予期しない、または悪意のあるコンテナ活動を検出します。例: 予期しない exec 呼び出し、権限昇格の試み、通常と異なるネットワーク接続。

- **異常検知**: コンテナプロセス、ファイルシステム変更、ネットワーク活動を継続的に監視し、異常なパターンをリアルタイムで特定します。

- **Kubernetes Security Context**: Kubernetes で Pod またはコンテナに seccomp と AppArmor プロファイルを設定します。[Configure a Security Context for a Pod or Container](https://kubernetes.io/docs/tutorials/security/seccomp/)

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### RULE \\#7 - Limit resources (memory, CPU, file descriptors, processes, restarts)

The best way to avoid DoS attacks is by limiting resources. You can limit [memory](https://docs.docker.com/config/containers/resource_constraints/#memory), [CPU](https://docs.docker.com/config/containers/resource_constraints/#cpu), maximum number of restarts (`--restart=on-failure:<number_of_restarts>`), maximum number of file descriptors (`--ulimit nofile=<number>`) and maximum number of processes (`--ulimit nproc=<number>`).

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### ルール #7 - リソースを制限する (メモリ、CPU、ファイルディスクリプタ、プロセス、再起動)

DoS 攻撃を回避する最善の方法は、リソースを制限することです。[メモリ](https://docs.docker.com/config/containers/resource_constraints/#memory)、[CPU](https://docs.docker.com/config/containers/resource_constraints/#cpu)、最大再起動回数 (`--restart=on-failure:<number_of_restarts>`)、最大ファイルディスクリプタ数 (`--ulimit nofile=<number>`)、最大プロセス数 (`--ulimit nproc=<number>`) を制限できます。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

[Check documentation for more details about ulimits](https://docs.docker.com/engine/reference/commandline/run/#set-ulimits-in-container---ulimit)

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

[ulimits の詳細についてはドキュメントを確認してください](https://docs.docker.com/engine/reference/commandline/run/#set-ulimits-in-container---ulimit)

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

You can also do this for Kubernetes: [Assign Memory Resources to Containers and Pods](https://kubernetes.io/docs/tasks/configure-pod-container/assign-memory-resource/), [Assign CPU Resources to Containers and Pods](https://kubernetes.io/docs/tasks/configure-pod-container/assign-cpu-resource/) and [Assign Extended Resources to a Container](https://kubernetes.io/docs/tasks/configure-pod-container/extended-resource/)

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

Kubernetes でも同様に実施できます: [Assign Memory Resources to Containers and Pods](https://kubernetes.io/docs/tasks/configure-pod-container/assign-memory-resource/)、[Assign CPU Resources to Containers and Pods](https://kubernetes.io/docs/tasks/configure-pod-container/assign-cpu-resource/)、[Assign Extended Resources to a Container](https://kubernetes.io/docs/tasks/configure-pod-container/extended-resource/)

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### RULE \\#8 - Set filesystem and volumes to read-only

**Run containers with a read-only filesystem** using `--read-only` flag. For example:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### ルール #8 - ファイルシステムとボリュームを読み取り専用に設定する

`--read-only` フラグを使用して、**読み取り専用ファイルシステムでコンテナを実行します**。例:

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```bash
docker run --read-only alpine sh -c 'echo "whatever" > /tmp'
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

If an application inside a container has to save something temporarily, combine `--read-only` flag with `--tmpfs` like this:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

コンテナ内のアプリケーションが一時的に何かを保存する必要がある場合は、次のように `--read-only` フラグと `--tmpfs` を組み合わせます。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```bash
docker run --read-only --tmpfs /tmp alpine sh -c 'echo "whatever" > /tmp/file'
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

The Docker Compose `compose.yml` equivalent would be:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

Docker Compose の `compose.yml` での同等の設定は次のとおりです。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```yaml
version: "3"
services:
  alpine:
    image: alpine
    read_only: true
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Equivalent in Kubernetes in [Security Context](https://kubernetes.io/docs/tasks/configure-pod-container/security-context/):

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

Kubernetes では [Security Context](https://kubernetes.io/docs/tasks/configure-pod-container/security-context/) で同等の設定を行います。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

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
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

In addition, if the volume is mounted only for reading **mount them as a read-only**
It can be done by appending `:ro` to the `-v` like this:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

さらに、ボリュームを読み取り目的でのみマウントする場合は、**読み取り専用としてマウントします**。
これは次のように `-v` に `:ro` を付けることで実施できます。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```bash
docker run -v volume-name:/path/in/container:ro alpine
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Or by using `--mount` option:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

または、`--mount` オプションを使用します。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```bash
docker run --mount source=volume-name,destination=/path/in/container,readonly alpine
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### RULE \\#9 - Integrate container scanning tools into your CI/CD pipeline

[CI/CD pipelines](https://cheatsheetseries.owasp.org/cheatsheets/CI_CD_Security_Cheat_Sheet.html) are a crucial part of the software development lifecycle and should include various security checks such as lint checks, static code analysis, and container scanning.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### ルール #9 - コンテナスキャンツールを CI/CD パイプラインに統合する

[CI/CD パイプライン](https://cheatsheetseries.owasp.org/cheatsheets/CI_CD_Security_Cheat_Sheet.html)はソフトウェア開発ライフサイクルの重要な部分であり、lint チェック、静的コード解析、コンテナスキャンなど、さまざまなセキュリティチェックを含めるべきです。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Many issues can be prevented by following some best practices when writing the Dockerfile. However, adding a security linter as a step in the build pipeline can go a long way in avoiding further headaches. Some issues that are commonly checked are:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

Dockerfile 作成時にいくつかのベストプラクティスに従うことで、多くの問題を防止できます。しかし、ビルドパイプラインのステップとしてセキュリティ linter を追加することは、さらなる悩みを避けるうえで大いに役立ちます。一般的にチェックされる問題には次のものがあります。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

- Ensure a `USER` directive is specified
- Ensure the base image version is pinned
- Ensure the OS packages versions are pinned
- Avoid the use of `ADD` in favor of `COPY`
- Avoid curl bashing in `RUN` directives

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

- `USER` ディレクティブが指定されていることを確認する
- ベースイメージのバージョンが固定されていることを確認する
- OS パッケージのバージョンが固定されていることを確認する
- `ADD` の使用を避け、`COPY` を使用する
- `RUN` ディレクティブで curl bashing を避ける

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

References:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

参考資料:

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

- [Docker Baselines on DevSec](https://dev-sec.io/baselines/docker/)
- [Use the Docker command line](https://docs.docker.com/engine/reference/commandline/cli/)
- [Overview of Docker Compose v2 CLI](https://docs.docker.com/compose/reference/overview/)
- [Configuring Logging Drivers](https://docs.docker.com/config/containers/logging/configure/)
- [View logs for a container or service](https://docs.docker.com/config/containers/logging/)
- [Dockerfile Security Best Practices](https://cloudberry.engineering/article/dockerfile-security-best-practices/)

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

- [Docker Baselines on DevSec](https://dev-sec.io/baselines/docker/)
- [Use the Docker command line](https://docs.docker.com/engine/reference/commandline/cli/)
- [Overview of Docker Compose v2 CLI](https://docs.docker.com/compose/reference/overview/)
- [Configuring Logging Drivers](https://docs.docker.com/config/containers/logging/configure/)
- [View logs for a container or service](https://docs.docker.com/config/containers/logging/)
- [Dockerfile Security Best Practices](https://cloudberry.engineering/article/dockerfile-security-best-practices/)

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Container scanning tools are especially important as part of a successful security strategy. They can detect known vulnerabilities, secrets and misconfigurations in container images and provide a report of the findings with recommendations on how to fix them. Some examples of popular container scanning tools are:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

コンテナスキャンツールは、成功するセキュリティ戦略の一部として特に重要です。これらはコンテナイメージ内の既知の脆弱性、シークレット、設定ミスを検出し、修正方法の推奨事項を含む検出結果レポートを提供できます。一般的なコンテナスキャンツールの例は次のとおりです。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

- Free
    - [Clair](https://github.com/quay/clair)
    - [Grype](https://github.com/anchore/grype)
    - [Trivy](https://github.com/aquasecurity/trivy)
- Commercial
    - [Snyk](https://snyk.io/) **(open source and free option available)**
    - [Anchore](https://github.com/anchore/grype/) **(open source and free option available)**
    - [Docker Scout](https://www.docker.com/products/docker-scout/) **(open source and free option available)**
    - [JFrog XRay](https://jfrog.com/xray/)
    - [Qualys](https://www.qualys.com/apps/container-security/)

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

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

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

To detect secrets in images:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

イメージ内のシークレットを検出するには:

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

- [ggshield](https://github.com/GitGuardian/ggshield) **(open source and free option available)**
- [Gitleaks](https://github.com/gitleaks/gitleaks) **(open source)**
- [TruffleHog](https://github.com/trufflesecurity/trufflehog) **(open source)**

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

- [ggshield](https://github.com/GitGuardian/ggshield) **(open source and free option available)**
- [Gitleaks](https://github.com/gitleaks/gitleaks) **(open source)**
- [TruffleHog](https://github.com/trufflesecurity/trufflehog) **(open source)**

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

To detect misconfigurations in Kubernetes:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

Kubernetes の設定ミスを検出するには:

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

- [kubeaudit](https://github.com/Shopify/kubeaudit)
- [kubesec.io](https://kubesec.io/)
- [kube-bench](https://github.com/aquasecurity/kube-bench)

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

- [kubeaudit](https://github.com/Shopify/kubeaudit)
- [kubesec.io](https://kubesec.io/)
- [kube-bench](https://github.com/aquasecurity/kube-bench)

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

To detect misconfigurations in Docker:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

Docker の設定ミスを検出するには:

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

- [inspec.io](https://www.inspec.io/docs/reference/resources/docker/)
- [dev-sec.io](https://dev-sec.io/baselines/docker/)
- [Docker Bench for Security](https://github.com/docker/docker-bench-security)

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

- [inspec.io](https://www.inspec.io/docs/reference/resources/docker/)
- [dev-sec.io](https://dev-sec.io/baselines/docker/)
- [Docker Bench for Security](https://github.com/docker/docker-bench-security)

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### RULE \\#10 - Keep the Docker daemon logging level at `info`

By default, the Docker daemon is configured to have a base logging level of `info`. This can be verified by checking the daemon configuration file `/etc/docker/daemon.json` for the`log-level` key. If the key is not present, the default logging level is `info`. Additionally, if the docker daemon is started with the `--log-level` option, the value of the `log-level` key in the configuration file will be overridden. To check if the Docker daemon is running with a different log level, you can use the following command:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### ルール #10 - Docker デーモンのログレベルを `info` に保つ

デフォルトでは、Docker デーモンは基本ログレベルが `info` になるように設定されています。これは、デーモン設定ファイル `/etc/docker/daemon.json` の `log-level` キーを確認することで検証できます。キーが存在しない場合、デフォルトのログレベルは `info` です。さらに、docker デーモンが `--log-level` オプション付きで起動されている場合、設定ファイルの `log-level` キーの値は上書きされます。Docker デーモンが異なるログレベルで実行されているか確認するには、次のコマンドを使用できます。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```bash
ps aux | grep '[d]ockerd.*--log-level' | awk '{for(i=1;i<=NF;i++) if ($i ~ /--log-level/) print $i}'
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Setting an appropriate log level, configures the Docker daemon to log events that you would want to review later. A base log level of 'info' and above would capture all logs except the debug logs. Until and unless required, you should not run docker daemon at the 'debug' log level.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

適切なログレベルを設定すると、後で確認したいイベントを Docker デーモンがログに記録するようになります。基本ログレベルが 'info' 以上であれば、debug ログを除くすべてのログを取得できます。必要な場合を除き、docker デーモンを 'debug' ログレベルで実行すべきではありません。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Rule \\#11 - Run Docker in rootless mode

Rootless mode ensures that the Docker daemon and containers are running as an unprivileged user, which means that even if an attacker breaks out of the container, they will not have root privileges on the host, which in turn substantially limits the attack surface. This is different to [userns-remap](#rule-2---set-a-user) mode, where the daemon still operates with root privileges.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### ルール #11 - rootless モードで Docker を実行する

Rootless モードは、Docker デーモンとコンテナが非特権ユーザーとして実行されることを保証します。つまり、攻撃者がコンテナから脱出してもホスト上の root 権限を持たず、結果として攻撃対象領域が大幅に制限されます。これは、デーモンが依然として root 権限で動作する [userns-remap](#ルール-2---ユーザーを設定する) モードとは異なります。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Evaluate the [specific requirements](https://cheatsheetseries.owasp.org/cheatsheets/Attack_Surface_Analysis_Cheat_Sheet.html) and [security posture](https://cheatsheetseries.owasp.org/cheatsheets/Threat_Modeling_Cheat_Sheet.html) of your environment to determine if rootless mode is the best choice for you. For environments where security is a paramount concern and the [limitations of rootless mode](https://docs.docker.com/engine/security/rootless/#known-limitations) do not interfere with operational requirements, it is a strongly recommended configuration. Alternatively consider using [Podman](#podman-as-an-alternative-to-docker) as an alternative to Docker.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

環境の[具体的な要件](https://cheatsheetseries.owasp.org/cheatsheets/Attack_Surface_Analysis_Cheat_Sheet.html)と[セキュリティ体制](https://cheatsheetseries.owasp.org/cheatsheets/Threat_Modeling_Cheat_Sheet.html)を評価し、rootless モードが最適な選択かどうかを判断してください。セキュリティが最重要であり、[rootless モードの制限](https://docs.docker.com/engine/security/rootless/#known-limitations)が運用要件と衝突しない環境では、強く推奨される設定です。代替案として、Docker の代わりに [Podman](#docker-の代替としての-podman) を使用することも検討してください。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

> Rootless mode allows running the Docker daemon and containers as a non-root user to mitigate potential vulnerabilities in the daemon and the container runtime.
> Rootless mode does not require root privileges even during the installation of the Docker daemon, as long as the [prerequisites](https://docs.docker.com/engine/security/rootless/#prerequisites) are met.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

> Rootless mode allows running the Docker daemon and containers as a non-root user to mitigate potential vulnerabilities in the daemon and the container runtime.
> Rootless mode does not require root privileges even during the installation of the Docker daemon, as long as the [prerequisites](https://docs.docker.com/engine/security/rootless/#prerequisites) are met.

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Read more about rootless mode and its limitations, installation and usage instructions on [Docker documentation](https://docs.docker.com/engine/security/rootless/) page.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

Rootless モードとその制限、インストールおよび使用手順の詳細は、[Docker documentation](https://docs.docker.com/engine/security/rootless/) ページで確認してください。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### RULE \\#12 - Utilize Docker Secrets for Sensitive Data Management

Docker Secrets provide a secure way to store and manage sensitive data such as passwords, tokens, and SSH keys. Using Docker Secrets helps in avoiding the exposure of sensitive data in container images or in runtime commands.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### ルール #12 - 機微データ管理に Docker Secrets を活用する

Docker Secrets は、パスワード、トークン、SSH キーなどの機微データを保存および管理する安全な方法を提供します。Docker Secrets を使用すると、コンテナイメージやランタイムコマンド内で機微データが露出することを避けやすくなります。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```bash
docker secret create my_secret /path/to/super-secret-data.txt
docker service create --name web --secret my_secret nginx:latest
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Or for Docker Compose:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

または Docker Compose では次のようにします。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

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

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

While Docker Secrets generally provide a secure way to manage sensitive data in Docker environments, this approach is not recommended for Kubernetes, where secrets are stored in plaintext by default. In Kubernetes, consider using additional security measures such as etcd encryption, or third-party tools. Refer to the [Secrets Management Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html) for more information.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

Docker Secrets は一般に Docker 環境で機微データを管理する安全な方法を提供しますが、Kubernetes では secrets がデフォルトで平文として保存されるため、このアプローチは推奨されません。Kubernetes では、etcd 暗号化やサードパーティツールなど、追加のセキュリティ対策を検討してください。詳細については [Secrets Management Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html) を参照してください。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### RULE \\#13 - Enhance Supply Chain Security

Building on the principles in [Rule \\#9](#rule-9---integrate-container-scanning-tools-into-your-cicd-pipeline), enhancing supply chain security involves implementing additional measures to secure the entire lifecycle of container images from creation to deployment. Some of the key practices include:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### ルール #13 - サプライチェーンセキュリティを強化する

[ルール #9](#ルール-9---コンテナスキャンツールを-cicd-パイプラインに統合する)の原則を踏まえると、サプライチェーンセキュリティの強化には、コンテナイメージの作成からデプロイまでのライフサイクル全体を保護する追加対策の実装が含まれます。主な実践事項には次のものがあります。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

- [Image Provenance](https://slsa.dev/spec/v1.0/provenance): Document the origin and history of container images to ensure traceability and integrity.
- [SBOM Generation](https://cyclonedx.org/guides/CycloneDX%20One%20Pager.pdf): Create a Software Bill of Materials (SBOM) for each image, detailing all components, libraries, and dependencies for transparency and vulnerability management.
- [Image Signing](https://github.com/notaryproject/notary): Digitally sign images to verify their integrity and authenticity, establishing trust in their security.
- [Trusted Registry](https://snyk.io/learn/container-security/container-registry-security/): Store the documented, signed images with their SBOMs in a secure registry that enforces strict [access controls](https://cheatsheetseries.owasp.org/cheatsheets/Access_Control_Cheat_Sheet.html) and supports metadata management.
- [Secure Deployment](https://www.openpolicyagent.org/docs/latest/#overview): Implement secure deployment polices, such as image validation, runtime security, and continuous monitoring, to ensure the security of the deployed images.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

- [Image Provenance](https://slsa.dev/spec/v1.0/provenance): コンテナイメージの出所と履歴を文書化し、追跡可能性と完全性を確保します。
- [SBOM Generation](https://cyclonedx.org/guides/CycloneDX%20One%20Pager.pdf): 各イメージについて Software Bill of Materials (SBOM) を作成し、透明性と脆弱性管理のために、すべてのコンポーネント、ライブラリ、依存関係を詳述します。
- [Image Signing](https://github.com/notaryproject/notary): イメージにデジタル署名し、その完全性と真正性を検証して、セキュリティへの信頼を確立します。
- [Trusted Registry](https://snyk.io/learn/container-security/container-registry-security/): 文書化され署名されたイメージとその SBOM を、厳格な[アクセス制御](https://cheatsheetseries.owasp.org/cheatsheets/Access_Control_Cheat_Sheet.html)を実施しメタデータ管理をサポートする安全なレジストリに保存します。
- [Secure Deployment](https://www.openpolicyagent.org/docs/latest/#overview): イメージ検証、ランタイムセキュリティ、継続的監視などの安全なデプロイポリシーを実装し、デプロイされたイメージのセキュリティを確保します。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## Podman as an alternative to Docker

[Podman](https://podman.io/) is an OCI-compliant, open-source container management tool developed by [Red Hat](https://www.redhat.com/en) that provides a Docker-compatible command-line interface and a desktop application for managing containers. It is designed to be a more secure and lightweight alternative to Docker, especially for environments where secure defaults are preferred. Some of the security benefits of Podman include:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## Docker の代替としての Podman

[Podman](https://podman.io/) は、[Red Hat](https://www.redhat.com/en) が開発した OCI 準拠のオープンソースコンテナ管理ツールであり、Docker 互換のコマンドラインインターフェースと、コンテナを管理するためのデスクトップアプリケーションを提供します。これは、特にセキュアなデフォルトが望まれる環境において、Docker より安全で軽量な代替手段となるよう設計されています。Podman のセキュリティ上の利点には次のものがあります。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

1. Daemonless Architecture: Unlike Docker, which requires a central daemon (dockerd) to create, run, and manage containers, Podman directly employs the fork-exec model. When a user requests to start a container, Podman forks from the current process, then the child process execs into the container's runtime.
2. Rootless Containers: The fork-exec model facilitates Podman's ability to run containers without requiring root privileges. When a non-root user initiates a container start, Podman forks and execs under the user's permissions.
3. SELinux Integration: Podman is built to work with SELinux, which provides an additional layer of security by enforcing mandatory access controls on containers and their interactions with the host system.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

1. デーモンレスアーキテクチャ: コンテナの作成、実行、管理に中央デーモン (dockerd) を必要とする Docker とは異なり、Podman は fork-exec モデルを直接使用します。ユーザーがコンテナの起動を要求すると、Podman は現在のプロセスから fork し、その後子プロセスがコンテナのランタイムへ exec します。
2. Rootless コンテナ: fork-exec モデルは、root 権限を必要とせずにコンテナを実行する Podman の能力を支えています。非 root ユーザーがコンテナ起動を開始すると、Podman はそのユーザーの権限で fork および exec します。
3. SELinux 統合: Podman は SELinux と連携するよう構築されています。SELinux は、コンテナおよびホストシステムとの相互作用に強制アクセス制御を適用することで、追加のセキュリティ層を提供します。

</div>
</div>

</section>
</div>

## References

<div className="referenceFooter">

[OWASP Docker Top 10](https://github.com/OWASP/Docker-Security)
[Docker Security Best Practices](https://docs.docker.com/develop/security-best-practices/)
[Docker Engine Security](https://docs.docker.com/engine/security/)
[Kubernetes Security Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Kubernetes_Security_Cheat_Sheet.html)
[SLSA - Supply Chain Levels for Software Artifacts](https://slsa.dev/)
[Sigstore](https://sigstore.dev/)
[Docker Build Attestation](https://docs.docker.com/build/attestations/)
[Docker Content Trust](https://docs.docker.com/engine/security/trust/)

</div>


## Attribution

<div className="attributionFooter">

- Original: Docker Security Cheat Sheet
- Source: https://cheatsheetseries.owasp.org/cheatsheets/Docker_Security_Cheat_Sheet.html
- Copyright: Cheat Sheets Series Team
- License: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
- License URL: https://creativecommons.org/licenses/by-sa/4.0/
- Changes: English original retained for comparison. Japanese translation added. Bilingual display generated from official source and local Japanese translation.
- Retrieved: 2026-05-20

</div>
