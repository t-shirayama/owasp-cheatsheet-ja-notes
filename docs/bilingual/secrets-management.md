---
title: Secrets Management Cheat Sheet
hide_title: true
---

<div className="docHero" data-category="cryptographic-storage">
  <h1>シークレット管理チートシート</h1>
  <div className="docMeta">
    <span className="docPill">最終更新: 2026-05-21</span>
    <span className="docPill">読了時間: 約 28 分</span>
    <span className="docPill">カテゴリ: 暗号</span>
  </div>
</div>

<p className="docLead">Secrets Management Cheat Sheet を、原文・翻訳・対比表示で確認できます。ASVS Index 対応の文脈で、シークレットの保管、ローテーション、検出、インシデント対応を整理しています。</p>

<div className="tabbedContent">
  <input className="tabInput" type="radio" name="secrets-management-view" id="secrets-management-original" />
  <input className="tabInput" type="radio" name="secrets-management-view" id="secrets-management-translation" defaultChecked />
  <input className="tabInput" type="radio" name="secrets-management-view" id="secrets-management-bilingual" />

  <div className="contentTabs">
    <label htmlFor="secrets-management-original" title="OWASP 原文">原文</label>
    <label htmlFor="secrets-management-translation" title="日本語訳">翻訳</label>
    <label htmlFor="secrets-management-bilingual" title="原文と翻訳を並べて確認">対比表示</label>
  </div>

<section id="secrets-management-original-panel" className="tabPanel originalPanel contentPanel">

# Secrets Management Cheat Sheet

## 1 Introduction

Secrets are being used everywhere nowadays, especially with the popularity of the DevOps movement. Application Programming Interface (API) keys, database credentials, Identity and Access Management (IAM) permissions, Secure Shell (SSH) keys, certificates, etc. Many organizations have them hardcoded within the source code in plaintext, littered throughout configuration files and configuration management tools.

There is a growing need for organizations to centralize the storage, provisioning, auditing, rotation and management of secrets to control access to secrets and prevent them from leaking and compromising the organization. Often, services share the same secrets, which makes identifying the source of compromise or leak challenging.

This cheat sheet offers best practices and guidelines to help properly implement secrets management.

## 2 General Secrets Management

The following sections address the main concepts relating to secrets management.

### 2.1 High Availability

It is vital to select a technology that is robust enough to service traffic reliably:

- Users (e.g., SSH keys, root account passwords). In an incident response scenario, users expect to be provisioned with credentials rapidly, so they can recover services that have gone offline. Having to wait for credentials could impact the responsiveness of the operations team.
- Applications (e.g., database credentials and API keys). If the service is not performant, it could degrade the availability of dependent applications or increase application startup times.

Such a service could receive a considerable volume of requests within a large organization.

### 2.2 Centralize and Standardize

Secrets used by your DevOps teams for your applications might be consumed differently than secrets stored by your marketeers or your SRE team. You often find poorly maintained secrets where the needs of secret consumers or producers mismatch. Therefore, you must standardize and centralize the secrets management solution with care. Standardizing and centralizing can mean that you use multiple secret management solutions. For instance: your cloud-native development teams choose to use the solution provided by the cloud provider, while your private cloud uses a third-party solution, and everybody has an account for a selected password manager.
By making sure that the teams standardize the interaction with these different solutions, they remain maintainable and usable in the event of an incident.
Even when a company centralizes its secrets management to just one solution, you will often have to secure the primary secret of that secrets management solution in a secondary secrets management solution. For instance, you can use a cloud provider's facilities to store secrets, but that cloud provider's root/management credentials need to be stored somewhere else.

Standardization should include Secrets life cycle management, Authentication, Authorization, and Accounting of the secrets management solution, and life cycle management. Note that it should be immediately apparent to an organization what a secret is used for and where to find it. The more Secrets management solutions you use, the more documentation you need.

### 2.3 Access Control

When users can read and/or update the secret in a secret management system, it means that the secret can now leak through that user and the system they used to touch the secret.
Therefore, engineers should not have access to all secrets in the secrets management system, and the Least Privilege principle should be applied. The secret management system needs to provide the ability to configure fine-grained access controls on each object and component to accomplish the Least Privilege principle.

### 2.4 Automate Secrets Management

Manual maintenance not only increases the risk of leakage; it also introduces the risk of human errors while maintaining the secret. Furthermore, it can become wasteful.
Therefore, it is better to limit or remove the human interaction with the actual secrets. You can restrict human interaction in multiple ways:

- **Secrets pipeline:** Having a secrets pipeline that does large parts of the secret management (e.g., creation, rotation, etc.)
- **Using dynamic secrets:** When an application starts, it could request its database credentials, which, when dynamically generated, will be provided with new credentials for that session. Dynamic secrets should be used where possible to reduce the surface area of credential reuse. Should the application's database credentials be stolen, upon reboot they would be expired.
- **Automated rotation of static secrets:** Key rotation is a challenging process when implemented manually, and can lead to mistakes. It is therefore better to automate the rotation of keys or at least ensure that the process is sufficiently supported by IT.

Rotating certain keys, such as encryption keys, might trigger full or partial data re-encryption. Different strategies for rotating keys exist:

- Gradual rotation
- Introducing new keys for Write operations
- Leaving old keys for Read operations
- Rapid rotation
- Scheduled rotation
- and more...

#### 2.4.1 Architectural Patterns for Automated Rotation

To illustrate how to design systems that support automated secret rotation, here are a few architectural patterns:

##### Example 1: Kubernetes with a Sidecar Container

In a Kubernetes environment, a common pattern is to use a sidecar container that is responsible for retrieving secrets from a secrets manager and making them available to the main application container. This decouples the application from the specifics of the secrets management solution.

- **Architecture:**
    - A Pod contains two containers: the main application container and a sidecar container (e.g., HashiCorp Vault Agent, CyberArk Conjur Secrets Provider).
    - The sidecar container authenticates with the secrets manager (e.g., using a Kubernetes Service Account).
    - It retrieves the secret and writes it to a shared in-memory volume.
    - The application container reads the secret from the shared volume.
    - The sidecar container can periodically refresh the secret, ensuring the application always has a valid, short-lived credential.
- **Kubernetes Manifest Snippet:**

    ```yaml
    apiVersion: v1
    kind: Pod
    metadata:
      name: my-app
    spec:
      serviceAccountName: my-app-sa
      containers:
      - name: my-app-container
        image: my-app-image
        volumeMounts:
        - name: secrets-volume
          mountPath: "/mnt/secrets"
          readOnly: true
      - name: vault-agent-sidecar
        image: vault:latest
        args: ["agent", "-config=/etc/vault/vault-agent-config.hcl"]
        volumeMounts:
        - name: secrets-volume
          mountPath: "/mnt/secrets"
      volumes:
      - name: secrets-volume
        emptyDir:
          medium: "Memory"
    ```

##### Example 2: Serverless Function for Database Credential Rotation

Cloud-native secret managers often provide built-in support for automated rotation using serverless functions (e.g., AWS Lambda, Azure Functions).

- **Architecture:**
    - A secret is stored in a cloud secrets manager (e.g., AWS Secrets Manager).
    - The secrets manager is configured to trigger a rotation Lambda function on a schedule.
    - The Lambda function has the necessary permissions to update the database password and the secret value in the secrets manager.
    - The rotation process typically involves multiple steps (create new secret, set new secret, test new secret, finish rotation) to ensure a safe transition.
- **AWS Lambda Rotation Function (Conceptual Python Code):**

    ```python
    import boto3
    import os

    def lambda_handler(event, context):
        secret_name = event['SecretId']
        token = event['ClientRequestToken']
        step = event['Step']

        secrets_manager = boto3.client('secretsmanager')
        # Get the secret metadata
        metadata = secrets_manager.describe_secret(SecretId=secret_name)

        if step == "createSecret":
            # Create a new version of the secret
            new_password = generate_new_password()
            secrets_manager.put_secret_value(
                SecretId=secret_name,
                ClientRequestToken=token,
                SecretString=f'{{"password":"{new_password}"}}',
                VersionStages=['AWSPENDING']
            )
        elif step == "setSecret":
            # Update the database with the new password
            update_database_password(new_password)
        elif step == "testSecret":
            # Test the new secret
            test_database_connection(new_password)
        elif step == "finishSecret":
            # Mark the new version of the secret as current
            secrets_manager.update_version_stage(
                SecretId=secret_name,
                VersionStage="AWSCURRENT",
                MoveToVersionId=token
            )
    ```

These examples demonstrate how you can create architectures that not only manage secrets securely but also automate the rotation process, significantly reducing the risk of compromised credentials.

### 2.5 Handling Secrets in Memory

An additional level of security can be achieved by minimizing the time window
where a secret is in memory and limiting the access to its memory space.

Depending on your application's particular circumstances, this can be difficult
to implement in a manner that ensures memory security. Because of this potential
implementation complexity, you are first encouraged to develop a threat model in order to clearly
surface your implicit assumptions about both your application's deployment environment as well
as understand the capabilities of your adversaries.

Often attempting to protect secrets in memory will be considered overkill
because as you evaluate a threat model, the potential threat
actors that you consider either do not have the capabilities to carry out such attacks
or the cost of defense far exceeds the likely impact of a compromise arising from
exposing secrets in memory. Also, it should be kept in mind while developing an
appropriate threat model, that if an attacker already has access to the memory of
the process handling the secret, by that time a security breach may have already
occurred. Furthermore, it should be recognized that with the advent of attacks like
[Rowhammer](https://arxiv.org/pdf/2211.07613.pdf), or
[Meltdown and Spectre](https://meltdownattack.com/), it is important
to understand that the operating system alone is not sufficient to protect your process
memory from these types of attacks. This becomes especially important when your
application is deployed to the cloud. The only foolproof approach to protecting memory
against these and similar attacks is to fully physically isolate your process memory from all other
untrusted processes.

Despite the implementation difficulties, in highly sensitive
environments, protecting secrets in memory can
be a valuable additional layer of security. For example, in scenarios where an
advanced attacker can cause a system to crash and gain access to a memory dump,
they may be able to extract secrets from it. Therefore, carefully safeguarding
secrets in memory is recommended for untrusted environments or situations where
tight security is of utmost importance.

Furthermore, in lower-level languages like C/C++, it is relatively easy to protect
secrets in memory. Thus, it may be worthwhile to implement this practice even if
the risk of an attacker gaining access to the memory is low. On the other hand, for
programming languages that rely on garbage collection, securing secrets in memory
generally is much more difficult.

- **Structures and Classes:** In .NET and Java, do not use immutable structures
    such as Strings to store secrets, since it is impossible to force them to
    be garbage collected. Instead, use primitive types such as byte arrays or
    char arrays, where the memory can be directly overwritten.

- **Zeroing Memory:** After a secret has been used, the memory it occupied
  should be zeroed out to prevent it from lingering in memory where it could
  potentially be accessed.

- **Memory Encryption:** In some cases, it may be possible to use hardware or
  operating system features to encrypt the entire memory space of the process
  handling the secret. This can provide an additional layer of security.

Remember, the goal is to minimize the time window where the secret is in
plaintext in memory as much as possible.

For more detailed information, see
[Testing Memory for Sensitive Data](https://mas.owasp.org/MASTG/tests/android/MASVS-STORAGE/MASTG-TEST-0011)
from the OWASP MAS project.

### 2.6 Auditing

Auditing is an essential part of secrets management due to the nature of the application. You must implement auditing securely to be resilient against attempts to tamper with or delete the audit logs. At a minimum, you should audit the following:

- Who requested a secret and for what system and role.
- Whether the secret request was approved or rejected.
- When the secret was used and by whom/what.
- When the secret has expired.
- Whether there were any attempts to reuse expired secrets.
- If there have been any authentication or authorization errors.
- When the secret was updated and by whom/what.
- Any administrative actions and possible user activity on the underlying supporting infrastructure stack.

It is essential that all auditing has correct timestamps. Therefore, the secret management solution should have proper time sync protocols set up at its supporting infrastructure. You should monitor the stack on which the solution runs for possible clock-skew and manual time adjustments.

### 2.7 Secret Lifecycle

Secrets follow a lifecycle. The stages of the lifecycle are as follows:

- Creation
- Rotation
- Revocation
- Expiration

#### 2.7.1 Creation

New secrets must be securely generated and cryptographically robust enough for their purpose. Secrets must have the minimum privileges assigned to them to enable their required use/role.

You should transmit credentials securely, such that ideally, you don't send the password along with the username when requesting user accounts. Instead, you should send the password via a secure channel (e.g., mutually authenticated connection) or a side-channel such as push notification, SMS, email. Refer to the [Multi-Factor Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Multifactor_Authentication_Cheat_Sheet) to learn about the pros and cons of each channel.

Applications may not benefit from having multiple communication channels, so you must provision credentials securely.

See [the Open CRE project on secrets lookup](https://www.opencre.org/cre/223-780) for more technical recommendations on secret creation.

#### 2.7.2 Rotation

You should regularly rotate secrets so that any stolen credentials will only work for a short time. Regular rotation will also reduce the tendency for users to fall back to bad habits such as reusing credentials.

Depending on a secret's function and what it protects, the lifetime could be from minutes (think end-to-end encrypted chats with perfect forward secrecy) to years (consider hardware secrets).

User credentials are excluded from regular rotation. These should only be rotated if there is suspicion or evidence that they have been compromised, according to [NIST recommendations](https://pages.nist.gov/800-63-FAQ/#q-b05).

#### 2.7.3 Revocation

When secrets are no longer required or potentially compromised, you must securely revoke them to restrict access. With (TLS) certificates, this also involves certificate revocation.

#### 2.7.4 Expiration

You should create secrets to expire after a defined time where possible. This expiration can either be active expiration by the secret consuming system, or an expiration date set at the secrets management system forcing supporting processes to be triggered, resulting in a secret rotation.
You should apply policies through the secrets management solution to ensure credentials are only made available for a limited time appropriate for the type of credentials. Applications should verify that the secret is still active before trusting it.

### 2.8 Transport Layer Security (TLS) Everywhere

Never transmit secrets via plaintext. In this day and age, there is no excuse given the ubiquitous adoption of TLS.

Furthermore, you can effectively use secrets management solutions to provision TLS certificates.

### 2.9 Downtime, Break-glass, Backup and Restore

Consider the possibility that a secrets management service becomes unavailable for various reasons, such as scheduled downtime for maintenance. It could be impossible to retrieve the credentials required to restore the service if you did not previously acquire them. Thus, choose maintenance windows carefully based on earlier metrics and audit logs.

Next, the backup and restore procedures of the system should be regularly tested and audited for their security. A few requirements regarding backup & restore. Ensure that:

- An automated backup procedure is in place and executed periodically; base the frequency of the backups and snapshots on the number of secrets and their lifecycle.
- Frequently test restore procedures to guarantee that the backups are intact.
- Encrypt backups and put them on secure storage with reduced access rights. Monitor the backup location for (unauthorized) access and administrative actions.

Lastly, you should implement emergency ("break-glass") processes to restore the service if the system becomes unavailable for reasons other than regular maintenance. Therefore, emergency break-glass credentials should be regularly backed up securely in a secondary secrets management system and tested routinely to verify they work.

### 2.10 Policies

Consistently enforce policies defining the minimum complexity requirements of passwords and approved encryption algorithms at an organization-wide level. Using a centralized secrets management solution can help companies implement these policies.

Next, having an organization-wide secrets management policy can help enforce applying the best practices defined in this cheat sheet.

### 2.11 Metadata: prepare to move the secret

A secret management solution should provide the capability to store at least the following metadata about a secret:

- When it was created/consumed/archived/rotated/deleted
- Who created/consumed/archived/rotated/deleted it (e.g., both the actual producer and the engineer using the production method)
- What created/consumed/archived/rotated/deleted it
- Who to contact when having trouble with the secret or having questions about it
- For what the secret is used (e.g., designated intended consumers and purpose of the secret)
- What type of secret it is (e.g., AES Key, HMAC key, RSA private key)
- When you need to rotate it, if done manually

Note: if you don't store metadata about the secret nor prepare to move, you will increase the probability of vendor lock-in.

### 2.12 Passwordless Authentication and Token Security

While not a direct replacement for all types of secrets (e.g., API keys, database credentials), passwordless authentication mechanisms like **OpenID Connect (OIDC)** can significantly reduce the attack surface by moving away from user-managed passwords. Instead of passwords, applications rely on trusted identity providers (IdPs) to authenticate users and receive secure tokens.

**How it helps:**

- **Reduces Password-Related Risks:** Eliminates threats like phishing, credential stuffing, and weak password practices.
- **Centralized Identity Management:** Authentication is handled by a specialized IdP, which can enforce strong authentication policies (e.g., MFA).
- **Short-Lived Sessions:** OIDC tokens are typically short-lived, limiting the window of opportunity for an attacker if a token is compromised.

**Token Security is Crucial:**

Adopting passwordless authentication shifts the security focus from protecting static passwords to protecting dynamic tokens (e.g., ID tokens, access tokens, refresh tokens). These tokens are bearer tokens, meaning anyone who possesses one can use them. Therefore, it is critical to:

- **Secure Token Transmission:** Always transmit tokens over TLS.
- **Protect Tokens in Storage:** Do not store tokens in insecure locations like local storage in a browser. Use secure, HTTP-only cookies or appropriate secure storage mechanisms for mobile applications.
- **Validate Tokens Correctly:** Always validate the signature, issuer, and audience of a token to ensure it is legitimate.
- **Manage Token Lifetime:** Use short-lived access tokens and implement a secure refresh token rotation strategy.

For more detailed guidance on securing OAuth 2.0 and OpenID Connect implementations, refer to the [OAuth2 Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/OAuth2_Cheat_Sheet.html).

## 3 Continuous Integration (CI) and Continuous Deployment (CD)

Building, testing and deploying changes generally requires access to many systems. Continuous Integration (CI) and Continuous Deployment (CD) tools typically store secrets to provide configuration to the application or during deployment. Alternatively, they interact heavily with the secrets management system. Various best practices can help smooth out secret management in CI/CD; we will deal with some of them in this section.

### 3.1 Hardening your CI/CD pipeline

CI/CD tooling consumes (high-privilege) credentials regularly. Ensure that the pipeline cannot be easily hacked or misused by employees. Here are a few guidelines which can help you:

- Treat your CI/CD tooling as a production environment: harden it, patch it and harden the underlying infrastructure and services.
- Have Security Event Monitoring in place.
- Implement least-privilege access: developers do not need to be able to administer projects. Instead, they only need to be able to execute required functions, such as setting up pipelines, running them, and working with code. Administrative tasks can quickly be done using configuration-as-code in a separate repository used by the CI/CD system to update its configuration. There is no need for privileged roles that might have access to secrets.
- Make sure that pipeline output does not leak secrets, and you can't listen in on production pipelines with debugging tools.
- Make sure you cannot exec into any runners and workers for a CI/CD system.
- Have proper authentication, authorization and accounting in place.
- Ensure only an approved process can create pipelines, including MR/PR steps to ensure that a created pipeline is security-reviewed.

### 3.2 Where should a secret be?

There are various places where you can store a secret to execute CI/CD actions:

- As part of your CI/CD tooling: you can store a secret in [GitLab](https://docs.gitlab.com/charts/installation/secrets.html)/[GitHub](https://docs.github.com/en/actions/security-guides/encrypted-secrets)/[Jenkins](https://www.jenkins.io/doc/developer/security/secrets/). This is not the same as committing it to code.
- As part of your secrets-management system: you can store a secret in a secrets management system, such as facilities provided by a cloud provider ([AWS Secrets Manager](https://aws.amazon.com/secrets-manager/), [Azure Key Vault](https://azure.microsoft.com/nl-nl/services/key-vault/), [Google Secret Manager](https://cloud.google.com/secret-manager)), or other third-party facilities ([Hashicorp Vault](https://www.vaultproject.io/), [Conjur](https://www.conjur.org/), [Keeper](https://www.keepersecurity.com/)). In this case, the CI/CD pipeline tooling requires credentials to connect to these secret management systems to have secrets in place. See [Cloud Providers](#4-cloud-providers) for more details on using a cloud provider's secret management system.

Another alternative here is using the CI/CD pipeline to leverage the Encryption as a Service from the secrets management systems to do the encryption of a secret. The CI/CD tooling can then commit the encrypted secret to git, which can be fetched by the consuming service on deployment and decrypted again. See section 3.6 for more details.

Note: not all secrets must be in the CI/CD pipeline to get to the actual deployment. Instead, make sure that the deployed services take care of part of their secrets management at their own lifecycle (e.g., deployment, runtime and destruction).

#### 3.2.1 As part of your CI/CD tooling

When secrets are part of your CI/CD tooling, it means that these secrets are exposed to your CI/CD jobs. CI/CD tooling can comprise, e.g., GitHub secrets, GitLab repository secrets, ENV Vars/Var Groups in Microsoft Azure DevOps, Kubernetes Secrets, etc.
These secrets are often configurable/viewable by people who have the authorization to do so (e.g., a maintainer in GitHub, a project owner in GitLab, an admin in Jenkins, etc.), which together line up for the following best practices:

- No "big secret": ensure that secrets in your CI/CD tooling that are not long-term, don't have a wide blast radius, and don't have a high value. Also, limit shared secrets (e.g., never have one password for all administrative users).
- As is / To be: have a clear overview of which users can view or alter the secrets. Often, maintainers of a GitLab/GitHub project can see or otherwise extract its secrets.
- Reduce the number of people that can perform administrative tasks on the project to limit exposure.
- Log & Alert: Assemble all the logs from the CI/CD tooling and have rules in place to detect secret extraction or misuse, whether through accessing them through a web interface or dumping them while double Base64 encoding or encrypting them with OpenSSL.
- Rotation: Regularly rotate secrets.
- Forking should not leak: Validate that a fork of the repository or copy of the job definition does not copy the secret.
- Document: Make sure you document which secrets you store as part of your CI/CD tooling and why so that you can migrate these easily when required.

#### 3.2.2 Storing it in a secrets management system

Naturally, you can store secrets in a designated secrets management solution. For example, you can use a solution offered by your (cloud) infrastructure provider, such as [AWS Secrets Manager](https://aws.amazon.com/secrets-manager/), [Google Secrets Manager](https://cloud.google.com/secret-manager), or [Azure Key Vault](https://azure.microsoft.com/nl-nl/services/key-vault/). You can find more information about these in [section 4](#4-cloud-providers) of this cheat sheet. Another option is a dedicated secrets management system, such as [Hashicorp Vault](https://www.vaultproject.io/), [Keeper](https://www.keepersecurity.com/), [Conjur](https://www.conjur.org/).
Here are a few do's and don'ts for the CI/CD interaction with these systems. Make sure that the following is taken care of:

- Rotation/Temporality: credentials used by the CI/CD tooling to authenticate against the secret management system are rotated frequently and expire after a job completes.
- Scope of authorization: scope credentials used by the CI/CD tooling (e.g., roles, users, etc.), only authorize those secrets and services of the secret management system required for the CI/CD tooling to execute its job.
- Attribution of the caller: credentials used by the CI/CD tooling still hold attribution of the one calling the secrets management solution. Ensure you can attribute any calls made by the CI/CD tooling to a person or service that requested the actions of the CI/CD tooling. If this is not possible through the default configuration of the secrets manager, make sure that you have a correlation setup in terms of request parameters.
- All of the above: Still follow those do's and don'ts listed in section 3.2.1: log & alert, take care of forking, etc.
- Backup: back up secrets to product-critical operations in separate storage (e.g., cold storage), especially encryption keys.

#### 3.2.3 Not touched by CI/CD at all

Secrets do not necessarily need to be brought to a consumer of the secret by a CI/CD pipeline. It is even better when the consumer of the secret retrieves the secret. In that case, the CI/CD pipeline still needs to instruct the orchestrating system (e.g., [Kubernetes](https://kubernetes.io/)) that it needs to schedule a specific service with a given service account with which the consumer can then retrieve the required secret. The CI/CD tooling then still has credentials for the orchestrating platform but no longer has access to the secrets themselves. The do's and don'ts regarding these credentials types are similar to those described in section 3.2.2.

### 3.3 Authentication and Authorization of CI/CD tooling

CI/CD tooling should have designated service accounts, which can only operate in the scope of the required secrets or orchestration of the consumers of a secret. Additionally, a CI/CD pipeline run should be easily attributable to the one who has defined the job or triggered it to detect who has tried to exfiltrate secrets or manipulate them. When you use certificate-based auth, the caller of the pipeline identity should be part of the certificate. If you use a token to authenticate towards the mentioned systems, make sure you set the principal requesting these actions (e.g., the user or the job creator).

Verify on a periodic basis whether this is (still) the case for your system so that you can do logging, attribution, and security alerting on suspicious actions effectively.

### 3.4 Logging and Accounting

Attackers can use CI/CD tooling to extract secrets. They could, for example, use administrative interfaces or job creation that exfiltrates the secret using encryption or double Base64 encoding. Therefore, you should log every action in a CI/CD tool. You should define security alerting rules at every non-standard manipulation of the pipeline tool and its administrative interface to monitor secret usage.
Logs should be queryable for at least 90 days and stored for a more extended period in cold storage. It might take security teams time to understand how attackers can exfiltrate or manipulate a secret using CI/CD tooling.

### 3.5 Rotation vs Dynamic Creation

You can leverage CI/CD tooling to rotate secrets or instruct other components to do the rotation of the secret. For instance, the CI/CD tool can request a secrets management system or another application to rotate the secret. Alternatively, the CI/CD tool or another component could set up a dynamic secret: a secret required for a consumer to use for as long as it lives. The secret is invalidated when the consumer no longer lives. This procedure reduces possible leakage of a secret and allows for easy detection of misuse. If an attacker uses a secret from anywhere other than the consumer's IP, you can easily detect it.

### 3.6 Pipeline Created Secrets

You can use pipeline tooling to generate secrets and either offer them directly to the service deployed by the tooling or provide the secret to a secrets management solution. Alternatively, the secret can be stored encrypted in git so that the secret and its metadata is as close to the developer's daily place of work as possible. A git-stored secret does require that developers cannot decrypt the secrets themselves and that every consumer of a secret has its encrypted variant of the secret. For instance: the secret should then be different per DTAP environment and be encrypted with another key. For each environment, only the designated consumer in that environment should be able to decrypt the specific secret. A secret does not leak cross-environment and can still be easily stored next to the code.
Consumers of a secret could now decrypt the secret using a sidecar, as described in section 5.2. Instead of retrieving the secrets, the consumer would leverage the sidecar to decrypt the secret.

When a pipeline creates a secret by itself, ensure that the scripts or binaries involved adhere to best practices for secret generation. Best practices include secure randomness, proper length of secret creation, etc. and that the secret is created based on well-defined metadata stored somewhere in git or somewhere else.

## 4 Cloud Providers

For cloud providers, there are at least four essential topics to touch upon:

- Designated secret storage/management solutions. Which service(s) do you use?
- Envelope & client-side encryption
- Identity and access management: decreasing the blast radius
- API quotas or service limits

### 4.1 Services to Use

It is best to use a designated secret management solution in any environment. Most cloud providers have at least one service that offers secret management. Of course, it's also possible to run a different secret management solution (e.g., HashiCorp Vault or Conjur) on compute resources within the cloud. We'll consider cloud provider service offerings in this section.

Sometimes it's possible to automatically rotate your secret, either via a service provided by your cloud provider or a (custom-built) function. Generally, you should prefer the cloud provider's solution since the barrier of entry and risk of misconfiguration are lower. If you use a custom solution, ensure the function's role to do its rotation can only be assumed by said function.

#### 4.1.1 AWS

For AWS, the recommended solution is [AWS Secrets Manager](https://docs.aws.amazon.com/secretsmanager/latest/userguide/intro.html).

Permissions are granted at the secret level. Check out the [Secrets Manager best practices](https://docs.aws.amazon.com/secretsmanager/latest/userguide/best-practices.html).

It is also possible to use the [Systems Manager Parameter Store](https://docs.aws.amazon.com/systems-manager/latest/userguide/systems-manager-parameter-store.html), which is cheaper, but that has a few downsides:

- you'll need to make sure you've specified encryption yourself (secrets manager does that by default)
- it offers fewer auto-rotation capabilities (you will likely need to build a custom function)
- it doesn't support cross-account access
- it doesn't support cross-region replication
- there are fewer [Security Hub Controls](https://docs.aws.amazon.com/securityhub/latest/userguide/securityhub-standards-fsbp-controls.html) available

##### 4.1.1.1 AWS Nitro Enclaves

With [AWS Nitro Enclaves](https://aws.amazon.com/ec2/nitro/nitro-enclaves/), you can create isolated compute environments to further protect and securely process highly sensitive data such as secrets. Enclaves are hardened, and restrict operator access, providing a trusted execution environment. A key feature is cryptographic attestation, which allows you to verify the enclave's identity and ensure only authorized code is running before provisioning secrets to it. This makes it a strong choice for scenarios requiring high assurance in secret handling.

##### 4.1.1.2 AWS CloudHSM

For secrets being used in highly confidential applications, it may be needed to have more control over the encryption and storage of these keys. AWS offers [CloudHSM](https://aws.amazon.com/cloudhsm/), which lets you bring your own key (BYOK) for AWS services. Thus, you will have more control over keys' creation, lifecycle, and durability. CloudHSM allows automatic scaling and backup of your data. The cloud service provider, Amazon, will not have any access to the key material stored in **AWS CloudHSM**.

#### 4.1.2 GCP

For GCP, the recommended service is [Secret Manager](https://cloud.google.com/secret-manager/docs).

Permissions are granted at the secret level.

Check out the [Secret Manager best practices](https://cloud.google.com/secret-manager/docs/best-practices).

##### 4.1.2.1 Google Cloud Confidential Computing

[GCP Confidential Computing](https://cloud.google.com/confidential-computing) is a technology that encrypts data in-use, while it is being processed. This is achieved through services like **Confidential VMs** and **Confidential GKE Nodes**, which leverage AMD Secure Encrypted Virtualization (SEV). This ensures that even Google personnel cannot view the contents of the memory of your virtual machines, providing a high degree of protection for secrets that must be held in memory.

#### 4.1.3 Azure

For Azure, the recommended service is [Key Vault](https://docs.microsoft.com/en-us/azure/key-vault/).

Contrary to other clouds, permissions are granted at the _**Key Vault**_ level. This means secrets for separate workloads and separate sensitivity levels should be in separated Key Vaults accordingly.

Check out the [Key Vault best practices](https://docs.microsoft.com/en-us/azure/key-vault/general/best-practices).

##### 4.1.3.1 Azure Confidential Computing

With [Azure Confidential Computing](https://azure.microsoft.com/en-us/solutions/confidential-compute/#overview), you can create trusted execution environments. This technology isolates sensitive data within a protected container, ensuring that it is encrypted both at rest, in transit, and in use. Services like **Azure Confidential Virtual Machines** and **Confidential Containers on ACI** utilize technologies like Intel SGX and AMD SEV-SNP to create these secure enclaves. This prevents unauthorized access from cloud administrators, malware, or other tenants, making it a robust solution for secret management.

##### 4.1.3.2 Azure Dedicated HSM

For secrets being used in Azure environments and requiring special security considerations, Azure offers [Azure Dedicated HSM](https://azure.microsoft.com/en-us/services/azure-dedicated-hsm/). This allows you more control over the secrets stored on it, including enhanced administrative and cryptographic control. The cloud service provider, Microsoft, will not have any access to the key material stored in Azure Dedicated HSM.

#### 4.1.4 Other clouds, Multi-cloud, and Cloud agnostic

If you're using multiple cloud providers, you should consider using a cloud-agnostic secret management solution. This will allow you to use the same secret management solution across all your cloud providers (and possibly also on-premises). Another advantage is that this avoids vendor lock-in with a specific cloud provider, as the solution can be used on any cloud provider.

There are open-source and commercial solutions available. Some examples are:

- [CyberArk Conjur](https://www.conjur.org/)
- [HashiCorp Vault](https://www.vaultproject.io/)
- [Pulumi ESC](https://www.pulumi.com/esc/)

### 4.2 Envelope & client-side encryption

This section will describe how a secret is encrypted and how you can manage the keys for that encryption in the cloud.

#### 4.2.1 Client-side encryption versus server-side encryption

Server-side encryption of secrets ensures that the cloud provider takes care of the encryption of the secret in storage. The secret is then safeguarded against compromise while at rest. Encryption at rest often does not require additional work other than selecting the key to encrypt it with (See section 4.2.2). However, when you submit the secret to another service, it will no longer be encrypted. It is decrypted before sharing with the intended service or human user.

Client-side encryption of secrets ensures that the secret remains encrypted until you actively decrypt it. This means it is only decrypted when it arrives at the consumer. You need to have a proper crypto system to cater for this. Think about mechanisms such as PGP using a safe configuration and other more scalable and relatively easy to use systems. Client-side encryption can provide an end-to-end encryption of the secret: from producer to consumer.

#### 4.2.2 Bring Your Own Key versus Cloud Provider Key

When you encrypt a secret at rest, the question is: which key do you want to use? The less trust you have in the cloud provider, the more you will want to manage yourself.

Often, you can either encrypt a secret with a key managed at the secrets management service or use a key management solution from the cloud provider to encrypt the secret. The key offered through the key management solution of the cloud provider can be either managed by the cloud provider or by yourself. Industry standards call the latter "bring your own key" (BYOK). You can either directly import or generate this key at the key management solution or using cloud HSM supported by the cloud provider.
You can then either use your key or the customer main key from the provider to encrypt the data key of the secrets management solution. The data key, in turn, encrypts the secret. By managing the CMK, you have control over the data key at the secrets management solution.

While importing your own key material can generally be done with all providers ([AWS](https://docs.aws.amazon.com/kms/latest/developerguide/importing-keys.html), [Azure](https://docs.microsoft.com/en-us/azure/key-vault/keys/byok-specification), [GCP](https://cloud.google.com/kms/docs/key-import)), unless you know what you are doing and your threat model and policy require this, this is not a recommended solution due to its complexity and difficulty of use.

### 4.3 Identity and Access Management (IAM)

IAM applies to both on-premises and cloud setups: to effectively manage secrets, you need to set up suitable access policies and roles. Setting this up goes beyond policies regarding secrets; it should include hardening the full IAM setup, as it could otherwise allow for privilege escalation attacks. Ensure you never allow open "pass role" privileges or unrestricted IAM creation privileges, as these can use or create credentials that have access to the secrets. Next, make sure you tightly control what can impersonate a service account: are your machines' roles accessible by an attacker exploiting your server? Can service roles from the data-pipeline tooling access the secrets easily? Ensure you include IAM for every cloud component in your threat model (e.g., ask yourself: how can you do elevation of privileges with this component?). See [this blog entry](https://xebia.com/ten-pitfalls-you-should-look-out-for-in-aws-iam/) for multiple do's and don'ts with examples.

Leverage the temporality of the IAM principals effectively: e.g., ensure that only specific roles and service accounts that require it can access the secrets. Monitor these accounts so that you can tell who or what used them to access the secrets.

Next, make sure that you scope access to your secrets: one should not be simply allowed to access all secrets. In GCP and AWS, you can create fine-grained access policies to ensure that a principal cannot access all secrets at once. In Azure, having access to the key vault means having access to all secrets in that key vault. It is, thus, essential to have separate key vaults when working on Azure to segregate access.

### 4.4 API limits

Cloud services can generally provide a limited amount of API calls over a given period. You could potentially (D)DoS yourself when you run into these limits. Most of these limits apply per account, project, or subscription, so spread workloads to limit your blast radius accordingly. Additionally, some services may support data key caching, preventing load on the key management service API (see, for example, [AWS data key caching](https://docs.aws.amazon.com/encryption-sdk/latest/developer-guide/data-key-caching.html)). Some services can leverage built-in data key caching. [S3 is one such example](https://docs.aws.amazon.com/AmazonS3/latest/userguide/bucket-key.html).

## 5 Containers & Orchestrators

You can enrich containers with secrets in multiple ways: build time (not recommended) and during orchestration/deployment.

### 5.1 Injection of Secrets (file, in-memory)

There are three ways to get secrets to an app inside a Docker container.

- Mounted volumes (file): With this method, we keep our secrets within a particular config/secret file and mount that file to our instance as a mounted volume. Ensure that these mounts are mounted in by the orchestrator and never built-in, as this will leak the secret with the container definition. Instead, make sure that the orchestrator mounts in the volume when required.
- Fetch from the secret store (in-memory): A sidecar app/container fetches the secrets it needs directly from a secret manager service without dealing with docker config. This solution allows you to use dynamically constructed secrets without worrying about the secrets being viewable from the file system or from checking the Docker container's environment variables.
- Environment variables: We can provide secrets directly as part of the Docker container configuration. Note: secrets themselves should never be hardcoded using docker ENV or docker ARG commands, as these can easily leak with the container definitions. See the Docker challenges at [WrongSecrets](https://github.com/OWASP/wrongsecrets) as well. Instead, let an orchestrator overwrite the environment variable with the actual secret and ensure that this is not hardcoded. Additionally, environment variables are generally accessible to all processes and may be included in logs or system dumps. Using environment variables is therefore not recommended unless the other methods are not possible.

### 5.2 Short-Lived Sidecar Containers

To inject secrets, you could create short-lived sidecar containers that fetch secrets from some remote endpoint and then store them on a shared volume mounted to the original container. The original container can now use the secrets from the mounted volume. The benefit of using this approach is that we don't need to integrate any third-party tool or code to get secrets. Once the sidecar has fetched the secrets, it terminates. Examples of this include [Vault Agent Sidecar Injector](https://developer.hashicorp.com/vault/docs/platform/k8s/injector) and [Conjur Secrets Provider](https://github.com/cyberark/secrets-provider-for-k8s). By mounting secrets to a volume shared with the pod, containers within the pod can consume secrets without being aware of the secrets manager.

### 5.3 Internal vs External Access

You should only expose secrets to communication mechanisms between the container and the deployment representation (e.g., a Kubernetes Pod). Never expose secrets through external access mechanisms shared among deployments or orchestrators (e.g., a shared volume).

When the orchestrator stores secrets (e.g., Kubernetes Secrets), make sure that the storage backend of the orchestrator is encrypted and you manage the keys well. See the [Kubernetes Security Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Kubernetes_Security_Cheat_Sheet.html) for more information.

## 6 Implementation Guidance

In this section, we will discuss implementation. Note that it is always best to refer to the official documentation of the secrets management system of choice for the actual implementation as it will be more up to date than any secondary document such as this cheat sheet.

### 6.1 Key Material Management Policies

Key material management is discussed in the [Key Management Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Key_Management_Cheat_Sheet.html)

### 6.2 Dynamic vs Static Use Cases

We see the following use cases for dynamic secrets, among others:

- short-lived secrets (e.g., credentials or API keys) for a secondary service that expresses the intent for connecting the primary service (e.g., consumer) to the service.
- short-lived integrity and encryption controls for guarding and securing in-memory and runtime communication processes. Think of encryption keys that only need to live for a single session or a single deployment lifetime.
- short-lived credentials for building a stack during the deployment of a service for interacting with the deployers and supporting infrastructure.

Note that these dynamic secrets often need to be created with the service we need to connect to. To create these types of dynamic secrets, we usually require long-term static secrets to create the dynamic secrets themselves. Other static use cases:

- key material that needs to live longer than a single deployment due to the nature of its usage in the interaction with other instances of the same service (e.g., storage encryption keys, TLS PKI keys)
- key material or credentials to connect to services that do not support creating temporal roles or credentials.

### 6.3 Ensure limitations are in place

Secrets should never be retrievable by everyone and everything. Always make sure that you put guardrails in place:

- Do you have the opportunity to create access policies? Ensure that there are policies in place to limit the number of entities that can read or write the secret. At the same time, write the policies so that you can easily extend them, and they are not too complicated to understand.
- Is there no way to reduce access to certain secrets within a secrets management solution? Consider separating the production and development secrets by having separate secret management solutions. Then, reduce access to the production secrets management solution.

### 6.4 Security Event Monitoring is Key

Continually monitor who/what, from which IP, and what methodology accesses the secret. There are various patterns to look out for, such as, but not limited to:

- Monitor who accesses the secret at the secret management system: is this normal behavior? If the CI/CD credentials are used to access the secret management solution from a different IP than where the CI/CD system is running, provide a security alert and assume the secret is compromised.
- Monitor the service requiring the secret (if possible), e.g., whether the user of the secret is coming from an expected IP, with an expected user agent. If not, alert and assume the secret is compromised.

### 6.5 Usability and Ease of Onboarding

For a secrets management solution to be effective, it must be easy for developers to adopt and use. If the process is too complex, developers may resort to insecure practices. A focus on usability and a smooth onboarding experience is critical.

- **Clear and Comprehensive Documentation:**
    - Provide clear, concise, and easy-to-find documentation. This should include tutorials for common use cases, detailed API references, and practical examples.
    - Maintain a "getting started" guide that walks new users through the process of obtaining their first secret.
- **Developer-Friendly Tooling and SDKs:**
    - Offer well-maintained SDKs for various programming languages to simplify integration.
    - Provide a command-line interface (CLI) that allows developers to manage secrets from their local development environment.
    - Develop plugins for common IDEs, CI/CD systems, and infrastructure-as-code (IaC) tools like Terraform and Pulumi.
- **Streamlined Workflows:**
    - Implement self-service workflows that enable developers to request and receive secrets with minimal manual intervention.
    - Use GitOps principles to manage secrets as code, allowing developers to define secret needs in a declarative manner alongside their application code.
    - Automate the approval process for low-risk secrets while maintaining appropriate controls for more sensitive ones.
- **Actionable Feedback and Support:**
    - Provide clear error messages that help developers troubleshoot issues independently.
    - Establish dedicated support channels (e.g., a Slack channel, a ticketing system) where developers can get help from the security or platform team.
- **Easy Integration:**
    - Ensure the secrets management solution can be easily integrated with existing applications. Sidecar containers, such as the [Vault Agent Sidecar Injector](https://developer.hashicorp.com/vault/docs/platform/k8s/injector) or the [Conjur Secrets Provider](https://github.com/cyberark/secrets-provider-for-k8s), can help decouple applications from the secrets management system.

## 7 Encryption

Secrets Management goes hand in hand with encryption. After all, secrets must be stored encrypted somewhere to protect their confidentiality and integrity.

### 7.1 Encryption Types to Use

You can use various encryption types to secure a secret as long as they provide sufficient security, including adequate resistance against quantum computing-based attacks. Given that this is a moving field, it is best to take a look at sources like [keylength.com](https://www.keylength.com/en/4/), which enumerate up-to-date recommendations on the usage of encryption types and key lengths for existing standards, as well as the NSA's [Commercial National Security Algorithm Suite 2.0](https://media.defense.gov/2022/Sep/07/2003071834/-1/-1/0/CSA_CNSA_2.0_ALGORITHMS_.PDF) which enumerates quantum resistant algorithms.

Please note that in all cases, we need to preferably select an algorithm that provides encryption and confidentiality at the same time, such as AES-256 using GCM [(Galois Counter Mode)](https://en.wikipedia.org/wiki/Galois/Counter_Mode), or a mixture of ChaCha20 and Poly1305 according to the best practices in the field.

### 7.2 Convergent Encryption

[Convergent Encryption](https://en.wikipedia.org/wiki/Convergent_encryption) ensures that a given plaintext and its key results in the same ciphertext. This can help detect possible reuse of secrets, resulting in the same ciphertext.
The challenge with enabling convergent encryption is that it allows attackers to use the system to generate a set of cryptographic strings that might end up in the same secret, allowing the attacker to derive the plaintext secret. Given the algorithm and key, you can mitigate this risk if the convergent crypto system you use has sufficient resource challenges during encryption. Another factor that can help reduce the risk is ensuring that a secret is of adequate length, further hampering the possible guess-iteration time required.

### 7.3 Where to store the Encryption Keys?

You should not store keys next to the secrets they encrypt, except if those keys are encrypted themselves (see envelope encryption). Start by consulting the [Key Management Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Key_Management_Cheat_Sheet.html) on where and how to store the encryption and possible HMAC keys.

### 7.4 Encryption as a Service (EaaS)

EaaS is a model in which users subscribe to a cloud-based encryption service without having to install encryption on their own systems. Using EaaS, you can get the following benefits:

- Encryption at rest
- Encryption in transit (TLS)
- Key handling and cryptographic implementations are taken care of by Encryption Service, not by developers
- The provider could add more services to interact with the sensitive data

## 8 Detection

There are many approaches to secrets detection and some very useful open-source projects to help with this. The [Yelp Detect Secrets](https://github.com/Yelp/detect-secrets) project is mature and has signature matching for around 20 secrets. For more information on other tools to help you in the detection space, check out the [Secrets Detection](https://github.com/topics/secrets-detection) topic on GitHub.

### 8.1 General detection approaches

Shift-left and DevSecOps principles apply to secrets detection as well. These general approaches below aim to consider secrets earlier and evolve the practice over time.

- Create standard test secrets and use them universally across the organization. This allows for reducing false positives by only needing to track a single test secret for each secret type.
- Consider enabling secrets detection at the developer level to avoid checking secrets into code before commit/PR either in the IDE, as part of test-driven development, or via pre-commit hook.
- Make secrets detection part of the threat model. Consider secrets as part of the attack surface during threat modeling exercises.
- Evaluate detection utilities and related signatures often to ensure they meet expectations.
- Consider having more than one detection utility and correlating/de-duping results to identify potential areas of detection weakness.
- Explore a balance between entropy and ease of detection. Secrets with consistent formats are easier to detect with lower false-positive rates, but you also don't want to miss a human-created password simply because it doesn't match your detection rules.

### 8.2 Types of secrets to be detected

Many types of secrets exist, and you should consider signatures for each to ensure accurate detection for all. Among the more common types are:

- High availability secrets (Tokens that are difficult to rotate)
- Application configuration files
- Connection strings
- API keys
- Credentials
- Passwords
- 2FA keys
- Private keys (e.g., SSH keys)
- Session tokens
- Platform-specific secret types (e.g., Amazon Web Services, Google Cloud)

For more fun learning about secrets and practice rooting them out, check out the [Wrong Secrets](https://owasp.org/www-project-wrongsecrets/) project.

### 8.3 Detection lifecycle

Secrets are like any other authorization token. They should:

- Exist only for as long as necessary (rotate often)
- Have a method for automatic rotation
- Only be visible to those who need them (least privilege)
- Be revocable (including the logging of attempt to use a revoked secret)
- Never be logged (must implement either an encryption or masking approach in place to avoid logging plaintext secrets)

Create detection rules for each of the stages of the secret lifecycle.

### 8.4 Documentation for how to detect secrets

Create documentation and update it regularly to inform the developer community on procedures and systems available at your organization and what types of secrets management you expect, how to test for secrets, and what to do in the event of detected secrets.

Documentation should:

- Exist and be updated often, especially in response to an incident
- Include the following information:
    - Who has access to the secret
    - How it gets rotated
    - Any upstream or downstream dependencies that could potentially be broken during secret rotation
    - Who is the point of contact during an incident
    - Security impact of exposure

- Identify when secrets may be handled differently depending on the threat risk, data classification, etc.

## 9 Incident Response

Quick response in the event of a secret exposure is perhaps one of the most critical considerations for secrets management.

### 9.1 Documentation

Incident response in the event of secret exposure should ensure that everyone in the chain of custody is aware and understands how to respond. This includes application creators (every member of a development team), information security, and technology leadership.

Documentation must include:

- How to test for secrets and secrets handling, especially during business continuity reviews.
- Whom to alert when a secret is detected.
- Steps to take for containment
- Information to log during the event

### 9.2 Remediation

The primary goal of incident response is rapid response and containment.

Containment should follow these procedures:

1. Revocation: Keys that were exposed should undergo immediate revocation. The secret must be able to be de-authorized quickly, and systems must be in place to identify the revocation status.
2. Rotation: A new secret must be able to be quickly created and implemented, preferably via an automated process to ensure repeatability, low rate of implementation error, and least-privilege (not directly human-readable).
3. Deletion: Secrets revoked/rotated must be removed from the exposed system immediately, including secrets discovered in code or logs. Secrets in code could have commit history for the exposure squashed to before the introduction of the secret, however, this may introduce other problems as it rewrites git history and will break any other links to a given commit. If you decide to do this be aware of the consequences and plan accordingly. Secrets in logs must have a process for removing the secret while maintaining log integrity.
4. Logging: Incident response teams must have access to information about the lifecycle of a secret to aid in containment and remediation, including:
    - Who had access?
    - When did they use it?
    - When was it previously rotated?

### 9.3 Logging

Additional considerations for logging of secrets usage should include:

- Logging for incident response should be to a single location accessible by incident response (IR) teams
- Ensure fidelity of logging information during purple team exercises such as:
    - What should have been logged?
    - What was actually logged?
    - Do we have adequate alerts in place to ensure this?

Consider using a standardized logging format and vocabulary such as the [Logging Vocabulary Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Logging_Vocabulary_Cheat_Sheet.html) to ensure that all necessary information is logged.

## 10 Secrets Management in a Multi-Cloud Environment

### 10.1 Introduction

Managing secrets in a multi-cloud environment presents unique challenges due to the diversity of cloud providers and their respective services. This section discusses the challenges and best practices for managing secrets across multiple cloud providers.

### 10.2 Challenges

1. **Diverse APIs and Interfaces**: Each cloud provider has its own API and interface for managing secrets, which can lead to complexity in integrating and managing secrets across multiple providers.
2. **Inconsistent Security Policies**: Different cloud providers may have varying security policies and practices, making it challenging to enforce consistent security standards across all environments.
3. **Key Rotation**: Ensuring that keys are rotated consistently and securely across multiple cloud providers can be difficult, especially if each provider has different mechanisms for key rotation.
4. **Access Control**: Managing access control for secrets across multiple cloud providers can be complex, as each provider may have different access control mechanisms and policies.
5. **Auditing and Monitoring**: Ensuring comprehensive auditing and monitoring of secret access and usage across multiple cloud providers can be challenging due to the differences in logging and monitoring capabilities.

### 10.3 Best Practices

1. **Use a Centralized Secrets Management Solution**: Implement a centralized secrets management solution that can integrate with multiple cloud providers. This can help standardize the management of secrets and enforce consistent security policies across all environments. Examples include HashiCorp Vault and CyberArk Conjur.
2. **Standardize Security Policies**: Define and enforce standardized security policies for managing secrets across all cloud providers. This includes policies for key rotation, access control, and auditing.
3. **Automate Key Rotation**: Implement automated key rotation processes to ensure that keys are rotated consistently and securely across all cloud providers. Use tools and scripts to automate the rotation process and reduce the risk of human error.
4. **Implement Fine-Grained Access Control**: Use fine-grained access control mechanisms to restrict access to secrets based on the principle of least privilege. Ensure that access control policies are consistently enforced across all cloud providers.
5. **Enable Comprehensive Auditing and Monitoring**: Implement comprehensive auditing and monitoring of secret access and usage across all cloud providers. Use centralized logging and monitoring solutions to aggregate and analyze logs from multiple providers.

### 10.4 References

- [HashiCorp Vault](https://www.vaultproject.io/)
- [CyberArk Conjur](https://www.conjur.org/)
- [AWS Secrets Manager](https://aws.amazon.com/secrets-manager/)
- [Azure Key Vault](https://azure.microsoft.com/en-us/services/key-vault/)
- [Google Cloud Secret Manager](https://cloud.google.com/secret-manager)

## 11 Related Cheat Sheets & further reading

- [Key Management Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Key_Management_Cheat_Sheet.html)
- [Logging Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html)
- [Password Storage Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html)
- [Cryptographic Storage Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cryptographic_Storage_Cheat_Sheet.html)
- [OWASP WrongSecrets project](https://github.com/OWASP/wrongsecrets/)
- [Blog: 10 Pointers on Secrets Management](https://xebia.com/blog/secure-deployment-10-pointers-on-secrets-management/)
- [Blog: From build to run: pointers on secure deployment](https://xebia.com/from-build-to-run-pointers-on-secure-deployment/)
- [GitHub listing on secrets detection tools](https://github.com/topics/secrets-detection)
- [NIST SP 800-57 Recommendation for Key Management](https://csrc.nist.gov/publications/detail/sp/800-57-part-1/rev-5/final)
- [OpenCRE References to secrets](https://opencre.org/cre/223-780)

</section>

<section id="secrets-management-translation-panel" className="tabPanel translationPanel contentPanel">

# シークレット管理チートシート

## 1 はじめに

シークレットは現在、特に DevOps ムーブメントの普及に伴い、あらゆる場所で使われています。Application Programming Interface (API) キー、データベース認証情報、Identity and Access Management (IAM) 権限、Secure Shell (SSH) キー、証明書などが該当します。多くの組織では、それらがソースコード内に平文でハードコードされ、設定ファイルや構成管理ツールの中に散在しています。

組織には、シークレットへのアクセスを制御し、漏えいや組織侵害を防ぐために、シークレットの保存、プロビジョニング、監査、ローテーション、管理を一元化する必要性が高まっています。多くの場合、サービスは同じシークレットを共有しており、侵害や漏えいの発生源を特定することが困難になります。

このチートシートは、シークレット管理を適切に実装するためのベストプラクティスとガイドラインを提供します。

## 2 一般的なシークレット管理

以下のセクションでは、シークレット管理に関連する主要な概念を扱います。

### 2.1 高可用性

トラフィックを確実に処理できる十分に堅牢な技術を選択することが重要です。

- ユーザー、たとえば SSH キーや root アカウントのパスワード。インシデント対応シナリオでは、停止したサービスを復旧できるよう、ユーザーは認証情報が迅速にプロビジョニングされることを期待します。認証情報を待つ必要があると、運用チームの対応力に影響する可能性があります。
- アプリケーション、たとえばデータベース認証情報や API キー。サービスの性能が十分でない場合、依存するアプリケーションの可用性を低下させたり、アプリケーションの起動時間を増加させたりする可能性があります。

大規模な組織では、このようなサービスに相当な量のリクエストが届く可能性があります。

### 2.2 集中化と標準化

アプリケーションのために DevOps チームが使用するシークレットは、マーケティング担当者や SRE チームが保存するシークレットとは異なる方法で消費される可能性があります。シークレットの利用者と生成者のニーズが一致せず、保守状態の悪いシークレットが見つかることはよくあります。したがって、シークレット管理ソリューションを慎重に標準化し、集中化しなければなりません。標準化と集中化は、複数のシークレット管理ソリューションを使用することを意味する場合もあります。たとえば、クラウドネイティブ開発チームはクラウドプロバイダーが提供するソリューションを選び、プライベートクラウドではサードパーティソリューションを使用し、全員が選定済みのパスワードマネージャーのアカウントを持つ、という形です。

チームがこれらの異なるソリューションとのやり取りを標準化しておくことで、インシデント発生時にも保守可能で使用可能な状態を維持できます。

企業がシークレット管理を単一のソリューションに集中化している場合でも、多くの場合、そのシークレット管理ソリューションの主要シークレットを二次的なシークレット管理ソリューションで保護する必要があります。たとえば、クラウドプロバイダーの機能を使用してシークレットを保存できますが、そのクラウドプロバイダーの root または管理認証情報は別の場所に保存する必要があります。

標準化には、シークレット管理ソリューションのシークレットライフサイクル管理、認証、認可、アカウンティング、およびライフサイクル管理を含める必要があります。組織にとって、シークレットが何に使われ、どこで見つけられるかがすぐに分かるべきである点に注意してください。使用するシークレット管理ソリューションが多いほど、必要なドキュメントも多くなります。

### 2.3 アクセス制御

ユーザーがシークレット管理システム内のシークレットを読み取りまたは更新できる場合、そのシークレットはそのユーザーと、ユーザーがシークレットに触れるために使用したシステムを通じて漏えいする可能性があります。

したがって、エンジニアがシークレット管理システム内のすべてのシークレットにアクセスできるべきではなく、最小権限の原則を適用すべきです。シークレット管理システムは、最小権限の原則を達成するために、各オブジェクトとコンポーネントに対して細かなアクセス制御を設定できる必要があります。

### 2.4 シークレット管理の自動化

手動保守は漏えいリスクを高めるだけでなく、シークレットを保守する際の人的ミスのリスクも生みます。さらに、無駄な作業になることもあります。

したがって、実際のシークレットに対する人間の操作を制限または排除する方が望ましいです。人間の操作は複数の方法で制限できます。

- **シークレットパイプライン:** 作成やローテーションなど、シークレット管理の大部分を担うシークレットパイプラインを用意します。
- **動的シークレットの使用:** アプリケーション起動時にデータベース認証情報を要求し、それが動的に生成される場合、そのセッション用の新しい認証情報が提供されます。認証情報の再利用範囲を減らすため、可能な場合は動的シークレットを使用すべきです。アプリケーションのデータベース認証情報が盗まれたとしても、再起動時には期限切れになります。
- **静的シークレットの自動ローテーション:** 鍵ローテーションは、手動で実装すると困難なプロセスであり、ミスにつながる可能性があります。したがって、鍵のローテーションを自動化するか、少なくとも IT によってプロセスが十分に支援されるようにする方が望ましいです。

暗号鍵など一部の鍵をローテーションすると、データの全部または一部の再暗号化が発生する可能性があります。鍵ローテーションには、次のようなさまざまな戦略があります。

- 段階的ローテーション
- 書き込み操作用の新しい鍵の導入
- 読み取り操作用に古い鍵を残す
- 迅速なローテーション
- 定期ローテーション
- ほか多数

#### 2.4.1 自動ローテーションのためのアーキテクチャパターン

自動シークレットローテーションをサポートするシステムをどのように設計するかを示すため、いくつかのアーキテクチャパターンを示します。

##### 例 1: サイドカーコンテナを使用する Kubernetes

Kubernetes 環境では、シークレットマネージャーからシークレットを取得し、メインアプリケーションコンテナが利用できるようにするサイドカーコンテナを使用するパターンが一般的です。これにより、アプリケーションはシークレット管理ソリューション固有の詳細から分離されます。

- **アーキテクチャ:**
    - Pod には、メインアプリケーションコンテナとサイドカーコンテナの 2 つのコンテナを含めます。例: HashiCorp Vault Agent、CyberArk Conjur Secrets Provider。
    - サイドカーコンテナは、たとえば Kubernetes Service Account を使用してシークレットマネージャーに認証します。
    - サイドカーコンテナはシークレットを取得し、共有インメモリボリュームに書き込みます。
    - アプリケーションコンテナは共有ボリュームからシークレットを読み取ります。
    - サイドカーコンテナはシークレットを定期的に更新でき、アプリケーションが常に有効で短命な認証情報を持つようにします。
- **Kubernetes マニフェストのスニペット:**

    ```yaml
    apiVersion: v1
    kind: Pod
    metadata:
      name: my-app
    spec:
      serviceAccountName: my-app-sa
      containers:
      - name: my-app-container
        image: my-app-image
        volumeMounts:
        - name: secrets-volume
          mountPath: "/mnt/secrets"
          readOnly: true
      - name: vault-agent-sidecar
        image: vault:latest
        args: ["agent", "-config=/etc/vault/vault-agent-config.hcl"]
        volumeMounts:
        - name: secrets-volume
          mountPath: "/mnt/secrets"
      volumes:
      - name: secrets-volume
        emptyDir:
          medium: "Memory"
    ```

##### 例 2: データベース認証情報ローテーションのためのサーバーレス関数

クラウドネイティブなシークレットマネージャーは、多くの場合、サーバーレス関数を使用した自動ローテーションを組み込みでサポートしています。例: AWS Lambda、Azure Functions。

- **アーキテクチャ:**
    - シークレットをクラウドシークレットマネージャーに保存します。例: AWS Secrets Manager。
    - シークレットマネージャーは、スケジュールに基づいてローテーション Lambda 関数をトリガーするように設定されます。
    - Lambda 関数は、データベースパスワードとシークレットマネージャー内のシークレット値を更新するために必要な権限を持ちます。
    - ローテーションプロセスは通常、安全な移行を確保するために複数のステップ、新しいシークレットの作成、新しいシークレットの設定、新しいシークレットのテスト、ローテーションの完了を含みます。
- **AWS Lambda ローテーション関数、概念的な Python コード:**

    ```python
    import boto3
    import os

    def lambda_handler(event, context):
        secret_name = event['SecretId']
        token = event['ClientRequestToken']
        step = event['Step']

        secrets_manager = boto3.client('secretsmanager')
        # Get the secret metadata
        metadata = secrets_manager.describe_secret(SecretId=secret_name)

        if step == "createSecret":
            # Create a new version of the secret
            new_password = generate_new_password()
            secrets_manager.put_secret_value(
                SecretId=secret_name,
                ClientRequestToken=token,
                SecretString=f'{{"password":"{new_password}"}}',
                VersionStages=['AWSPENDING']
            )
        elif step == "setSecret":
            # Update the database with the new password
            update_database_password(new_password)
        elif step == "testSecret":
            # Test the new secret
            test_database_connection(new_password)
        elif step == "finishSecret":
            # Mark the new version of the secret as current
            secrets_manager.update_version_stage(
                SecretId=secret_name,
                VersionStage="AWSCURRENT",
                MoveToVersionId=token
            )
    ```

これらの例は、シークレットを安全に管理するだけでなくローテーションプロセスも自動化するアーキテクチャを作成できることを示しており、侵害された認証情報によるリスクを大幅に低減します。

### 2.5 メモリ内のシークレットの取り扱い

シークレットがメモリ内に存在する時間枠を最小化し、そのメモリ空間へのアクセスを制限することで、追加のセキュリティレベルを達成できます。

アプリケーション固有の状況によっては、メモリセキュリティを確保する形でこれを実装することは困難な場合があります。この実装の複雑さがあり得るため、まず脅威モデルを作成し、アプリケーションのデプロイ環境に関する暗黙の前提と、攻撃者の能力を明確にすることが推奨されます。

多くの場合、脅威モデルを評価すると、想定する脅威アクターがそのような攻撃を実行する能力を持たない、またはメモリ内のシークレット露出に起因する侵害の想定影響より防御コストが大きく上回るため、メモリ内のシークレット保護は過剰と見なされます。また、適切な脅威モデルを作成する際には、攻撃者がシークレットを扱うプロセスのメモリにすでにアクセスできているなら、その時点でセキュリティ侵害がすでに発生している可能性があることを念頭に置くべきです。さらに、[Rowhammer](https://arxiv.org/pdf/2211.07613.pdf) や [Meltdown and Spectre](https://meltdownattack.com/) のような攻撃の登場により、これらの種類の攻撃からプロセスメモリを保護するにはオペレーティングシステムだけでは不十分であることを理解することが重要です。これは、アプリケーションがクラウドにデプロイされている場合に特に重要になります。これらや類似の攻撃からメモリを保護する唯一の確実な方法は、プロセスメモリを他のすべての信頼できないプロセスから完全に物理的に分離することです。

実装は困難ですが、高度に機微な環境では、メモリ内のシークレットを保護することが有用な追加セキュリティ層になり得ます。たとえば、高度な攻撃者がシステムをクラッシュさせ、メモリダンプへアクセスできるシナリオでは、そこからシークレットを抽出できる可能性があります。したがって、信頼できない環境や極めて厳格なセキュリティが最重要となる状況では、メモリ内のシークレットを慎重に保護することが推奨されます。

さらに、C/C++ のような低レベル言語では、メモリ内のシークレットを保護することは比較的容易です。そのため、攻撃者がメモリへアクセスするリスクが低い場合でも、この実践を実装する価値があるかもしれません。一方、ガベージコレクションに依存するプログラミング言語では、メモリ内のシークレットを保護することは一般にかなり困難です。

- **構造体とクラス:** .NET や Java では、Strings のようなイミュータブルな構造を使用してシークレットを保存しないでください。それらを強制的にガベージコレクトすることは不可能だからです。代わりに、メモリを直接上書きできる byte 配列や char 配列などのプリミティブ型を使用します。
- **メモリのゼロ化:** シークレットを使用した後、そのシークレットが占有していたメモリはゼロ化すべきです。これにより、後でアクセスされる可能性がある状態でメモリ内に残存することを防ぎます。
- **メモリ暗号化:** 場合によっては、シークレットを扱うプロセスのメモリ空間全体を暗号化するために、ハードウェアまたはオペレーティングシステムの機能を使用できる可能性があります。これは追加のセキュリティ層を提供できます。

目標は、シークレットが平文でメモリ内に存在する時間枠を可能な限り最小化することである、という点を忘れないでください。

より詳細な情報については、OWASP MAS プロジェクトの [Testing Memory for Sensitive Data](https://mas.owasp.org/MASTG/tests/android/MASVS-STORAGE/MASTG-TEST-0011) を参照してください。

### 2.6 監査

監査は、アプリケーションの性質上、シークレット管理に不可欠な部分です。監査ログの改ざんや削除の試みに耐えられるよう、監査を安全に実装しなければなりません。少なくとも、以下を監査すべきです。

- 誰が、どのシステムとロールのためにシークレットを要求したか。
- シークレット要求が承認されたか拒否されたか。
- シークレットがいつ、誰または何によって使用されたか。
- シークレットがいつ期限切れになったか。
- 期限切れシークレットを再利用しようとした試みがあったか。
- 認証または認可エラーがあったか。
- シークレットがいつ、誰または何によって更新されたか。
- 基盤となる支援インフラスタック上の管理操作および可能なユーザー活動。

すべての監査に正しいタイムスタンプがあることは不可欠です。したがって、シークレット管理ソリューションの支援インフラには適切な時刻同期プロトコルを設定すべきです。ソリューションが稼働するスタックについて、クロックスキューや手動の時刻調整がないか監視すべきです。

### 2.7 シークレットライフサイクル

シークレットにはライフサイクルがあります。ライフサイクルの段階は次のとおりです。

- 作成
- ローテーション
- 失効
- 有効期限

#### 2.7.1 作成

新しいシークレットは安全に生成され、その目的に対して暗号学的に十分堅牢でなければなりません。シークレットには、必要な用途またはロールを可能にするための最小権限を割り当てなければなりません。

認証情報は安全に送信すべきであり、理想的にはユーザーアカウントを要求する際にパスワードをユーザー名と一緒に送らないようにします。代わりに、相互認証された接続などの安全なチャネル、またはプッシュ通知、SMS、メールなどのサイドチャネルでパスワードを送信すべきです。各チャネルの長所と短所については、[Multi-Factor Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Multifactor_Authentication_Cheat_Sheet) を参照してください。

アプリケーションは複数の通信チャネルを持つことで利点を得られない場合があるため、認証情報を安全にプロビジョニングしなければなりません。

シークレット作成に関するより技術的な推奨事項については、[the Open CRE project on secrets lookup](https://www.opencre.org/cre/223-780) を参照してください。

#### 2.7.2 ローテーション

盗まれた認証情報が短時間しか機能しないように、シークレットは定期的にローテーションすべきです。定期ローテーションは、ユーザーが認証情報の再利用などの悪い習慣に戻る傾向も低減します。

シークレットの機能と保護対象によって、寿命は数分、たとえば perfect forward secrecy を備えたエンドツーエンド暗号化チャットから、数年、たとえばハードウェアシークレットまでさまざまです。

ユーザー認証情報は定期ローテーションの対象外です。これらは [NIST recommendations](https://pages.nist.gov/800-63-FAQ/#q-b05) に従い、侵害の疑いまたは証拠がある場合にのみローテーションすべきです。

#### 2.7.3 失効

シークレットが不要になった場合、または侵害された可能性がある場合、アクセスを制限するために安全に失効させなければなりません。(TLS) 証明書の場合、これには証明書失効も含まれます。

#### 2.7.4 有効期限

可能な場合、定義された時間後に期限切れになるシークレットを作成すべきです。この有効期限は、シークレットを消費するシステムによる能動的な期限切れでも、シークレット管理システムに設定された有効期限によって支援プロセスを強制的にトリガーし、シークレットローテーションにつなげる方式でもかまいません。

認証情報がその種類に適した限られた時間だけ利用可能になるよう、シークレット管理ソリューションを通じてポリシーを適用すべきです。アプリケーションは、シークレットを信頼する前に、そのシークレットがまだ有効であることを検証すべきです。

### 2.8 あらゆる場所で Transport Layer Security (TLS)

シークレットを平文で送信してはなりません。TLS が広く採用されている現在、言い訳はありません。

さらに、シークレット管理ソリューションを使用して TLS 証明書を効果的にプロビジョニングできます。

### 2.9 ダウンタイム、ブレークグラス、バックアップと復元

保守のための予定されたダウンタイムなど、さまざまな理由でシークレット管理サービスが利用できなくなる可能性を検討してください。事前に認証情報を取得していなかった場合、サービス復元に必要な認証情報を取得できない可能性があります。したがって、過去のメトリクスと監査ログに基づいて、保守時間帯を慎重に選択してください。

次に、システムのバックアップと復元手順は、そのセキュリティについて定期的にテストおよび監査されるべきです。バックアップと復元に関するいくつかの要件として、次を確実にしてください。

- 自動バックアップ手順が用意され、定期的に実行されていること。バックアップとスナップショットの頻度は、シークレットの数とライフサイクルに基づいて決めます。
- バックアップが完全であることを保証するため、復元手順を頻繁にテストすること。
- バックアップを暗号化し、アクセス権を縮小した安全なストレージに置くこと。バックアップ場所へのアクセスおよび管理操作が認可されているかを監視すること。

最後に、通常保守以外の理由でシステムが利用不能になった場合にサービスを復元するため、緊急時の「ブレークグラス」プロセスを実装すべきです。したがって、緊急ブレークグラス認証情報は、二次的なシークレット管理システムに安全に定期バックアップし、機能することを検証するために定期的にテストすべきです。

### 2.10 ポリシー

パスワードの最小複雑性要件と承認済み暗号アルゴリズムを定義するポリシーを、組織全体のレベルで一貫して適用します。集中型シークレット管理ソリューションを使用すると、企業はこれらのポリシーを実装しやすくなります。

次に、組織全体のシークレット管理ポリシーを持つことで、このチートシートで定義されているベストプラクティスの適用を強制しやすくなります。

### 2.11 メタデータ: シークレット移行への備え

シークレット管理ソリューションは、少なくとも以下のメタデータをシークレットについて保存できる機能を提供すべきです。

- いつ作成、消費、アーカイブ、ローテーション、削除されたか
- 誰が作成、消費、アーカイブ、ローテーション、削除したか。例: 実際の生成者と生成方法を使用したエンジニアの両方
- 何が作成、消費、アーカイブ、ローテーション、削除したか
- シークレットに問題がある場合や質問がある場合に誰へ連絡するか
- 何のためにシークレットが使用されるか。例: 指定された想定利用者とシークレットの目的
- シークレットの種類。例: AES Key、HMAC key、RSA private key
- 手動で行う場合、いつローテーションする必要があるか

注: シークレットに関するメタデータを保存せず、移行への準備もしない場合、ベンダーロックインの可能性が高まります。

### 2.12 パスワードレス認証とトークンセキュリティ

**OpenID Connect (OIDC)** のようなパスワードレス認証メカニズムは、API キーやデータベース認証情報など、すべての種類のシークレットを直接置き換えるものではありませんが、ユーザー管理パスワードから離れることで攻撃対象領域を大幅に低減できます。アプリケーションはパスワードの代わりに、信頼されたアイデンティティプロバイダー (IdP) に依存してユーザーを認証し、安全なトークンを受け取ります。

**どのように役立つか:**

- **パスワード関連リスクの低減:** フィッシング、クレデンシャルスタッフィング、弱いパスワード運用のような脅威を排除します。
- **集中型アイデンティティ管理:** 認証は専門の IdP によって処理され、MFA などの強力な認証ポリシーを適用できます。
- **短命なセッション:** OIDC トークンは通常短命であり、トークンが侵害された場合の攻撃者の機会を制限します。

**トークンセキュリティは重要:**

パスワードレス認証を採用すると、セキュリティの焦点は静的パスワードの保護から、ID トークン、アクセストークン、リフレッシュトークンなどの動的トークンの保護へ移ります。これらのトークンは bearer token であり、所有している人は誰でも使用できます。したがって、次の事項が重要です。

- **トークン送信の保護:** トークンは常に TLS 経由で送信します。
- **保存時のトークン保護:** ブラウザの local storage のような安全でない場所にトークンを保存しないでください。安全な HTTP-only Cookie、またはモバイルアプリケーションに適した安全な保存メカニズムを使用してください。
- **トークンの正しい検証:** トークンが正当であることを確認するため、署名、発行者、オーディエンスを常に検証します。
- **トークン寿命の管理:** 短命なアクセストークンを使用し、安全なリフレッシュトークンローテーション戦略を実装します。

OAuth 2.0 と OpenID Connect 実装の保護に関するより詳細なガイダンスについては、[OAuth2 Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/OAuth2_Cheat_Sheet.html) を参照してください。

## 3 Continuous Integration (CI) と Continuous Deployment (CD)

変更のビルド、テスト、デプロイには、一般に多くのシステムへのアクセスが必要です。Continuous Integration (CI) と Continuous Deployment (CD) ツールは通常、アプリケーションへの設定提供やデプロイ中にシークレットを保存します。あるいは、シークレット管理システムと密接にやり取りします。CI/CD におけるシークレット管理を円滑にするためのさまざまなベストプラクティスがあり、このセクションではその一部を扱います。

### 3.1 CI/CD パイプラインの堅牢化

CI/CD ツールは高権限の認証情報を定期的に消費します。パイプラインが容易にハッキングされたり、従業員に悪用されたりしないようにしてください。役立つガイドラインをいくつか示します。

- CI/CD ツールを本番環境として扱います。堅牢化し、パッチを適用し、基盤となるインフラとサービスを堅牢化します。
- Security Event Monitoring を配置します。
- 最小権限アクセスを実装します。開発者はプロジェクトを管理できる必要はありません。必要なのは、パイプラインの設定、実行、コード作業など、必要な機能を実行できることだけです。管理タスクは、CI/CD システムが設定を更新するために使用する別リポジトリで configuration-as-code を使えば迅速に実施できます。シークレットへアクセスできる可能性がある特権ロールは不要です。
- パイプライン出力がシークレットを漏えいしないこと、およびデバッグツールで本番パイプラインを盗み見できないことを確認します。
- CI/CD システムの runner や worker に exec できないようにします。
- 適切な認証、認可、アカウンティングを配置します。
- 作成されたパイプラインがセキュリティレビューされることを保証する MR/PR ステップを含め、承認済みプロセスだけがパイプラインを作成できるようにします。

### 3.2 シークレットはどこに置くべきか

CI/CD アクションを実行するためにシークレットを保存できる場所はいくつかあります。

- CI/CD ツールの一部として保存する: [GitLab](https://docs.gitlab.com/charts/installation/secrets.html)、[GitHub](https://docs.github.com/en/actions/security-guides/encrypted-secrets)、[Jenkins](https://www.jenkins.io/doc/developer/security/secrets/) にシークレットを保存できます。これはコードにコミットすることとは異なります。
- シークレット管理システムの一部として保存する: クラウドプロバイダーが提供する機能、たとえば [AWS Secrets Manager](https://aws.amazon.com/secrets-manager/)、[Azure Key Vault](https://azure.microsoft.com/nl-nl/services/key-vault/)、[Google Secret Manager](https://cloud.google.com/secret-manager)、またはサードパーティ機能、たとえば [Hashicorp Vault](https://www.vaultproject.io/)、[Conjur](https://www.conjur.org/)、[Keeper](https://www.keepersecurity.com/) などのシークレット管理システムにシークレットを保存できます。この場合、CI/CD パイプラインツールは、これらのシークレット管理システムに接続してシークレットを用意するための認証情報を必要とします。クラウドプロバイダーのシークレット管理システムの使用に関する詳細は、[Cloud Providers](#4-cloud-providers) を参照してください。

ここでの別の選択肢は、CI/CD パイプラインがシークレット管理システムの Encryption as a Service を活用してシークレットを暗号化することです。CI/CD ツールは暗号化されたシークレットを git にコミットでき、消費するサービスはデプロイ時にそれを取得して再び復号できます。詳細はセクション 3.6 を参照してください。

注: 実際のデプロイに到達するために、すべてのシークレットが CI/CD パイプライン内に存在しなければならないわけではありません。代わりに、デプロイされたサービスが自身のライフサイクル、たとえばデプロイ、ランタイム、破棄の中で、シークレット管理の一部を担うようにしてください。

#### 3.2.1 CI/CD ツールの一部として

シークレットが CI/CD ツールの一部である場合、それらのシークレットは CI/CD ジョブに露出します。CI/CD ツールには、たとえば GitHub secrets、GitLab repository secrets、Microsoft Azure DevOps の ENV Vars/Var Groups、Kubernetes Secrets などが含まれます。

これらのシークレットは多くの場合、権限を持つ人、たとえば GitHub の maintainer、GitLab の project owner、Jenkins の admin などによって設定または閲覧可能です。これに対応して、次のベストプラクティスが導かれます。

- 「大きなシークレット」を持たない: CI/CD ツール内のシークレットが長期的でなく、広い影響範囲を持たず、高い価値を持たないようにします。また、共有シークレットを制限します。たとえば、すべての管理ユーザーで 1 つのパスワードを使わないでください。
- As is / To be: どのユーザーがシークレットを閲覧または変更できるかを明確に把握します。多くの場合、GitLab/GitHub プロジェクトの maintainer は、そのシークレットを見たり、別の方法で抽出したりできます。
- 露出を制限するため、プロジェクト上で管理タスクを実行できる人の数を減らします。
- Log & Alert: CI/CD ツールからすべてのログを収集し、Web インターフェース経由でアクセスする場合や、二重 Base64 エンコードまたは OpenSSL で暗号化してダンプする場合など、シークレット抽出や悪用を検出するルールを配置します。
- Rotation: シークレットを定期的にローテーションします。
- Forking should not leak: リポジトリの fork やジョブ定義のコピーがシークレットをコピーしないことを検証します。
- Document: 必要な場合に容易に移行できるよう、CI/CD ツールの一部として保存するシークレットとその理由を文書化します。

#### 3.2.2 シークレット管理システムへの保存

当然ながら、指定されたシークレット管理ソリューションにシークレットを保存できます。たとえば、[AWS Secrets Manager](https://aws.amazon.com/secrets-manager/)、[Google Secrets Manager](https://cloud.google.com/secret-manager)、[Azure Key Vault](https://azure.microsoft.com/nl-nl/services/key-vault/) など、クラウドインフラプロバイダーが提供するソリューションを使用できます。これらの詳細は、このチートシートの [section 4](#4-cloud-providers) にあります。もう 1 つの選択肢は、[Hashicorp Vault](https://www.vaultproject.io/)、[Keeper](https://www.keepersecurity.com/)、[Conjur](https://www.conjur.org/) などの専用シークレット管理システムです。

これらのシステムと CI/CD がやり取りする際の do と don't をいくつか示します。次の事項が確実に処理されていることを確認してください。

- Rotation/Temporality: CI/CD ツールがシークレット管理システムに対して認証するために使用する認証情報は頻繁にローテーションされ、ジョブ完了後に期限切れになること。
- Scope of authorization: CI/CD ツールが使用する認証情報、たとえばロールやユーザーなどのスコープを限定し、CI/CD ツールがジョブを実行するために必要なシークレットとシークレット管理システムのサービスだけを認可すること。
- Attribution of the caller: CI/CD ツールが使用する認証情報が、シークレット管理ソリューションを呼び出した主体の帰属を保持していること。CI/CD ツールによるすべての呼び出しを、その CI/CD ツールのアクションを要求した人物またはサービスに帰属できるようにしてください。シークレットマネージャーのデフォルト設定でこれが不可能な場合は、リクエストパラメータに関する相関付けを設定してください。
- All of the above: セクション 3.2.1 に記載した do と don't、log & alert、forking への対応などを引き続き守ること。
- Backup: 製品の重要運用に関わるシークレット、特に暗号鍵を、別のストレージ、たとえば cold storage にバックアップすること。

#### 3.2.3 CI/CD がまったく触れない

シークレットは、必ずしも CI/CD パイプラインによってシークレットの利用者へ運ばれる必要はありません。シークレットの利用者自身がシークレットを取得する方がさらに望ましいです。その場合でも、CI/CD パイプラインは、たとえば [Kubernetes](https://kubernetes.io/) のようなオーケストレーションシステムに対して、利用者が必要なシークレットを取得できる特定のサービスアカウントで特定のサービスをスケジュールするよう指示する必要があります。CI/CD ツールは引き続きオーケストレーションプラットフォームの認証情報を持ちますが、シークレットそのものへはアクセスしなくなります。これらの認証情報タイプに関する do と don't は、セクション 3.2.2 に記載したものと同様です。

### 3.3 CI/CD ツールの認証と認可

CI/CD ツールには、必要なシークレットまたはシークレット利用者のオーケストレーションの範囲でのみ動作できる専用サービスアカウントを持たせるべきです。さらに、CI/CD パイプライン実行は、ジョブを定義またはトリガーした主体へ容易に帰属できるべきです。これにより、誰がシークレットを外部へ持ち出そうとしたか、または操作しようとしたかを検出できます。証明書ベース認証を使用する場合、パイプラインアイデンティティの呼び出し元を証明書の一部に含めるべきです。前述のシステムに対してトークンで認証する場合は、これらのアクションを要求するプリンシパル、たとえばユーザーまたはジョブ作成者を設定してください。

ログ記録、帰属、疑わしいアクションに対するセキュリティアラートを効果的に行えるよう、これが自分のシステムで今も成り立っているかを定期的に検証してください。

### 3.4 ロギングとアカウンティング

攻撃者は CI/CD ツールを使用してシークレットを抽出できます。たとえば、管理インターフェースやジョブ作成を使い、暗号化や二重 Base64 エンコードでシークレットを外部送信できます。したがって、CI/CD ツール内のすべてのアクションをログに記録すべきです。シークレットの使用を監視するため、パイプラインツールとその管理インターフェースに対する非標準的な操作ごとに、セキュリティアラートルールを定義すべきです。

ログは少なくとも 90 日間クエリ可能であり、より長期間 cold storage に保存されるべきです。攻撃者が CI/CD ツールを使用してシークレットを外部へ持ち出したり操作したりする方法をセキュリティチームが理解するには時間がかかる場合があります。

### 3.5 ローテーションと動的作成

CI/CD ツールを活用してシークレットをローテーションしたり、他のコンポーネントにシークレットのローテーションを指示したりできます。たとえば、CI/CD ツールがシークレット管理システムまたは別のアプリケーションにシークレットのローテーションを要求できます。あるいは、CI/CD ツールまたは別のコンポーネントが動的シークレットを設定できます。これは、利用者が存在している間だけ使用するために必要なシークレットです。利用者が存在しなくなると、そのシークレットは無効化されます。この手順は、シークレットの漏えい可能性を低減し、悪用の検出を容易にします。攻撃者が利用者の IP 以外の場所からシークレットを使用した場合、容易に検出できます。

### 3.6 パイプラインが作成するシークレット

パイプラインツールを使用してシークレットを生成し、ツールによってデプロイされるサービスへ直接提供するか、シークレット管理ソリューションへ提供できます。あるいは、シークレットとそのメタデータを開発者の日常的な作業場所にできるだけ近づけるため、シークレットを暗号化して git に保存できます。git に保存されたシークレットでは、開発者自身がシークレットを復号できないこと、およびシークレットの各利用者がそのシークレットの暗号化済みバリアントを持つことが必要です。たとえば、シークレットは DTAP 環境ごとに異なり、別の鍵で暗号化されるべきです。各環境では、その環境内の指定された利用者だけが特定のシークレットを復号できるべきです。シークレットは環境をまたいで漏えいせず、コードの近くに容易に保存できます。

シークレットの利用者は、セクション 5.2 で説明するように、サイドカーを使ってシークレットを復号できるようになります。シークレットを取得する代わりに、利用者はサイドカーを活用してシークレットを復号します。

パイプラインが自らシークレットを作成する場合、関係するスクリプトまたはバイナリがシークレット生成のベストプラクティスに従うことを確認してください。ベストプラクティスには、安全な乱数、適切なシークレット長など、および git またはその他の場所に保存された明確に定義されたメタデータに基づいてシークレットが作成されることが含まれます。

## 4 クラウドプロバイダー

クラウドプロバイダーについては、少なくとも 4 つの重要なトピックがあります。

- 指定されたシークレット保存または管理ソリューション。どのサービスを使用するか。
- エンベロープ暗号化とクライアントサイド暗号化
- Identity and Access Management: 影響範囲の縮小
- API クォータまたはサービス制限

### 4.1 使用するサービス

どの環境でも、指定されたシークレット管理ソリューションを使用するのが最善です。ほとんどのクラウドプロバイダーには、シークレット管理を提供するサービスが少なくとも 1 つあります。もちろん、クラウド内のコンピュートリソース上で別のシークレット管理ソリューション、たとえば HashiCorp Vault や Conjur を実行することも可能です。このセクションでは、クラウドプロバイダーのサービス提供を検討します。

クラウドプロバイダーが提供するサービスまたはカスタム構築された関数によって、シークレットを自動的にローテーションできる場合があります。一般に、導入障壁と設定ミスのリスクが低いため、クラウドプロバイダーのソリューションを優先すべきです。カスタムソリューションを使用する場合、ローテーションを行う関数のロールが、その関数だけによって引き受け可能であることを確認してください。

#### 4.1.1 AWS

AWS では、推奨ソリューションは [AWS Secrets Manager](https://docs.aws.amazon.com/secretsmanager/latest/userguide/intro.html) です。

権限はシークレットレベルで付与されます。[Secrets Manager best practices](https://docs.aws.amazon.com/secretsmanager/latest/userguide/best-practices.html) を確認してください。

より安価な [Systems Manager Parameter Store](https://docs.aws.amazon.com/systems-manager/latest/userguide/systems-manager-parameter-store.html) を使用することも可能ですが、いくつかの欠点があります。

- 暗号化を自分で指定したことを確認する必要があります。Secrets Manager はデフォルトで暗号化します。
- 自動ローテーション機能が少なく、カスタム関数を構築する必要がある可能性が高いです。
- クロスアカウントアクセスをサポートしません。
- クロスリージョンレプリケーションをサポートしません。
- 利用可能な [Security Hub Controls](https://docs.aws.amazon.com/securityhub/latest/userguide/securityhub-standards-fsbp-controls.html) が少ないです。

##### 4.1.1.1 AWS Nitro Enclaves

[AWS Nitro Enclaves](https://aws.amazon.com/ec2/nitro/nitro-enclaves/) を使用すると、シークレットなどの高度に機微なデータをさらに保護し安全に処理するための分離されたコンピュート環境を作成できます。Enclave は堅牢化され、オペレーターアクセスを制限し、信頼された実行環境を提供します。重要な機能は暗号学的アテステーションであり、シークレットをプロビジョニングする前に enclave のアイデンティティを検証し、認可されたコードだけが実行されていることを確認できます。これにより、シークレット取り扱いに高い保証が必要なシナリオで有力な選択肢になります。

##### 4.1.1.2 AWS CloudHSM

非常に機密性の高いアプリケーションで使用されるシークレットでは、これらの鍵の暗号化と保存をより細かく制御する必要がある場合があります。AWS は [CloudHSM](https://aws.amazon.com/cloudhsm/) を提供しており、AWS サービスに対して bring your own key (BYOK) を使用できます。したがって、鍵の作成、ライフサイクル、耐久性をより制御できます。CloudHSM はデータの自動スケーリングとバックアップを可能にします。クラウドサービスプロバイダーである Amazon は、**AWS CloudHSM** に保存された鍵材料へアクセスできません。

#### 4.1.2 GCP

GCP では、推奨サービスは [Secret Manager](https://cloud.google.com/secret-manager/docs) です。

権限はシークレットレベルで付与されます。

[Secret Manager best practices](https://cloud.google.com/secret-manager/docs/best-practices) を確認してください。

##### 4.1.2.1 Google Cloud Confidential Computing

[GCP Confidential Computing](https://cloud.google.com/confidential-computing) は、処理中のデータ、つまり使用中データを暗号化する技術です。これは、AMD Secure Encrypted Virtualization (SEV) を活用する **Confidential VMs** や **Confidential GKE Nodes** などのサービスによって実現されます。これにより、Google の担当者でさえ仮想マシンのメモリ内容を閲覧できず、メモリ内に保持する必要があるシークレットに高度な保護を提供します。

#### 4.1.3 Azure

Azure では、推奨サービスは [Key Vault](https://docs.microsoft.com/en-us/azure/key-vault/) です。

他のクラウドとは異なり、権限は _**Key Vault**_ レベルで付与されます。つまり、ワークロードや機密度が異なるシークレットは、それに応じて分離された Key Vault に配置すべきです。

[Key Vault best practices](https://docs.microsoft.com/en-us/azure/key-vault/general/best-practices) を確認してください。

##### 4.1.3.1 Azure Confidential Computing

[Azure Confidential Computing](https://azure.microsoft.com/en-us/solutions/confidential-compute/#overview) を使用すると、信頼された実行環境を作成できます。この技術は、保護されたコンテナ内で機微データを分離し、保存時、転送中、使用中のすべてで暗号化されるようにします。**Azure Confidential Virtual Machines** や **Confidential Containers on ACI** のようなサービスは、Intel SGX や AMD SEV-SNP などの技術を利用して、これらの安全な enclave を作成します。これにより、クラウド管理者、マルウェア、他のテナントからの不正アクセスを防止し、シークレット管理のための堅牢なソリューションになります。

##### 4.1.3.2 Azure Dedicated HSM

Azure 環境で使用され、特別なセキュリティ考慮事項が必要なシークレットについて、Azure は [Azure Dedicated HSM](https://azure.microsoft.com/en-us/services/azure-dedicated-hsm/) を提供しています。これにより、強化された管理制御と暗号制御を含め、保存されるシークレットをより細かく制御できます。クラウドサービスプロバイダーである Microsoft は、Azure Dedicated HSM に保存された鍵材料へアクセスできません。

#### 4.1.4 その他のクラウド、マルチクラウド、クラウド非依存

複数のクラウドプロバイダーを使用している場合は、クラウド非依存のシークレット管理ソリューションの使用を検討すべきです。これにより、すべてのクラウドプロバイダー、場合によってはオンプレミスでも、同じシークレット管理ソリューションを使用できます。もう 1 つの利点は、特定のクラウドプロバイダーへのベンダーロックインを避けられることです。そのソリューションはどのクラウドプロバイダーでも使用できるからです。

オープンソースおよび商用のソリューションがあります。例は次のとおりです。

- [CyberArk Conjur](https://www.conjur.org/)
- [HashiCorp Vault](https://www.vaultproject.io/)
- [Pulumi ESC](https://www.pulumi.com/esc/)

### 4.2 エンベロープ暗号化とクライアントサイド暗号化

このセクションでは、シークレットがどのように暗号化されるか、およびクラウドでその暗号化の鍵をどのように管理できるかを説明します。

#### 4.2.1 クライアントサイド暗号化とサーバーサイド暗号化

シークレットのサーバーサイド暗号化では、クラウドプロバイダーが保存中のシークレットの暗号化を担当します。そのシークレットは保存時の侵害から保護されます。保存時暗号化は多くの場合、暗号化に使用する鍵を選択すること以外に追加作業を必要としません。セクション 4.2.2 を参照してください。ただし、そのシークレットを別のサービスへ送信すると、もはや暗号化されたままではありません。意図されたサービスまたは人間のユーザーと共有する前に復号されます。

シークレットのクライアントサイド暗号化では、能動的に復号するまでシークレットは暗号化されたままです。つまり、利用者に到着したときだけ復号されます。これに対応するには適切な暗号システムが必要です。安全な設定の PGP や、よりスケーラブルで比較的使いやすいシステムなどのメカニズムを考えてください。クライアントサイド暗号化は、生成者から利用者までのシークレットのエンドツーエンド暗号化を提供できます。

#### 4.2.2 Bring Your Own Key と Cloud Provider Key

保存時にシークレットを暗号化する場合、問題はどの鍵を使用するかです。クラウドプロバイダーへの信頼が少ないほど、自分で管理したくなります。

多くの場合、シークレット管理サービスで管理される鍵でシークレットを暗号化するか、クラウドプロバイダーの鍵管理ソリューションを使用してシークレットを暗号化できます。クラウドプロバイダーの鍵管理ソリューションを通じて提供される鍵は、クラウドプロバイダーによって管理される場合も、自分で管理する場合もあります。業界標準では後者を「bring your own key」(BYOK) と呼びます。この鍵は、鍵管理ソリューションに直接インポートまたは生成することも、クラウドプロバイダーがサポートする cloud HSM を使用することもできます。

その後、自分の鍵またはプロバイダーの customer main key を使用して、シークレット管理ソリューションの data key を暗号化できます。data key はさらにシークレットを暗号化します。CMK を管理することで、シークレット管理ソリューションにおける data key を制御できます。

自分の鍵材料のインポートは一般にすべてのプロバイダー、[AWS](https://docs.aws.amazon.com/kms/latest/developerguide/importing-keys.html)、[Azure](https://docs.microsoft.com/en-us/azure/key-vault/keys/byok-specification)、[GCP](https://cloud.google.com/kms/docs/key-import) で可能ですが、自分が何をしているかを理解しており、脅威モデルとポリシーがこれを要求する場合を除き、複雑で使いにくいため推奨されるソリューションではありません。

### 4.3 Identity and Access Management (IAM)

IAM はオンプレミスとクラウドの両方の構成に適用されます。シークレットを効果的に管理するには、適切なアクセスポリシーとロールを設定する必要があります。この設定はシークレットに関するポリシーを超えて、IAM セットアップ全体の堅牢化を含むべきです。そうしなければ、権限昇格攻撃を許す可能性があります。オープンな「pass role」権限や無制限の IAM 作成権限を許可しないようにしてください。これらはシークレットにアクセスできる認証情報を使用または作成できるためです。次に、何がサービスアカウントを impersonate できるかを厳密に制御してください。サーバーを悪用した攻撃者がマシンのロールへアクセスできるか、データパイプラインツールのサービスロールがシークレットに容易にアクセスできるか、などを確認します。すべてのクラウドコンポーネントについて IAM を脅威モデルに含めてください。たとえば、このコンポーネントでどのように権限昇格できるかを自問します。例を含む複数の do と don't については、[this blog entry](https://xebia.com/ten-pitfalls-you-should-look-out-for-in-aws-iam/) を参照してください。

IAM プリンシパルの一時性を効果的に活用します。たとえば、必要とする特定のロールとサービスアカウントだけがシークレットにアクセスできるようにします。誰または何がそれらを使用してシークレットへアクセスしたかを判断できるよう、これらのアカウントを監視します。

次に、シークレットへのアクセス範囲を限定してください。単純にすべてのシークレットへのアクセスを許可すべきではありません。GCP と AWS では、プリンシパルがすべてのシークレットへ一度にアクセスできないよう、細かなアクセスポリシーを作成できます。Azure では、Key Vault へのアクセス権があることは、その Key Vault 内のすべてのシークレットへのアクセス権があることを意味します。したがって、Azure で作業する場合はアクセスを分離するために Key Vault を分けることが不可欠です。

### 4.4 API 制限

クラウドサービスは一般に、一定期間内の API 呼び出し数に制限を設けることがあります。これらの制限に達すると、自分自身に対して (D)DoS を引き起こす可能性があります。これらの制限の多くはアカウント、プロジェクト、サブスクリプション単位で適用されるため、影響範囲を制限するようにワークロードを分散してください。さらに、一部のサービスは data key caching をサポートし、鍵管理サービス API への負荷を防止できます。例として [AWS data key caching](https://docs.aws.amazon.com/encryption-sdk/latest/developer-guide/data-key-caching.html) を参照してください。一部のサービスは組み込みの data key caching を活用できます。[S3 is one such example](https://docs.aws.amazon.com/AmazonS3/latest/userguide/bucket-key.html) です。

## 5 コンテナとオーケストレーター

コンテナには、ビルド時、これは推奨されません、およびオーケストレーションまたはデプロイ中という複数の方法でシークレットを追加できます。

### 5.1 シークレットの注入、ファイル、インメモリ

Docker コンテナ内のアプリにシークレットを渡す方法は 3 つあります。

- マウントされたボリューム、ファイル: この方法では、特定の config/secret ファイル内にシークレットを保持し、そのファイルをマウントボリュームとしてインスタンスにマウントします。これらのマウントはオーケストレーターによってマウントされ、ビルトインされないようにしてください。ビルトインするとコンテナ定義とともにシークレットが漏えいします。代わりに、必要なときにオーケストレーターがボリュームをマウントするようにします。
- シークレットストアから取得、インメモリ: サイドカーアプリまたはコンテナが、Docker config を扱わずに、必要なシークレットをシークレットマネージャーサービスから直接取得します。このソリューションにより、ファイルシステムから閲覧されたり、Docker コンテナの環境変数を確認されることでシークレットが見えることを心配せずに、動的に構築されたシークレットを使用できます。
- 環境変数: Docker コンテナ設定の一部としてシークレットを直接提供できます。注: シークレットそのものは docker ENV または docker ARG コマンドでハードコードしてはなりません。これらはコンテナ定義とともに容易に漏えいするためです。[WrongSecrets](https://github.com/OWASP/wrongsecrets) の Docker challenges も参照してください。代わりに、オーケストレーターが実際のシークレットで環境変数を上書きするようにし、それがハードコードされていないことを確認します。さらに、環境変数は一般にすべてのプロセスからアクセス可能であり、ログやシステムダンプに含まれる可能性があります。そのため、他の方法が不可能な場合を除き、環境変数の使用は推奨されません。

### 5.2 短命なサイドカーコンテナ

シークレットを注入するために、リモートエンドポイントからシークレットを取得し、元のコンテナにマウントされた共有ボリュームに保存する短命なサイドカーコンテナを作成できます。元のコンテナは、マウントされたボリュームからシークレットを使用できるようになります。このアプローチの利点は、シークレットを取得するためにサードパーティツールやコードを統合する必要がないことです。サイドカーがシークレットを取得すると終了します。この例には [Vault Agent Sidecar Injector](https://developer.hashicorp.com/vault/docs/platform/k8s/injector) や [Conjur Secrets Provider](https://github.com/cyberark/secrets-provider-for-k8s) があります。Pod と共有されるボリュームにシークレットをマウントすることで、Pod 内のコンテナはシークレットマネージャーを意識せずにシークレットを消費できます。

### 5.3 内部アクセスと外部アクセス

シークレットは、コンテナとデプロイ表現、たとえば Kubernetes Pod の間の通信メカニズムだけに露出すべきです。デプロイやオーケストレーター間で共有される外部アクセスメカニズム、たとえば共有ボリュームを通じてシークレットを露出してはなりません。

オーケストレーターがシークレット、たとえば Kubernetes Secrets を保存する場合、オーケストレーターのストレージバックエンドが暗号化されており、鍵が適切に管理されていることを確認してください。詳細は [Kubernetes Security Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Kubernetes_Security_Cheat_Sheet.html) を参照してください。

## 6 実装ガイダンス

このセクションでは実装について説明します。実際の実装については、選択したシークレット管理システムの公式ドキュメントを参照することが常に最善である点に注意してください。その方が、このチートシートのような二次文書よりも最新であるためです。

### 6.1 鍵材料管理ポリシー

鍵材料管理については、[Key Management Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Key_Management_Cheat_Sheet.html) で説明されています。

### 6.2 動的ユースケースと静的ユースケース

動的シークレットのユースケースには、とりわけ次のものがあります。

- 二次サービスに対する短命なシークレット、たとえば認証情報や API キー。これは、主サービス、たとえば利用者がそのサービスへ接続する意図を表します。
- メモリ内およびランタイム通信プロセスを保護し安全にするための、短命な完全性および暗号化制御。単一セッションまたは単一デプロイメントの寿命だけでよい暗号鍵を考えてください。
- サービスのデプロイ中にスタックを構築し、デプロイ担当者と支援インフラとやり取りするための短命な認証情報。

これらの動的シークレットは、多くの場合、接続先となるサービスとともに作成する必要がある点に注意してください。この種の動的シークレットを作成するには、通常、動的シークレットそのものを作成するための長期的な静的シークレットが必要です。その他の静的ユースケースは次のとおりです。

- 同じサービスの他のインスタンスとのやり取りでの使用性質により、単一デプロイメントより長く存在する必要がある鍵材料。例: ストレージ暗号鍵、TLS PKI 鍵。
- 一時的なロールや認証情報の作成をサポートしないサービスへ接続するための鍵材料または認証情報。

### 6.3 制限が配置されていることを確認する

シークレットは、すべての人やすべてのものから取得可能であってはなりません。常にガードレールを配置してください。

- アクセスポリシーを作成する機会がありますか。シークレットを読み書きできるエンティティの数を制限するポリシーがあることを確認してください。同時に、容易に拡張でき、理解が複雑になりすぎないようにポリシーを記述します。
- シークレット管理ソリューション内で特定のシークレットへのアクセスを減らす方法がありませんか。本番シークレットと開発シークレットを分離するために、別々のシークレット管理ソリューションを持つことを検討してください。そのうえで、本番シークレット管理ソリューションへのアクセスを減らします。

### 6.4 Security Event Monitoring が重要

誰または何が、どの IP から、どの方法でシークレットへアクセスするかを継続的に監視します。注目すべきパターンは、これらに限定されませんが、次のようなものがあります。

- シークレット管理システムで誰がシークレットへアクセスするかを監視します。これは通常の動作でしょうか。CI/CD 認証情報が、CI/CD システムが実行されている場所とは異なる IP からシークレット管理ソリューションへアクセスするために使用された場合、セキュリティアラートを出し、そのシークレットは侵害されたと想定してください。
- 可能であれば、シークレットを必要とするサービスを監視します。たとえば、シークレットの利用者が期待される IP、期待される user agent から来ているかを確認します。そうでなければ、アラートを出し、そのシークレットは侵害されたと想定してください。

### 6.5 ユーザビリティとオンボーディングの容易さ

シークレット管理ソリューションが効果的であるためには、開発者が採用し使いやすいものでなければなりません。プロセスが複雑すぎると、開発者は安全でない実践に戻る可能性があります。ユーザビリティと円滑なオンボーディング体験に焦点を当てることが重要です。

- **明確で包括的なドキュメント:**
    - 明確で簡潔で見つけやすいドキュメントを提供します。これには、一般的なユースケースのチュートリアル、詳細な API リファレンス、実用的な例を含めるべきです。
    - 新規ユーザーが最初のシークレットを取得するプロセスを案内する「getting started」ガイドを維持します。
- **開発者に優しいツールと SDK:**
    - 統合を簡素化するため、さまざまなプログラミング言語向けに保守された SDK を提供します。
    - 開発者がローカル開発環境からシークレットを管理できるコマンドラインインターフェース (CLI) を提供します。
    - 一般的な IDE、CI/CD システム、Terraform や Pulumi などの infrastructure-as-code (IaC) ツール向けプラグインを開発します。
- **合理化されたワークフロー:**
    - 開発者が最小限の手動介入でシークレットを要求し受け取れるセルフサービスワークフローを実装します。
    - GitOps 原則を使用してシークレットをコードとして管理し、開発者がアプリケーションコードと並べて宣言的にシークレット要件を定義できるようにします。
    - 低リスクのシークレットについて承認プロセスを自動化し、より機微なものには適切な制御を維持します。
- **実行可能なフィードバックとサポート:**
    - 開発者が独力で問題をトラブルシュートできるよう、明確なエラーメッセージを提供します。
    - 開発者がセキュリティチームまたはプラットフォームチームから支援を受けられる専用サポートチャネル、たとえば Slack チャネルやチケットシステムを確立します。
- **容易な統合:**
    - シークレット管理ソリューションが既存アプリケーションと容易に統合できることを確認します。[Vault Agent Sidecar Injector](https://developer.hashicorp.com/vault/docs/platform/k8s/injector) や [Conjur Secrets Provider](https://github.com/cyberark/secrets-provider-for-k8s) などのサイドカーコンテナは、アプリケーションをシークレット管理システムから分離するのに役立ちます。

## 7 暗号化

シークレット管理は暗号化と密接に関係しています。結局のところ、シークレットは機密性と完全性を保護するため、どこかに暗号化して保存しなければなりません。

### 7.1 使用する暗号化の種類

十分なセキュリティを提供し、量子コンピューティングベースの攻撃に対する十分な耐性を含む限り、シークレットを保護するためにさまざまな暗号化方式を使用できます。この分野は変化しているため、既存標準に対する暗号化方式と鍵長の使用について最新の推奨事項を列挙している [keylength.com](https://www.keylength.com/en/4/) や、量子耐性アルゴリズムを列挙している NSA の [Commercial National Security Algorithm Suite 2.0](https://media.defense.gov/2022/Sep/07/2003071834/-1/-1/0/CSA_CNSA_2.0_ALGORITHMS_.PDF) などの情報源を確認するのが最善です。

すべての場合において、GCM [(Galois Counter Mode)](https://en.wikipedia.org/wiki/Galois/Counter_Mode) を使用する AES-256、またはこの分野のベストプラクティスに従った ChaCha20 と Poly1305 の組み合わせなど、暗号化と機密性を同時に提供するアルゴリズムを優先的に選択する必要がある点に注意してください。

### 7.2 収束暗号化

[Convergent Encryption](https://en.wikipedia.org/wiki/Convergent_encryption) は、ある平文とその鍵が同じ暗号文を生成することを保証します。これにより、シークレットの再利用の可能性を、同じ暗号文として検出しやすくなります。

収束暗号化を有効にする際の課題は、攻撃者がそのシステムを使用して暗号文字列の集合を生成し、それが同じシークレットになり得ることで、攻撃者が平文シークレットを導出できる可能性があることです。アルゴリズムと鍵が与えられている場合、使用する収束暗号システムが暗号化時に十分なリソース課題を持っていれば、このリスクを軽減できます。リスク低減に役立つもう 1 つの要素は、シークレットが十分な長さであることを保証し、推測反復に必要な時間をさらに妨げることです。

### 7.3 暗号鍵をどこに保存するか

鍵自体が暗号化されている場合、エンベロープ暗号化を参照してください、を除き、鍵をその鍵が暗号化するシークレットの隣に保存すべきではありません。暗号鍵および可能な HMAC 鍵をどこに、どのように保存するかについては、まず [Key Management Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Key_Management_Cheat_Sheet.html) を参照してください。

### 7.4 Encryption as a Service (EaaS)

EaaS は、ユーザーが自分のシステムに暗号化をインストールせず、クラウドベースの暗号化サービスを購読するモデルです。EaaS を使用すると、次の利点を得られます。

- 保存時暗号化
- 転送中暗号化 (TLS)
- 鍵の取り扱いと暗号実装は開発者ではなく Encryption Service が担当します。
- プロバイダーは機微データとやり取りする追加サービスを加えることができます。

## 8 検出

シークレット検出には多くのアプローチがあり、それを支援する非常に有用なオープンソースプロジェクトもあります。[Yelp Detect Secrets](https://github.com/Yelp/detect-secrets) プロジェクトは成熟しており、約 20 種類のシークレットに対するシグネチャマッチングを備えています。検出領域で役立つ他のツールの詳細については、GitHub の [Secrets Detection](https://github.com/topics/secrets-detection) トピックを確認してください。

### 8.1 一般的な検出アプローチ

Shift-left と DevSecOps の原則は、シークレット検出にも適用されます。以下の一般的なアプローチは、シークレットをより早期に考慮し、実践を時間とともに発展させることを目的としています。

- 標準的なテストシークレットを作成し、組織全体で普遍的に使用します。これにより、シークレットタイプごとに単一のテストシークレットだけを追跡すればよくなり、誤検知を減らせます。
- IDE、テスト駆動開発の一部、または pre-commit hook を通じて、commit/PR の前にシークレットをコードへチェックインしないよう、開発者レベルでシークレット検出を有効にすることを検討します。
- シークレット検出を脅威モデルの一部にします。脅威モデリング演習中、シークレットを攻撃対象領域の一部として検討します。
- 検出ユーティリティと関連シグネチャが期待を満たしていることを確認するため、頻繁に評価します。
- 複数の検出ユーティリティを持ち、結果を相関付け、重複排除して、検出の弱点となり得る領域を特定することを検討します。
- エントロピーと検出容易性のバランスを探ります。一貫した形式を持つシークレットは低い誤検知率で検出しやすいですが、人間が作成したパスワードが検出ルールに一致しないという理由だけで見逃したくはありません。

### 8.2 検出すべきシークレットの種類

多くの種類のシークレットが存在するため、すべてを正確に検出できるよう、それぞれに対するシグネチャを検討すべきです。より一般的な種類には次があります。

- 高可用性シークレット、ローテーションが難しいトークン
- アプリケーション設定ファイル
- 接続文字列
- API キー
- 認証情報
- パスワード
- 2FA キー
- 秘密鍵、たとえば SSH キー
- セッショントークン
- プラットフォーム固有のシークレットタイプ、たとえば Amazon Web Services、Google Cloud

シークレットについて楽しく学び、見つけ出す練習をするには、[Wrong Secrets](https://owasp.org/www-project-wrongsecrets/) プロジェクトを確認してください。

### 8.3 検出ライフサイクル

シークレットは他の認可トークンと同様です。次のようであるべきです。

- 必要な期間だけ存在する、頻繁にローテーションする
- 自動ローテーションの方法がある
- 必要とする人だけに見える、最小権限
- 失効可能である、失効済みシークレットの使用試行ログ記録を含む
- ログに記録されない、平文シークレットのログ記録を避けるため、暗号化またはマスキングのアプローチを実装しなければならない

シークレットライフサイクルの各段階について検出ルールを作成します。

### 8.4 シークレット検出方法に関するドキュメント

開発者コミュニティに対して、組織で利用可能な手順とシステム、期待するシークレット管理の種類、シークレットのテスト方法、検出されたシークレットがあった場合に何をするかを知らせるため、ドキュメントを作成し定期的に更新します。

ドキュメントは次のようであるべきです。

- 存在し、特にインシデント対応時に頻繁に更新される
- 次の情報を含む
    - 誰がシークレットへアクセスできるか
    - どのようにローテーションされるか
    - シークレットローテーション中に破損する可能性がある上流または下流の依存関係
    - インシデント時の連絡先
    - 露出によるセキュリティ影響
- 脅威リスク、データ分類などに応じて、シークレットの扱いが異なる場合を特定する

## 9 インシデント対応

シークレット露出時の迅速な対応は、シークレット管理における最も重要な考慮事項の 1 つかもしれません。

### 9.1 ドキュメント

シークレット露出時のインシデント対応では、管理の連鎖にいる全員が認識し、対応方法を理解していることを確実にすべきです。これには、アプリケーション作成者、開発チームの全メンバー、情報セキュリティ、技術リーダーシップが含まれます。

ドキュメントには次を含めなければなりません。

- 特に事業継続性レビュー中に、シークレットとシークレット取り扱いをテストする方法。
- シークレットが検出されたときに誰へ警告するか。
- 封じ込めのために実行する手順。
- イベント中にログへ記録する情報。

### 9.2 修復

インシデント対応の主な目標は、迅速な対応と封じ込めです。

封じ込めは次の手順に従うべきです。

1. 失効: 露出した鍵は即時失効されるべきです。シークレットは迅速に認可解除できなければならず、失効状態を特定するためのシステムが整っていなければなりません。
2. ローテーション: 新しいシークレットは迅速に作成および実装できなければなりません。再現性、低い実装エラー率、最小権限、人間が直接読めないことを確保するため、自動化プロセスによることが望ましいです。
3. 削除: 失効またはローテーションされたシークレットは、コードやログで発見されたシークレットを含め、露出したシステムから直ちに削除しなければなりません。コード内のシークレットについては、シークレット導入前まで commit 履歴を squash できますが、これは git 履歴を書き換え、特定 commit への他のリンクを壊すため、別の問題を引き起こす可能性があります。これを行う場合は、結果を認識し、適切に計画してください。ログ内のシークレットについては、ログの完全性を維持しながらシークレットを削除するプロセスが必要です。
4. ロギング: インシデント対応チームは、封じ込めと修復を支援するため、シークレットのライフサイクルに関する情報へアクセスできなければなりません。これには次が含まれます。
    - 誰がアクセス権を持っていたか。
    - いつ使用したか。
    - 以前いつローテーションされたか。

### 9.3 ロギング

シークレット使用のロギングに関する追加の考慮事項には、次を含めるべきです。

- インシデント対応のためのログは、incident response (IR) チームがアクセスできる単一の場所に記録すること。
- purple team 演習中に、次のようなログ情報の忠実度を確認すること。
    - 何がログ記録されるべきだったか。
    - 実際には何がログ記録されたか。
    - これを保証する十分なアラートが配置されているか。

必要なすべての情報がログ記録されるよう、[Logging Vocabulary Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Logging_Vocabulary_Cheat_Sheet.html) のような標準化されたログ形式と語彙の使用を検討してください。

## 10 マルチクラウド環境におけるシークレット管理

### 10.1 はじめに

マルチクラウド環境におけるシークレット管理には、クラウドプロバイダーとそれぞれのサービスの多様性により、固有の課題があります。このセクションでは、複数のクラウドプロバイダーにまたがってシークレットを管理するための課題とベストプラクティスについて説明します。

### 10.2 課題

1. **多様な API とインターフェース:** 各クラウドプロバイダーはシークレット管理のために独自の API とインターフェースを持っており、複数プロバイダーにまたがるシークレットの統合と管理が複雑になる可能性があります。
2. **一貫しないセキュリティポリシー:** クラウドプロバイダーごとにセキュリティポリシーと実践が異なる可能性があり、すべての環境で一貫したセキュリティ標準を強制することが困難になります。
3. **鍵ローテーション:** 複数のクラウドプロバイダーにまたがって鍵を一貫して安全にローテーションすることは、各プロバイダーが異なる鍵ローテーションメカニズムを持つ場合に特に困難です。
4. **アクセス制御:** 各プロバイダーが異なるアクセス制御メカニズムとポリシーを持つ可能性があるため、複数のクラウドプロバイダーにまたがるシークレットのアクセス制御管理は複雑になり得ます。
5. **監査とモニタリング:** 複数のクラウドプロバイダーにまたがるシークレットアクセスと使用の包括的な監査とモニタリングを確保することは、ロギングとモニタリング能力の違いにより困難になる可能性があります。

### 10.3 ベストプラクティス

1. **集中型シークレット管理ソリューションを使用する:** 複数のクラウドプロバイダーと統合できる集中型シークレット管理ソリューションを実装します。これにより、シークレット管理を標準化し、すべての環境で一貫したセキュリティポリシーを強制しやすくなります。例には HashiCorp Vault と CyberArk Conjur があります。
2. **セキュリティポリシーを標準化する:** すべてのクラウドプロバイダーにまたがってシークレットを管理するための標準化されたセキュリティポリシーを定義し強制します。これには、鍵ローテーション、アクセス制御、監査のポリシーが含まれます。
3. **鍵ローテーションを自動化する:** すべてのクラウドプロバイダーにまたがって鍵が一貫して安全にローテーションされるよう、自動鍵ローテーションプロセスを実装します。ツールとスクリプトを使用してローテーションプロセスを自動化し、人的ミスのリスクを低減します。
4. **細かなアクセス制御を実装する:** 最小権限の原則に基づき、シークレットへのアクセスを制限するため、細かなアクセス制御メカニズムを使用します。アクセス制御ポリシーがすべてのクラウドプロバイダーで一貫して強制されることを確認します。
5. **包括的な監査とモニタリングを有効化する:** すべてのクラウドプロバイダーにまたがって、シークレットアクセスと使用の包括的な監査とモニタリングを実装します。集中型ロギングおよびモニタリングソリューションを使用して、複数プロバイダーからのログを集約および分析します。

### 10.4 参考資料

- [HashiCorp Vault](https://www.vaultproject.io/)
- [CyberArk Conjur](https://www.conjur.org/)
- [AWS Secrets Manager](https://aws.amazon.com/secrets-manager/)
- [Azure Key Vault](https://azure.microsoft.com/en-us/services/key-vault/)
- [Google Cloud Secret Manager](https://cloud.google.com/secret-manager)

## 11 関連チートシートと追加資料

- [Key Management Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Key_Management_Cheat_Sheet.html)
- [Logging Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html)
- [Password Storage Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html)
- [Cryptographic Storage Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cryptographic_Storage_Cheat_Sheet.html)
- [OWASP WrongSecrets project](https://github.com/OWASP/wrongsecrets/)
- [Blog: 10 Pointers on Secrets Management](https://xebia.com/blog/secure-deployment-10-pointers-on-secrets-management/)
- [Blog: From build to run: pointers on secure deployment](https://xebia.com/from-build-to-run-pointers-on-secure-deployment/)
- [GitHub listing on secrets detection tools](https://github.com/topics/secrets-detection)
- [NIST SP 800-57 Recommendation for Key Management](https://csrc.nist.gov/publications/detail/sp/800-57-part-1/rev-5/final)
- [OpenCRE References to secrets](https://opencre.org/cre/223-780)

</section>

<section id="secrets-management-bilingual-panel" className="tabPanel bilingualPanel">

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (Original)</span>

# Secrets Management Cheat Sheet

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

# シークレット管理チートシート

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (Original)</span>

## 1 Introduction

Secrets are being used everywhere nowadays, especially with the popularity of the DevOps movement. Application Programming Interface (API) keys, database credentials, Identity and Access Management (IAM) permissions, Secure Shell (SSH) keys, certificates, etc. Many organizations have them hardcoded within the source code in plaintext, littered throughout configuration files and configuration management tools.

There is a growing need for organizations to centralize the storage, provisioning, auditing, rotation and management of secrets to control access to secrets and prevent them from leaking and compromising the organization. Often, services share the same secrets, which makes identifying the source of compromise or leak challenging.

This cheat sheet offers best practices and guidelines to help properly implement secrets management.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## 1 はじめに

シークレットは現在、特に DevOps ムーブメントの普及に伴い、あらゆる場所で使われています。Application Programming Interface (API) キー、データベース認証情報、Identity and Access Management (IAM) 権限、Secure Shell (SSH) キー、証明書などが該当します。多くの組織では、それらがソースコード内に平文でハードコードされ、設定ファイルや構成管理ツールの中に散在しています。

組織には、シークレットへのアクセスを制御し、漏えいや組織侵害を防ぐために、シークレットの保存、プロビジョニング、監査、ローテーション、管理を一元化する必要性が高まっています。多くの場合、サービスは同じシークレットを共有しており、侵害や漏えいの発生源を特定することが困難になります。

このチートシートは、シークレット管理を適切に実装するためのベストプラクティスとガイドラインを提供します。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (Original)</span>

## 2 General Secrets Management

The following sections address the main concepts relating to secrets management.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## 2 一般的なシークレット管理

以下のセクションでは、シークレット管理に関連する主要な概念を扱います。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (Original)</span>

### 2.1 High Availability

It is vital to select a technology that is robust enough to service traffic reliably:

- Users (e.g., SSH keys, root account passwords). In an incident response scenario, users expect to be provisioned with credentials rapidly, so they can recover services that have gone offline. Having to wait for credentials could impact the responsiveness of the operations team.
- Applications (e.g., database credentials and API keys). If the service is not performant, it could degrade the availability of dependent applications or increase application startup times.

Such a service could receive a considerable volume of requests within a large organization.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### 2.1 高可用性

トラフィックを確実に処理できる十分に堅牢な技術を選択することが重要です。

- ユーザー、たとえば SSH キーや root アカウントのパスワード。インシデント対応シナリオでは、停止したサービスを復旧できるよう、ユーザーは認証情報が迅速にプロビジョニングされることを期待します。認証情報を待つ必要があると、運用チームの対応力に影響する可能性があります。
- アプリケーション、たとえばデータベース認証情報や API キー。サービスの性能が十分でない場合、依存するアプリケーションの可用性を低下させたり、アプリケーションの起動時間を増加させたりする可能性があります。

大規模な組織では、このようなサービスに相当な量のリクエストが届く可能性があります。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (Original)</span>

### 2.2 Centralize and Standardize

Secrets used by your DevOps teams for your applications might be consumed differently than secrets stored by your marketeers or your SRE team. You often find poorly maintained secrets where the needs of secret consumers or producers mismatch. Therefore, you must standardize and centralize the secrets management solution with care. Standardizing and centralizing can mean that you use multiple secret management solutions. For instance: your cloud-native development teams choose to use the solution provided by the cloud provider, while your private cloud uses a third-party solution, and everybody has an account for a selected password manager.
By making sure that the teams standardize the interaction with these different solutions, they remain maintainable and usable in the event of an incident.
Even when a company centralizes its secrets management to just one solution, you will often have to secure the primary secret of that secrets management solution in a secondary secrets management solution. For instance, you can use a cloud provider's facilities to store secrets, but that cloud provider's root/management credentials need to be stored somewhere else.

Standardization should include Secrets life cycle management, Authentication, Authorization, and Accounting of the secrets management solution, and life cycle management. Note that it should be immediately apparent to an organization what a secret is used for and where to find it. The more Secrets management solutions you use, the more documentation you need.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### 2.2 集中化と標準化

アプリケーションのために DevOps チームが使用するシークレットは、マーケティング担当者や SRE チームが保存するシークレットとは異なる方法で消費される可能性があります。シークレットの利用者と生成者のニーズが一致せず、保守状態の悪いシークレットが見つかることはよくあります。したがって、シークレット管理ソリューションを慎重に標準化し、集中化しなければなりません。標準化と集中化は、複数のシークレット管理ソリューションを使用することを意味する場合もあります。たとえば、クラウドネイティブ開発チームはクラウドプロバイダーが提供するソリューションを選び、プライベートクラウドではサードパーティソリューションを使用し、全員が選定済みのパスワードマネージャーのアカウントを持つ、という形です。

チームがこれらの異なるソリューションとのやり取りを標準化しておくことで、インシデント発生時にも保守可能で使用可能な状態を維持できます。

企業がシークレット管理を単一のソリューションに集中化している場合でも、多くの場合、そのシークレット管理ソリューションの主要シークレットを二次的なシークレット管理ソリューションで保護する必要があります。たとえば、クラウドプロバイダーの機能を使用してシークレットを保存できますが、そのクラウドプロバイダーの root または管理認証情報は別の場所に保存する必要があります。

標準化には、シークレット管理ソリューションのシークレットライフサイクル管理、認証、認可、アカウンティング、およびライフサイクル管理を含める必要があります。組織にとって、シークレットが何に使われ、どこで見つけられるかがすぐに分かるべきである点に注意してください。使用するシークレット管理ソリューションが多いほど、必要なドキュメントも多くなります。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (Original)</span>

### 2.3 Access Control

When users can read and/or update the secret in a secret management system, it means that the secret can now leak through that user and the system they used to touch the secret.
Therefore, engineers should not have access to all secrets in the secrets management system, and the Least Privilege principle should be applied. The secret management system needs to provide the ability to configure fine-grained access controls on each object and component to accomplish the Least Privilege principle.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### 2.3 アクセス制御

ユーザーがシークレット管理システム内のシークレットを読み取りまたは更新できる場合、そのシークレットはそのユーザーと、ユーザーがシークレットに触れるために使用したシステムを通じて漏えいする可能性があります。

したがって、エンジニアがシークレット管理システム内のすべてのシークレットにアクセスできるべきではなく、最小権限の原則を適用すべきです。シークレット管理システムは、最小権限の原則を達成するために、各オブジェクトとコンポーネントに対して細かなアクセス制御を設定できる必要があります。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (Original)</span>

### 2.4 Automate Secrets Management

Manual maintenance not only increases the risk of leakage; it also introduces the risk of human errors while maintaining the secret. Furthermore, it can become wasteful.
Therefore, it is better to limit or remove the human interaction with the actual secrets. You can restrict human interaction in multiple ways:

- **Secrets pipeline:** Having a secrets pipeline that does large parts of the secret management (e.g., creation, rotation, etc.)
- **Using dynamic secrets:** When an application starts, it could request its database credentials, which, when dynamically generated, will be provided with new credentials for that session. Dynamic secrets should be used where possible to reduce the surface area of credential reuse. Should the application's database credentials be stolen, upon reboot they would be expired.
- **Automated rotation of static secrets:** Key rotation is a challenging process when implemented manually, and can lead to mistakes. It is therefore better to automate the rotation of keys or at least ensure that the process is sufficiently supported by IT.

Rotating certain keys, such as encryption keys, might trigger full or partial data re-encryption. Different strategies for rotating keys exist:

- Gradual rotation
- Introducing new keys for Write operations
- Leaving old keys for Read operations
- Rapid rotation
- Scheduled rotation
- and more...

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### 2.4 シークレット管理の自動化

手動保守は漏えいリスクを高めるだけでなく、シークレットを保守する際の人的ミスのリスクも生みます。さらに、無駄な作業になることもあります。

したがって、実際のシークレットに対する人間の操作を制限または排除する方が望ましいです。人間の操作は複数の方法で制限できます。

- **シークレットパイプライン:** 作成やローテーションなど、シークレット管理の大部分を担うシークレットパイプラインを用意します。
- **動的シークレットの使用:** アプリケーション起動時にデータベース認証情報を要求し、それが動的に生成される場合、そのセッション用の新しい認証情報が提供されます。認証情報の再利用範囲を減らすため、可能な場合は動的シークレットを使用すべきです。アプリケーションのデータベース認証情報が盗まれたとしても、再起動時には期限切れになります。
- **静的シークレットの自動ローテーション:** 鍵ローテーションは、手動で実装すると困難なプロセスであり、ミスにつながる可能性があります。したがって、鍵のローテーションを自動化するか、少なくとも IT によってプロセスが十分に支援されるようにする方が望ましいです。

暗号鍵など一部の鍵をローテーションすると、データの全部または一部の再暗号化が発生する可能性があります。鍵ローテーションには、次のようなさまざまな戦略があります。

- 段階的ローテーション
- 書き込み操作用の新しい鍵の導入
- 読み取り操作用に古い鍵を残す
- 迅速なローテーション
- 定期ローテーション
- ほか多数

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (Original)</span>

#### 2.4.1 Architectural Patterns for Automated Rotation

To illustrate how to design systems that support automated secret rotation, here are a few architectural patterns:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

#### 2.4.1 自動ローテーションのためのアーキテクチャパターン

自動シークレットローテーションをサポートするシステムをどのように設計するかを示すため、いくつかのアーキテクチャパターンを示します。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (Original)</span>

##### Example 1: Kubernetes with a Sidecar Container

In a Kubernetes environment, a common pattern is to use a sidecar container that is responsible for retrieving secrets from a secrets manager and making them available to the main application container. This decouples the application from the specifics of the secrets management solution.

- **Architecture:**
    - A Pod contains two containers: the main application container and a sidecar container (e.g., HashiCorp Vault Agent, CyberArk Conjur Secrets Provider).
    - The sidecar container authenticates with the secrets manager (e.g., using a Kubernetes Service Account).
    - It retrieves the secret and writes it to a shared in-memory volume.
    - The application container reads the secret from the shared volume.
    - The sidecar container can periodically refresh the secret, ensuring the application always has a valid, short-lived credential.
- **Kubernetes Manifest Snippet:**

    ```yaml
    apiVersion: v1
    kind: Pod
    metadata:
      name: my-app
    spec:
      serviceAccountName: my-app-sa
      containers:
      - name: my-app-container
        image: my-app-image
        volumeMounts:
        - name: secrets-volume
          mountPath: "/mnt/secrets"
          readOnly: true
      - name: vault-agent-sidecar
        image: vault:latest
        args: ["agent", "-config=/etc/vault/vault-agent-config.hcl"]
        volumeMounts:
        - name: secrets-volume
          mountPath: "/mnt/secrets"
      volumes:
      - name: secrets-volume
        emptyDir:
          medium: "Memory"
    ```

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

##### 例 1: サイドカーコンテナを使用する Kubernetes

Kubernetes 環境では、シークレットマネージャーからシークレットを取得し、メインアプリケーションコンテナが利用できるようにするサイドカーコンテナを使用するパターンが一般的です。これにより、アプリケーションはシークレット管理ソリューション固有の詳細から分離されます。

- **アーキテクチャ:**
    - Pod には、メインアプリケーションコンテナとサイドカーコンテナの 2 つのコンテナを含めます。例: HashiCorp Vault Agent、CyberArk Conjur Secrets Provider。
    - サイドカーコンテナは、たとえば Kubernetes Service Account を使用してシークレットマネージャーに認証します。
    - サイドカーコンテナはシークレットを取得し、共有インメモリボリュームに書き込みます。
    - アプリケーションコンテナは共有ボリュームからシークレットを読み取ります。
    - サイドカーコンテナはシークレットを定期的に更新でき、アプリケーションが常に有効で短命な認証情報を持つようにします。
- **Kubernetes マニフェストのスニペット:**

    ```yaml
    apiVersion: v1
    kind: Pod
    metadata:
      name: my-app
    spec:
      serviceAccountName: my-app-sa
      containers:
      - name: my-app-container
        image: my-app-image
        volumeMounts:
        - name: secrets-volume
          mountPath: "/mnt/secrets"
          readOnly: true
      - name: vault-agent-sidecar
        image: vault:latest
        args: ["agent", "-config=/etc/vault/vault-agent-config.hcl"]
        volumeMounts:
        - name: secrets-volume
          mountPath: "/mnt/secrets"
      volumes:
      - name: secrets-volume
        emptyDir:
          medium: "Memory"
    ```

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (Original)</span>

##### Example 2: Serverless Function for Database Credential Rotation

Cloud-native secret managers often provide built-in support for automated rotation using serverless functions (e.g., AWS Lambda, Azure Functions).

- **Architecture:**
    - A secret is stored in a cloud secrets manager (e.g., AWS Secrets Manager).
    - The secrets manager is configured to trigger a rotation Lambda function on a schedule.
    - The Lambda function has the necessary permissions to update the database password and the secret value in the secrets manager.
    - The rotation process typically involves multiple steps (create new secret, set new secret, test new secret, finish rotation) to ensure a safe transition.
- **AWS Lambda Rotation Function (Conceptual Python Code):**

    ```python
    import boto3
    import os

    def lambda_handler(event, context):
        secret_name = event['SecretId']
        token = event['ClientRequestToken']
        step = event['Step']

        secrets_manager = boto3.client('secretsmanager')
        # Get the secret metadata
        metadata = secrets_manager.describe_secret(SecretId=secret_name)

        if step == "createSecret":
            # Create a new version of the secret
            new_password = generate_new_password()
            secrets_manager.put_secret_value(
                SecretId=secret_name,
                ClientRequestToken=token,
                SecretString=f'{{"password":"{new_password}"}}',
                VersionStages=['AWSPENDING']
            )
        elif step == "setSecret":
            # Update the database with the new password
            update_database_password(new_password)
        elif step == "testSecret":
            # Test the new secret
            test_database_connection(new_password)
        elif step == "finishSecret":
            # Mark the new version of the secret as current
            secrets_manager.update_version_stage(
                SecretId=secret_name,
                VersionStage="AWSCURRENT",
                MoveToVersionId=token
            )
    ```

These examples demonstrate how you can create architectures that not only manage secrets securely but also automate the rotation process, significantly reducing the risk of compromised credentials.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

##### 例 2: データベース認証情報ローテーションのためのサーバーレス関数

クラウドネイティブなシークレットマネージャーは、多くの場合、サーバーレス関数を使用した自動ローテーションを組み込みでサポートしています。例: AWS Lambda、Azure Functions。

- **アーキテクチャ:**
    - シークレットをクラウドシークレットマネージャーに保存します。例: AWS Secrets Manager。
    - シークレットマネージャーは、スケジュールに基づいてローテーション Lambda 関数をトリガーするように設定されます。
    - Lambda 関数は、データベースパスワードとシークレットマネージャー内のシークレット値を更新するために必要な権限を持ちます。
    - ローテーションプロセスは通常、安全な移行を確保するために複数のステップ、新しいシークレットの作成、新しいシークレットの設定、新しいシークレットのテスト、ローテーションの完了を含みます。
- **AWS Lambda ローテーション関数、概念的な Python コード:**

    ```python
    import boto3
    import os

    def lambda_handler(event, context):
        secret_name = event['SecretId']
        token = event['ClientRequestToken']
        step = event['Step']

        secrets_manager = boto3.client('secretsmanager')
        # Get the secret metadata
        metadata = secrets_manager.describe_secret(SecretId=secret_name)

        if step == "createSecret":
            # Create a new version of the secret
            new_password = generate_new_password()
            secrets_manager.put_secret_value(
                SecretId=secret_name,
                ClientRequestToken=token,
                SecretString=f'{{"password":"{new_password}"}}',
                VersionStages=['AWSPENDING']
            )
        elif step == "setSecret":
            # Update the database with the new password
            update_database_password(new_password)
        elif step == "testSecret":
            # Test the new secret
            test_database_connection(new_password)
        elif step == "finishSecret":
            # Mark the new version of the secret as current
            secrets_manager.update_version_stage(
                SecretId=secret_name,
                VersionStage="AWSCURRENT",
                MoveToVersionId=token
            )
    ```

これらの例は、シークレットを安全に管理するだけでなくローテーションプロセスも自動化するアーキテクチャを作成できることを示しており、侵害された認証情報によるリスクを大幅に低減します。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (Original)</span>

### 2.5 Handling Secrets in Memory

An additional level of security can be achieved by minimizing the time window
where a secret is in memory and limiting the access to its memory space.

Depending on your application's particular circumstances, this can be difficult
to implement in a manner that ensures memory security. Because of this potential
implementation complexity, you are first encouraged to develop a threat model in order to clearly
surface your implicit assumptions about both your application's deployment environment as well
as understand the capabilities of your adversaries.

Often attempting to protect secrets in memory will be considered overkill
because as you evaluate a threat model, the potential threat
actors that you consider either do not have the capabilities to carry out such attacks
or the cost of defense far exceeds the likely impact of a compromise arising from
exposing secrets in memory. Also, it should be kept in mind while developing an
appropriate threat model, that if an attacker already has access to the memory of
the process handling the secret, by that time a security breach may have already
occurred. Furthermore, it should be recognized that with the advent of attacks like
[Rowhammer](https://arxiv.org/pdf/2211.07613.pdf), or
[Meltdown and Spectre](https://meltdownattack.com/), it is important
to understand that the operating system alone is not sufficient to protect your process
memory from these types of attacks. This becomes especially important when your
application is deployed to the cloud. The only foolproof approach to protecting memory
against these and similar attacks is to fully physically isolate your process memory from all other
untrusted processes.

Despite the implementation difficulties, in highly sensitive
environments, protecting secrets in memory can
be a valuable additional layer of security. For example, in scenarios where an
advanced attacker can cause a system to crash and gain access to a memory dump,
they may be able to extract secrets from it. Therefore, carefully safeguarding
secrets in memory is recommended for untrusted environments or situations where
tight security is of utmost importance.

Furthermore, in lower-level languages like C/C++, it is relatively easy to protect
secrets in memory. Thus, it may be worthwhile to implement this practice even if
the risk of an attacker gaining access to the memory is low. On the other hand, for
programming languages that rely on garbage collection, securing secrets in memory
generally is much more difficult.

- **Structures and Classes:** In .NET and Java, do not use immutable structures
    such as Strings to store secrets, since it is impossible to force them to
    be garbage collected. Instead, use primitive types such as byte arrays or
    char arrays, where the memory can be directly overwritten.

- **Zeroing Memory:** After a secret has been used, the memory it occupied
  should be zeroed out to prevent it from lingering in memory where it could
  potentially be accessed.

- **Memory Encryption:** In some cases, it may be possible to use hardware or
  operating system features to encrypt the entire memory space of the process
  handling the secret. This can provide an additional layer of security.

Remember, the goal is to minimize the time window where the secret is in
plaintext in memory as much as possible.

For more detailed information, see
[Testing Memory for Sensitive Data](https://mas.owasp.org/MASTG/tests/android/MASVS-STORAGE/MASTG-TEST-0011)
from the OWASP MAS project.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### 2.5 メモリ内のシークレットの取り扱い

シークレットがメモリ内に存在する時間枠を最小化し、そのメモリ空間へのアクセスを制限することで、追加のセキュリティレベルを達成できます。

アプリケーション固有の状況によっては、メモリセキュリティを確保する形でこれを実装することは困難な場合があります。この実装の複雑さがあり得るため、まず脅威モデルを作成し、アプリケーションのデプロイ環境に関する暗黙の前提と、攻撃者の能力を明確にすることが推奨されます。

多くの場合、脅威モデルを評価すると、想定する脅威アクターがそのような攻撃を実行する能力を持たない、またはメモリ内のシークレット露出に起因する侵害の想定影響より防御コストが大きく上回るため、メモリ内のシークレット保護は過剰と見なされます。また、適切な脅威モデルを作成する際には、攻撃者がシークレットを扱うプロセスのメモリにすでにアクセスできているなら、その時点でセキュリティ侵害がすでに発生している可能性があることを念頭に置くべきです。さらに、[Rowhammer](https://arxiv.org/pdf/2211.07613.pdf) や [Meltdown and Spectre](https://meltdownattack.com/) のような攻撃の登場により、これらの種類の攻撃からプロセスメモリを保護するにはオペレーティングシステムだけでは不十分であることを理解することが重要です。これは、アプリケーションがクラウドにデプロイされている場合に特に重要になります。これらや類似の攻撃からメモリを保護する唯一の確実な方法は、プロセスメモリを他のすべての信頼できないプロセスから完全に物理的に分離することです。

実装は困難ですが、高度に機微な環境では、メモリ内のシークレットを保護することが有用な追加セキュリティ層になり得ます。たとえば、高度な攻撃者がシステムをクラッシュさせ、メモリダンプへアクセスできるシナリオでは、そこからシークレットを抽出できる可能性があります。したがって、信頼できない環境や極めて厳格なセキュリティが最重要となる状況では、メモリ内のシークレットを慎重に保護することが推奨されます。

さらに、C/C++ のような低レベル言語では、メモリ内のシークレットを保護することは比較的容易です。そのため、攻撃者がメモリへアクセスするリスクが低い場合でも、この実践を実装する価値があるかもしれません。一方、ガベージコレクションに依存するプログラミング言語では、メモリ内のシークレットを保護することは一般にかなり困難です。

- **構造体とクラス:** .NET や Java では、Strings のようなイミュータブルな構造を使用してシークレットを保存しないでください。それらを強制的にガベージコレクトすることは不可能だからです。代わりに、メモリを直接上書きできる byte 配列や char 配列などのプリミティブ型を使用します。
- **メモリのゼロ化:** シークレットを使用した後、そのシークレットが占有していたメモリはゼロ化すべきです。これにより、後でアクセスされる可能性がある状態でメモリ内に残存することを防ぎます。
- **メモリ暗号化:** 場合によっては、シークレットを扱うプロセスのメモリ空間全体を暗号化するために、ハードウェアまたはオペレーティングシステムの機能を使用できる可能性があります。これは追加のセキュリティ層を提供できます。

目標は、シークレットが平文でメモリ内に存在する時間枠を可能な限り最小化することである、という点を忘れないでください。

より詳細な情報については、OWASP MAS プロジェクトの [Testing Memory for Sensitive Data](https://mas.owasp.org/MASTG/tests/android/MASVS-STORAGE/MASTG-TEST-0011) を参照してください。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (Original)</span>

### 2.6 Auditing

Auditing is an essential part of secrets management due to the nature of the application. You must implement auditing securely to be resilient against attempts to tamper with or delete the audit logs. At a minimum, you should audit the following:

- Who requested a secret and for what system and role.
- Whether the secret request was approved or rejected.
- When the secret was used and by whom/what.
- When the secret has expired.
- Whether there were any attempts to reuse expired secrets.
- If there have been any authentication or authorization errors.
- When the secret was updated and by whom/what.
- Any administrative actions and possible user activity on the underlying supporting infrastructure stack.

It is essential that all auditing has correct timestamps. Therefore, the secret management solution should have proper time sync protocols set up at its supporting infrastructure. You should monitor the stack on which the solution runs for possible clock-skew and manual time adjustments.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### 2.6 監査

監査は、アプリケーションの性質上、シークレット管理に不可欠な部分です。監査ログの改ざんや削除の試みに耐えられるよう、監査を安全に実装しなければなりません。少なくとも、以下を監査すべきです。

- 誰が、どのシステムとロールのためにシークレットを要求したか。
- シークレット要求が承認されたか拒否されたか。
- シークレットがいつ、誰または何によって使用されたか。
- シークレットがいつ期限切れになったか。
- 期限切れシークレットを再利用しようとした試みがあったか。
- 認証または認可エラーがあったか。
- シークレットがいつ、誰または何によって更新されたか。
- 基盤となる支援インフラスタック上の管理操作および可能なユーザー活動。

すべての監査に正しいタイムスタンプがあることは不可欠です。したがって、シークレット管理ソリューションの支援インフラには適切な時刻同期プロトコルを設定すべきです。ソリューションが稼働するスタックについて、クロックスキューや手動の時刻調整がないか監視すべきです。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (Original)</span>

### 2.7 Secret Lifecycle

Secrets follow a lifecycle. The stages of the lifecycle are as follows:

- Creation
- Rotation
- Revocation
- Expiration

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### 2.7 シークレットライフサイクル

シークレットにはライフサイクルがあります。ライフサイクルの段階は次のとおりです。

- 作成
- ローテーション
- 失効
- 有効期限

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (Original)</span>

#### 2.7.1 Creation

New secrets must be securely generated and cryptographically robust enough for their purpose. Secrets must have the minimum privileges assigned to them to enable their required use/role.

You should transmit credentials securely, such that ideally, you don't send the password along with the username when requesting user accounts. Instead, you should send the password via a secure channel (e.g., mutually authenticated connection) or a side-channel such as push notification, SMS, email. Refer to the [Multi-Factor Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Multifactor_Authentication_Cheat_Sheet) to learn about the pros and cons of each channel.

Applications may not benefit from having multiple communication channels, so you must provision credentials securely.

See [the Open CRE project on secrets lookup](https://www.opencre.org/cre/223-780) for more technical recommendations on secret creation.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

#### 2.7.1 作成

新しいシークレットは安全に生成され、その目的に対して暗号学的に十分堅牢でなければなりません。シークレットには、必要な用途またはロールを可能にするための最小権限を割り当てなければなりません。

認証情報は安全に送信すべきであり、理想的にはユーザーアカウントを要求する際にパスワードをユーザー名と一緒に送らないようにします。代わりに、相互認証された接続などの安全なチャネル、またはプッシュ通知、SMS、メールなどのサイドチャネルでパスワードを送信すべきです。各チャネルの長所と短所については、[Multi-Factor Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Multifactor_Authentication_Cheat_Sheet) を参照してください。

アプリケーションは複数の通信チャネルを持つことで利点を得られない場合があるため、認証情報を安全にプロビジョニングしなければなりません。

シークレット作成に関するより技術的な推奨事項については、[the Open CRE project on secrets lookup](https://www.opencre.org/cre/223-780) を参照してください。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (Original)</span>

#### 2.7.2 Rotation

You should regularly rotate secrets so that any stolen credentials will only work for a short time. Regular rotation will also reduce the tendency for users to fall back to bad habits such as reusing credentials.

Depending on a secret's function and what it protects, the lifetime could be from minutes (think end-to-end encrypted chats with perfect forward secrecy) to years (consider hardware secrets).

User credentials are excluded from regular rotation. These should only be rotated if there is suspicion or evidence that they have been compromised, according to [NIST recommendations](https://pages.nist.gov/800-63-FAQ/#q-b05).

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

#### 2.7.2 ローテーション

盗まれた認証情報が短時間しか機能しないように、シークレットは定期的にローテーションすべきです。定期ローテーションは、ユーザーが認証情報の再利用などの悪い習慣に戻る傾向も低減します。

シークレットの機能と保護対象によって、寿命は数分、たとえば perfect forward secrecy を備えたエンドツーエンド暗号化チャットから、数年、たとえばハードウェアシークレットまでさまざまです。

ユーザー認証情報は定期ローテーションの対象外です。これらは [NIST recommendations](https://pages.nist.gov/800-63-FAQ/#q-b05) に従い、侵害の疑いまたは証拠がある場合にのみローテーションすべきです。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (Original)</span>

#### 2.7.3 Revocation

When secrets are no longer required or potentially compromised, you must securely revoke them to restrict access. With (TLS) certificates, this also involves certificate revocation.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

#### 2.7.3 失効

シークレットが不要になった場合、または侵害された可能性がある場合、アクセスを制限するために安全に失効させなければなりません。(TLS) 証明書の場合、これには証明書失効も含まれます。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (Original)</span>

#### 2.7.4 Expiration

You should create secrets to expire after a defined time where possible. This expiration can either be active expiration by the secret consuming system, or an expiration date set at the secrets management system forcing supporting processes to be triggered, resulting in a secret rotation.
You should apply policies through the secrets management solution to ensure credentials are only made available for a limited time appropriate for the type of credentials. Applications should verify that the secret is still active before trusting it.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

#### 2.7.4 有効期限

可能な場合、定義された時間後に期限切れになるシークレットを作成すべきです。この有効期限は、シークレットを消費するシステムによる能動的な期限切れでも、シークレット管理システムに設定された有効期限によって支援プロセスを強制的にトリガーし、シークレットローテーションにつなげる方式でもかまいません。

認証情報がその種類に適した限られた時間だけ利用可能になるよう、シークレット管理ソリューションを通じてポリシーを適用すべきです。アプリケーションは、シークレットを信頼する前に、そのシークレットがまだ有効であることを検証すべきです。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (Original)</span>

### 2.8 Transport Layer Security (TLS) Everywhere

Never transmit secrets via plaintext. In this day and age, there is no excuse given the ubiquitous adoption of TLS.

Furthermore, you can effectively use secrets management solutions to provision TLS certificates.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### 2.8 あらゆる場所で Transport Layer Security (TLS)

シークレットを平文で送信してはなりません。TLS が広く採用されている現在、言い訳はありません。

さらに、シークレット管理ソリューションを使用して TLS 証明書を効果的にプロビジョニングできます。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (Original)</span>

### 2.9 Downtime, Break-glass, Backup and Restore

Consider the possibility that a secrets management service becomes unavailable for various reasons, such as scheduled downtime for maintenance. It could be impossible to retrieve the credentials required to restore the service if you did not previously acquire them. Thus, choose maintenance windows carefully based on earlier metrics and audit logs.

Next, the backup and restore procedures of the system should be regularly tested and audited for their security. A few requirements regarding backup & restore. Ensure that:

- An automated backup procedure is in place and executed periodically; base the frequency of the backups and snapshots on the number of secrets and their lifecycle.
- Frequently test restore procedures to guarantee that the backups are intact.
- Encrypt backups and put them on secure storage with reduced access rights. Monitor the backup location for (unauthorized) access and administrative actions.

Lastly, you should implement emergency ("break-glass") processes to restore the service if the system becomes unavailable for reasons other than regular maintenance. Therefore, emergency break-glass credentials should be regularly backed up securely in a secondary secrets management system and tested routinely to verify they work.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### 2.9 ダウンタイム、ブレークグラス、バックアップと復元

保守のための予定されたダウンタイムなど、さまざまな理由でシークレット管理サービスが利用できなくなる可能性を検討してください。事前に認証情報を取得していなかった場合、サービス復元に必要な認証情報を取得できない可能性があります。したがって、過去のメトリクスと監査ログに基づいて、保守時間帯を慎重に選択してください。

次に、システムのバックアップと復元手順は、そのセキュリティについて定期的にテストおよび監査されるべきです。バックアップと復元に関するいくつかの要件として、次を確実にしてください。

- 自動バックアップ手順が用意され、定期的に実行されていること。バックアップとスナップショットの頻度は、シークレットの数とライフサイクルに基づいて決めます。
- バックアップが完全であることを保証するため、復元手順を頻繁にテストすること。
- バックアップを暗号化し、アクセス権を縮小した安全なストレージに置くこと。バックアップ場所へのアクセスおよび管理操作が認可されているかを監視すること。

最後に、通常保守以外の理由でシステムが利用不能になった場合にサービスを復元するため、緊急時の「ブレークグラス」プロセスを実装すべきです。したがって、緊急ブレークグラス認証情報は、二次的なシークレット管理システムに安全に定期バックアップし、機能することを検証するために定期的にテストすべきです。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (Original)</span>

### 2.10 Policies

Consistently enforce policies defining the minimum complexity requirements of passwords and approved encryption algorithms at an organization-wide level. Using a centralized secrets management solution can help companies implement these policies.

Next, having an organization-wide secrets management policy can help enforce applying the best practices defined in this cheat sheet.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### 2.10 ポリシー

パスワードの最小複雑性要件と承認済み暗号アルゴリズムを定義するポリシーを、組織全体のレベルで一貫して適用します。集中型シークレット管理ソリューションを使用すると、企業はこれらのポリシーを実装しやすくなります。

次に、組織全体のシークレット管理ポリシーを持つことで、このチートシートで定義されているベストプラクティスの適用を強制しやすくなります。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (Original)</span>

### 2.11 Metadata: prepare to move the secret

A secret management solution should provide the capability to store at least the following metadata about a secret:

- When it was created/consumed/archived/rotated/deleted
- Who created/consumed/archived/rotated/deleted it (e.g., both the actual producer and the engineer using the production method)
- What created/consumed/archived/rotated/deleted it
- Who to contact when having trouble with the secret or having questions about it
- For what the secret is used (e.g., designated intended consumers and purpose of the secret)
- What type of secret it is (e.g., AES Key, HMAC key, RSA private key)
- When you need to rotate it, if done manually

Note: if you don't store metadata about the secret nor prepare to move, you will increase the probability of vendor lock-in.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### 2.11 メタデータ: シークレット移行への備え

シークレット管理ソリューションは、少なくとも以下のメタデータをシークレットについて保存できる機能を提供すべきです。

- いつ作成、消費、アーカイブ、ローテーション、削除されたか
- 誰が作成、消費、アーカイブ、ローテーション、削除したか。例: 実際の生成者と生成方法を使用したエンジニアの両方
- 何が作成、消費、アーカイブ、ローテーション、削除したか
- シークレットに問題がある場合や質問がある場合に誰へ連絡するか
- 何のためにシークレットが使用されるか。例: 指定された想定利用者とシークレットの目的
- シークレットの種類。例: AES Key、HMAC key、RSA private key
- 手動で行う場合、いつローテーションする必要があるか

注: シークレットに関するメタデータを保存せず、移行への準備もしない場合、ベンダーロックインの可能性が高まります。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (Original)</span>

### 2.12 Passwordless Authentication and Token Security

While not a direct replacement for all types of secrets (e.g., API keys, database credentials), passwordless authentication mechanisms like **OpenID Connect (OIDC)** can significantly reduce the attack surface by moving away from user-managed passwords. Instead of passwords, applications rely on trusted identity providers (IdPs) to authenticate users and receive secure tokens.

**How it helps:**

- **Reduces Password-Related Risks:** Eliminates threats like phishing, credential stuffing, and weak password practices.
- **Centralized Identity Management:** Authentication is handled by a specialized IdP, which can enforce strong authentication policies (e.g., MFA).
- **Short-Lived Sessions:** OIDC tokens are typically short-lived, limiting the window of opportunity for an attacker if a token is compromised.

**Token Security is Crucial:**

Adopting passwordless authentication shifts the security focus from protecting static passwords to protecting dynamic tokens (e.g., ID tokens, access tokens, refresh tokens). These tokens are bearer tokens, meaning anyone who possesses one can use them. Therefore, it is critical to:

- **Secure Token Transmission:** Always transmit tokens over TLS.
- **Protect Tokens in Storage:** Do not store tokens in insecure locations like local storage in a browser. Use secure, HTTP-only cookies or appropriate secure storage mechanisms for mobile applications.
- **Validate Tokens Correctly:** Always validate the signature, issuer, and audience of a token to ensure it is legitimate.
- **Manage Token Lifetime:** Use short-lived access tokens and implement a secure refresh token rotation strategy.

For more detailed guidance on securing OAuth 2.0 and OpenID Connect implementations, refer to the [OAuth2 Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/OAuth2_Cheat_Sheet.html).

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### 2.12 パスワードレス認証とトークンセキュリティ

**OpenID Connect (OIDC)** のようなパスワードレス認証メカニズムは、API キーやデータベース認証情報など、すべての種類のシークレットを直接置き換えるものではありませんが、ユーザー管理パスワードから離れることで攻撃対象領域を大幅に低減できます。アプリケーションはパスワードの代わりに、信頼されたアイデンティティプロバイダー (IdP) に依存してユーザーを認証し、安全なトークンを受け取ります。

**どのように役立つか:**

- **パスワード関連リスクの低減:** フィッシング、クレデンシャルスタッフィング、弱いパスワード運用のような脅威を排除します。
- **集中型アイデンティティ管理:** 認証は専門の IdP によって処理され、MFA などの強力な認証ポリシーを適用できます。
- **短命なセッション:** OIDC トークンは通常短命であり、トークンが侵害された場合の攻撃者の機会を制限します。

**トークンセキュリティは重要:**

パスワードレス認証を採用すると、セキュリティの焦点は静的パスワードの保護から、ID トークン、アクセストークン、リフレッシュトークンなどの動的トークンの保護へ移ります。これらのトークンは bearer token であり、所有している人は誰でも使用できます。したがって、次の事項が重要です。

- **トークン送信の保護:** トークンは常に TLS 経由で送信します。
- **保存時のトークン保護:** ブラウザの local storage のような安全でない場所にトークンを保存しないでください。安全な HTTP-only Cookie、またはモバイルアプリケーションに適した安全な保存メカニズムを使用してください。
- **トークンの正しい検証:** トークンが正当であることを確認するため、署名、発行者、オーディエンスを常に検証します。
- **トークン寿命の管理:** 短命なアクセストークンを使用し、安全なリフレッシュトークンローテーション戦略を実装します。

OAuth 2.0 と OpenID Connect 実装の保護に関するより詳細なガイダンスについては、[OAuth2 Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/OAuth2_Cheat_Sheet.html) を参照してください。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (Original)</span>

## 3 Continuous Integration (CI) and Continuous Deployment (CD)

Building, testing and deploying changes generally requires access to many systems. Continuous Integration (CI) and Continuous Deployment (CD) tools typically store secrets to provide configuration to the application or during deployment. Alternatively, they interact heavily with the secrets management system. Various best practices can help smooth out secret management in CI/CD; we will deal with some of them in this section.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## 3 Continuous Integration (CI) と Continuous Deployment (CD)

変更のビルド、テスト、デプロイには、一般に多くのシステムへのアクセスが必要です。Continuous Integration (CI) と Continuous Deployment (CD) ツールは通常、アプリケーションへの設定提供やデプロイ中にシークレットを保存します。あるいは、シークレット管理システムと密接にやり取りします。CI/CD におけるシークレット管理を円滑にするためのさまざまなベストプラクティスがあり、このセクションではその一部を扱います。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (Original)</span>

### 3.1 Hardening your CI/CD pipeline

CI/CD tooling consumes (high-privilege) credentials regularly. Ensure that the pipeline cannot be easily hacked or misused by employees. Here are a few guidelines which can help you:

- Treat your CI/CD tooling as a production environment: harden it, patch it and harden the underlying infrastructure and services.
- Have Security Event Monitoring in place.
- Implement least-privilege access: developers do not need to be able to administer projects. Instead, they only need to be able to execute required functions, such as setting up pipelines, running them, and working with code. Administrative tasks can quickly be done using configuration-as-code in a separate repository used by the CI/CD system to update its configuration. There is no need for privileged roles that might have access to secrets.
- Make sure that pipeline output does not leak secrets, and you can't listen in on production pipelines with debugging tools.
- Make sure you cannot exec into any runners and workers for a CI/CD system.
- Have proper authentication, authorization and accounting in place.
- Ensure only an approved process can create pipelines, including MR/PR steps to ensure that a created pipeline is security-reviewed.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### 3.1 CI/CD パイプラインの堅牢化

CI/CD ツールは高権限の認証情報を定期的に消費します。パイプラインが容易にハッキングされたり、従業員に悪用されたりしないようにしてください。役立つガイドラインをいくつか示します。

- CI/CD ツールを本番環境として扱います。堅牢化し、パッチを適用し、基盤となるインフラとサービスを堅牢化します。
- Security Event Monitoring を配置します。
- 最小権限アクセスを実装します。開発者はプロジェクトを管理できる必要はありません。必要なのは、パイプラインの設定、実行、コード作業など、必要な機能を実行できることだけです。管理タスクは、CI/CD システムが設定を更新するために使用する別リポジトリで configuration-as-code を使えば迅速に実施できます。シークレットへアクセスできる可能性がある特権ロールは不要です。
- パイプライン出力がシークレットを漏えいしないこと、およびデバッグツールで本番パイプラインを盗み見できないことを確認します。
- CI/CD システムの runner や worker に exec できないようにします。
- 適切な認証、認可、アカウンティングを配置します。
- 作成されたパイプラインがセキュリティレビューされることを保証する MR/PR ステップを含め、承認済みプロセスだけがパイプラインを作成できるようにします。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (Original)</span>

### 3.2 Where should a secret be?

There are various places where you can store a secret to execute CI/CD actions:

- As part of your CI/CD tooling: you can store a secret in [GitLab](https://docs.gitlab.com/charts/installation/secrets.html)/[GitHub](https://docs.github.com/en/actions/security-guides/encrypted-secrets)/[Jenkins](https://www.jenkins.io/doc/developer/security/secrets/). This is not the same as committing it to code.
- As part of your secrets-management system: you can store a secret in a secrets management system, such as facilities provided by a cloud provider ([AWS Secrets Manager](https://aws.amazon.com/secrets-manager/), [Azure Key Vault](https://azure.microsoft.com/nl-nl/services/key-vault/), [Google Secret Manager](https://cloud.google.com/secret-manager)), or other third-party facilities ([Hashicorp Vault](https://www.vaultproject.io/), [Conjur](https://www.conjur.org/), [Keeper](https://www.keepersecurity.com/)). In this case, the CI/CD pipeline tooling requires credentials to connect to these secret management systems to have secrets in place. See [Cloud Providers](#4-cloud-providers) for more details on using a cloud provider's secret management system.

Another alternative here is using the CI/CD pipeline to leverage the Encryption as a Service from the secrets management systems to do the encryption of a secret. The CI/CD tooling can then commit the encrypted secret to git, which can be fetched by the consuming service on deployment and decrypted again. See section 3.6 for more details.

Note: not all secrets must be in the CI/CD pipeline to get to the actual deployment. Instead, make sure that the deployed services take care of part of their secrets management at their own lifecycle (e.g., deployment, runtime and destruction).

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### 3.2 シークレットはどこに置くべきか

CI/CD アクションを実行するためにシークレットを保存できる場所はいくつかあります。

- CI/CD ツールの一部として保存する: [GitLab](https://docs.gitlab.com/charts/installation/secrets.html)、[GitHub](https://docs.github.com/en/actions/security-guides/encrypted-secrets)、[Jenkins](https://www.jenkins.io/doc/developer/security/secrets/) にシークレットを保存できます。これはコードにコミットすることとは異なります。
- シークレット管理システムの一部として保存する: クラウドプロバイダーが提供する機能、たとえば [AWS Secrets Manager](https://aws.amazon.com/secrets-manager/)、[Azure Key Vault](https://azure.microsoft.com/nl-nl/services/key-vault/)、[Google Secret Manager](https://cloud.google.com/secret-manager)、またはサードパーティ機能、たとえば [Hashicorp Vault](https://www.vaultproject.io/)、[Conjur](https://www.conjur.org/)、[Keeper](https://www.keepersecurity.com/) などのシークレット管理システムにシークレットを保存できます。この場合、CI/CD パイプラインツールは、これらのシークレット管理システムに接続してシークレットを用意するための認証情報を必要とします。クラウドプロバイダーのシークレット管理システムの使用に関する詳細は、[Cloud Providers](#4-cloud-providers) を参照してください。

ここでの別の選択肢は、CI/CD パイプラインがシークレット管理システムの Encryption as a Service を活用してシークレットを暗号化することです。CI/CD ツールは暗号化されたシークレットを git にコミットでき、消費するサービスはデプロイ時にそれを取得して再び復号できます。詳細はセクション 3.6 を参照してください。

注: 実際のデプロイに到達するために、すべてのシークレットが CI/CD パイプライン内に存在しなければならないわけではありません。代わりに、デプロイされたサービスが自身のライフサイクル、たとえばデプロイ、ランタイム、破棄の中で、シークレット管理の一部を担うようにしてください。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (Original)</span>

#### 3.2.1 As part of your CI/CD tooling

When secrets are part of your CI/CD tooling, it means that these secrets are exposed to your CI/CD jobs. CI/CD tooling can comprise, e.g., GitHub secrets, GitLab repository secrets, ENV Vars/Var Groups in Microsoft Azure DevOps, Kubernetes Secrets, etc.
These secrets are often configurable/viewable by people who have the authorization to do so (e.g., a maintainer in GitHub, a project owner in GitLab, an admin in Jenkins, etc.), which together line up for the following best practices:

- No "big secret": ensure that secrets in your CI/CD tooling that are not long-term, don't have a wide blast radius, and don't have a high value. Also, limit shared secrets (e.g., never have one password for all administrative users).
- As is / To be: have a clear overview of which users can view or alter the secrets. Often, maintainers of a GitLab/GitHub project can see or otherwise extract its secrets.
- Reduce the number of people that can perform administrative tasks on the project to limit exposure.
- Log & Alert: Assemble all the logs from the CI/CD tooling and have rules in place to detect secret extraction or misuse, whether through accessing them through a web interface or dumping them while double Base64 encoding or encrypting them with OpenSSL.
- Rotation: Regularly rotate secrets.
- Forking should not leak: Validate that a fork of the repository or copy of the job definition does not copy the secret.
- Document: Make sure you document which secrets you store as part of your CI/CD tooling and why so that you can migrate these easily when required.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

#### 3.2.1 CI/CD ツールの一部として

シークレットが CI/CD ツールの一部である場合、それらのシークレットは CI/CD ジョブに露出します。CI/CD ツールには、たとえば GitHub secrets、GitLab repository secrets、Microsoft Azure DevOps の ENV Vars/Var Groups、Kubernetes Secrets などが含まれます。

これらのシークレットは多くの場合、権限を持つ人、たとえば GitHub の maintainer、GitLab の project owner、Jenkins の admin などによって設定または閲覧可能です。これに対応して、次のベストプラクティスが導かれます。

- 「大きなシークレット」を持たない: CI/CD ツール内のシークレットが長期的でなく、広い影響範囲を持たず、高い価値を持たないようにします。また、共有シークレットを制限します。たとえば、すべての管理ユーザーで 1 つのパスワードを使わないでください。
- As is / To be: どのユーザーがシークレットを閲覧または変更できるかを明確に把握します。多くの場合、GitLab/GitHub プロジェクトの maintainer は、そのシークレットを見たり、別の方法で抽出したりできます。
- 露出を制限するため、プロジェクト上で管理タスクを実行できる人の数を減らします。
- Log & Alert: CI/CD ツールからすべてのログを収集し、Web インターフェース経由でアクセスする場合や、二重 Base64 エンコードまたは OpenSSL で暗号化してダンプする場合など、シークレット抽出や悪用を検出するルールを配置します。
- Rotation: シークレットを定期的にローテーションします。
- Forking should not leak: リポジトリの fork やジョブ定義のコピーがシークレットをコピーしないことを検証します。
- Document: 必要な場合に容易に移行できるよう、CI/CD ツールの一部として保存するシークレットとその理由を文書化します。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (Original)</span>

#### 3.2.2 Storing it in a secrets management system

Naturally, you can store secrets in a designated secrets management solution. For example, you can use a solution offered by your (cloud) infrastructure provider, such as [AWS Secrets Manager](https://aws.amazon.com/secrets-manager/), [Google Secrets Manager](https://cloud.google.com/secret-manager), or [Azure Key Vault](https://azure.microsoft.com/nl-nl/services/key-vault/). You can find more information about these in [section 4](#4-cloud-providers) of this cheat sheet. Another option is a dedicated secrets management system, such as [Hashicorp Vault](https://www.vaultproject.io/), [Keeper](https://www.keepersecurity.com/), [Conjur](https://www.conjur.org/).
Here are a few do's and don'ts for the CI/CD interaction with these systems. Make sure that the following is taken care of:

- Rotation/Temporality: credentials used by the CI/CD tooling to authenticate against the secret management system are rotated frequently and expire after a job completes.
- Scope of authorization: scope credentials used by the CI/CD tooling (e.g., roles, users, etc.), only authorize those secrets and services of the secret management system required for the CI/CD tooling to execute its job.
- Attribution of the caller: credentials used by the CI/CD tooling still hold attribution of the one calling the secrets management solution. Ensure you can attribute any calls made by the CI/CD tooling to a person or service that requested the actions of the CI/CD tooling. If this is not possible through the default configuration of the secrets manager, make sure that you have a correlation setup in terms of request parameters.
- All of the above: Still follow those do's and don'ts listed in section 3.2.1: log & alert, take care of forking, etc.
- Backup: back up secrets to product-critical operations in separate storage (e.g., cold storage), especially encryption keys.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

#### 3.2.2 シークレット管理システムへの保存

当然ながら、指定されたシークレット管理ソリューションにシークレットを保存できます。たとえば、[AWS Secrets Manager](https://aws.amazon.com/secrets-manager/)、[Google Secrets Manager](https://cloud.google.com/secret-manager)、[Azure Key Vault](https://azure.microsoft.com/nl-nl/services/key-vault/) など、クラウドインフラプロバイダーが提供するソリューションを使用できます。これらの詳細は、このチートシートの [section 4](#4-cloud-providers) にあります。もう 1 つの選択肢は、[Hashicorp Vault](https://www.vaultproject.io/)、[Keeper](https://www.keepersecurity.com/)、[Conjur](https://www.conjur.org/) などの専用シークレット管理システムです。

これらのシステムと CI/CD がやり取りする際の do と don't をいくつか示します。次の事項が確実に処理されていることを確認してください。

- Rotation/Temporality: CI/CD ツールがシークレット管理システムに対して認証するために使用する認証情報は頻繁にローテーションされ、ジョブ完了後に期限切れになること。
- Scope of authorization: CI/CD ツールが使用する認証情報、たとえばロールやユーザーなどのスコープを限定し、CI/CD ツールがジョブを実行するために必要なシークレットとシークレット管理システムのサービスだけを認可すること。
- Attribution of the caller: CI/CD ツールが使用する認証情報が、シークレット管理ソリューションを呼び出した主体の帰属を保持していること。CI/CD ツールによるすべての呼び出しを、その CI/CD ツールのアクションを要求した人物またはサービスに帰属できるようにしてください。シークレットマネージャーのデフォルト設定でこれが不可能な場合は、リクエストパラメータに関する相関付けを設定してください。
- All of the above: セクション 3.2.1 に記載した do と don't、log & alert、forking への対応などを引き続き守ること。
- Backup: 製品の重要運用に関わるシークレット、特に暗号鍵を、別のストレージ、たとえば cold storage にバックアップすること。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (Original)</span>

#### 3.2.3 Not touched by CI/CD at all

Secrets do not necessarily need to be brought to a consumer of the secret by a CI/CD pipeline. It is even better when the consumer of the secret retrieves the secret. In that case, the CI/CD pipeline still needs to instruct the orchestrating system (e.g., [Kubernetes](https://kubernetes.io/)) that it needs to schedule a specific service with a given service account with which the consumer can then retrieve the required secret. The CI/CD tooling then still has credentials for the orchestrating platform but no longer has access to the secrets themselves. The do's and don'ts regarding these credentials types are similar to those described in section 3.2.2.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

#### 3.2.3 CI/CD がまったく触れない

シークレットは、必ずしも CI/CD パイプラインによってシークレットの利用者へ運ばれる必要はありません。シークレットの利用者自身がシークレットを取得する方がさらに望ましいです。その場合でも、CI/CD パイプラインは、たとえば [Kubernetes](https://kubernetes.io/) のようなオーケストレーションシステムに対して、利用者が必要なシークレットを取得できる特定のサービスアカウントで特定のサービスをスケジュールするよう指示する必要があります。CI/CD ツールは引き続きオーケストレーションプラットフォームの認証情報を持ちますが、シークレットそのものへはアクセスしなくなります。これらの認証情報タイプに関する do と don't は、セクション 3.2.2 に記載したものと同様です。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (Original)</span>

### 3.3 Authentication and Authorization of CI/CD tooling

CI/CD tooling should have designated service accounts, which can only operate in the scope of the required secrets or orchestration of the consumers of a secret. Additionally, a CI/CD pipeline run should be easily attributable to the one who has defined the job or triggered it to detect who has tried to exfiltrate secrets or manipulate them. When you use certificate-based auth, the caller of the pipeline identity should be part of the certificate. If you use a token to authenticate towards the mentioned systems, make sure you set the principal requesting these actions (e.g., the user or the job creator).

Verify on a periodic basis whether this is (still) the case for your system so that you can do logging, attribution, and security alerting on suspicious actions effectively.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### 3.3 CI/CD ツールの認証と認可

CI/CD ツールには、必要なシークレットまたはシークレット利用者のオーケストレーションの範囲でのみ動作できる専用サービスアカウントを持たせるべきです。さらに、CI/CD パイプライン実行は、ジョブを定義またはトリガーした主体へ容易に帰属できるべきです。これにより、誰がシークレットを外部へ持ち出そうとしたか、または操作しようとしたかを検出できます。証明書ベース認証を使用する場合、パイプラインアイデンティティの呼び出し元を証明書の一部に含めるべきです。前述のシステムに対してトークンで認証する場合は、これらのアクションを要求するプリンシパル、たとえばユーザーまたはジョブ作成者を設定してください。

ログ記録、帰属、疑わしいアクションに対するセキュリティアラートを効果的に行えるよう、これが自分のシステムで今も成り立っているかを定期的に検証してください。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (Original)</span>

### 3.4 Logging and Accounting

Attackers can use CI/CD tooling to extract secrets. They could, for example, use administrative interfaces or job creation that exfiltrates the secret using encryption or double Base64 encoding. Therefore, you should log every action in a CI/CD tool. You should define security alerting rules at every non-standard manipulation of the pipeline tool and its administrative interface to monitor secret usage.
Logs should be queryable for at least 90 days and stored for a more extended period in cold storage. It might take security teams time to understand how attackers can exfiltrate or manipulate a secret using CI/CD tooling.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### 3.4 ロギングとアカウンティング

攻撃者は CI/CD ツールを使用してシークレットを抽出できます。たとえば、管理インターフェースやジョブ作成を使い、暗号化や二重 Base64 エンコードでシークレットを外部送信できます。したがって、CI/CD ツール内のすべてのアクションをログに記録すべきです。シークレットの使用を監視するため、パイプラインツールとその管理インターフェースに対する非標準的な操作ごとに、セキュリティアラートルールを定義すべきです。

ログは少なくとも 90 日間クエリ可能であり、より長期間 cold storage に保存されるべきです。攻撃者が CI/CD ツールを使用してシークレットを外部へ持ち出したり操作したりする方法をセキュリティチームが理解するには時間がかかる場合があります。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (Original)</span>

### 3.5 Rotation vs Dynamic Creation

You can leverage CI/CD tooling to rotate secrets or instruct other components to do the rotation of the secret. For instance, the CI/CD tool can request a secrets management system or another application to rotate the secret. Alternatively, the CI/CD tool or another component could set up a dynamic secret: a secret required for a consumer to use for as long as it lives. The secret is invalidated when the consumer no longer lives. This procedure reduces possible leakage of a secret and allows for easy detection of misuse. If an attacker uses a secret from anywhere other than the consumer's IP, you can easily detect it.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### 3.5 ローテーションと動的作成

CI/CD ツールを活用してシークレットをローテーションしたり、他のコンポーネントにシークレットのローテーションを指示したりできます。たとえば、CI/CD ツールがシークレット管理システムまたは別のアプリケーションにシークレットのローテーションを要求できます。あるいは、CI/CD ツールまたは別のコンポーネントが動的シークレットを設定できます。これは、利用者が存在している間だけ使用するために必要なシークレットです。利用者が存在しなくなると、そのシークレットは無効化されます。この手順は、シークレットの漏えい可能性を低減し、悪用の検出を容易にします。攻撃者が利用者の IP 以外の場所からシークレットを使用した場合、容易に検出できます。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (Original)</span>

### 3.6 Pipeline Created Secrets

You can use pipeline tooling to generate secrets and either offer them directly to the service deployed by the tooling or provide the secret to a secrets management solution. Alternatively, the secret can be stored encrypted in git so that the secret and its metadata is as close to the developer's daily place of work as possible. A git-stored secret does require that developers cannot decrypt the secrets themselves and that every consumer of a secret has its encrypted variant of the secret. For instance: the secret should then be different per DTAP environment and be encrypted with another key. For each environment, only the designated consumer in that environment should be able to decrypt the specific secret. A secret does not leak cross-environment and can still be easily stored next to the code.
Consumers of a secret could now decrypt the secret using a sidecar, as described in section 5.2. Instead of retrieving the secrets, the consumer would leverage the sidecar to decrypt the secret.

When a pipeline creates a secret by itself, ensure that the scripts or binaries involved adhere to best practices for secret generation. Best practices include secure randomness, proper length of secret creation, etc. and that the secret is created based on well-defined metadata stored somewhere in git or somewhere else.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### 3.6 パイプラインが作成するシークレット

パイプラインツールを使用してシークレットを生成し、ツールによってデプロイされるサービスへ直接提供するか、シークレット管理ソリューションへ提供できます。あるいは、シークレットとそのメタデータを開発者の日常的な作業場所にできるだけ近づけるため、シークレットを暗号化して git に保存できます。git に保存されたシークレットでは、開発者自身がシークレットを復号できないこと、およびシークレットの各利用者がそのシークレットの暗号化済みバリアントを持つことが必要です。たとえば、シークレットは DTAP 環境ごとに異なり、別の鍵で暗号化されるべきです。各環境では、その環境内の指定された利用者だけが特定のシークレットを復号できるべきです。シークレットは環境をまたいで漏えいせず、コードの近くに容易に保存できます。

シークレットの利用者は、セクション 5.2 で説明するように、サイドカーを使ってシークレットを復号できるようになります。シークレットを取得する代わりに、利用者はサイドカーを活用してシークレットを復号します。

パイプラインが自らシークレットを作成する場合、関係するスクリプトまたはバイナリがシークレット生成のベストプラクティスに従うことを確認してください。ベストプラクティスには、安全な乱数、適切なシークレット長など、および git またはその他の場所に保存された明確に定義されたメタデータに基づいてシークレットが作成されることが含まれます。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (Original)</span>

## 4 Cloud Providers

For cloud providers, there are at least four essential topics to touch upon:

- Designated secret storage/management solutions. Which service(s) do you use?
- Envelope & client-side encryption
- Identity and access management: decreasing the blast radius
- API quotas or service limits

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## 4 クラウドプロバイダー

クラウドプロバイダーについては、少なくとも 4 つの重要なトピックがあります。

- 指定されたシークレット保存または管理ソリューション。どのサービスを使用するか。
- エンベロープ暗号化とクライアントサイド暗号化
- Identity and Access Management: 影響範囲の縮小
- API クォータまたはサービス制限

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (Original)</span>

### 4.1 Services to Use

It is best to use a designated secret management solution in any environment. Most cloud providers have at least one service that offers secret management. Of course, it's also possible to run a different secret management solution (e.g., HashiCorp Vault or Conjur) on compute resources within the cloud. We'll consider cloud provider service offerings in this section.

Sometimes it's possible to automatically rotate your secret, either via a service provided by your cloud provider or a (custom-built) function. Generally, you should prefer the cloud provider's solution since the barrier of entry and risk of misconfiguration are lower. If you use a custom solution, ensure the function's role to do its rotation can only be assumed by said function.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### 4.1 使用するサービス

どの環境でも、指定されたシークレット管理ソリューションを使用するのが最善です。ほとんどのクラウドプロバイダーには、シークレット管理を提供するサービスが少なくとも 1 つあります。もちろん、クラウド内のコンピュートリソース上で別のシークレット管理ソリューション、たとえば HashiCorp Vault や Conjur を実行することも可能です。このセクションでは、クラウドプロバイダーのサービス提供を検討します。

クラウドプロバイダーが提供するサービスまたはカスタム構築された関数によって、シークレットを自動的にローテーションできる場合があります。一般に、導入障壁と設定ミスのリスクが低いため、クラウドプロバイダーのソリューションを優先すべきです。カスタムソリューションを使用する場合、ローテーションを行う関数のロールが、その関数だけによって引き受け可能であることを確認してください。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (Original)</span>

#### 4.1.1 AWS

For AWS, the recommended solution is [AWS Secrets Manager](https://docs.aws.amazon.com/secretsmanager/latest/userguide/intro.html).

Permissions are granted at the secret level. Check out the [Secrets Manager best practices](https://docs.aws.amazon.com/secretsmanager/latest/userguide/best-practices.html).

It is also possible to use the [Systems Manager Parameter Store](https://docs.aws.amazon.com/systems-manager/latest/userguide/systems-manager-parameter-store.html), which is cheaper, but that has a few downsides:

- you'll need to make sure you've specified encryption yourself (secrets manager does that by default)
- it offers fewer auto-rotation capabilities (you will likely need to build a custom function)
- it doesn't support cross-account access
- it doesn't support cross-region replication
- there are fewer [Security Hub Controls](https://docs.aws.amazon.com/securityhub/latest/userguide/securityhub-standards-fsbp-controls.html) available

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

#### 4.1.1 AWS

AWS では、推奨ソリューションは [AWS Secrets Manager](https://docs.aws.amazon.com/secretsmanager/latest/userguide/intro.html) です。

権限はシークレットレベルで付与されます。[Secrets Manager best practices](https://docs.aws.amazon.com/secretsmanager/latest/userguide/best-practices.html) を確認してください。

より安価な [Systems Manager Parameter Store](https://docs.aws.amazon.com/systems-manager/latest/userguide/systems-manager-parameter-store.html) を使用することも可能ですが、いくつかの欠点があります。

- 暗号化を自分で指定したことを確認する必要があります。Secrets Manager はデフォルトで暗号化します。
- 自動ローテーション機能が少なく、カスタム関数を構築する必要がある可能性が高いです。
- クロスアカウントアクセスをサポートしません。
- クロスリージョンレプリケーションをサポートしません。
- 利用可能な [Security Hub Controls](https://docs.aws.amazon.com/securityhub/latest/userguide/securityhub-standards-fsbp-controls.html) が少ないです。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (Original)</span>

##### 4.1.1.1 AWS Nitro Enclaves

With [AWS Nitro Enclaves](https://aws.amazon.com/ec2/nitro/nitro-enclaves/), you can create isolated compute environments to further protect and securely process highly sensitive data such as secrets. Enclaves are hardened, and restrict operator access, providing a trusted execution environment. A key feature is cryptographic attestation, which allows you to verify the enclave's identity and ensure only authorized code is running before provisioning secrets to it. This makes it a strong choice for scenarios requiring high assurance in secret handling.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

##### 4.1.1.1 AWS Nitro Enclaves

[AWS Nitro Enclaves](https://aws.amazon.com/ec2/nitro/nitro-enclaves/) を使用すると、シークレットなどの高度に機微なデータをさらに保護し安全に処理するための分離されたコンピュート環境を作成できます。Enclave は堅牢化され、オペレーターアクセスを制限し、信頼された実行環境を提供します。重要な機能は暗号学的アテステーションであり、シークレットをプロビジョニングする前に enclave のアイデンティティを検証し、認可されたコードだけが実行されていることを確認できます。これにより、シークレット取り扱いに高い保証が必要なシナリオで有力な選択肢になります。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (Original)</span>

##### 4.1.1.2 AWS CloudHSM

For secrets being used in highly confidential applications, it may be needed to have more control over the encryption and storage of these keys. AWS offers [CloudHSM](https://aws.amazon.com/cloudhsm/), which lets you bring your own key (BYOK) for AWS services. Thus, you will have more control over keys' creation, lifecycle, and durability. CloudHSM allows automatic scaling and backup of your data. The cloud service provider, Amazon, will not have any access to the key material stored in **AWS CloudHSM**.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

##### 4.1.1.2 AWS CloudHSM

非常に機密性の高いアプリケーションで使用されるシークレットでは、これらの鍵の暗号化と保存をより細かく制御する必要がある場合があります。AWS は [CloudHSM](https://aws.amazon.com/cloudhsm/) を提供しており、AWS サービスに対して bring your own key (BYOK) を使用できます。したがって、鍵の作成、ライフサイクル、耐久性をより制御できます。CloudHSM はデータの自動スケーリングとバックアップを可能にします。クラウドサービスプロバイダーである Amazon は、**AWS CloudHSM** に保存された鍵材料へアクセスできません。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (Original)</span>

#### 4.1.2 GCP

For GCP, the recommended service is [Secret Manager](https://cloud.google.com/secret-manager/docs).

Permissions are granted at the secret level.

Check out the [Secret Manager best practices](https://cloud.google.com/secret-manager/docs/best-practices).

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

#### 4.1.2 GCP

GCP では、推奨サービスは [Secret Manager](https://cloud.google.com/secret-manager/docs) です。

権限はシークレットレベルで付与されます。

[Secret Manager best practices](https://cloud.google.com/secret-manager/docs/best-practices) を確認してください。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (Original)</span>

##### 4.1.2.1 Google Cloud Confidential Computing

[GCP Confidential Computing](https://cloud.google.com/confidential-computing) is a technology that encrypts data in-use, while it is being processed. This is achieved through services like **Confidential VMs** and **Confidential GKE Nodes**, which leverage AMD Secure Encrypted Virtualization (SEV). This ensures that even Google personnel cannot view the contents of the memory of your virtual machines, providing a high degree of protection for secrets that must be held in memory.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

##### 4.1.2.1 Google Cloud Confidential Computing

[GCP Confidential Computing](https://cloud.google.com/confidential-computing) は、処理中のデータ、つまり使用中データを暗号化する技術です。これは、AMD Secure Encrypted Virtualization (SEV) を活用する **Confidential VMs** や **Confidential GKE Nodes** などのサービスによって実現されます。これにより、Google の担当者でさえ仮想マシンのメモリ内容を閲覧できず、メモリ内に保持する必要があるシークレットに高度な保護を提供します。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (Original)</span>

#### 4.1.3 Azure

For Azure, the recommended service is [Key Vault](https://docs.microsoft.com/en-us/azure/key-vault/).

Contrary to other clouds, permissions are granted at the _**Key Vault**_ level. This means secrets for separate workloads and separate sensitivity levels should be in separated Key Vaults accordingly.

Check out the [Key Vault best practices](https://docs.microsoft.com/en-us/azure/key-vault/general/best-practices).

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

#### 4.1.3 Azure

Azure では、推奨サービスは [Key Vault](https://docs.microsoft.com/en-us/azure/key-vault/) です。

他のクラウドとは異なり、権限は _**Key Vault**_ レベルで付与されます。つまり、ワークロードや機密度が異なるシークレットは、それに応じて分離された Key Vault に配置すべきです。

[Key Vault best practices](https://docs.microsoft.com/en-us/azure/key-vault/general/best-practices) を確認してください。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (Original)</span>

##### 4.1.3.1 Azure Confidential Computing

With [Azure Confidential Computing](https://azure.microsoft.com/en-us/solutions/confidential-compute/#overview), you can create trusted execution environments. This technology isolates sensitive data within a protected container, ensuring that it is encrypted both at rest, in transit, and in use. Services like **Azure Confidential Virtual Machines** and **Confidential Containers on ACI** utilize technologies like Intel SGX and AMD SEV-SNP to create these secure enclaves. This prevents unauthorized access from cloud administrators, malware, or other tenants, making it a robust solution for secret management.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

##### 4.1.3.1 Azure Confidential Computing

[Azure Confidential Computing](https://azure.microsoft.com/en-us/solutions/confidential-compute/#overview) を使用すると、信頼された実行環境を作成できます。この技術は、保護されたコンテナ内で機微データを分離し、保存時、転送中、使用中のすべてで暗号化されるようにします。**Azure Confidential Virtual Machines** や **Confidential Containers on ACI** のようなサービスは、Intel SGX や AMD SEV-SNP などの技術を利用して、これらの安全な enclave を作成します。これにより、クラウド管理者、マルウェア、他のテナントからの不正アクセスを防止し、シークレット管理のための堅牢なソリューションになります。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (Original)</span>

##### 4.1.3.2 Azure Dedicated HSM

For secrets being used in Azure environments and requiring special security considerations, Azure offers [Azure Dedicated HSM](https://azure.microsoft.com/en-us/services/azure-dedicated-hsm/). This allows you more control over the secrets stored on it, including enhanced administrative and cryptographic control. The cloud service provider, Microsoft, will not have any access to the key material stored in Azure Dedicated HSM.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

##### 4.1.3.2 Azure Dedicated HSM

Azure 環境で使用され、特別なセキュリティ考慮事項が必要なシークレットについて、Azure は [Azure Dedicated HSM](https://azure.microsoft.com/en-us/services/azure-dedicated-hsm/) を提供しています。これにより、強化された管理制御と暗号制御を含め、保存されるシークレットをより細かく制御できます。クラウドサービスプロバイダーである Microsoft は、Azure Dedicated HSM に保存された鍵材料へアクセスできません。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (Original)</span>

#### 4.1.4 Other clouds, Multi-cloud, and Cloud agnostic

If you're using multiple cloud providers, you should consider using a cloud-agnostic secret management solution. This will allow you to use the same secret management solution across all your cloud providers (and possibly also on-premises). Another advantage is that this avoids vendor lock-in with a specific cloud provider, as the solution can be used on any cloud provider.

There are open-source and commercial solutions available. Some examples are:

- [CyberArk Conjur](https://www.conjur.org/)
- [HashiCorp Vault](https://www.vaultproject.io/)
- [Pulumi ESC](https://www.pulumi.com/esc/)

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

#### 4.1.4 その他のクラウド、マルチクラウド、クラウド非依存

複数のクラウドプロバイダーを使用している場合は、クラウド非依存のシークレット管理ソリューションの使用を検討すべきです。これにより、すべてのクラウドプロバイダー、場合によってはオンプレミスでも、同じシークレット管理ソリューションを使用できます。もう 1 つの利点は、特定のクラウドプロバイダーへのベンダーロックインを避けられることです。そのソリューションはどのクラウドプロバイダーでも使用できるからです。

オープンソースおよび商用のソリューションがあります。例は次のとおりです。

- [CyberArk Conjur](https://www.conjur.org/)
- [HashiCorp Vault](https://www.vaultproject.io/)
- [Pulumi ESC](https://www.pulumi.com/esc/)

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (Original)</span>

### 4.2 Envelope & client-side encryption

This section will describe how a secret is encrypted and how you can manage the keys for that encryption in the cloud.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### 4.2 エンベロープ暗号化とクライアントサイド暗号化

このセクションでは、シークレットがどのように暗号化されるか、およびクラウドでその暗号化の鍵をどのように管理できるかを説明します。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (Original)</span>

#### 4.2.1 Client-side encryption versus server-side encryption

Server-side encryption of secrets ensures that the cloud provider takes care of the encryption of the secret in storage. The secret is then safeguarded against compromise while at rest. Encryption at rest often does not require additional work other than selecting the key to encrypt it with (See section 4.2.2). However, when you submit the secret to another service, it will no longer be encrypted. It is decrypted before sharing with the intended service or human user.

Client-side encryption of secrets ensures that the secret remains encrypted until you actively decrypt it. This means it is only decrypted when it arrives at the consumer. You need to have a proper crypto system to cater for this. Think about mechanisms such as PGP using a safe configuration and other more scalable and relatively easy to use systems. Client-side encryption can provide an end-to-end encryption of the secret: from producer to consumer.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

#### 4.2.1 クライアントサイド暗号化とサーバーサイド暗号化

シークレットのサーバーサイド暗号化では、クラウドプロバイダーが保存中のシークレットの暗号化を担当します。そのシークレットは保存時の侵害から保護されます。保存時暗号化は多くの場合、暗号化に使用する鍵を選択すること以外に追加作業を必要としません。セクション 4.2.2 を参照してください。ただし、そのシークレットを別のサービスへ送信すると、もはや暗号化されたままではありません。意図されたサービスまたは人間のユーザーと共有する前に復号されます。

シークレットのクライアントサイド暗号化では、能動的に復号するまでシークレットは暗号化されたままです。つまり、利用者に到着したときだけ復号されます。これに対応するには適切な暗号システムが必要です。安全な設定の PGP や、よりスケーラブルで比較的使いやすいシステムなどのメカニズムを考えてください。クライアントサイド暗号化は、生成者から利用者までのシークレットのエンドツーエンド暗号化を提供できます。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (Original)</span>

#### 4.2.2 Bring Your Own Key versus Cloud Provider Key

When you encrypt a secret at rest, the question is: which key do you want to use? The less trust you have in the cloud provider, the more you will want to manage yourself.

Often, you can either encrypt a secret with a key managed at the secrets management service or use a key management solution from the cloud provider to encrypt the secret. The key offered through the key management solution of the cloud provider can be either managed by the cloud provider or by yourself. Industry standards call the latter "bring your own key" (BYOK). You can either directly import or generate this key at the key management solution or using cloud HSM supported by the cloud provider.
You can then either use your key or the customer main key from the provider to encrypt the data key of the secrets management solution. The data key, in turn, encrypts the secret. By managing the CMK, you have control over the data key at the secrets management solution.

While importing your own key material can generally be done with all providers ([AWS](https://docs.aws.amazon.com/kms/latest/developerguide/importing-keys.html), [Azure](https://docs.microsoft.com/en-us/azure/key-vault/keys/byok-specification), [GCP](https://cloud.google.com/kms/docs/key-import)), unless you know what you are doing and your threat model and policy require this, this is not a recommended solution due to its complexity and difficulty of use.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

#### 4.2.2 Bring Your Own Key と Cloud Provider Key

保存時にシークレットを暗号化する場合、問題はどの鍵を使用するかです。クラウドプロバイダーへの信頼が少ないほど、自分で管理したくなります。

多くの場合、シークレット管理サービスで管理される鍵でシークレットを暗号化するか、クラウドプロバイダーの鍵管理ソリューションを使用してシークレットを暗号化できます。クラウドプロバイダーの鍵管理ソリューションを通じて提供される鍵は、クラウドプロバイダーによって管理される場合も、自分で管理する場合もあります。業界標準では後者を「bring your own key」(BYOK) と呼びます。この鍵は、鍵管理ソリューションに直接インポートまたは生成することも、クラウドプロバイダーがサポートする cloud HSM を使用することもできます。

その後、自分の鍵またはプロバイダーの customer main key を使用して、シークレット管理ソリューションの data key を暗号化できます。data key はさらにシークレットを暗号化します。CMK を管理することで、シークレット管理ソリューションにおける data key を制御できます。

自分の鍵材料のインポートは一般にすべてのプロバイダー、[AWS](https://docs.aws.amazon.com/kms/latest/developerguide/importing-keys.html)、[Azure](https://docs.microsoft.com/en-us/azure/key-vault/keys/byok-specification)、[GCP](https://cloud.google.com/kms/docs/key-import) で可能ですが、自分が何をしているかを理解しており、脅威モデルとポリシーがこれを要求する場合を除き、複雑で使いにくいため推奨されるソリューションではありません。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (Original)</span>

### 4.3 Identity and Access Management (IAM)

IAM applies to both on-premises and cloud setups: to effectively manage secrets, you need to set up suitable access policies and roles. Setting this up goes beyond policies regarding secrets; it should include hardening the full IAM setup, as it could otherwise allow for privilege escalation attacks. Ensure you never allow open "pass role" privileges or unrestricted IAM creation privileges, as these can use or create credentials that have access to the secrets. Next, make sure you tightly control what can impersonate a service account: are your machines' roles accessible by an attacker exploiting your server? Can service roles from the data-pipeline tooling access the secrets easily? Ensure you include IAM for every cloud component in your threat model (e.g., ask yourself: how can you do elevation of privileges with this component?). See [this blog entry](https://xebia.com/ten-pitfalls-you-should-look-out-for-in-aws-iam/) for multiple do's and don'ts with examples.

Leverage the temporality of the IAM principals effectively: e.g., ensure that only specific roles and service accounts that require it can access the secrets. Monitor these accounts so that you can tell who or what used them to access the secrets.

Next, make sure that you scope access to your secrets: one should not be simply allowed to access all secrets. In GCP and AWS, you can create fine-grained access policies to ensure that a principal cannot access all secrets at once. In Azure, having access to the key vault means having access to all secrets in that key vault. It is, thus, essential to have separate key vaults when working on Azure to segregate access.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### 4.3 Identity and Access Management (IAM)

IAM はオンプレミスとクラウドの両方の構成に適用されます。シークレットを効果的に管理するには、適切なアクセスポリシーとロールを設定する必要があります。この設定はシークレットに関するポリシーを超えて、IAM セットアップ全体の堅牢化を含むべきです。そうしなければ、権限昇格攻撃を許す可能性があります。オープンな「pass role」権限や無制限の IAM 作成権限を許可しないようにしてください。これらはシークレットにアクセスできる認証情報を使用または作成できるためです。次に、何がサービスアカウントを impersonate できるかを厳密に制御してください。サーバーを悪用した攻撃者がマシンのロールへアクセスできるか、データパイプラインツールのサービスロールがシークレットに容易にアクセスできるか、などを確認します。すべてのクラウドコンポーネントについて IAM を脅威モデルに含めてください。たとえば、このコンポーネントでどのように権限昇格できるかを自問します。例を含む複数の do と don't については、[this blog entry](https://xebia.com/ten-pitfalls-you-should-look-out-for-in-aws-iam/) を参照してください。

IAM プリンシパルの一時性を効果的に活用します。たとえば、必要とする特定のロールとサービスアカウントだけがシークレットにアクセスできるようにします。誰または何がそれらを使用してシークレットへアクセスしたかを判断できるよう、これらのアカウントを監視します。

次に、シークレットへのアクセス範囲を限定してください。単純にすべてのシークレットへのアクセスを許可すべきではありません。GCP と AWS では、プリンシパルがすべてのシークレットへ一度にアクセスできないよう、細かなアクセスポリシーを作成できます。Azure では、Key Vault へのアクセス権があることは、その Key Vault 内のすべてのシークレットへのアクセス権があることを意味します。したがって、Azure で作業する場合はアクセスを分離するために Key Vault を分けることが不可欠です。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (Original)</span>

### 4.4 API limits

Cloud services can generally provide a limited amount of API calls over a given period. You could potentially (D)DoS yourself when you run into these limits. Most of these limits apply per account, project, or subscription, so spread workloads to limit your blast radius accordingly. Additionally, some services may support data key caching, preventing load on the key management service API (see, for example, [AWS data key caching](https://docs.aws.amazon.com/encryption-sdk/latest/developer-guide/data-key-caching.html)). Some services can leverage built-in data key caching. [S3 is one such example](https://docs.aws.amazon.com/AmazonS3/latest/userguide/bucket-key.html).

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### 4.4 API 制限

クラウドサービスは一般に、一定期間内の API 呼び出し数に制限を設けることがあります。これらの制限に達すると、自分自身に対して (D)DoS を引き起こす可能性があります。これらの制限の多くはアカウント、プロジェクト、サブスクリプション単位で適用されるため、影響範囲を制限するようにワークロードを分散してください。さらに、一部のサービスは data key caching をサポートし、鍵管理サービス API への負荷を防止できます。例として [AWS data key caching](https://docs.aws.amazon.com/encryption-sdk/latest/developer-guide/data-key-caching.html) を参照してください。一部のサービスは組み込みの data key caching を活用できます。[S3 is one such example](https://docs.aws.amazon.com/AmazonS3/latest/userguide/bucket-key.html) です。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (Original)</span>

## 5 Containers & Orchestrators

You can enrich containers with secrets in multiple ways: build time (not recommended) and during orchestration/deployment.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## 5 コンテナとオーケストレーター

コンテナには、ビルド時、これは推奨されません、およびオーケストレーションまたはデプロイ中という複数の方法でシークレットを追加できます。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (Original)</span>

### 5.1 Injection of Secrets (file, in-memory)

There are three ways to get secrets to an app inside a Docker container.

- Mounted volumes (file): With this method, we keep our secrets within a particular config/secret file and mount that file to our instance as a mounted volume. Ensure that these mounts are mounted in by the orchestrator and never built-in, as this will leak the secret with the container definition. Instead, make sure that the orchestrator mounts in the volume when required.
- Fetch from the secret store (in-memory): A sidecar app/container fetches the secrets it needs directly from a secret manager service without dealing with docker config. This solution allows you to use dynamically constructed secrets without worrying about the secrets being viewable from the file system or from checking the Docker container's environment variables.
- Environment variables: We can provide secrets directly as part of the Docker container configuration. Note: secrets themselves should never be hardcoded using docker ENV or docker ARG commands, as these can easily leak with the container definitions. See the Docker challenges at [WrongSecrets](https://github.com/OWASP/wrongsecrets) as well. Instead, let an orchestrator overwrite the environment variable with the actual secret and ensure that this is not hardcoded. Additionally, environment variables are generally accessible to all processes and may be included in logs or system dumps. Using environment variables is therefore not recommended unless the other methods are not possible.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### 5.1 シークレットの注入、ファイル、インメモリ

Docker コンテナ内のアプリにシークレットを渡す方法は 3 つあります。

- マウントされたボリューム、ファイル: この方法では、特定の config/secret ファイル内にシークレットを保持し、そのファイルをマウントボリュームとしてインスタンスにマウントします。これらのマウントはオーケストレーターによってマウントされ、ビルトインされないようにしてください。ビルトインするとコンテナ定義とともにシークレットが漏えいします。代わりに、必要なときにオーケストレーターがボリュームをマウントするようにします。
- シークレットストアから取得、インメモリ: サイドカーアプリまたはコンテナが、Docker config を扱わずに、必要なシークレットをシークレットマネージャーサービスから直接取得します。このソリューションにより、ファイルシステムから閲覧されたり、Docker コンテナの環境変数を確認されることでシークレットが見えることを心配せずに、動的に構築されたシークレットを使用できます。
- 環境変数: Docker コンテナ設定の一部としてシークレットを直接提供できます。注: シークレットそのものは docker ENV または docker ARG コマンドでハードコードしてはなりません。これらはコンテナ定義とともに容易に漏えいするためです。[WrongSecrets](https://github.com/OWASP/wrongsecrets) の Docker challenges も参照してください。代わりに、オーケストレーターが実際のシークレットで環境変数を上書きするようにし、それがハードコードされていないことを確認します。さらに、環境変数は一般にすべてのプロセスからアクセス可能であり、ログやシステムダンプに含まれる可能性があります。そのため、他の方法が不可能な場合を除き、環境変数の使用は推奨されません。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (Original)</span>

### 5.2 Short-Lived Sidecar Containers

To inject secrets, you could create short-lived sidecar containers that fetch secrets from some remote endpoint and then store them on a shared volume mounted to the original container. The original container can now use the secrets from the mounted volume. The benefit of using this approach is that we don't need to integrate any third-party tool or code to get secrets. Once the sidecar has fetched the secrets, it terminates. Examples of this include [Vault Agent Sidecar Injector](https://developer.hashicorp.com/vault/docs/platform/k8s/injector) and [Conjur Secrets Provider](https://github.com/cyberark/secrets-provider-for-k8s). By mounting secrets to a volume shared with the pod, containers within the pod can consume secrets without being aware of the secrets manager.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### 5.2 短命なサイドカーコンテナ

シークレットを注入するために、リモートエンドポイントからシークレットを取得し、元のコンテナにマウントされた共有ボリュームに保存する短命なサイドカーコンテナを作成できます。元のコンテナは、マウントされたボリュームからシークレットを使用できるようになります。このアプローチの利点は、シークレットを取得するためにサードパーティツールやコードを統合する必要がないことです。サイドカーがシークレットを取得すると終了します。この例には [Vault Agent Sidecar Injector](https://developer.hashicorp.com/vault/docs/platform/k8s/injector) や [Conjur Secrets Provider](https://github.com/cyberark/secrets-provider-for-k8s) があります。Pod と共有されるボリュームにシークレットをマウントすることで、Pod 内のコンテナはシークレットマネージャーを意識せずにシークレットを消費できます。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (Original)</span>

### 5.3 Internal vs External Access

You should only expose secrets to communication mechanisms between the container and the deployment representation (e.g., a Kubernetes Pod). Never expose secrets through external access mechanisms shared among deployments or orchestrators (e.g., a shared volume).

When the orchestrator stores secrets (e.g., Kubernetes Secrets), make sure that the storage backend of the orchestrator is encrypted and you manage the keys well. See the [Kubernetes Security Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Kubernetes_Security_Cheat_Sheet.html) for more information.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### 5.3 内部アクセスと外部アクセス

シークレットは、コンテナとデプロイ表現、たとえば Kubernetes Pod の間の通信メカニズムだけに露出すべきです。デプロイやオーケストレーター間で共有される外部アクセスメカニズム、たとえば共有ボリュームを通じてシークレットを露出してはなりません。

オーケストレーターがシークレット、たとえば Kubernetes Secrets を保存する場合、オーケストレーターのストレージバックエンドが暗号化されており、鍵が適切に管理されていることを確認してください。詳細は [Kubernetes Security Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Kubernetes_Security_Cheat_Sheet.html) を参照してください。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (Original)</span>

## 6 Implementation Guidance

In this section, we will discuss implementation. Note that it is always best to refer to the official documentation of the secrets management system of choice for the actual implementation as it will be more up to date than any secondary document such as this cheat sheet.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## 6 実装ガイダンス

このセクションでは実装について説明します。実際の実装については、選択したシークレット管理システムの公式ドキュメントを参照することが常に最善である点に注意してください。その方が、このチートシートのような二次文書よりも最新であるためです。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (Original)</span>

### 6.1 Key Material Management Policies

Key material management is discussed in the [Key Management Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Key_Management_Cheat_Sheet.html)

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### 6.1 鍵材料管理ポリシー

鍵材料管理については、[Key Management Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Key_Management_Cheat_Sheet.html) で説明されています。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (Original)</span>

### 6.2 Dynamic vs Static Use Cases

We see the following use cases for dynamic secrets, among others:

- short-lived secrets (e.g., credentials or API keys) for a secondary service that expresses the intent for connecting the primary service (e.g., consumer) to the service.
- short-lived integrity and encryption controls for guarding and securing in-memory and runtime communication processes. Think of encryption keys that only need to live for a single session or a single deployment lifetime.
- short-lived credentials for building a stack during the deployment of a service for interacting with the deployers and supporting infrastructure.

Note that these dynamic secrets often need to be created with the service we need to connect to. To create these types of dynamic secrets, we usually require long-term static secrets to create the dynamic secrets themselves. Other static use cases:

- key material that needs to live longer than a single deployment due to the nature of its usage in the interaction with other instances of the same service (e.g., storage encryption keys, TLS PKI keys)
- key material or credentials to connect to services that do not support creating temporal roles or credentials.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### 6.2 動的ユースケースと静的ユースケース

動的シークレットのユースケースには、とりわけ次のものがあります。

- 二次サービスに対する短命なシークレット、たとえば認証情報や API キー。これは、主サービス、たとえば利用者がそのサービスへ接続する意図を表します。
- メモリ内およびランタイム通信プロセスを保護し安全にするための、短命な完全性および暗号化制御。単一セッションまたは単一デプロイメントの寿命だけでよい暗号鍵を考えてください。
- サービスのデプロイ中にスタックを構築し、デプロイ担当者と支援インフラとやり取りするための短命な認証情報。

これらの動的シークレットは、多くの場合、接続先となるサービスとともに作成する必要がある点に注意してください。この種の動的シークレットを作成するには、通常、動的シークレットそのものを作成するための長期的な静的シークレットが必要です。その他の静的ユースケースは次のとおりです。

- 同じサービスの他のインスタンスとのやり取りでの使用性質により、単一デプロイメントより長く存在する必要がある鍵材料。例: ストレージ暗号鍵、TLS PKI 鍵。
- 一時的なロールや認証情報の作成をサポートしないサービスへ接続するための鍵材料または認証情報。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (Original)</span>

### 6.3 Ensure limitations are in place

Secrets should never be retrievable by everyone and everything. Always make sure that you put guardrails in place:

- Do you have the opportunity to create access policies? Ensure that there are policies in place to limit the number of entities that can read or write the secret. At the same time, write the policies so that you can easily extend them, and they are not too complicated to understand.
- Is there no way to reduce access to certain secrets within a secrets management solution? Consider separating the production and development secrets by having separate secret management solutions. Then, reduce access to the production secrets management solution.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### 6.3 制限が配置されていることを確認する

シークレットは、すべての人やすべてのものから取得可能であってはなりません。常にガードレールを配置してください。

- アクセスポリシーを作成する機会がありますか。シークレットを読み書きできるエンティティの数を制限するポリシーがあることを確認してください。同時に、容易に拡張でき、理解が複雑になりすぎないようにポリシーを記述します。
- シークレット管理ソリューション内で特定のシークレットへのアクセスを減らす方法がありませんか。本番シークレットと開発シークレットを分離するために、別々のシークレット管理ソリューションを持つことを検討してください。そのうえで、本番シークレット管理ソリューションへのアクセスを減らします。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (Original)</span>

### 6.4 Security Event Monitoring is Key

Continually monitor who/what, from which IP, and what methodology accesses the secret. There are various patterns to look out for, such as, but not limited to:

- Monitor who accesses the secret at the secret management system: is this normal behavior? If the CI/CD credentials are used to access the secret management solution from a different IP than where the CI/CD system is running, provide a security alert and assume the secret is compromised.
- Monitor the service requiring the secret (if possible), e.g., whether the user of the secret is coming from an expected IP, with an expected user agent. If not, alert and assume the secret is compromised.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### 6.4 Security Event Monitoring が重要

誰または何が、どの IP から、どの方法でシークレットへアクセスするかを継続的に監視します。注目すべきパターンは、これらに限定されませんが、次のようなものがあります。

- シークレット管理システムで誰がシークレットへアクセスするかを監視します。これは通常の動作でしょうか。CI/CD 認証情報が、CI/CD システムが実行されている場所とは異なる IP からシークレット管理ソリューションへアクセスするために使用された場合、セキュリティアラートを出し、そのシークレットは侵害されたと想定してください。
- 可能であれば、シークレットを必要とするサービスを監視します。たとえば、シークレットの利用者が期待される IP、期待される user agent から来ているかを確認します。そうでなければ、アラートを出し、そのシークレットは侵害されたと想定してください。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (Original)</span>

### 6.5 Usability and Ease of Onboarding

For a secrets management solution to be effective, it must be easy for developers to adopt and use. If the process is too complex, developers may resort to insecure practices. A focus on usability and a smooth onboarding experience is critical.

- **Clear and Comprehensive Documentation:**
    - Provide clear, concise, and easy-to-find documentation. This should include tutorials for common use cases, detailed API references, and practical examples.
    - Maintain a "getting started" guide that walks new users through the process of obtaining their first secret.
- **Developer-Friendly Tooling and SDKs:**
    - Offer well-maintained SDKs for various programming languages to simplify integration.
    - Provide a command-line interface (CLI) that allows developers to manage secrets from their local development environment.
    - Develop plugins for common IDEs, CI/CD systems, and infrastructure-as-code (IaC) tools like Terraform and Pulumi.
- **Streamlined Workflows:**
    - Implement self-service workflows that enable developers to request and receive secrets with minimal manual intervention.
    - Use GitOps principles to manage secrets as code, allowing developers to define secret needs in a declarative manner alongside their application code.
    - Automate the approval process for low-risk secrets while maintaining appropriate controls for more sensitive ones.
- **Actionable Feedback and Support:**
    - Provide clear error messages that help developers troubleshoot issues independently.
    - Establish dedicated support channels (e.g., a Slack channel, a ticketing system) where developers can get help from the security or platform team.
- **Easy Integration:**
    - Ensure the secrets management solution can be easily integrated with existing applications. Sidecar containers, such as the [Vault Agent Sidecar Injector](https://developer.hashicorp.com/vault/docs/platform/k8s/injector) or the [Conjur Secrets Provider](https://github.com/cyberark/secrets-provider-for-k8s), can help decouple applications from the secrets management system.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### 6.5 ユーザビリティとオンボーディングの容易さ

シークレット管理ソリューションが効果的であるためには、開発者が採用し使いやすいものでなければなりません。プロセスが複雑すぎると、開発者は安全でない実践に戻る可能性があります。ユーザビリティと円滑なオンボーディング体験に焦点を当てることが重要です。

- **明確で包括的なドキュメント:**
    - 明確で簡潔で見つけやすいドキュメントを提供します。これには、一般的なユースケースのチュートリアル、詳細な API リファレンス、実用的な例を含めるべきです。
    - 新規ユーザーが最初のシークレットを取得するプロセスを案内する「getting started」ガイドを維持します。
- **開発者に優しいツールと SDK:**
    - 統合を簡素化するため、さまざまなプログラミング言語向けに保守された SDK を提供します。
    - 開発者がローカル開発環境からシークレットを管理できるコマンドラインインターフェース (CLI) を提供します。
    - 一般的な IDE、CI/CD システム、Terraform や Pulumi などの infrastructure-as-code (IaC) ツール向けプラグインを開発します。
- **合理化されたワークフロー:**
    - 開発者が最小限の手動介入でシークレットを要求し受け取れるセルフサービスワークフローを実装します。
    - GitOps 原則を使用してシークレットをコードとして管理し、開発者がアプリケーションコードと並べて宣言的にシークレット要件を定義できるようにします。
    - 低リスクのシークレットについて承認プロセスを自動化し、より機微なものには適切な制御を維持します。
- **実行可能なフィードバックとサポート:**
    - 開発者が独力で問題をトラブルシュートできるよう、明確なエラーメッセージを提供します。
    - 開発者がセキュリティチームまたはプラットフォームチームから支援を受けられる専用サポートチャネル、たとえば Slack チャネルやチケットシステムを確立します。
- **容易な統合:**
    - シークレット管理ソリューションが既存アプリケーションと容易に統合できることを確認します。[Vault Agent Sidecar Injector](https://developer.hashicorp.com/vault/docs/platform/k8s/injector) や [Conjur Secrets Provider](https://github.com/cyberark/secrets-provider-for-k8s) などのサイドカーコンテナは、アプリケーションをシークレット管理システムから分離するのに役立ちます。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (Original)</span>

## 7 Encryption

Secrets Management goes hand in hand with encryption. After all, secrets must be stored encrypted somewhere to protect their confidentiality and integrity.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## 7 暗号化

シークレット管理は暗号化と密接に関係しています。結局のところ、シークレットは機密性と完全性を保護するため、どこかに暗号化して保存しなければなりません。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (Original)</span>

### 7.1 Encryption Types to Use

You can use various encryption types to secure a secret as long as they provide sufficient security, including adequate resistance against quantum computing-based attacks. Given that this is a moving field, it is best to take a look at sources like [keylength.com](https://www.keylength.com/en/4/), which enumerate up-to-date recommendations on the usage of encryption types and key lengths for existing standards, as well as the NSA's [Commercial National Security Algorithm Suite 2.0](https://media.defense.gov/2022/Sep/07/2003071834/-1/-1/0/CSA_CNSA_2.0_ALGORITHMS_.PDF) which enumerates quantum resistant algorithms.

Please note that in all cases, we need to preferably select an algorithm that provides encryption and confidentiality at the same time, such as AES-256 using GCM [(Galois Counter Mode)](https://en.wikipedia.org/wiki/Galois/Counter_Mode), or a mixture of ChaCha20 and Poly1305 according to the best practices in the field.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### 7.1 使用する暗号化の種類

十分なセキュリティを提供し、量子コンピューティングベースの攻撃に対する十分な耐性を含む限り、シークレットを保護するためにさまざまな暗号化方式を使用できます。この分野は変化しているため、既存標準に対する暗号化方式と鍵長の使用について最新の推奨事項を列挙している [keylength.com](https://www.keylength.com/en/4/) や、量子耐性アルゴリズムを列挙している NSA の [Commercial National Security Algorithm Suite 2.0](https://media.defense.gov/2022/Sep/07/2003071834/-1/-1/0/CSA_CNSA_2.0_ALGORITHMS_.PDF) などの情報源を確認するのが最善です。

すべての場合において、GCM [(Galois Counter Mode)](https://en.wikipedia.org/wiki/Galois/Counter_Mode) を使用する AES-256、またはこの分野のベストプラクティスに従った ChaCha20 と Poly1305 の組み合わせなど、暗号化と機密性を同時に提供するアルゴリズムを優先的に選択する必要がある点に注意してください。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (Original)</span>

### 7.2 Convergent Encryption

[Convergent Encryption](https://en.wikipedia.org/wiki/Convergent_encryption) ensures that a given plaintext and its key results in the same ciphertext. This can help detect possible reuse of secrets, resulting in the same ciphertext.
The challenge with enabling convergent encryption is that it allows attackers to use the system to generate a set of cryptographic strings that might end up in the same secret, allowing the attacker to derive the plaintext secret. Given the algorithm and key, you can mitigate this risk if the convergent crypto system you use has sufficient resource challenges during encryption. Another factor that can help reduce the risk is ensuring that a secret is of adequate length, further hampering the possible guess-iteration time required.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### 7.2 収束暗号化

[Convergent Encryption](https://en.wikipedia.org/wiki/Convergent_encryption) は、ある平文とその鍵が同じ暗号文を生成することを保証します。これにより、シークレットの再利用の可能性を、同じ暗号文として検出しやすくなります。

収束暗号化を有効にする際の課題は、攻撃者がそのシステムを使用して暗号文字列の集合を生成し、それが同じシークレットになり得ることで、攻撃者が平文シークレットを導出できる可能性があることです。アルゴリズムと鍵が与えられている場合、使用する収束暗号システムが暗号化時に十分なリソース課題を持っていれば、このリスクを軽減できます。リスク低減に役立つもう 1 つの要素は、シークレットが十分な長さであることを保証し、推測反復に必要な時間をさらに妨げることです。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (Original)</span>

### 7.3 Where to store the Encryption Keys?

You should not store keys next to the secrets they encrypt, except if those keys are encrypted themselves (see envelope encryption). Start by consulting the [Key Management Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Key_Management_Cheat_Sheet.html) on where and how to store the encryption and possible HMAC keys.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### 7.3 暗号鍵をどこに保存するか

鍵自体が暗号化されている場合、エンベロープ暗号化を参照してください、を除き、鍵をその鍵が暗号化するシークレットの隣に保存すべきではありません。暗号鍵および可能な HMAC 鍵をどこに、どのように保存するかについては、まず [Key Management Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Key_Management_Cheat_Sheet.html) を参照してください。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (Original)</span>

### 7.4 Encryption as a Service (EaaS)

EaaS is a model in which users subscribe to a cloud-based encryption service without having to install encryption on their own systems. Using EaaS, you can get the following benefits:

- Encryption at rest
- Encryption in transit (TLS)
- Key handling and cryptographic implementations are taken care of by Encryption Service, not by developers
- The provider could add more services to interact with the sensitive data

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### 7.4 Encryption as a Service (EaaS)

EaaS は、ユーザーが自分のシステムに暗号化をインストールせず、クラウドベースの暗号化サービスを購読するモデルです。EaaS を使用すると、次の利点を得られます。

- 保存時暗号化
- 転送中暗号化 (TLS)
- 鍵の取り扱いと暗号実装は開発者ではなく Encryption Service が担当します。
- プロバイダーは機微データとやり取りする追加サービスを加えることができます。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (Original)</span>

## 8 Detection

There are many approaches to secrets detection and some very useful open-source projects to help with this. The [Yelp Detect Secrets](https://github.com/Yelp/detect-secrets) project is mature and has signature matching for around 20 secrets. For more information on other tools to help you in the detection space, check out the [Secrets Detection](https://github.com/topics/secrets-detection) topic on GitHub.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## 8 検出

シークレット検出には多くのアプローチがあり、それを支援する非常に有用なオープンソースプロジェクトもあります。[Yelp Detect Secrets](https://github.com/Yelp/detect-secrets) プロジェクトは成熟しており、約 20 種類のシークレットに対するシグネチャマッチングを備えています。検出領域で役立つ他のツールの詳細については、GitHub の [Secrets Detection](https://github.com/topics/secrets-detection) トピックを確認してください。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (Original)</span>

### 8.1 General detection approaches

Shift-left and DevSecOps principles apply to secrets detection as well. These general approaches below aim to consider secrets earlier and evolve the practice over time.

- Create standard test secrets and use them universally across the organization. This allows for reducing false positives by only needing to track a single test secret for each secret type.
- Consider enabling secrets detection at the developer level to avoid checking secrets into code before commit/PR either in the IDE, as part of test-driven development, or via pre-commit hook.
- Make secrets detection part of the threat model. Consider secrets as part of the attack surface during threat modeling exercises.
- Evaluate detection utilities and related signatures often to ensure they meet expectations.
- Consider having more than one detection utility and correlating/de-duping results to identify potential areas of detection weakness.
- Explore a balance between entropy and ease of detection. Secrets with consistent formats are easier to detect with lower false-positive rates, but you also don't want to miss a human-created password simply because it doesn't match your detection rules.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### 8.1 一般的な検出アプローチ

Shift-left と DevSecOps の原則は、シークレット検出にも適用されます。以下の一般的なアプローチは、シークレットをより早期に考慮し、実践を時間とともに発展させることを目的としています。

- 標準的なテストシークレットを作成し、組織全体で普遍的に使用します。これにより、シークレットタイプごとに単一のテストシークレットだけを追跡すればよくなり、誤検知を減らせます。
- IDE、テスト駆動開発の一部、または pre-commit hook を通じて、commit/PR の前にシークレットをコードへチェックインしないよう、開発者レベルでシークレット検出を有効にすることを検討します。
- シークレット検出を脅威モデルの一部にします。脅威モデリング演習中、シークレットを攻撃対象領域の一部として検討します。
- 検出ユーティリティと関連シグネチャが期待を満たしていることを確認するため、頻繁に評価します。
- 複数の検出ユーティリティを持ち、結果を相関付け、重複排除して、検出の弱点となり得る領域を特定することを検討します。
- エントロピーと検出容易性のバランスを探ります。一貫した形式を持つシークレットは低い誤検知率で検出しやすいですが、人間が作成したパスワードが検出ルールに一致しないという理由だけで見逃したくはありません。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (Original)</span>

### 8.2 Types of secrets to be detected

Many types of secrets exist, and you should consider signatures for each to ensure accurate detection for all. Among the more common types are:

- High availability secrets (Tokens that are difficult to rotate)
- Application configuration files
- Connection strings
- API keys
- Credentials
- Passwords
- 2FA keys
- Private keys (e.g., SSH keys)
- Session tokens
- Platform-specific secret types (e.g., Amazon Web Services, Google Cloud)

For more fun learning about secrets and practice rooting them out, check out the [Wrong Secrets](https://owasp.org/www-project-wrongsecrets/) project.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### 8.2 検出すべきシークレットの種類

多くの種類のシークレットが存在するため、すべてを正確に検出できるよう、それぞれに対するシグネチャを検討すべきです。より一般的な種類には次があります。

- 高可用性シークレット、ローテーションが難しいトークン
- アプリケーション設定ファイル
- 接続文字列
- API キー
- 認証情報
- パスワード
- 2FA キー
- 秘密鍵、たとえば SSH キー
- セッショントークン
- プラットフォーム固有のシークレットタイプ、たとえば Amazon Web Services、Google Cloud

シークレットについて楽しく学び、見つけ出す練習をするには、[Wrong Secrets](https://owasp.org/www-project-wrongsecrets/) プロジェクトを確認してください。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (Original)</span>

### 8.3 Detection lifecycle

Secrets are like any other authorization token. They should:

- Exist only for as long as necessary (rotate often)
- Have a method for automatic rotation
- Only be visible to those who need them (least privilege)
- Be revocable (including the logging of attempt to use a revoked secret)
- Never be logged (must implement either an encryption or masking approach in place to avoid logging plaintext secrets)

Create detection rules for each of the stages of the secret lifecycle.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### 8.3 検出ライフサイクル

シークレットは他の認可トークンと同様です。次のようであるべきです。

- 必要な期間だけ存在する、頻繁にローテーションする
- 自動ローテーションの方法がある
- 必要とする人だけに見える、最小権限
- 失効可能である、失効済みシークレットの使用試行ログ記録を含む
- ログに記録されない、平文シークレットのログ記録を避けるため、暗号化またはマスキングのアプローチを実装しなければならない

シークレットライフサイクルの各段階について検出ルールを作成します。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (Original)</span>

### 8.4 Documentation for how to detect secrets

Create documentation and update it regularly to inform the developer community on procedures and systems available at your organization and what types of secrets management you expect, how to test for secrets, and what to do in the event of detected secrets.

Documentation should:

- Exist and be updated often, especially in response to an incident
- Include the following information:
    - Who has access to the secret
    - How it gets rotated
    - Any upstream or downstream dependencies that could potentially be broken during secret rotation
    - Who is the point of contact during an incident
    - Security impact of exposure

- Identify when secrets may be handled differently depending on the threat risk, data classification, etc.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### 8.4 シークレット検出方法に関するドキュメント

開発者コミュニティに対して、組織で利用可能な手順とシステム、期待するシークレット管理の種類、シークレットのテスト方法、検出されたシークレットがあった場合に何をするかを知らせるため、ドキュメントを作成し定期的に更新します。

ドキュメントは次のようであるべきです。

- 存在し、特にインシデント対応時に頻繁に更新される
- 次の情報を含む
    - 誰がシークレットへアクセスできるか
    - どのようにローテーションされるか
    - シークレットローテーション中に破損する可能性がある上流または下流の依存関係
    - インシデント時の連絡先
    - 露出によるセキュリティ影響
- 脅威リスク、データ分類などに応じて、シークレットの扱いが異なる場合を特定する

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (Original)</span>

## 9 Incident Response

Quick response in the event of a secret exposure is perhaps one of the most critical considerations for secrets management.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## 9 インシデント対応

シークレット露出時の迅速な対応は、シークレット管理における最も重要な考慮事項の 1 つかもしれません。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (Original)</span>

### 9.1 Documentation

Incident response in the event of secret exposure should ensure that everyone in the chain of custody is aware and understands how to respond. This includes application creators (every member of a development team), information security, and technology leadership.

Documentation must include:

- How to test for secrets and secrets handling, especially during business continuity reviews.
- Whom to alert when a secret is detected.
- Steps to take for containment
- Information to log during the event

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### 9.1 ドキュメント

シークレット露出時のインシデント対応では、管理の連鎖にいる全員が認識し、対応方法を理解していることを確実にすべきです。これには、アプリケーション作成者、開発チームの全メンバー、情報セキュリティ、技術リーダーシップが含まれます。

ドキュメントには次を含めなければなりません。

- 特に事業継続性レビュー中に、シークレットとシークレット取り扱いをテストする方法。
- シークレットが検出されたときに誰へ警告するか。
- 封じ込めのために実行する手順。
- イベント中にログへ記録する情報。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (Original)</span>

### 9.2 Remediation

The primary goal of incident response is rapid response and containment.

Containment should follow these procedures:

1. Revocation: Keys that were exposed should undergo immediate revocation. The secret must be able to be de-authorized quickly, and systems must be in place to identify the revocation status.
2. Rotation: A new secret must be able to be quickly created and implemented, preferably via an automated process to ensure repeatability, low rate of implementation error, and least-privilege (not directly human-readable).
3. Deletion: Secrets revoked/rotated must be removed from the exposed system immediately, including secrets discovered in code or logs. Secrets in code could have commit history for the exposure squashed to before the introduction of the secret, however, this may introduce other problems as it rewrites git history and will break any other links to a given commit. If you decide to do this be aware of the consequences and plan accordingly. Secrets in logs must have a process for removing the secret while maintaining log integrity.
4. Logging: Incident response teams must have access to information about the lifecycle of a secret to aid in containment and remediation, including:
    - Who had access?
    - When did they use it?
    - When was it previously rotated?

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### 9.2 修復

インシデント対応の主な目標は、迅速な対応と封じ込めです。

封じ込めは次の手順に従うべきです。

1. 失効: 露出した鍵は即時失効されるべきです。シークレットは迅速に認可解除できなければならず、失効状態を特定するためのシステムが整っていなければなりません。
2. ローテーション: 新しいシークレットは迅速に作成および実装できなければなりません。再現性、低い実装エラー率、最小権限、人間が直接読めないことを確保するため、自動化プロセスによることが望ましいです。
3. 削除: 失効またはローテーションされたシークレットは、コードやログで発見されたシークレットを含め、露出したシステムから直ちに削除しなければなりません。コード内のシークレットについては、シークレット導入前まで commit 履歴を squash できますが、これは git 履歴を書き換え、特定 commit への他のリンクを壊すため、別の問題を引き起こす可能性があります。これを行う場合は、結果を認識し、適切に計画してください。ログ内のシークレットについては、ログの完全性を維持しながらシークレットを削除するプロセスが必要です。
4. ロギング: インシデント対応チームは、封じ込めと修復を支援するため、シークレットのライフサイクルに関する情報へアクセスできなければなりません。これには次が含まれます。
    - 誰がアクセス権を持っていたか。
    - いつ使用したか。
    - 以前いつローテーションされたか。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (Original)</span>

### 9.3 Logging

Additional considerations for logging of secrets usage should include:

- Logging for incident response should be to a single location accessible by incident response (IR) teams
- Ensure fidelity of logging information during purple team exercises such as:
    - What should have been logged?
    - What was actually logged?
    - Do we have adequate alerts in place to ensure this?

Consider using a standardized logging format and vocabulary such as the [Logging Vocabulary Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Logging_Vocabulary_Cheat_Sheet.html) to ensure that all necessary information is logged.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### 9.3 ロギング

シークレット使用のロギングに関する追加の考慮事項には、次を含めるべきです。

- インシデント対応のためのログは、incident response (IR) チームがアクセスできる単一の場所に記録すること。
- purple team 演習中に、次のようなログ情報の忠実度を確認すること。
    - 何がログ記録されるべきだったか。
    - 実際には何がログ記録されたか。
    - これを保証する十分なアラートが配置されているか。

必要なすべての情報がログ記録されるよう、[Logging Vocabulary Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Logging_Vocabulary_Cheat_Sheet.html) のような標準化されたログ形式と語彙の使用を検討してください。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (Original)</span>

## 10 Secrets Management in a Multi-Cloud Environment

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## 10 マルチクラウド環境におけるシークレット管理

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (Original)</span>

### 10.1 Introduction

Managing secrets in a multi-cloud environment presents unique challenges due to the diversity of cloud providers and their respective services. This section discusses the challenges and best practices for managing secrets across multiple cloud providers.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### 10.1 はじめに

マルチクラウド環境におけるシークレット管理には、クラウドプロバイダーとそれぞれのサービスの多様性により、固有の課題があります。このセクションでは、複数のクラウドプロバイダーにまたがってシークレットを管理するための課題とベストプラクティスについて説明します。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (Original)</span>

### 10.2 Challenges

1. **Diverse APIs and Interfaces**: Each cloud provider has its own API and interface for managing secrets, which can lead to complexity in integrating and managing secrets across multiple providers.
2. **Inconsistent Security Policies**: Different cloud providers may have varying security policies and practices, making it challenging to enforce consistent security standards across all environments.
3. **Key Rotation**: Ensuring that keys are rotated consistently and securely across multiple cloud providers can be difficult, especially if each provider has different mechanisms for key rotation.
4. **Access Control**: Managing access control for secrets across multiple cloud providers can be complex, as each provider may have different access control mechanisms and policies.
5. **Auditing and Monitoring**: Ensuring comprehensive auditing and monitoring of secret access and usage across multiple cloud providers can be challenging due to the differences in logging and monitoring capabilities.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### 10.2 課題

1. **多様な API とインターフェース:** 各クラウドプロバイダーはシークレット管理のために独自の API とインターフェースを持っており、複数プロバイダーにまたがるシークレットの統合と管理が複雑になる可能性があります。
2. **一貫しないセキュリティポリシー:** クラウドプロバイダーごとにセキュリティポリシーと実践が異なる可能性があり、すべての環境で一貫したセキュリティ標準を強制することが困難になります。
3. **鍵ローテーション:** 複数のクラウドプロバイダーにまたがって鍵を一貫して安全にローテーションすることは、各プロバイダーが異なる鍵ローテーションメカニズムを持つ場合に特に困難です。
4. **アクセス制御:** 各プロバイダーが異なるアクセス制御メカニズムとポリシーを持つ可能性があるため、複数のクラウドプロバイダーにまたがるシークレットのアクセス制御管理は複雑になり得ます。
5. **監査とモニタリング:** 複数のクラウドプロバイダーにまたがるシークレットアクセスと使用の包括的な監査とモニタリングを確保することは、ロギングとモニタリング能力の違いにより困難になる可能性があります。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (Original)</span>

### 10.3 Best Practices

1. **Use a Centralized Secrets Management Solution**: Implement a centralized secrets management solution that can integrate with multiple cloud providers. This can help standardize the management of secrets and enforce consistent security policies across all environments. Examples include HashiCorp Vault and CyberArk Conjur.
2. **Standardize Security Policies**: Define and enforce standardized security policies for managing secrets across all cloud providers. This includes policies for key rotation, access control, and auditing.
3. **Automate Key Rotation**: Implement automated key rotation processes to ensure that keys are rotated consistently and securely across all cloud providers. Use tools and scripts to automate the rotation process and reduce the risk of human error.
4. **Implement Fine-Grained Access Control**: Use fine-grained access control mechanisms to restrict access to secrets based on the principle of least privilege. Ensure that access control policies are consistently enforced across all cloud providers.
5. **Enable Comprehensive Auditing and Monitoring**: Implement comprehensive auditing and monitoring of secret access and usage across all cloud providers. Use centralized logging and monitoring solutions to aggregate and analyze logs from multiple providers.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### 10.3 ベストプラクティス

1. **集中型シークレット管理ソリューションを使用する:** 複数のクラウドプロバイダーと統合できる集中型シークレット管理ソリューションを実装します。これにより、シークレット管理を標準化し、すべての環境で一貫したセキュリティポリシーを強制しやすくなります。例には HashiCorp Vault と CyberArk Conjur があります。
2. **セキュリティポリシーを標準化する:** すべてのクラウドプロバイダーにまたがってシークレットを管理するための標準化されたセキュリティポリシーを定義し強制します。これには、鍵ローテーション、アクセス制御、監査のポリシーが含まれます。
3. **鍵ローテーションを自動化する:** すべてのクラウドプロバイダーにまたがって鍵が一貫して安全にローテーションされるよう、自動鍵ローテーションプロセスを実装します。ツールとスクリプトを使用してローテーションプロセスを自動化し、人的ミスのリスクを低減します。
4. **細かなアクセス制御を実装する:** 最小権限の原則に基づき、シークレットへのアクセスを制限するため、細かなアクセス制御メカニズムを使用します。アクセス制御ポリシーがすべてのクラウドプロバイダーで一貫して強制されることを確認します。
5. **包括的な監査とモニタリングを有効化する:** すべてのクラウドプロバイダーにまたがって、シークレットアクセスと使用の包括的な監査とモニタリングを実装します。集中型ロギングおよびモニタリングソリューションを使用して、複数プロバイダーからのログを集約および分析します。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (Original)</span>

### 10.4 References

- [HashiCorp Vault](https://www.vaultproject.io/)
- [CyberArk Conjur](https://www.conjur.org/)
- [AWS Secrets Manager](https://aws.amazon.com/secrets-manager/)
- [Azure Key Vault](https://azure.microsoft.com/en-us/services/key-vault/)
- [Google Cloud Secret Manager](https://cloud.google.com/secret-manager)

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### 10.4 参考資料

- [HashiCorp Vault](https://www.vaultproject.io/)
- [CyberArk Conjur](https://www.conjur.org/)
- [AWS Secrets Manager](https://aws.amazon.com/secrets-manager/)
- [Azure Key Vault](https://azure.microsoft.com/en-us/services/key-vault/)
- [Google Cloud Secret Manager](https://cloud.google.com/secret-manager)

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (Original)</span>

## 11 Related Cheat Sheets & further reading

- [Key Management Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Key_Management_Cheat_Sheet.html)
- [Logging Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html)
- [Password Storage Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html)
- [Cryptographic Storage Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cryptographic_Storage_Cheat_Sheet.html)
- [OWASP WrongSecrets project](https://github.com/OWASP/wrongsecrets/)
- [Blog: 10 Pointers on Secrets Management](https://xebia.com/blog/secure-deployment-10-pointers-on-secrets-management/)
- [Blog: From build to run: pointers on secure deployment](https://xebia.com/from-build-to-run-pointers-on-secure-deployment/)
- [GitHub listing on secrets detection tools](https://github.com/topics/secrets-detection)
- [NIST SP 800-57 Recommendation for Key Management](https://csrc.nist.gov/publications/detail/sp/800-57-part-1/rev-5/final)
- [OpenCRE References to secrets](https://opencre.org/cre/223-780)

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## 11 関連チートシートと追加資料

- [Key Management Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Key_Management_Cheat_Sheet.html)
- [Logging Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html)
- [Password Storage Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html)
- [Cryptographic Storage Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cryptographic_Storage_Cheat_Sheet.html)
- [OWASP WrongSecrets project](https://github.com/OWASP/wrongsecrets/)
- [Blog: 10 Pointers on Secrets Management](https://xebia.com/blog/secure-deployment-10-pointers-on-secrets-management/)
- [Blog: From build to run: pointers on secure deployment](https://xebia.com/from-build-to-run-pointers-on-secure-deployment/)
- [GitHub listing on secrets detection tools](https://github.com/topics/secrets-detection)
- [NIST SP 800-57 Recommendation for Key Management](https://csrc.nist.gov/publications/detail/sp/800-57-part-1/rev-5/final)
- [OpenCRE References to secrets](https://opencre.org/cre/223-780)

</div>
</div>

</section>
</div>

## Attribution

<div className="attributionFooter">

- Original: Secrets Management Cheat Sheet
- Source: https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html
- Copyright: Cheat Sheets Series Team
- License: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
- License URL: https://creativecommons.org/licenses/by-sa/4.0/
- Changes: English original retained for comparison. Japanese translation added. Bilingual display generated from official source and local Japanese translation.
- Retrieved: 2026-05-21

</div>
