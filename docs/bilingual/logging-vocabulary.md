---
title: Logging Vocabulary Cheat Sheet
hide_title: true
---

<div className="docHero" data-category="asvs-v16">
  <h1>ロギング語彙チートシート</h1>
  <div className="docMeta">
    <span className="docPill">最終更新: 2026-05-20</span>
    <span className="docPill">読了時間: 準備中</span>
    <span className="docPill">カテゴリ: セキュリティログとエラーハンドリング</span>
  </div>
</div>

<p className="docLead">ロギング語彙チートシートを、原文・翻訳・対比表示で確認できます。ASVS Index 対応の文脈で、公式原文と日本語訳を確認しやすく整理しています。</p>

<div className="tabbedContent">
  <input className="tabInput" type="radio" name="logging-vocabulary-view" id="logging-vocabulary-original" />
  <input className="tabInput" type="radio" name="logging-vocabulary-view" id="logging-vocabulary-translation" defaultChecked />
  <input className="tabInput" type="radio" name="logging-vocabulary-view" id="logging-vocabulary-bilingual" />

  <div className="contentTabs">
    <label htmlFor="logging-vocabulary-original" title="OWASP 原文">原文</label>
    <label htmlFor="logging-vocabulary-translation" title="日本語訳">翻訳</label>
    <label htmlFor="logging-vocabulary-bilingual" title="原文と翻訳を並べて確認">対比表示</label>
  </div>

<section id="logging-vocabulary-original-panel" className="tabPanel originalPanel contentPanel">

This document proposes a standard vocabulary for logging security events. The intent is to simplify monitoring and alerting such that, assuming developers trap errors and log them using this vocabulary, monitoring and alerting would be improved by simply keying on these terms.

## Overview

Each year IBM Security commissions the Ponemon Institute to survey companies around the world for information related to security breaches, mitigation, and the associated costs; the result is called the Cost of a Data Breach Report.

In addition to the millions of dollars lost due to breaches the report finds that the **mean time to identify** a breach continues to hover around **200 days**. Clearly our ability to monitor applications and alert on anomalous behavior would improve our time to identify and mitigate an attack against our applications.

![IBM Cost of Data Breach Report 2025](https://cheatsheetseries.owasp.org/assets/cost-of-breach-2025.png)

> IBM Cost of a Data Breach Study 2025, Fig.4, pg.12, [https://www.ibm.com/reports/data-breach]

This logging standard would seek to define specific keywords which, when applied consistently across software, would allow groups to simply monitor for these events terms across all applications and respond quickly in the event of attack.

## Assumptions

- Observability/SRE groups must support the use of this standard and encourage developers to use it
- Incident Response must either ingest this data OR provide a means by which other monitoring teams can send a notification of alert, preferably programmatically.
- Architects must support, adopt, and contribute to this standard
- Developers must embrace this standard and begin to implement (requires knowledge and intent to understand potential attacks and trap those errors in code).

## Getting Started

As a reminder, the goal of logging is to be able to alert on specific security events. Of course, the first step to logging these events is good error handling, if you're not trapping the events, you don't have an event to log.

### Identifying Events

In order to better understand security event logging a good high-level understanding of threat modeling would be helpful, even if it's a simple approach of:

1. **What could go wrong?**

- Orders: could someone order on behalf of another?
- Authentication: could I log in as someone else?
- Authorization: could I see someone else' account?

2. **What would happen if it did?**

- Orders: I've placed an order on behalf of another... to an abandoned warehouse in New Jersey. Oops.
- Then I bragged about it on 4Chan.
- Then I told the New York Times about it.

3. **Who might intend to do this?**

- Intentional attacks by hackers.
- An employee "testing" how things work.
- An API coded incorrectly doing things the author did not intend.

### Implementation

Some languages have libraries which ease the job of adopting this logging vocabulary in applications:

- Python: [lucabello/owasp-logger](https://github.com/lucabello/owasp-logger)
- C#/.NET: [byteguard-hq/byteguard-security-logger](https://github.com/ByteGuard-HQ/byteguard-security-logger)

## Format

_NOTE: All dates should be logged in [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) format **WITH** UTC offset to ensure maximum portability_

```
{
    "datetime": "2021-01-01T01:01:01-0700",
    "appid": "foobar.netportal_auth",
    "event": "AUTHN_login_success:joebob1",
    "level": "INFO",
    "description": "User joebob1 login successfully",
    "useragent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.108 Safari/537.36",
    "source_ip": "165.225.50.94",
    "host_ip": "10.12.7.9",
    "hostname": "portalauth.foobar.com",
    "protocol": "https",
    "port": "440",
    "request_uri": "/api/v2/auth/",
    "request_method": "POST",
    "region": "AWS-US-WEST-2",
    "geo": "USA"
}
```

## The Vocabulary

What follows are the various event types that should be captured. For each event type there is a prefix like "authn" and additional data that may be included for that event.

Portions of the full logging format are included for example, but a complete event log should follow the format above.

**Note on Data Privacy:**

All fields logged after event type should be considered optional. Businesses implementing this logging method should consider value of the fields being logged vs. responsibility as a data steward for the data logged. For example: logging user IP address may be useful for detection and response, but may be considered personally identifiable information when combined with other data and subject to regulation or deletion requests.

---

## Authentication [AUTHN]

### authn_login_success[:userid]

**Description**
All login events should be recorded including success.

**Level:**
INFO

**Example:**

```
{
    "datetime": "2019-01-01 00:00:00,000",
    "appid": "foobar.netportal_auth",
    "event": "authn_login_success:joebob1",
    "level": "INFO",
    "description": "User joebob1 login successfully",
    ...
}
```

---

### authn_login_successafterfail[:userid,retries]

**Description**
The user successfully logged in after previously failing.

**Level:**
INFO

**Example:**

```
{
    "datetime": "2019-01-01 00:00:00,000",
    "appid": "foobar.netportal_auth",
    "event": "authn_login_successafterfail:joebob1,2",
    "level": "INFO",
    "description": "User joebob1 login successfully",
    ...
}
```

---

### authn_login_fail[:userid]

**Description**
All login events should be recorded including failure.

**Level:**
WARN

**Example:**

```
{
    "datetime": "2019-01-01 00:00:00,000",
    "appid": "foobar.netportal_auth",
    "event": "authn_login_fail:joebob1",
    "level": "WARN",
    "description": "User joebob1 login failed",
    ...
}
```

---

### authn_login_fail_max[:userid,maxlimit(int)]

**Description**
All login events should be recorded including failure.

**Level:**
WARN

**Example:**

```
{
    "datetime": "2019-01-01 00:00:00,000",
    "appid": "foobar.netportal_auth",
    "event": "authn_login_fail_max:joebob1,3",
    "level": "WARN",
    "description": "User joebob1 reached the login fail limit of 3",
    ...
}
```

---

### authn_login_lock[:userid,reason]

**Description**
When the feature exists to lock an account after x retries or other condition, the lock should be logged with relevant data.

**Level:**
WARN

**Reasons:**

- maxretries: The maximum number of retries was reached
- suspicious: Suspicious activity was observed on the account
- customer: The customer requested their account be locked
- other: Other

**Example:**

```
{
    "datetime": "2019-01-01 00:00:00,000",
    "appid": "foobar.netportal_auth",
    "event": "authn_login_lock:joebob1,maxretries",
    "level": "WARN",
    "description": "User joebob1 login locked because maxretries exceeded",
    ...
}
```

---

### authn_password_change[:userid]

**Description**
Every password change should be logged, including the userid that it was for.

**Level:**
INFO

**Example:**

```
{
    "datetime": "2019-01-01 00:00:00,000",
    "appid": "foobar.netportal_auth",
    "event": "authn_password_change:joebob1",
    "level": "INFO",
    "description": "User joebob1 has successfully changed their password",
    ...
}
```

---

### authn_password_change_fail[:userid]

**Description**
An attempt to change a password that failed. May also trigger other events such as `authn_login_lock`.

**Level:**
CRITICAL

**Example:**

```
{
    "datetime": "2019-01-01 00:00:00,000",
    "appid": "foobar.netportal_auth",
    "event": "authn_password_change_fail:joebob1",
    "level": "CRITICAL",
    "description": "User joebob1 failed to change their password",
    ...
}
```

---

### authn_impossible_travel[:userid,region1,region2]

**Description**
When a user is logged in from one city and suddenly appears in another, too far away to have traveled in a reasonable timeframe, this often indicates a potential account takeover.

**Level:**: CRITICAL

**Example:**

```
{
    "datetime": "2019-01-01 00:00:00,000",
    "appid": "foobar.netportal_auth",
    "event": "authn_impossible_travel:joebob1,US-OR,CN-SH",
    "level": "CRITICAL",
    "description": "User joebob1 has accessed the application in two distant cities at the same time",
    ...
}
```

---

### authn_token_created[:userid, entitlement(s)]

**Description**
When a token is created for service access it should be recorded

**Level:**: INFO

**Example:**

```
{
    "datetime": "2019-01-01 00:00:00,000",
    "appid": "aws.foobar.com",
    "event": "authn_token_created:app.foobarapi.prod,create,read,update",
    "level": "INFO",
    "description": "A token has been created for app.foobarapi.prod with create,read,update",
    ...
}
```

---

### authn_token_revoked[:userid,tokenid]

**Description**
A token has been revoked for the given account.

**Level:**: INFO

**Example:**

```
{
    "datetime": "2019-01-01 00:00:00,000",
    "appid": "aws.foobar.com",
    "event": "authn_token_revoked:app.foobarapi.prod,xyz-abc-123-gfk",
    "level": "INFO",
    "description": "Token ID: xyz-abc-123-gfk was revoked for user app.foobarapi.prod",
    ...
}
```

---

### authn_token_reuse[:userid,tokenid]

**Description**
A previously revoked token was attempted to be reused.

**Level:**: CRITICAL

**Example:**

```
{
    "datetime": "2019-01-01 00:00:00,000",
    "appid": "aws.foobar.com",
    "event": "authn_token_reuse:app.foobarapi.prod,xyz-abc-123-gfk",
    "level": "CRITICAL",
    "description": "User app.foobarapi.prod attempted to use token ID: xyz-abc-123-gfk which was previously revoked",
    ...
}
```

---

### authn_token_delete[:appid]

**Description**
When a token is deleted it should be recorded

**Level:**: WARN

**Example:**

```
{
    "datetime": "2019-01-01 00:00:00,000",
    "appid": "foobar.netportal_auth",
    "event": "authn_token_delete:foobarapi",
    "level": "WARN",
    "description": "The token for foobarapi has been deleted",
    ...
}
```

---

## Authorization [AUTHZ]

---

### authz_fail[:userid,resource]

**Description**
An attempt was made to access a resource which was unauthorized

**Level:**: CRITICAL

**Example:**

```
{
    "datetime": "2019-01-01 00:00:00,000",
    "appid": "foobar.netportal_auth",
    "event": "authz_fail:joebob1,resource",
    "level": "CRITICAL",
    "description": "User joebob1 attempted to access a resource without entitlement",
    ...
}
```

---

### authz_change[:userid,from,to]

**Description**
The user or entity entitlements was changed

**Level:**: WARN

**Example:**

```
{
    "datetime": "2019-01-01 00:00:00,000",
    "appid": "foobar.netportal_auth",
    "event": "authz_change:joebob1,user,admin",
    "level": "WARN",
    "description": "User joebob1 access was changed from user to admin",
    ...
}
```

---

### authz_admin[:userid,event]

**Description**
All activity by privileged users such as admin should be recorded.

**Level:**: WARN

**Example:**

```
{
    "datetime": "2019-01-01 00:00:00,000",
    "appid": "foobar.netportal_auth",
    "event": "authz_admin:joebob1,user_privilege_change",
    "level": "WARN",
    "description": "Administrator joebob1 has updated privileges of user foobarapi from user to admin",
    ...
}
```

---

## Encryption/Decryption [CRYPT]

### crypt_decrypt_fail[userid]

**Description**
Failure to perform encryption and decryption could be simply due to a system error, or it may be related to authorization failures where a user lacks permissions on the related data.

**Level:**: WARN

**Example:**

```
{
    "datetime": "2019-01-01 00:00:00,000",
    "appid": "foobar.netportal_auth",
    "event": "crypt_decrypt_fail:joebob1",
    "level": "WARN",
    "description": "User joebob1 was unable to perform decryption" + err,
    ...
}
```

---

### crypt_encrypt_fail[userid]

**Description**
Failure to perform encryption and decryption could be simply due to a system error, or it may be related to authorization failures where a user lacks permissions on the related data.

**Level:**: WARN

**Example:**

```
{
    "datetime": "2019-01-01 00:00:00,000",
    "appid": "foobar.netportal_auth",
    "event": "crypt_encrypt_fail:joebob1",
    "level": "WARN",
    "description": "User joebob1 was unable to perform encryption" + err,
    ...
}
```

---

## Excessive Use [EXCESS]

### excess_rate_limit_exceeded[userid,max]

**Description**
Expected service limit ceilings should be established and alerted when exceeded, even if simply for managing costs and scaling.

**Level:**: WARN

**Example:**

```
{
    "datetime": "2019-01-01 00:00:00,000",
    "appid": "foobar.netportal_auth",
    "event": "excess_rate_limit_exceeded:app.foobarapi.prod,100000",
    "level": "WARN",
    "description": "User app.foobarapi.prod has exceeded max:100000 requests",
    ...
}
```

---

## File Upload [UPLOAD]

### upload_complete[userid,filename,type]

**Description**
On successful file upload the first step in the validation process is that the upload has completed.

**Level:**: INFO

**Example:**

```
    {
    "datetime": "2019-01-01 00:00:00,000",
    "appid": "foobar.netportal_auth",
    "event": "upload_complete:joebob1,user_generated_content.png,PNG",
    "level": "INFO",
    "description": "User joebob1 has uploaded user_generated_content.png",
    ...
}
```

---

### upload_stored[filename,from,to]

**Description**
One step in good file upload validation is to move/rename the file and when providing the content back to end users, never reference the original filename in the download. This is true both when storing in a filesystem as well as in block storage.

**Level:**: INFO

**Example:**

```
{
    "datetime": "2019-01-01 00:00:00,000",
    "appid": "foobar.netportal_auth",
    "event": "upload_stored:user_generated_content.png,kjsdhkrjhwijhsiuhdf000010202002",
    "level": "INFO",
    "description": "File user_generated_content.png was stored in the database with key abcdefghijk101010101",
    ...
}
```

---

### upload_validation[filename,(virusscan|imagemagick|...):(FAILED|incomplete|passed)]

**Description**
All file uploads should have some validation performed, both for correctness (is in fact of file type x), and for safety (does not contain a virus).

**Level:**: INFO|CRITICAL

**Example:**

```
{
    "datetime": "2019-01-01 00:00:00,000",
    "appid": "foobar.netportal_auth",
    "event": "upload_validation:filename,virusscan:FAILED",
    "level": "CRITICAL",
    "description": "File user_generated_content.png FAILED virus scan and was purged",
    ...
}
```

---

### upload_delete[userid,fileid]

**Description**
When a file is deleted for normal reasons it should be recorded.

**Level:**: INFO

**Example:**

```
{
    "datetime": "2019-01-01 00:00:00,000",
    "appid": "foobar.netportal_auth",
    "event": "upload_delete:joebob1,",
    "level": "INFO",
    "description": "User joebob1 has marked file abcdefghijk101010101 for deletion.",
    ...
}
```

---

## Input Validation [INPUT]

### input_validation_fail:[(fieldone,fieldtwo...),userid]

**Description**
When input validation fails on the server-side it must either be because a) sufficient validation was not provided on the client, or b) client-side validation was bypassed. In either case it's an opportunity for attack and should be mitigated quickly.

**Level:**
WARN

**Example:**

```
{
    "datetime": "2019-01-01 00:00:00,000",
    "appid": "foobar.netportal_auth",
    "event": "input_validation_fail:(zip,date_of_birth),joebob1",
    "level": "WARN",
    "description": "User joebob1 submitted data that failed validation.",
    ...
}
```

---

### input_validation_discrete_fail[:field,userid]

**Description**
When server-side validation of a value against a discrete list of options (e.g. drop down list, radio buttons) fails, it is a strong indication of malicious activity as this indicates the client-side code has been tampered with.

**Level:**
WARN

**Example:**

```json
{
    "datetime": "2021-02-01T08:30:00-0500",
    "appid": "foobar.netportal_auth",
    "event": "input_validation_discrete_fail:country,joebob1",
    "level": "WARN",
    "description": "User joebob1 submitted an invalid value for the 'country' field.",
    ...
}
```

---

## Malicious Behavior [MALICIOUS

### malicious_excess_404:[userid|IP,useragent]

**Description**
When a user makes numerous requests for files that don't exist it often is an indicator of attempts to "force-browse" for files that could exist and is often behavior indicating malicious intent.

**Level:**
WARN

**Example:**

```
{
    "datetime": "2019-01-01 00:00:00,000",
    "appid": "foobar.netportal_auth",
    "event": "malicious_excess404:123.456.789.101,M@l1c10us-Hax0rB0t0-v1",
    "level": "WARN",
    "description": "A user at 123.456.789.101 has generated a large number of 404 requests.",
    ...
}
```

---

### malicious_extraneous:[userid|IP,inputname,useragent]

**Description**
When a user submits data to a backend handler that was not expected it can indicate probing for input validation errors. If your backend service receives data it does not handle or have an input for this is an indication of likely malicious abuse.

**Level:**
CRITICAL

**Example:**

```
{
    "datetime": "2019-01-01 00:00:00,000",
    "appid": "foobar.netportal_auth",
    "event": "malicious_extraneous:dr@evil.com,creditcardnum,Mozilla/5.0 (X11; Linux x86_64; rv:10.0) Gecko/20100101 Firefox/10.0",
    "level": "CRITICAL",
    "description": "User dr@evil.com included field creditcardnum in the request which is not handled by this service.",
    ...
}
```

---

### malicious_attack_tool:[userid|IP,toolname,useragent]

**Description**
When obvious attack tools are identified either by signature or by user agent they should be logged.

For example, the tool "Nikto" leaves behind its user agent by default with a string like **_"Mozilla/5.00 (Nikto/2.1.6) (Evasions:None) (Test:Port Check)"_**

**Level:**
CRITICAL

**Example:**

```
{
    "datetime": "2019-01-01 00:00:00,000",
    "appid": "foobar.netportal_auth",
    "event": "malicious_attack_tool:127.0.0.1,nikto,Mozilla/5.00 (Nikto/2.1.6) (Evasions:None) (Test:Port Check)",
    "level": "CRITICAL",
    "description": "Attack traffic indicating use of Nikto coming from 127.0.0.1",
    ...
}
```

---

### malicious_sqli:[userid|IP,parameter,ruleid,useragent]

**Description**
When request input matches a SQL injection (SQLi) signature or heuristic (e.g., comment delimiters, tautologies like `' OR 1=1 --`, stacked queries, `UNION SELECT`, etc.), block the request and log the attempt.

_NOTE: Logging the payload is dangerous and may result in log injection. Prefer recording a detection rule ID / category and the parameter name over logging the full payload._

**Level:**
CRITICAL

**Example:**

```
{
    "datetime": "2019-01-01 00:00:00,000",
    "appid": "foobar.netportal_auth",
    "event": "malicious_sqli:127.0.0.1,search,SQLI-UNION,Mozilla/5.0 (X11; Linux x86_64; rv:10.0) Gecko/20100101 Firefox/10.0",
    "level": "CRITICAL",
    "description": "Request from 127.0.0.1 contained a SQL injection pattern (rule SQLI-UNION) in parameter 'search'.",
    ...
}
```

---

### malicious_cors:[userid|IP,useragent,referer]

**Description**
When attempts are made from unauthorized origins they should of course be blocked, but also logged whenever possible. Even if we block an illegal cross-origin request the fact that the request is being made could be an indication of attack.

_NOTE: Did you know that the word "referer" is misspelled in the original HTTP specification? The correct spelling should be "referrer" but the original typo persists to this day and is used here intentionally._

**Level:**
CRITICAL

**Example:**

```
{
    "datetime": "2019-01-01 00:00:00,000",
    "appid": "foobar.netportal_auth",
    "event": "malicious_cors:127.0.0.1,Mozilla/5.0 (X11; Linux x86_64; rv:10.0) Gecko/20100101 Firefox/10.0,attack.evil.com",
    "level": "CRITICAL",
    "description": "An illegal cross-origin request from 127.0.0.1 was referred from attack.evil.com"
    ...
}
```

---

### malicious_direct_reference:[userid|IP, useragent]

**Description**
A common attack against authentication and authorization is to directly access an object without credentials or appropriate access authority. Failing to prevent this flaw used to be one of the OWASP Top Ten called **Insecure Direct Object Reference**. Assuming you've correctly prevented this attack, logging the attempt is valuable to identify malicious users.

**Level:**
CRITICAL

**Example:**

```
{
    "datetime": "2019-01-01 00:00:00,000",
    "appid": "foobar.netportal_auth",
    "event": "malicious_direct_reference:joebob1, Mozilla/5.0 (X11; Linux x86_64; rv:10.0) Gecko/20100101 Firefox/10.0",
    "level": "CRITICAL",
    "description": "User joebob1 attempted to access an object to which they are not authorized",
    ...
}
```

---

## MCP Servers [MCP]

This section focuses on concerns related to the use of MCP servers either within productivity applications, or at the enterprise level.

---

### mcp_prompt_injection[:userid]

**Description**
When an MCP client or server detects indicators of prompt injection (for example, instructions to ignore system/developer messages, attempts to override tool policies, requests to reveal secrets, or attempts to coerce tool calls outside of the intended task), block or constrain the action and log the event for investigation.

_NOTE: Avoid logging the full prompt/tool I/O. Prefer logging a detection category or rule ID, the target tool/server, and request identifiers to support triage without creating a secondary sensitive-data or log-injection risk._

**Level:**
WARN

**Example:**

```
{
    "datetime": "2019-01-01 00:00:00,000",
    "appid": "foobar.cooldevapp_mcp_toolname",
    "event": "mcp_prompt_injection:joebob1",
    "level": "WARN",
    "description": "A possible prompt injection has occurred",
    ...
}
```

---

### mcp_resource_exhaustion[:userid]

**Description**
When an MCP client or server detects a request pattern intended to exhaust resources (for example, unusually large prompts, repeated retries, tool-call loops, or other behavior that drives excessive token usage and cost), terminate or throttle the activity and log the attempt.

_NOTE: Avoid logging full prompts or tool inputs/outputs. Prefer logging measured usage (tokens in/out), policy thresholds, request identifiers, and the tool/model involved._

**Level:**
WARN

**Example:**

```
{
    "datetime": "2019-01-01 00:00:00,000",
    "appid": "foobar.cooldevapp_mcp_toolname",
    "event": "mcp_resource_exhaustion:joebob1",
    "level": "WARN",
    "description": "Request blocked due to token budget overrun (tokens_in=18240, tokens_out=0, budget=8000)",
    ...
}
```

---

### mcp_tool_poisoning[:userid]

**Description**
When an MCP client or server detects that a tool may be malicious or tampered with (for example, unexpected tool changes, signature/hash verification failures, suspicious tool metadata, or a tool sourced from an agent/tool marketplace with minimal validation), block or quarantine the tool and log the attempt.

_NOTE: Tool ecosystems and agent marketplaces can enable rapid proliferation of third-party tools with relatively low validation. An internal marketplace or hashed allowlist for approved tools is highly recommended._

**Level:**
WARN

**Example:**

```
{
    "datetime": "2019-01-01 00:00:00,000",
    "appid": "foobar.cooldevapp_mcp_toolname",
    "event": "mcp_tool_poisoning:joebob1",
    "level": "WARN",
    "description": "Tool execution blocked (tool=\"calendar_sync\", source=\"https://marketplace.example/tools/calendar_sync\", version=\"2.4.1\", signature=\"missing\", policy=\"allowlist_required\")",
    ...
}
```

---

## Privilege Changes [PRIVILEGE]

This section focuses on object privilege changes such as read/write/execute permissions or objects in a database having authorization meta-information changed.

Changes to user/account are covered in the User Management section.

---

### privilege_permissions_changed:[userid,file|object,fromlevel,tolevel]

**Description**
Tracking changes to objects to which there are access control restrictions can uncover attempt to escalate privilege on those files by unauthorized users.

**Level:**
WARN

**Example:**

```
{
    "datetime": "2019-01-01 00:00:00,000",
    "appid": "foobar.netportal_auth",
    "event": "permissions_changed:joebob1, /users/admin/some/important/path,0511,0777",
    "level": "WARN",
    "description": "User joebob1 changed permissions on /users/admin/some/important/path",
    ...
}
```

---

## Sensitive Data Changes [DATA]

It's not necessary to log or alert on changes to all files, but in the case of highly sensitive files or data it is important that we monitor and alert on changes.

---

### sensitive_create:[userid,file|object]

**Description**
When a new piece of data is created and marked as sensitive or placed into a directory/table/repository where sensitive data is stored, that creation should be logged and reviewed periodically.

**Level:**
WARN

**Example:**

```
{
    "datetime": "2019-01-01 00:00:00,000",
    "appid": "foobar.netportal_auth",
    "event": "sensitive_create:joebob1, /users/admin/some/important/path",
    "level": "WARN",
    "description": "User joebob1 created a new file in /users/admin/some/important/path",
    ...
}
```

---

### sensitive_read:[userid,file|object]

**Description**
All data marked as sensitive or placed into a directory/table/repository where sensitive data is stored should be have access logged and reviewed periodically.

**Level:**
WARN

**Example:**

```
{
    "datetime": "2019-01-01 00:00:00,000",
    "appid": "foobar.netportal_auth",
    "event": "sensitive_read:joebob1, /users/admin/some/important/path",
    "level": "WARN",
    "description": "User joebob1 read file /users/admin/some/important/path",
    ...
}
```

---

### sensitive_update:[userid,file|object]

**Description**
All data marked as sensitive or placed into a directory/table/repository where sensitive data is stored should be have updates to the data logged and reviewed periodically.

**Level:**
WARN

**Example:**

```
{
    "datetime": "2019-01-01 00:00:00,000",
    "appid": "foobar.netportal_auth",
    "event": "sensitive_update:joebob1, /users/admin/some/important/path",
    "level": "WARN",
    "description": "User joebob1 modified file /users/admin/some/important/path",
    ...
}
```

---

### sensitive_delete:[userid,file|object]

**Description**
All data marked as sensitive or placed into a directory/table/repository where sensitive data is stored should have deletions of the data logged and reviewed periodically. The file should not be immediately deleted but marked for deletion and an archive of the file should be maintained according to legal/privacy requirements.

**Level:**
WARN

**Example:**

```
{
    "datetime": "2019-01-01 00:00:00,000",
    "appid": "foobar.netportal_auth",
    "event": "sensitive_delete:joebob1, /users/admin/some/important/path",
    "level": "WARN",
    "description": "User joebob1 marked file /users/admin/some/important/path for deletion",
    ...
}
```

---

## Sequence Errors [SEQUENCE]

Also called a **_business logic attack_**, if a specific path is expected through a system and an attempt is made to skip or change the order of that path it could indicate malicious intent.

---

### sequence_fail:[userid]

**Description**
When a user reaches a part of the application out of sequence it may indicate intentional abuse of the business logic and should be tracked.

**Level:**
CRITICAL

**Example:**

```
{
    "datetime": "2019-01-01 00:00:00,000",
    "appid": "foobar.netportal_auth",
    "event": "sequence_fail:joebob1",
    "level": "CRITICAL",
    "description": "User joebob1 has reached a part of the application out of the normal application flow.",
    ...
}
```

---

## Session Management [SESSION]

### session_created:[userid]

**Description**
When a new authenticated session is created that session may be logged and activity monitored.

**Level:**
INFO

**Example:**

```
    {
    "datetime": "2019-01-01 00:00:00,000",
    "appid": "foobar.netportal_auth",
    "event": "session_created:joebob1",
    "level": "INFO",
    "description": "User joebob1 has started a new session",
    ...
}
```

---

### session_renewed:[userid]

**Description**
When a user is warned of session to be expired/revoked and chooses to extend their session that activity should be logged. Also, if the system in question contains highly confidential data then extending a session may require additional verification.

**Level:**
INFO

**Example:**

```
{
    "datetime": "2019-01-01 00:00:00,000",
    "appid": "foobar.netportal_auth",
    "event": "session_renewed:joebob1",
    "level": "INFO",
    "description": "User joebob1 was warned of expiring session and extended.",
    ...
}
```

---

### session_expired:[userid,reason]

**Description**
When a session expires, especially in the case of an authenticated session or with sensitive data, then that session expiry may be logged and clarifying data included. The reason code may be any such as: logout, timeout, revoked, etc. Sessions should never be deleted but rather expired in the case of revocation requirement.

**Level:**
INFO

**Example:**

```
{
    "datetime": "2019-01-01 00:00:00,000",
    "appid": "foobar.netportal_auth",
    "event": "session_expired:joebob1,revoked",
    "level": "INFO",
    "description": "User joebob1 session expired due to administrator revocation.",
    ...
}
```

---

### session_use_after_expire:[userid]

**Description**
In the case a user attempts to access systems with an expire session it may be helpful to log, especially if combined with subsequent login failure. This could identify a case where a malicious user is attempting a session hijack or directly accessing another person's machine/browser.

**Level:**
CRITICAL

**Example:**

```
{
    "datetime": "2019-01-01 00:00:00,000",
    "appid": "foobar.netportal_auth",
    "event": "session_use_after_expire:joebob1",
    "level": "CRITICAL",
    "description": "User joebob1 attempted access after session expired.",
    ...
}
```

---

## System Events [SYS]

### sys_startup:[userid]

**Description**
When a system is first started it can be valuable to log the startup, even if the system is serverless or a container, especially if possible to log the user that initiated the system.

**Level:**
WARN

**Example:**

```
{
    "datetime": "2019-01-01 00:00:00,000",
    "appid": "foobar.netportal_auth",
    "event": "sys_startup:joebob1",
    "level": "WARN",
    "description": "User joebob1 spawned a new instance",
    ...
}
```

---

### sys_shutdown:[userid]

**Description**
When a system is shut down it can be valuable to log the event, even if the system is serverless or a container, especially if possible to log the user that initiated the system.

**Level:**
WARN

**Example:**

```
{
    "datetime": "2019-01-01 00:00:00,000",
    "appid": "foobar.netportal_auth",
    "event": "sys_shutdown:joebob1",
    "level": "WARN",
    "description": "User joebob1 stopped this instance",
    ...
}
```

---

### sys_restart:[userid]

**Description**
When a system is restarted it can be valuable to log the event, even if the system is serverless or a container, especially if possible to log the user that initiated the system.

**Level:**
WARN

**Example:**

```
{
    "datetime": "2019-01-01 00:00:00,000",
    "appid": "foobar.netportal_auth",
    "event": "sys_restart:joebob1",
    "level": "WARN",
    "description": "User joebob1 initiated a restart",
    ...
}
```

---

### sys_crash[:reason]

**Description**
If possible to catch an unstable condition resulting in the crash of a system, logging that event could be helpful, especially if the event is triggered by an attack.

**Level:**
WARN

**Example:**

```
{
    "datetime": "2019-01-01 00:00:00,000",
    "appid": "foobar.netportal_auth",
    "event": "sys_crash:outofmemory,
    "level": "WARN",
    "description": "The system crashed due to Out of Memory error.",
    ...
}
```

---

### sys_monitor_disabled:[userid,monitor]

**Description**
If your systems contain agents responsible for file integrity, resources, logging, virus, etc. it is especially valuable to know if they are halted and by whom.

**Level:**
WARN

**Example:**

```
{
    "datetime": "2019-01-01 00:00:00,000",
    "appid": "foobar.netportal_auth",
    "event": "sys_monitor_disabled:joebob1,crowdstrike",
    "level": "WARN",
    "description": "User joebob1 has disabled CrowdStrike",
    ...
}
```

---

### sys_monitor_enabled:[userid,monitor]

**Description**
If your systems contain agents responsible for file integrity, resources, logging, virus, etc. it is especially valuable to know if they are started again after being stopped, and by whom.

**Level:**
WARN

**Example:**

```
{
    "datetime": "2019-01-01 00:00:00,000",
    "appid": "foobar.netportal_auth",
    "event": "sys_monitor_enabled:joebob1,crowdstrike",
    "level": "WARN",
    "description": "User joebob1 has enabled CrowdStrike",
    ...
}
```

---

## User Management [USER]

### user_created:[userid,newuserid,attributes[one,two,three]]

**Description**
When creating new users, logging the specifics of the user creation event is helpful, especially if new users can be created with administration privileges.

**Level:**
WARN

**Example:**

```
{
    "datetime": "2019-01-01 00:00:00,000",
    "appid": "foobar.netportal_auth",
    "event": "user_created:joebob1,user1,admin:create,update,delete",
    "level": "WARN",
    "description": "User joebob1 created user1 with admin:create,update,delete privilege attributes",
    ...
}
```

---

### user_updated:[userid,onuserid,attributes[one,two,three]]

**Description**
When updating users, logging the specifics of the user update event is helpful, especially if users can be updated with administration privileges.

**Level:**
WARN

**Example:**

```
{
    "datetime": "2019-01-01 00:00:00,000",
    "appid": "foobar.netportal_auth",
    "event": "user_updated:joebob1,user1,admin:create,update,delete",
    "level": "WARN",
    "description": "User joebob1 updated user1 with attributes admin:create,update,delete privilege attributes",
    ...
}
```

---

### user_archived:[userid,onuserid]

**Description**
It is always best to archive users rather than deleting, except where required. When archiving users, logging the specifics of the user archive event is helpful. A malicious user could use this feature to deny service to legitimate users.

**Level:**
WARN

**Example:**

```
{
    "datetime": "2019-01-01 00:00:00,000",
    "appid": "foobar.netportal_auth",
    "event": "user_archived:joebob1,user1",
    "level": "WARN",
    "description": "User joebob1 archived user1",
    ...
}
```

---

### user_deleted:[userid,onuserid]

**Description**
It is always best to archive users rather than deleting, except where required. When deleting users, logging the specifics of the user delete event is helpful. A malicious user could use this feature to deny service to legitimate users.

**Level:**
WARN

**Example:**

```
{
    "datetime": "2019-01-01 00:00:00,000",
    "appid": "foobar.netportal_auth",
    "event": "user_deleted:joebob1,user1",
    "level": "WARN",
    "description": "User joebob1 has deleted user1",
    ...
}
```

---

## Exclusions

As important as what you DO log is what you DON'T log. Private or secret information, source code, keys, certs, etc. should never be logged.

For comprehensive overview of items that should be excluded from logging, please see the [OWASP Logging Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html#data-to-exclude).

</section>

<section id="logging-vocabulary-translation-panel" className="tabPanel translationPanel contentPanel">

この文書は、セキュリティイベントをロギングするための標準語彙を提案します。その目的は、開発者がエラーを捕捉し、この語彙を使ってログに記録するという前提で、これらの用語をキーにするだけで監視とアラートを改善できるようにすることです。

## 概要

IBM Security は毎年 Ponemon Institute に委託し、世界中の企業を対象に、セキュリティ侵害、緩和策、関連コストに関する調査を実施しています。その結果は Cost of a Data Breach Report と呼ばれます。

侵害によって数百万ドル規模の損失が発生するだけでなく、このレポートでは、侵害を識別するまでの平均時間 (**mean time to identify**) が引き続き約 **200 日** 付近で推移していることが示されています。アプリケーションを監視し、異常な振る舞いに対してアラートを出す能力を高めれば、アプリケーションに対する攻撃を識別し、緩和するまでの時間を短縮できることは明らかです。

![IBM Cost of Data Breach Report 2025](https://cheatsheetseries.owasp.org/assets/cost-of-breach-2025.png)

> IBM Cost of a Data Breach Study 2025, Fig.4, pg.12, [https://www.ibm.com/reports/data-breach]

このロギング標準は、ソフトウェア全体で一貫して適用されたときに、各グループがすべてのアプリケーション横断でこれらのイベント用語を単純に監視し、攻撃発生時に迅速に対応できるような、具体的なキーワードを定義しようとするものです。

## 前提

- Observability/SRE グループは、この標準の利用をサポートし、開発者に利用を促す必要があります。
- インシデント対応チームは、このデータを取り込むか、他の監視チームがアラート通知を送信できる手段を提供する必要があります。可能であればプログラムから送信できることが望まれます。
- アーキテクトは、この標準をサポートし、採用し、貢献する必要があります。
- 開発者は、この標準を受け入れ、実装を始める必要があります。これには、潜在的な攻撃を理解し、そのエラーをコードで捕捉するための知識と意図が必要です。

## はじめに

念のため確認すると、ロギングの目標は、特定のセキュリティイベントに対してアラートを出せるようにすることです。もちろん、これらのイベントをログに記録する最初のステップは適切なエラーハンドリングです。イベントを捕捉していなければ、ログに記録するイベントも存在しません。

### イベントの特定

セキュリティイベントのロギングをよりよく理解するには、次のような単純なアプローチであっても、脅威モデリングを大まかに理解していると役立ちます。

1. **何が問題になり得るか。**

- 注文: 誰かが他人の代わりに注文できるか。
- 認証: 自分が他人としてログインできるか。
- 認可: 他人のアカウントを閲覧できるか。

2. **それが起きた場合、何が発生するか。**

- 注文: 他人の代わりに、ニュージャージー州の放棄された倉庫宛てに注文してしまった。しまった。
- その後、それを 4Chan で自慢した。
- その後、それを New York Times に伝えた。

3. **誰がこれを意図する可能性があるか。**

- 攻撃者による意図的な攻撃。
- 仕組みを「テスト」している従業員。
- 作成者が意図しないことを行う、誤って実装された API。

### 実装

一部の言語には、アプリケーションでこのロギング語彙を採用しやすくするライブラリがあります。

- Python: [lucabello/owasp-logger](https://github.com/lucabello/owasp-logger)
- C#/.NET: [byteguard-hq/byteguard-security-logger](https://github.com/ByteGuard-HQ/byteguard-security-logger)

## 形式

_注: 最大限の移植性を確保するため、すべての日付は UTC オフセット **付き** の [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) 形式でログに記録するべきです。_

```
{
    "datetime": "2021-01-01T01:01:01-0700",
    "appid": "foobar.netportal_auth",
    "event": "AUTHN_login_success:joebob1",
    "level": "INFO",
    "description": "User joebob1 login successfully",
    "useragent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.108 Safari/537.36",
    "source_ip": "165.225.50.94",
    "host_ip": "10.12.7.9",
    "hostname": "portalauth.foobar.com",
    "protocol": "https",
    "port": "440",
    "request_uri": "/api/v2/auth/",
    "request_method": "POST",
    "region": "AWS-US-WEST-2",
    "geo": "USA"
}
```

## 語彙

以下は、捕捉するべきさまざまなイベントタイプです。各イベントタイプには `authn` のような接頭辞があり、そのイベントに含められる追加データがあります。

例では完全なロギング形式の一部だけを示していますが、完全なイベントログは上記の形式に従うべきです。

**データプライバシーに関する注記:**

イベントタイプの後にログに記録されるすべてのフィールドは任意と考えるべきです。このロギング手法を実装する事業者は、ログに記録するフィールドの価値と、ログに記録されるデータの管理者としての責任を比較検討するべきです。たとえば、ユーザーの IP アドレスをログに記録することは検知と対応には有用かもしれませんが、他のデータと組み合わさると個人を識別可能な情報と見なされ、規制や削除要求の対象になる場合があります。

---

## 認証 [AUTHN]

### authn_login_success[:userid]

**説明**
成功を含むすべてのログインイベントを記録するべきです。

**レベル:**
INFO

**例:**

```
{
    "datetime": "2019-01-01 00:00:00,000",
    "appid": "foobar.netportal_auth",
    "event": "authn_login_success:joebob1",
    "level": "INFO",
    "description": "User joebob1 login successfully",
    ...
}
```

---

### authn_login_successafterfail[:userid,retries]

**説明**
ユーザーが以前に失敗した後で正常にログインしました。

**レベル:**
INFO

**例:**

```
{
    "datetime": "2019-01-01 00:00:00,000",
    "appid": "foobar.netportal_auth",
    "event": "authn_login_successafterfail:joebob1,2",
    "level": "INFO",
    "description": "User joebob1 login successfully",
    ...
}
```

---

### authn_login_fail[:userid]

**説明**
失敗を含むすべてのログインイベントを記録するべきです。

**レベル:**
WARN

**例:**

```
{
    "datetime": "2019-01-01 00:00:00,000",
    "appid": "foobar.netportal_auth",
    "event": "authn_login_fail:joebob1",
    "level": "WARN",
    "description": "User joebob1 login failed",
    ...
}
```

---

### authn_login_fail_max[:userid,maxlimit(int)]

**説明**
失敗を含むすべてのログインイベントを記録するべきです。

**レベル:**
WARN

**例:**

```
{
    "datetime": "2019-01-01 00:00:00,000",
    "appid": "foobar.netportal_auth",
    "event": "authn_login_fail_max:joebob1,3",
    "level": "WARN",
    "description": "User joebob1 reached the login fail limit of 3",
    ...
}
```

---

### authn_login_lock[:userid,reason]

**説明**
一定回数の再試行やその他の条件の後にアカウントをロックする機能がある場合、そのロックは関連データとともにログに記録するべきです。

**レベル:**
WARN

**理由:**

- maxretries: 最大再試行回数に達しました。
- suspicious: アカウント上で疑わしいアクティビティが観測されました。
- customer: 顧客がアカウントのロックを要求しました。
- other: その他。

**例:**

```
{
    "datetime": "2019-01-01 00:00:00,000",
    "appid": "foobar.netportal_auth",
    "event": "authn_login_lock:joebob1,maxretries",
    "level": "WARN",
    "description": "User joebob1 login locked because maxretries exceeded",
    ...
}
```

---

### authn_password_change[:userid]

**説明**
すべてのパスワード変更は、その対象となった userid を含めてログに記録するべきです。

**レベル:**
INFO

**例:**

```
{
    "datetime": "2019-01-01 00:00:00,000",
    "appid": "foobar.netportal_auth",
    "event": "authn_password_change:joebob1",
    "level": "INFO",
    "description": "User joebob1 has successfully changed their password",
    ...
}
```

---

### authn_password_change_fail[:userid]

**説明**
失敗したパスワード変更の試行です。`authn_login_lock` など、他のイベントもトリガーする可能性があります。

**レベル:**
CRITICAL

**例:**

```
{
    "datetime": "2019-01-01 00:00:00,000",
    "appid": "foobar.netportal_auth",
    "event": "authn_password_change_fail:joebob1",
    "level": "CRITICAL",
    "description": "User joebob1 failed to change their password",
    ...
}
```

---

### authn_impossible_travel[:userid,region1,region2]

**説明**
ユーザーがある都市からログインしており、合理的な時間内には移動できないほど遠い別の都市に突然現れた場合、多くの場合、アカウント乗っ取りの可能性を示します。

**レベル:**: CRITICAL

**例:**

```
{
    "datetime": "2019-01-01 00:00:00,000",
    "appid": "foobar.netportal_auth",
    "event": "authn_impossible_travel:joebob1,US-OR,CN-SH",
    "level": "CRITICAL",
    "description": "User joebob1 has accessed the application in two distant cities at the same time",
    ...
}
```

---

### authn_token_created[:userid, entitlement(s)]

**説明**
サービスアクセス用のトークンが作成された場合、それを記録するべきです。

**レベル:**: INFO

**例:**

```
{
    "datetime": "2019-01-01 00:00:00,000",
    "appid": "aws.foobar.com",
    "event": "authn_token_created:app.foobarapi.prod,create,read,update",
    "level": "INFO",
    "description": "A token has been created for app.foobarapi.prod with create,read,update",
    ...
}
```

---

### authn_token_revoked[:userid,tokenid]

**説明**
指定されたアカウントのトークンが失効されました。

**レベル:**: INFO

**例:**

```
{
    "datetime": "2019-01-01 00:00:00,000",
    "appid": "aws.foobar.com",
    "event": "authn_token_revoked:app.foobarapi.prod,xyz-abc-123-gfk",
    "level": "INFO",
    "description": "Token ID: xyz-abc-123-gfk was revoked for user app.foobarapi.prod",
    ...
}
```

---

### authn_token_reuse[:userid,tokenid]

**説明**
以前に失効されたトークンが再利用されようとしました。

**レベル:**: CRITICAL

**例:**

```
{
    "datetime": "2019-01-01 00:00:00,000",
    "appid": "aws.foobar.com",
    "event": "authn_token_reuse:app.foobarapi.prod,xyz-abc-123-gfk",
    "level": "CRITICAL",
    "description": "User app.foobarapi.prod attempted to use token ID: xyz-abc-123-gfk which was previously revoked",
    ...
}
```

---

### authn_token_delete[:appid]

**説明**
トークンが削除された場合、それを記録するべきです。

**レベル:**: WARN

**例:**

```
{
    "datetime": "2019-01-01 00:00:00,000",
    "appid": "foobar.netportal_auth",
    "event": "authn_token_delete:foobarapi",
    "level": "WARN",
    "description": "The token for foobarapi has been deleted",
    ...
}
```

---

## 認可 [AUTHZ]

---

### authz_fail[:userid,resource]

**説明**
認可されていないリソースにアクセスする試行が行われました。

**レベル:**: CRITICAL

**例:**

```
{
    "datetime": "2019-01-01 00:00:00,000",
    "appid": "foobar.netportal_auth",
    "event": "authz_fail:joebob1,resource",
    "level": "CRITICAL",
    "description": "User joebob1 attempted to access a resource without entitlement",
    ...
}
```

---

### authz_change[:userid,from,to]

**説明**
ユーザーまたはエンティティの権限 (entitlements) が変更されました。

**レベル:**: WARN

**例:**

```
{
    "datetime": "2019-01-01 00:00:00,000",
    "appid": "foobar.netportal_auth",
    "event": "authz_change:joebob1,user,admin",
    "level": "WARN",
    "description": "User joebob1 access was changed from user to admin",
    ...
}
```

---

### authz_admin[:userid,event]

**説明**
管理者などの特権ユーザーによるすべてのアクティビティを記録するべきです。

**レベル:**: WARN

**例:**

```
{
    "datetime": "2019-01-01 00:00:00,000",
    "appid": "foobar.netportal_auth",
    "event": "authz_admin:joebob1,user_privilege_change",
    "level": "WARN",
    "description": "Administrator joebob1 has updated privileges of user foobarapi from user to admin",
    ...
}
```

---

## 暗号化/復号 [CRYPT]

### crypt_decrypt_fail[userid]

**説明**
暗号化や復号の実行失敗は、単純なシステムエラーである場合もあれば、ユーザーが関連データに対する権限を持たないという認可失敗に関連している場合もあります。

**レベル:**: WARN

**例:**

```
{
    "datetime": "2019-01-01 00:00:00,000",
    "appid": "foobar.netportal_auth",
    "event": "crypt_decrypt_fail:joebob1",
    "level": "WARN",
    "description": "User joebob1 was unable to perform decryption" + err,
    ...
}
```

---

### crypt_encrypt_fail[userid]

**説明**
暗号化や復号の実行失敗は、単純なシステムエラーである場合もあれば、ユーザーが関連データに対する権限を持たないという認可失敗に関連している場合もあります。

**レベル:**: WARN

**例:**

```
{
    "datetime": "2019-01-01 00:00:00,000",
    "appid": "foobar.netportal_auth",
    "event": "crypt_encrypt_fail:joebob1",
    "level": "WARN",
    "description": "User joebob1 was unable to perform encryption" + err,
    ...
}
```

---

## 過剰利用 [EXCESS]

### excess_rate_limit_exceeded[userid,max]

**説明**
想定されるサービス制限の上限を設定し、それを超過した場合は、単にコストやスケーリングを管理する目的であっても、アラートを出すべきです。

**レベル:**: WARN

**例:**

```
{
    "datetime": "2019-01-01 00:00:00,000",
    "appid": "foobar.netportal_auth",
    "event": "excess_rate_limit_exceeded:app.foobarapi.prod,100000",
    "level": "WARN",
    "description": "User app.foobarapi.prod has exceeded max:100000 requests",
    ...
}
```

---

## ファイルアップロード [UPLOAD]

### upload_complete[userid,filename,type]

**説明**
ファイルアップロードが成功した場合、検証プロセスの最初のステップはアップロードが完了したことです。

**レベル:**: INFO

**例:**

```
    {
    "datetime": "2019-01-01 00:00:00,000",
    "appid": "foobar.netportal_auth",
    "event": "upload_complete:joebob1,user_generated_content.png,PNG",
    "level": "INFO",
    "description": "User joebob1 has uploaded user_generated_content.png",
    ...
}
```

---

### upload_stored[filename,from,to]

**説明**
適切なファイルアップロード検証の一つのステップは、ファイルを移動またはリネームし、コンテンツをエンドユーザーに返す際に、ダウンロードで元のファイル名を参照しないことです。これはファイルシステムに保存する場合にも、ブロックストレージに保存する場合にも当てはまります。

**レベル:**: INFO

**例:**

```
{
    "datetime": "2019-01-01 00:00:00,000",
    "appid": "foobar.netportal_auth",
    "event": "upload_stored:user_generated_content.png,kjsdhkrjhwijhsiuhdf000010202002",
    "level": "INFO",
    "description": "File user_generated_content.png was stored in the database with key abcdefghijk101010101",
    ...
}
```

---

### upload_validation[filename,(virusscan|imagemagick|...):(FAILED|incomplete|passed)]

**説明**
すべてのファイルアップロードには、正しさ (実際にファイルタイプ x であるか) と安全性 (ウイルスを含まないか) の両方について、何らかの検証を実施するべきです。

**レベル:**: INFO|CRITICAL

**例:**

```
{
    "datetime": "2019-01-01 00:00:00,000",
    "appid": "foobar.netportal_auth",
    "event": "upload_validation:filename,virusscan:FAILED",
    "level": "CRITICAL",
    "description": "File user_generated_content.png FAILED virus scan and was purged",
    ...
}
```

---

### upload_delete[userid,fileid]

**説明**
通常の理由でファイルが削除された場合、それを記録するべきです。

**レベル:**: INFO

**例:**

```
{
    "datetime": "2019-01-01 00:00:00,000",
    "appid": "foobar.netportal_auth",
    "event": "upload_delete:joebob1,",
    "level": "INFO",
    "description": "User joebob1 has marked file abcdefghijk101010101 for deletion.",
    ...
}
```

---

## 入力検証 [INPUT]

### input_validation_fail:[(fieldone,fieldtwo...),userid]

**説明**
サーバー側で入力検証が失敗する場合、その原因は a) クライアントで十分な検証が提供されていない、または b) クライアント側検証が迂回された、のどちらかであるはずです。いずれの場合も攻撃の機会であり、迅速に緩和するべきです。

**レベル:**
WARN

**例:**

```
{
    "datetime": "2019-01-01 00:00:00,000",
    "appid": "foobar.netportal_auth",
    "event": "input_validation_fail:(zip,date_of_birth),joebob1",
    "level": "WARN",
    "description": "User joebob1 submitted data that failed validation.",
    ...
}
```

---

### input_validation_discrete_fail[:field,userid]

**説明**
離散的な選択肢リスト (ドロップダウンリスト、ラジオボタンなど) に対する値のサーバー側検証が失敗する場合、クライアント側コードが改ざんされたことを示すため、悪意ある活動の強い兆候です。

**レベル:**
WARN

**例:**

```json
{
    "datetime": "2021-02-01T08:30:00-0500",
    "appid": "foobar.netportal_auth",
    "event": "input_validation_discrete_fail:country,joebob1",
    "level": "WARN",
    "description": "User joebob1 submitted an invalid value for the 'country' field.",
    ...
}
```

---

## 悪意ある振る舞い [MALICIOUS

### malicious_excess_404:[userid|IP,useragent]

**説明**
ユーザーが存在しないファイルに対して多数のリクエストを行う場合、それは存在する可能性のあるファイルを「force-browse」しようとする試みの指標であることが多く、悪意ある意図を示す振る舞いであることがよくあります。

**レベル:**
WARN

**例:**

```
{
    "datetime": "2019-01-01 00:00:00,000",
    "appid": "foobar.netportal_auth",
    "event": "malicious_excess404:123.456.789.101,M@l1c10us-Hax0rB0t0-v1",
    "level": "WARN",
    "description": "A user at 123.456.789.101 has generated a large number of 404 requests.",
    ...
}
```

---

### malicious_extraneous:[userid|IP,inputname,useragent]

**説明**
ユーザーがバックエンドハンドラーに想定外のデータを送信する場合、入力検証エラーを探る行為を示す可能性があります。バックエンドサービスが処理しない、または入力として持たないデータを受け取る場合、それは悪意ある悪用の可能性を示します。

**レベル:**
CRITICAL

**例:**

```
{
    "datetime": "2019-01-01 00:00:00,000",
    "appid": "foobar.netportal_auth",
    "event": "malicious_extraneous:dr@evil.com,creditcardnum,Mozilla/5.0 (X11; Linux x86_64; rv:10.0) Gecko/20100101 Firefox/10.0",
    "level": "CRITICAL",
    "description": "User dr@evil.com included field creditcardnum in the request which is not handled by this service.",
    ...
}
```

---

### malicious_attack_tool:[userid|IP,toolname,useragent]

**説明**
明らかな攻撃ツールがシグネチャまたはユーザーエージェントによって識別された場合、それらをログに記録するべきです。

たとえば、ツール "Nikto" はデフォルトで **_"Mozilla/5.00 (Nikto/2.1.6) (Evasions:None) (Test:Port Check)"_** のような文字列をユーザーエージェントに残します。

**レベル:**
CRITICAL

**例:**

```
{
    "datetime": "2019-01-01 00:00:00,000",
    "appid": "foobar.netportal_auth",
    "event": "malicious_attack_tool:127.0.0.1,nikto,Mozilla/5.00 (Nikto/2.1.6) (Evasions:None) (Test:Port Check)",
    "level": "CRITICAL",
    "description": "Attack traffic indicating use of Nikto coming from 127.0.0.1",
    ...
}
```

---

### malicious_sqli:[userid|IP,parameter,ruleid,useragent]

**説明**
リクエスト入力が SQL インジェクション (SQLi) のシグネチャまたはヒューリスティック (コメント区切り、`' OR 1=1 --` のようなトートロジー、スタッククエリ、`UNION SELECT` など) に一致する場合、リクエストをブロックし、その試行をログに記録します。

_注: ペイロードをログに記録することは危険であり、ログインジェクションにつながる可能性があります。完全なペイロードを記録するよりも、検知ルール ID / カテゴリとパラメータ名を記録することを推奨します。_

**レベル:**
CRITICAL

**例:**

```
{
    "datetime": "2019-01-01 00:00:00,000",
    "appid": "foobar.netportal_auth",
    "event": "malicious_sqli:127.0.0.1,search,SQLI-UNION,Mozilla/5.0 (X11; Linux x86_64; rv:10.0) Gecko/20100101 Firefox/10.0",
    "level": "CRITICAL",
    "description": "Request from 127.0.0.1 contained a SQL injection pattern (rule SQLI-UNION) in parameter 'search'.",
    ...
}
```

---

### malicious_cors:[userid|IP,useragent,referer]

**説明**
許可されていないオリジンから試行が行われた場合、当然ブロックするべきですが、可能な限りログにも記録するべきです。不正なクロスオリジンリクエストをブロックしたとしても、そのリクエストが行われている事実は攻撃の兆候である可能性があります。

_注: "referer" という単語は元の HTTP 仕様で綴り間違いされていることをご存じでしょうか。正しい綴りは "referrer" であるべきですが、元の誤字は今日まで残っており、ここでは意図的に使用されています。_

**レベル:**
CRITICAL

**例:**

```
{
    "datetime": "2019-01-01 00:00:00,000",
    "appid": "foobar.netportal_auth",
    "event": "malicious_cors:127.0.0.1,Mozilla/5.0 (X11; Linux x86_64; rv:10.0) Gecko/20100101 Firefox/10.0,attack.evil.com",
    "level": "CRITICAL",
    "description": "An illegal cross-origin request from 127.0.0.1 was referred from attack.evil.com"
    ...
}
```

---

### malicious_direct_reference:[userid|IP, useragent]

**説明**
認証と認可に対する一般的な攻撃は、認証情報や適切なアクセス権限なしにオブジェクトへ直接アクセスすることです。この欠陥を防げないことは、以前の OWASP Top Ten で **Insecure Direct Object Reference** と呼ばれていました。この攻撃を正しく防止できているという前提では、その試行をログに記録することは悪意あるユーザーを識別するうえで有用です。

**レベル:**
CRITICAL

**例:**

```
{
    "datetime": "2019-01-01 00:00:00,000",
    "appid": "foobar.netportal_auth",
    "event": "malicious_direct_reference:joebob1, Mozilla/5.0 (X11; Linux x86_64; rv:10.0) Gecko/20100101 Firefox/10.0",
    "level": "CRITICAL",
    "description": "User joebob1 attempted to access an object to which they are not authorized",
    ...
}
```

---

## MCP サーバー [MCP]

このセクションは、生産性アプリケーション内またはエンタープライズレベルで MCP サーバーを使用することに関連する懸念に焦点を当てます。

---

### mcp_prompt_injection[:userid]

**説明**
MCP クライアントまたはサーバーがプロンプトインジェクションの指標 (たとえば、system/developer メッセージを無視する指示、ツールポリシーを上書きしようとする試み、シークレットの開示要求、意図されたタスク外でツール呼び出しを強制しようとする試み) を検知した場合、そのアクションをブロックまたは制約し、調査のためにイベントをログに記録します。

_注: 完全なプロンプトやツール I/O をログに記録することは避けてください。二次的な機密データリスクやログインジェクションリスクを作らずにトリアージを支援するため、検知カテゴリまたはルール ID、対象ツール/サーバー、リクエスト識別子を記録することを推奨します。_

**レベル:**
WARN

**例:**

```
{
    "datetime": "2019-01-01 00:00:00,000",
    "appid": "foobar.cooldevapp_mcp_toolname",
    "event": "mcp_prompt_injection:joebob1",
    "level": "WARN",
    "description": "A possible prompt injection has occurred",
    ...
}
```

---

### mcp_resource_exhaustion[:userid]

**説明**
MCP クライアントまたはサーバーが、リソースを枯渇させることを意図したリクエストパターン (たとえば、異常に大きなプロンプト、反復的な再試行、ツール呼び出しループ、過剰なトークン使用量とコストを引き起こすその他の振る舞い) を検知した場合、その活動を終了またはスロットリングし、その試行をログに記録します。

_注: 完全なプロンプトやツール入力/出力をログに記録することは避けてください。測定された使用量 (入出力トークン)、ポリシーしきい値、リクエスト識別子、関連するツール/モデルを記録することを推奨します。_

**レベル:**
WARN

**例:**

```
{
    "datetime": "2019-01-01 00:00:00,000",
    "appid": "foobar.cooldevapp_mcp_toolname",
    "event": "mcp_resource_exhaustion:joebob1",
    "level": "WARN",
    "description": "Request blocked due to token budget overrun (tokens_in=18240, tokens_out=0, budget=8000)",
    ...
}
```

---

### mcp_tool_poisoning[:userid]

**説明**
MCP クライアントまたはサーバーが、ツールが悪意あるもの、または改ざんされた可能性があること (たとえば、予期しないツール変更、署名/ハッシュ検証失敗、疑わしいツールメタデータ、検証が最小限のエージェント/ツールマーケットプレイスから取得されたツール) を検知した場合、そのツールをブロックまたは隔離し、その試行をログに記録します。

_注: ツールエコシステムとエージェントマーケットプレイスは、検証が比較的低い第三者ツールの急速な拡散を可能にします。承認済みツールの内部マーケットプレイスまたはハッシュ済み許可リストを使用することを強く推奨します。_

**レベル:**
WARN

**例:**

```
{
    "datetime": "2019-01-01 00:00:00,000",
    "appid": "foobar.cooldevapp_mcp_toolname",
    "event": "mcp_tool_poisoning:joebob1",
    "level": "WARN",
    "description": "Tool execution blocked (tool=\"calendar_sync\", source=\"https://marketplace.example/tools/calendar_sync\", version=\"2.4.1\", signature=\"missing\", policy=\"allowlist_required\")",
    ...
}
```

---

## 権限変更 [PRIVILEGE]

このセクションは、読み取り/書き込み/実行パーミッションなどのオブジェクト権限変更、またはデータベース内のオブジェクトの認可メタ情報変更に焦点を当てます。

ユーザー/アカウントへの変更は、ユーザー管理セクションで扱います。

---

### privilege_permissions_changed:[userid,file|object,fromlevel,tolevel]

**説明**
アクセス制御制限のあるオブジェクトへの変更を追跡することで、認可されていないユーザーによるファイル権限の昇格試行を発見できます。

**レベル:**
WARN

**例:**

```
{
    "datetime": "2019-01-01 00:00:00,000",
    "appid": "foobar.netportal_auth",
    "event": "permissions_changed:joebob1, /users/admin/some/important/path,0511,0777",
    "level": "WARN",
    "description": "User joebob1 changed permissions on /users/admin/some/important/path",
    ...
}
```

---

## 機密データ変更 [DATA]

すべてのファイルの変更をログに記録したりアラートしたりする必要はありませんが、非常に機密性の高いファイルやデータの場合は、変更を監視しアラートすることが重要です。

---

### sensitive_create:[userid,file|object]

**説明**
新しいデータが作成され、機密としてマークされた場合、または機密データが保存されるディレクトリ/テーブル/リポジトリに配置された場合、その作成をログに記録し、定期的にレビューするべきです。

**レベル:**
WARN

**例:**

```
{
    "datetime": "2019-01-01 00:00:00,000",
    "appid": "foobar.netportal_auth",
    "event": "sensitive_create:joebob1, /users/admin/some/important/path",
    "level": "WARN",
    "description": "User joebob1 created a new file in /users/admin/some/important/path",
    ...
}
```

---

### sensitive_read:[userid,file|object]

**説明**
機密としてマークされた、または機密データが保存されるディレクトリ/テーブル/リポジトリに配置されたすべてのデータは、アクセスをログに記録し、定期的にレビューするべきです。

**レベル:**
WARN

**例:**

```
{
    "datetime": "2019-01-01 00:00:00,000",
    "appid": "foobar.netportal_auth",
    "event": "sensitive_read:joebob1, /users/admin/some/important/path",
    "level": "WARN",
    "description": "User joebob1 read file /users/admin/some/important/path",
    ...
}
```

---

### sensitive_update:[userid,file|object]

**説明**
機密としてマークされた、または機密データが保存されるディレクトリ/テーブル/リポジトリに配置されたすべてのデータは、データの更新をログに記録し、定期的にレビューするべきです。

**レベル:**
WARN

**例:**

```
{
    "datetime": "2019-01-01 00:00:00,000",
    "appid": "foobar.netportal_auth",
    "event": "sensitive_update:joebob1, /users/admin/some/important/path",
    "level": "WARN",
    "description": "User joebob1 modified file /users/admin/some/important/path",
    ...
}
```

---

### sensitive_delete:[userid,file|object]

**説明**
機密としてマークされた、または機密データが保存されるディレクトリ/テーブル/リポジトリに配置されたすべてのデータは、データの削除をログに記録し、定期的にレビューするべきです。ファイルは即座に削除せず、削除対象としてマークし、法務/プライバシー要件に従ってファイルのアーカイブを維持するべきです。

**レベル:**
WARN

**例:**

```
{
    "datetime": "2019-01-01 00:00:00,000",
    "appid": "foobar.netportal_auth",
    "event": "sensitive_delete:joebob1, /users/admin/some/important/path",
    "level": "WARN",
    "description": "User joebob1 marked file /users/admin/some/important/path for deletion",
    ...
}
```

---

## シーケンスエラー [SEQUENCE]

**_ビジネスロジック攻撃_** とも呼ばれます。システム内で特定のパスが期待されているにもかかわらず、そのパスをスキップしたり順序を変更したりする試行が行われた場合、悪意ある意図を示す可能性があります。

---

### sequence_fail:[userid]

**説明**
ユーザーがアプリケーションの一部に順序外で到達した場合、ビジネスロジックの意図的な悪用を示す可能性があり、追跡するべきです。

**レベル:**
CRITICAL

**例:**

```
{
    "datetime": "2019-01-01 00:00:00,000",
    "appid": "foobar.netportal_auth",
    "event": "sequence_fail:joebob1",
    "level": "CRITICAL",
    "description": "User joebob1 has reached a part of the application out of the normal application flow.",
    ...
}
```

---

## セッション管理 [SESSION]

### session_created:[userid]

**説明**
新しい認証済みセッションが作成された場合、そのセッションをログに記録し、アクティビティを監視してもよいです。

**レベル:**
INFO

**例:**

```
    {
    "datetime": "2019-01-01 00:00:00,000",
    "appid": "foobar.netportal_auth",
    "event": "session_created:joebob1",
    "level": "INFO",
    "description": "User joebob1 has started a new session",
    ...
}
```

---

### session_renewed:[userid]

**説明**
ユーザーがセッションの期限切れ/失効について警告され、セッション延長を選択した場合、そのアクティビティをログに記録するべきです。また、対象システムに高度に機密なデータが含まれる場合、セッション延長には追加の検証が必要になる可能性があります。

**レベル:**
INFO

**例:**

```
{
    "datetime": "2019-01-01 00:00:00,000",
    "appid": "foobar.netportal_auth",
    "event": "session_renewed:joebob1",
    "level": "INFO",
    "description": "User joebob1 was warned of expiring session and extended.",
    ...
}
```

---

### session_expired:[userid,reason]

**説明**
セッションが期限切れになった場合、特に認証済みセッションや機密データを伴う場合、そのセッション期限切れをログに記録し、説明データを含めてもよいです。理由コードには logout、timeout、revoked など任意の値を指定できます。失効要件がある場合、セッションは削除せず、期限切れにするべきです。

**レベル:**
INFO

**例:**

```
{
    "datetime": "2019-01-01 00:00:00,000",
    "appid": "foobar.netportal_auth",
    "event": "session_expired:joebob1,revoked",
    "level": "INFO",
    "description": "User joebob1 session expired due to administrator revocation.",
    ...
}
```

---

### session_use_after_expire:[userid]

**説明**
ユーザーが期限切れのセッションでシステムへアクセスしようとした場合、特にその後のログイン失敗と組み合わさるなら、ログに記録すると有用なことがあります。これは、悪意あるユーザーがセッションハイジャックを試みている、または他人のマシン/ブラウザに直接アクセスしているケースを識別できる可能性があります。

**レベル:**
CRITICAL

**例:**

```
{
    "datetime": "2019-01-01 00:00:00,000",
    "appid": "foobar.netportal_auth",
    "event": "session_use_after_expire:joebob1",
    "level": "CRITICAL",
    "description": "User joebob1 attempted access after session expired.",
    ...
}
```

---

## システムイベント [SYS]

### sys_startup:[userid]

**説明**
システムが最初に起動された場合、その起動をログに記録することは有用です。システムがサーバーレスやコンテナであっても同様であり、可能であればシステムを起動したユーザーをログに記録するとよいです。

**レベル:**
WARN

**例:**

```
{
    "datetime": "2019-01-01 00:00:00,000",
    "appid": "foobar.netportal_auth",
    "event": "sys_startup:joebob1",
    "level": "WARN",
    "description": "User joebob1 spawned a new instance",
    ...
}
```

---

### sys_shutdown:[userid]

**説明**
システムがシャットダウンされた場合、そのイベントをログに記録することは有用です。システムがサーバーレスやコンテナであっても同様であり、可能であればシステムを停止したユーザーをログに記録するとよいです。

**レベル:**
WARN

**例:**

```
{
    "datetime": "2019-01-01 00:00:00,000",
    "appid": "foobar.netportal_auth",
    "event": "sys_shutdown:joebob1",
    "level": "WARN",
    "description": "User joebob1 stopped this instance",
    ...
}
```

---

### sys_restart:[userid]

**説明**
システムが再起動された場合、そのイベントをログに記録することは有用です。システムがサーバーレスやコンテナであっても同様であり、可能であればシステムを再起動したユーザーをログに記録するとよいです。

**レベル:**
WARN

**例:**

```
{
    "datetime": "2019-01-01 00:00:00,000",
    "appid": "foobar.netportal_auth",
    "event": "sys_restart:joebob1",
    "level": "WARN",
    "description": "User joebob1 initiated a restart",
    ...
}
```

---

### sys_crash[:reason]

**説明**
システムのクラッシュにつながる不安定な状態を捕捉できる場合、そのイベントをログに記録すると有用です。特に、そのイベントが攻撃によってトリガーされた場合に有用です。

**レベル:**
WARN

**例:**

```
{
    "datetime": "2019-01-01 00:00:00,000",
    "appid": "foobar.netportal_auth",
    "event": "sys_crash:outofmemory,
    "level": "WARN",
    "description": "The system crashed due to Out of Memory error.",
    ...
}
```

---

### sys_monitor_disabled:[userid,monitor]

**説明**
システムにファイル整合性、リソース、ロギング、ウイルス対策などを担当するエージェントが含まれている場合、それらが停止されたかどうか、誰によって停止されたかを知ることは特に重要です。

**レベル:**
WARN

**例:**

```
{
    "datetime": "2019-01-01 00:00:00,000",
    "appid": "foobar.netportal_auth",
    "event": "sys_monitor_disabled:joebob1,crowdstrike",
    "level": "WARN",
    "description": "User joebob1 has disabled CrowdStrike",
    ...
}
```

---

### sys_monitor_enabled:[userid,monitor]

**説明**
システムにファイル整合性、リソース、ロギング、ウイルス対策などを担当するエージェントが含まれている場合、それらが停止後に再開されたかどうか、誰によって再開されたかを知ることは特に重要です。

**レベル:**
WARN

**例:**

```
{
    "datetime": "2019-01-01 00:00:00,000",
    "appid": "foobar.netportal_auth",
    "event": "sys_monitor_enabled:joebob1,crowdstrike",
    "level": "WARN",
    "description": "User joebob1 has enabled CrowdStrike",
    ...
}
```

---

## ユーザー管理 [USER]

### user_created:[userid,newuserid,attributes[one,two,three]]

**説明**
新しいユーザーを作成する場合、ユーザー作成イベントの詳細をログに記録することは有用です。特に、新しいユーザーを管理者権限付きで作成できる場合に重要です。

**レベル:**
WARN

**例:**

```
{
    "datetime": "2019-01-01 00:00:00,000",
    "appid": "foobar.netportal_auth",
    "event": "user_created:joebob1,user1,admin:create,update,delete",
    "level": "WARN",
    "description": "User joebob1 created user1 with admin:create,update,delete privilege attributes",
    ...
}
```

---

### user_updated:[userid,onuserid,attributes[one,two,three]]

**説明**
ユーザーを更新する場合、ユーザー更新イベントの詳細をログに記録することは有用です。特に、ユーザーを管理者権限付きで更新できる場合に重要です。

**レベル:**
WARN

**例:**

```
{
    "datetime": "2019-01-01 00:00:00,000",
    "appid": "foobar.netportal_auth",
    "event": "user_updated:joebob1,user1,admin:create,update,delete",
    "level": "WARN",
    "description": "User joebob1 updated user1 with attributes admin:create,update,delete privilege attributes",
    ...
}
```

---

### user_archived:[userid,onuserid]

**説明**
必須の場合を除き、ユーザーは削除するよりもアーカイブするのが常に最善です。ユーザーをアーカイブする場合、ユーザーアーカイブイベントの詳細をログに記録することは有用です。悪意あるユーザーがこの機能を使って正当なユーザーに対するサービス拒否を行う可能性があります。

**レベル:**
WARN

**例:**

```
{
    "datetime": "2019-01-01 00:00:00,000",
    "appid": "foobar.netportal_auth",
    "event": "user_archived:joebob1,user1",
    "level": "WARN",
    "description": "User joebob1 archived user1",
    ...
}
```

---

### user_deleted:[userid,onuserid]

**説明**
必須の場合を除き、ユーザーは削除するよりもアーカイブするのが常に最善です。ユーザーを削除する場合、ユーザー削除イベントの詳細をログに記録することは有用です。悪意あるユーザーがこの機能を使って正当なユーザーに対するサービス拒否を行う可能性があります。

**レベル:**
WARN

**例:**

```
{
    "datetime": "2019-01-01 00:00:00,000",
    "appid": "foobar.netportal_auth",
    "event": "user_deleted:joebob1,user1",
    "level": "WARN",
    "description": "User joebob1 has deleted user1",
    ...
}
```

---

## 除外事項

何をログに記録するかと同じくらい、何をログに記録しないかも重要です。プライベート情報や秘密情報、ソースコード、鍵、証明書などは、決してログに記録するべきではありません。

ログから除外するべき項目の包括的な概要については、[OWASP Logging Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html#data-to-exclude) を参照してください。

</section>

<section id="logging-vocabulary-bilingual-panel" className="tabPanel bilingualPanel">

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

This document proposes a standard vocabulary for logging security events. The intent is to simplify monitoring and alerting such that, assuming developers trap errors and log them using this vocabulary, monitoring and alerting would be improved by simply keying on these terms.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

この文書は、セキュリティイベントをロギングするための標準語彙を提案します。その目的は、開発者がエラーを捕捉し、この語彙を使ってログに記録するという前提で、これらの用語をキーにするだけで監視とアラートを改善できるようにすることです。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## Overview

Each year IBM Security commissions the Ponemon Institute to survey companies around the world for information related to security breaches, mitigation, and the associated costs; the result is called the Cost of a Data Breach Report.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## 概要

IBM Security は毎年 Ponemon Institute に委託し、世界中の企業を対象に、セキュリティ侵害、緩和策、関連コストに関する調査を実施しています。その結果は Cost of a Data Breach Report と呼ばれます。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

In addition to the millions of dollars lost due to breaches the report finds that the **mean time to identify** a breach continues to hover around **200 days**. Clearly our ability to monitor applications and alert on anomalous behavior would improve our time to identify and mitigate an attack against our applications.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

侵害によって数百万ドル規模の損失が発生するだけでなく、このレポートでは、侵害を識別するまでの平均時間 (**mean time to identify**) が引き続き約 **200 日** 付近で推移していることが示されています。アプリケーションを監視し、異常な振る舞いに対してアラートを出す能力を高めれば、アプリケーションに対する攻撃を識別し、緩和するまでの時間を短縮できることは明らかです。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

> IBM Cost of a Data Breach Study 2025, Fig.4, pg.12, [https://www.ibm.com/reports/data-breach]

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

> IBM Cost of a Data Breach Study 2025, Fig.4, pg.12, [https://www.ibm.com/reports/data-breach]

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

This logging standard would seek to define specific keywords which, when applied consistently across software, would allow groups to simply monitor for these events terms across all applications and respond quickly in the event of attack.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

このロギング標準は、ソフトウェア全体で一貫して適用されたときに、各グループがすべてのアプリケーション横断でこれらのイベント用語を単純に監視し、攻撃発生時に迅速に対応できるような、具体的なキーワードを定義しようとするものです。

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

![IBM Cost of Data Breach Report 2025](https://cheatsheetseries.owasp.org/assets/cost-of-breach-2025.png)

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## Assumptions

- Observability/SRE groups must support the use of this standard and encourage developers to use it
- Incident Response must either ingest this data OR provide a means by which other monitoring teams can send a notification of alert, preferably programmatically.
- Architects must support, adopt, and contribute to this standard
- Developers must embrace this standard and begin to implement (requires knowledge and intent to understand potential attacks and trap those errors in code).

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## 前提

- Observability/SRE グループは、この標準の利用をサポートし、開発者に利用を促す必要があります。
- インシデント対応チームは、このデータを取り込むか、他の監視チームがアラート通知を送信できる手段を提供する必要があります。可能であればプログラムから送信できることが望まれます。
- アーキテクトは、この標準をサポートし、採用し、貢献する必要があります。
- 開発者は、この標準を受け入れ、実装を始める必要があります。これには、潜在的な攻撃を理解し、そのエラーをコードで捕捉するための知識と意図が必要です。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## Getting Started

As a reminder, the goal of logging is to be able to alert on specific security events. Of course, the first step to logging these events is good error handling, if you're not trapping the events, you don't have an event to log.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## はじめに

念のため確認すると、ロギングの目標は、特定のセキュリティイベントに対してアラートを出せるようにすることです。もちろん、これらのイベントをログに記録する最初のステップは適切なエラーハンドリングです。イベントを捕捉していなければ、ログに記録するイベントも存在しません。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Identifying Events

In order to better understand security event logging a good high-level understanding of threat modeling would be helpful, even if it's a simple approach of:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### イベントの特定

セキュリティイベントのロギングをよりよく理解するには、次のような単純なアプローチであっても、脅威モデリングを大まかに理解していると役立ちます。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

1. **What could go wrong?**

- Orders: could someone order on behalf of another?
- Authentication: could I log in as someone else?
- Authorization: could I see someone else' account?

2. **What would happen if it did?**

- Orders: I've placed an order on behalf of another... to an abandoned warehouse in New Jersey. Oops.
- Then I bragged about it on 4Chan.
- Then I told the New York Times about it.

3. **Who might intend to do this?**

- Intentional attacks by hackers.
- An employee "testing" how things work.
- An API coded incorrectly doing things the author did not intend.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

1. **何が問題になり得るか。**

- 注文: 誰かが他人の代わりに注文できるか。
- 認証: 自分が他人としてログインできるか。
- 認可: 他人のアカウントを閲覧できるか。

2. **それが起きた場合、何が発生するか。**

- 注文: 他人の代わりに、ニュージャージー州の放棄された倉庫宛てに注文してしまった。しまった。
- その後、それを 4Chan で自慢した。
- その後、それを New York Times に伝えた。

3. **誰がこれを意図する可能性があるか。**

- 攻撃者による意図的な攻撃。
- 仕組みを「テスト」している従業員。
- 作成者が意図しないことを行う、誤って実装された API。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### Implementation

Some languages have libraries which ease the job of adopting this logging vocabulary in applications:

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### 実装

一部の言語には、アプリケーションでこのロギング語彙を採用しやすくするライブラリがあります。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

- Python: [lucabello/owasp-logger](https://github.com/lucabello/owasp-logger)
- C#/.NET: [byteguard-hq/byteguard-security-logger](https://github.com/ByteGuard-HQ/byteguard-security-logger)

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

- Python: [lucabello/owasp-logger](https://github.com/lucabello/owasp-logger)
- C#/.NET: [byteguard-hq/byteguard-security-logger](https://github.com/ByteGuard-HQ/byteguard-security-logger)

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## Format

_NOTE: All dates should be logged in [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) format **WITH** UTC offset to ensure maximum portability_

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## 形式

_注: 最大限の移植性を確保するため、すべての日付は UTC オフセット **付き** の [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) 形式でログに記録するべきです。_

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```
{
    "datetime": "2021-01-01T01:01:01-0700",
    "appid": "foobar.netportal_auth",
    "event": "AUTHN_login_success:joebob1",
    "level": "INFO",
    "description": "User joebob1 login successfully",
    "useragent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.108 Safari/537.36",
    "source_ip": "165.225.50.94",
    "host_ip": "10.12.7.9",
    "hostname": "portalauth.foobar.com",
    "protocol": "https",
    "port": "440",
    "request_uri": "/api/v2/auth/",
    "request_method": "POST",
    "region": "AWS-US-WEST-2",
    "geo": "USA"
}
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## The Vocabulary

What follows are the various event types that should be captured. For each event type there is a prefix like "authn" and additional data that may be included for that event.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## 語彙

以下は、捕捉するべきさまざまなイベントタイプです。各イベントタイプには `authn` のような接頭辞があり、そのイベントに含められる追加データがあります。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Portions of the full logging format are included for example, but a complete event log should follow the format above.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

例では完全なロギング形式の一部だけを示していますが、完全なイベントログは上記の形式に従うべきです。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

**Note on Data Privacy:**

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

**データプライバシーに関する注記:**

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

All fields logged after event type should be considered optional. Businesses implementing this logging method should consider value of the fields being logged vs. responsibility as a data steward for the data logged. For example: logging user IP address may be useful for detection and response, but may be considered personally identifiable information when combined with other data and subject to regulation or deletion requests.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

イベントタイプの後にログに記録されるすべてのフィールドは任意と考えるべきです。このロギング手法を実装する事業者は、ログに記録するフィールドの価値と、ログに記録されるデータの管理者としての責任を比較検討するべきです。たとえば、ユーザーの IP アドレスをログに記録することは検知と対応には有用かもしれませんが、他のデータと組み合わさると個人を識別可能な情報と見なされ、規制や削除要求の対象になる場合があります。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## Authentication [AUTHN]

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## 認証 [AUTHN]

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### authn_login_success[:userid]

**Description**
All login events should be recorded including success.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### authn_login_success[:userid]

**説明**
成功を含むすべてのログインイベントを記録するべきです。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

**Level:**
INFO

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

**レベル:**
INFO

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

**Example:**

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

**例:**

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```
{
    "datetime": "2019-01-01 00:00:00,000",
    "appid": "foobar.netportal_auth",
    "event": "authn_login_success:joebob1",
    "level": "INFO",
    "description": "User joebob1 login successfully",
    ...
}
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### authn_login_successafterfail[:userid,retries]

**Description**
The user successfully logged in after previously failing.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### authn_login_successafterfail[:userid,retries]

**説明**
ユーザーが以前に失敗した後で正常にログインしました。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

**Level:**
INFO

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

**レベル:**
INFO

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

**Example:**

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

**例:**

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```
{
    "datetime": "2019-01-01 00:00:00,000",
    "appid": "foobar.netportal_auth",
    "event": "authn_login_successafterfail:joebob1,2",
    "level": "INFO",
    "description": "User joebob1 login successfully",
    ...
}
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### authn_login_fail[:userid]

**Description**
All login events should be recorded including failure.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### authn_login_fail[:userid]

**説明**
失敗を含むすべてのログインイベントを記録するべきです。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

**Level:**
WARN

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

**レベル:**
WARN

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

**Example:**

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

**例:**

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```
{
    "datetime": "2019-01-01 00:00:00,000",
    "appid": "foobar.netportal_auth",
    "event": "authn_login_fail:joebob1",
    "level": "WARN",
    "description": "User joebob1 login failed",
    ...
}
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### authn_login_fail_max[:userid,maxlimit(int)]

**Description**
All login events should be recorded including failure.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### authn_login_fail_max[:userid,maxlimit(int)]

**説明**
失敗を含むすべてのログインイベントを記録するべきです。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

**Level:**
WARN

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

**レベル:**
WARN

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

**Example:**

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

**例:**

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```
{
    "datetime": "2019-01-01 00:00:00,000",
    "appid": "foobar.netportal_auth",
    "event": "authn_login_fail_max:joebob1,3",
    "level": "WARN",
    "description": "User joebob1 reached the login fail limit of 3",
    ...
}
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### authn_login_lock[:userid,reason]

**Description**
When the feature exists to lock an account after x retries or other condition, the lock should be logged with relevant data.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### authn_login_lock[:userid,reason]

**説明**
一定回数の再試行やその他の条件の後にアカウントをロックする機能がある場合、そのロックは関連データとともにログに記録するべきです。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

**Level:**
WARN

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

**レベル:**
WARN

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

**Reasons:**

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

**理由:**

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

- maxretries: The maximum number of retries was reached
- suspicious: Suspicious activity was observed on the account
- customer: The customer requested their account be locked
- other: Other

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

- maxretries: 最大再試行回数に達しました。
- suspicious: アカウント上で疑わしいアクティビティが観測されました。
- customer: 顧客がアカウントのロックを要求しました。
- other: その他。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

**Example:**

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

**例:**

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```
{
    "datetime": "2019-01-01 00:00:00,000",
    "appid": "foobar.netportal_auth",
    "event": "authn_login_lock:joebob1,maxretries",
    "level": "WARN",
    "description": "User joebob1 login locked because maxretries exceeded",
    ...
}
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### authn_password_change[:userid]

**Description**
Every password change should be logged, including the userid that it was for.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### authn_password_change[:userid]

**説明**
すべてのパスワード変更は、その対象となった userid を含めてログに記録するべきです。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

**Level:**
INFO

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

**レベル:**
INFO

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

**Example:**

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

**例:**

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```
{
    "datetime": "2019-01-01 00:00:00,000",
    "appid": "foobar.netportal_auth",
    "event": "authn_password_change:joebob1",
    "level": "INFO",
    "description": "User joebob1 has successfully changed their password",
    ...
}
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### authn_password_change_fail[:userid]

**Description**
An attempt to change a password that failed. May also trigger other events such as `authn_login_lock`.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### authn_password_change_fail[:userid]

**説明**
失敗したパスワード変更の試行です。`authn_login_lock` など、他のイベントもトリガーする可能性があります。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

**Level:**
CRITICAL

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

**レベル:**
CRITICAL

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

**Example:**

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

**例:**

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```
{
    "datetime": "2019-01-01 00:00:00,000",
    "appid": "foobar.netportal_auth",
    "event": "authn_password_change_fail:joebob1",
    "level": "CRITICAL",
    "description": "User joebob1 failed to change their password",
    ...
}
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### authn_impossible_travel[:userid,region1,region2]

**Description**
When a user is logged in from one city and suddenly appears in another, too far away to have traveled in a reasonable timeframe, this often indicates a potential account takeover.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### authn_impossible_travel[:userid,region1,region2]

**説明**
ユーザーがある都市からログインしており、合理的な時間内には移動できないほど遠い別の都市に突然現れた場合、多くの場合、アカウント乗っ取りの可能性を示します。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

**Level:**: CRITICAL

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

**レベル:**: CRITICAL

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

**Example:**

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

**例:**

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```
{
    "datetime": "2019-01-01 00:00:00,000",
    "appid": "foobar.netportal_auth",
    "event": "authn_impossible_travel:joebob1,US-OR,CN-SH",
    "level": "CRITICAL",
    "description": "User joebob1 has accessed the application in two distant cities at the same time",
    ...
}
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### authn_token_created[:userid, entitlement(s)]

**Description**
When a token is created for service access it should be recorded

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### authn_token_created[:userid, entitlement(s)]

**説明**
サービスアクセス用のトークンが作成された場合、それを記録するべきです。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

**Level:**: INFO

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

**レベル:**: INFO

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

**Example:**

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

**例:**

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```
{
    "datetime": "2019-01-01 00:00:00,000",
    "appid": "aws.foobar.com",
    "event": "authn_token_created:app.foobarapi.prod,create,read,update",
    "level": "INFO",
    "description": "A token has been created for app.foobarapi.prod with create,read,update",
    ...
}
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### authn_token_revoked[:userid,tokenid]

**Description**
A token has been revoked for the given account.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### authn_token_revoked[:userid,tokenid]

**説明**
指定されたアカウントのトークンが失効されました。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

**Level:**: INFO

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

**レベル:**: INFO

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

**Example:**

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

**例:**

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```
{
    "datetime": "2019-01-01 00:00:00,000",
    "appid": "aws.foobar.com",
    "event": "authn_token_revoked:app.foobarapi.prod,xyz-abc-123-gfk",
    "level": "INFO",
    "description": "Token ID: xyz-abc-123-gfk was revoked for user app.foobarapi.prod",
    ...
}
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### authn_token_reuse[:userid,tokenid]

**Description**
A previously revoked token was attempted to be reused.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### authn_token_reuse[:userid,tokenid]

**説明**
以前に失効されたトークンが再利用されようとしました。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

**Level:**: CRITICAL

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

**レベル:**: CRITICAL

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

**Example:**

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

**例:**

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```
{
    "datetime": "2019-01-01 00:00:00,000",
    "appid": "aws.foobar.com",
    "event": "authn_token_reuse:app.foobarapi.prod,xyz-abc-123-gfk",
    "level": "CRITICAL",
    "description": "User app.foobarapi.prod attempted to use token ID: xyz-abc-123-gfk which was previously revoked",
    ...
}
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### authn_token_delete[:appid]

**Description**
When a token is deleted it should be recorded

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### authn_token_delete[:appid]

**説明**
トークンが削除された場合、それを記録するべきです。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

**Level:**: WARN

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

**レベル:**: WARN

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

**Example:**

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

**例:**

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```
{
    "datetime": "2019-01-01 00:00:00,000",
    "appid": "foobar.netportal_auth",
    "event": "authn_token_delete:foobarapi",
    "level": "WARN",
    "description": "The token for foobarapi has been deleted",
    ...
}
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## Authorization [AUTHZ]

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## 認可 [AUTHZ]

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### authz_fail[:userid,resource]

**Description**
An attempt was made to access a resource which was unauthorized

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### authz_fail[:userid,resource]

**説明**
認可されていないリソースにアクセスする試行が行われました。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

**Level:**: CRITICAL

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

**レベル:**: CRITICAL

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

**Example:**

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

**例:**

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```
{
    "datetime": "2019-01-01 00:00:00,000",
    "appid": "foobar.netportal_auth",
    "event": "authz_fail:joebob1,resource",
    "level": "CRITICAL",
    "description": "User joebob1 attempted to access a resource without entitlement",
    ...
}
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### authz_change[:userid,from,to]

**Description**
The user or entity entitlements was changed

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### authz_change[:userid,from,to]

**説明**
ユーザーまたはエンティティの権限 (entitlements) が変更されました。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

**Level:**: WARN

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

**レベル:**: WARN

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

**Example:**

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

**例:**

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```
{
    "datetime": "2019-01-01 00:00:00,000",
    "appid": "foobar.netportal_auth",
    "event": "authz_change:joebob1,user,admin",
    "level": "WARN",
    "description": "User joebob1 access was changed from user to admin",
    ...
}
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### authz_admin[:userid,event]

**Description**
All activity by privileged users such as admin should be recorded.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### authz_admin[:userid,event]

**説明**
管理者などの特権ユーザーによるすべてのアクティビティを記録するべきです。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

**Level:**: WARN

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

**レベル:**: WARN

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

**Example:**

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

**例:**

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```
{
    "datetime": "2019-01-01 00:00:00,000",
    "appid": "foobar.netportal_auth",
    "event": "authz_admin:joebob1,user_privilege_change",
    "level": "WARN",
    "description": "Administrator joebob1 has updated privileges of user foobarapi from user to admin",
    ...
}
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## Encryption/Decryption [CRYPT]

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## 暗号化/復号 [CRYPT]

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### crypt_decrypt_fail[userid]

**Description**
Failure to perform encryption and decryption could be simply due to a system error, or it may be related to authorization failures where a user lacks permissions on the related data.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### crypt_decrypt_fail[userid]

**説明**
暗号化や復号の実行失敗は、単純なシステムエラーである場合もあれば、ユーザーが関連データに対する権限を持たないという認可失敗に関連している場合もあります。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

**Level:**: WARN

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

**レベル:**: WARN

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

**Example:**

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

**例:**

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```
{
    "datetime": "2019-01-01 00:00:00,000",
    "appid": "foobar.netportal_auth",
    "event": "crypt_decrypt_fail:joebob1",
    "level": "WARN",
    "description": "User joebob1 was unable to perform decryption" + err,
    ...
}
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### crypt_encrypt_fail[userid]

**Description**
Failure to perform encryption and decryption could be simply due to a system error, or it may be related to authorization failures where a user lacks permissions on the related data.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### crypt_encrypt_fail[userid]

**説明**
暗号化や復号の実行失敗は、単純なシステムエラーである場合もあれば、ユーザーが関連データに対する権限を持たないという認可失敗に関連している場合もあります。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

**Level:**: WARN

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

**レベル:**: WARN

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

**Example:**

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

**例:**

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```
{
    "datetime": "2019-01-01 00:00:00,000",
    "appid": "foobar.netportal_auth",
    "event": "crypt_encrypt_fail:joebob1",
    "level": "WARN",
    "description": "User joebob1 was unable to perform encryption" + err,
    ...
}
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## Excessive Use [EXCESS]

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## 過剰利用 [EXCESS]

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### excess_rate_limit_exceeded[userid,max]

**Description**
Expected service limit ceilings should be established and alerted when exceeded, even if simply for managing costs and scaling.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### excess_rate_limit_exceeded[userid,max]

**説明**
想定されるサービス制限の上限を設定し、それを超過した場合は、単にコストやスケーリングを管理する目的であっても、アラートを出すべきです。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

**Level:**: WARN

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

**レベル:**: WARN

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

**Example:**

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

**例:**

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```
{
    "datetime": "2019-01-01 00:00:00,000",
    "appid": "foobar.netportal_auth",
    "event": "excess_rate_limit_exceeded:app.foobarapi.prod,100000",
    "level": "WARN",
    "description": "User app.foobarapi.prod has exceeded max:100000 requests",
    ...
}
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## File Upload [UPLOAD]

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## ファイルアップロード [UPLOAD]

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### upload_complete[userid,filename,type]

**Description**
On successful file upload the first step in the validation process is that the upload has completed.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### upload_complete[userid,filename,type]

**説明**
ファイルアップロードが成功した場合、検証プロセスの最初のステップはアップロードが完了したことです。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

**Level:**: INFO

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

**レベル:**: INFO

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

**Example:**

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

**例:**

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```
    {
    "datetime": "2019-01-01 00:00:00,000",
    "appid": "foobar.netportal_auth",
    "event": "upload_complete:joebob1,user_generated_content.png,PNG",
    "level": "INFO",
    "description": "User joebob1 has uploaded user_generated_content.png",
    ...
}
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### upload_stored[filename,from,to]

**Description**
One step in good file upload validation is to move/rename the file and when providing the content back to end users, never reference the original filename in the download. This is true both when storing in a filesystem as well as in block storage.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### upload_stored[filename,from,to]

**説明**
適切なファイルアップロード検証の一つのステップは、ファイルを移動またはリネームし、コンテンツをエンドユーザーに返す際に、ダウンロードで元のファイル名を参照しないことです。これはファイルシステムに保存する場合にも、ブロックストレージに保存する場合にも当てはまります。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

**Level:**: INFO

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

**レベル:**: INFO

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

**Example:**

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

**例:**

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```
{
    "datetime": "2019-01-01 00:00:00,000",
    "appid": "foobar.netportal_auth",
    "event": "upload_stored:user_generated_content.png,kjsdhkrjhwijhsiuhdf000010202002",
    "level": "INFO",
    "description": "File user_generated_content.png was stored in the database with key abcdefghijk101010101",
    ...
}
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### upload_validation[filename,(virusscan|imagemagick|...):(FAILED|incomplete|passed)]

**Description**
All file uploads should have some validation performed, both for correctness (is in fact of file type x), and for safety (does not contain a virus).

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### upload_validation[filename,(virusscan|imagemagick|...):(FAILED|incomplete|passed)]

**説明**
すべてのファイルアップロードには、正しさ (実際にファイルタイプ x であるか) と安全性 (ウイルスを含まないか) の両方について、何らかの検証を実施するべきです。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

**Level:**: INFO|CRITICAL

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

**レベル:**: INFO|CRITICAL

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

**Example:**

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

**例:**

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```
{
    "datetime": "2019-01-01 00:00:00,000",
    "appid": "foobar.netportal_auth",
    "event": "upload_validation:filename,virusscan:FAILED",
    "level": "CRITICAL",
    "description": "File user_generated_content.png FAILED virus scan and was purged",
    ...
}
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### upload_delete[userid,fileid]

**Description**
When a file is deleted for normal reasons it should be recorded.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### upload_delete[userid,fileid]

**説明**
通常の理由でファイルが削除された場合、それを記録するべきです。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

**Level:**: INFO

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

**レベル:**: INFO

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

**Example:**

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

**例:**

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```
{
    "datetime": "2019-01-01 00:00:00,000",
    "appid": "foobar.netportal_auth",
    "event": "upload_delete:joebob1,",
    "level": "INFO",
    "description": "User joebob1 has marked file abcdefghijk101010101 for deletion.",
    ...
}
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## Input Validation [INPUT]

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## 入力検証 [INPUT]

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### input_validation_fail:[(fieldone,fieldtwo...),userid]

**Description**
When input validation fails on the server-side it must either be because a) sufficient validation was not provided on the client, or b) client-side validation was bypassed. In either case it's an opportunity for attack and should be mitigated quickly.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### input_validation_fail:[(fieldone,fieldtwo...),userid]

**説明**
サーバー側で入力検証が失敗する場合、その原因は a) クライアントで十分な検証が提供されていない、または b) クライアント側検証が迂回された、のどちらかであるはずです。いずれの場合も攻撃の機会であり、迅速に緩和するべきです。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

**Level:**
WARN

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

**レベル:**
WARN

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

**Example:**

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

**例:**

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```
{
    "datetime": "2019-01-01 00:00:00,000",
    "appid": "foobar.netportal_auth",
    "event": "input_validation_fail:(zip,date_of_birth),joebob1",
    "level": "WARN",
    "description": "User joebob1 submitted data that failed validation.",
    ...
}
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### input_validation_discrete_fail[:field,userid]

**Description**
When server-side validation of a value against a discrete list of options (e.g. drop down list, radio buttons) fails, it is a strong indication of malicious activity as this indicates the client-side code has been tampered with.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### input_validation_discrete_fail[:field,userid]

**説明**
離散的な選択肢リスト (ドロップダウンリスト、ラジオボタンなど) に対する値のサーバー側検証が失敗する場合、クライアント側コードが改ざんされたことを示すため、悪意ある活動の強い兆候です。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

**Level:**
WARN

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

**レベル:**
WARN

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

**Example:**

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

**例:**

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```json
{
    "datetime": "2021-02-01T08:30:00-0500",
    "appid": "foobar.netportal_auth",
    "event": "input_validation_discrete_fail:country,joebob1",
    "level": "WARN",
    "description": "User joebob1 submitted an invalid value for the 'country' field.",
    ...
}
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## Malicious Behavior [MALICIOUS

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## 悪意ある振る舞い [MALICIOUS

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### malicious_excess_404:[userid|IP,useragent]

**Description**
When a user makes numerous requests for files that don't exist it often is an indicator of attempts to "force-browse" for files that could exist and is often behavior indicating malicious intent.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### malicious_excess_404:[userid|IP,useragent]

**説明**
ユーザーが存在しないファイルに対して多数のリクエストを行う場合、それは存在する可能性のあるファイルを「force-browse」しようとする試みの指標であることが多く、悪意ある意図を示す振る舞いであることがよくあります。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

**Level:**
WARN

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

**レベル:**
WARN

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

**Example:**

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

**例:**

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```
{
    "datetime": "2019-01-01 00:00:00,000",
    "appid": "foobar.netportal_auth",
    "event": "malicious_excess404:123.456.789.101,M@l1c10us-Hax0rB0t0-v1",
    "level": "WARN",
    "description": "A user at 123.456.789.101 has generated a large number of 404 requests.",
    ...
}
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### malicious_extraneous:[userid|IP,inputname,useragent]

**Description**
When a user submits data to a backend handler that was not expected it can indicate probing for input validation errors. If your backend service receives data it does not handle or have an input for this is an indication of likely malicious abuse.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### malicious_extraneous:[userid|IP,inputname,useragent]

**説明**
ユーザーがバックエンドハンドラーに想定外のデータを送信する場合、入力検証エラーを探る行為を示す可能性があります。バックエンドサービスが処理しない、または入力として持たないデータを受け取る場合、それは悪意ある悪用の可能性を示します。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

**Level:**
CRITICAL

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

**レベル:**
CRITICAL

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

**Example:**

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

**例:**

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```
{
    "datetime": "2019-01-01 00:00:00,000",
    "appid": "foobar.netportal_auth",
    "event": "malicious_extraneous:dr@evil.com,creditcardnum,Mozilla/5.0 (X11; Linux x86_64; rv:10.0) Gecko/20100101 Firefox/10.0",
    "level": "CRITICAL",
    "description": "User dr@evil.com included field creditcardnum in the request which is not handled by this service.",
    ...
}
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### malicious_attack_tool:[userid|IP,toolname,useragent]

**Description**
When obvious attack tools are identified either by signature or by user agent they should be logged.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### malicious_attack_tool:[userid|IP,toolname,useragent]

**説明**
明らかな攻撃ツールがシグネチャまたはユーザーエージェントによって識別された場合、それらをログに記録するべきです。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

For example, the tool "Nikto" leaves behind its user agent by default with a string like **_"Mozilla/5.00 (Nikto/2.1.6) (Evasions:None) (Test:Port Check)"_**

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

たとえば、ツール "Nikto" はデフォルトで **_"Mozilla/5.00 (Nikto/2.1.6) (Evasions:None) (Test:Port Check)"_** のような文字列をユーザーエージェントに残します。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

**Level:**
CRITICAL

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

**レベル:**
CRITICAL

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

**Example:**

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

**例:**

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```
{
    "datetime": "2019-01-01 00:00:00,000",
    "appid": "foobar.netportal_auth",
    "event": "malicious_attack_tool:127.0.0.1,nikto,Mozilla/5.00 (Nikto/2.1.6) (Evasions:None) (Test:Port Check)",
    "level": "CRITICAL",
    "description": "Attack traffic indicating use of Nikto coming from 127.0.0.1",
    ...
}
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### malicious_sqli:[userid|IP,parameter,ruleid,useragent]

**Description**
When request input matches a SQL injection (SQLi) signature or heuristic (e.g., comment delimiters, tautologies like `' OR 1=1 --`, stacked queries, `UNION SELECT`, etc.), block the request and log the attempt.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### malicious_sqli:[userid|IP,parameter,ruleid,useragent]

**説明**
リクエスト入力が SQL インジェクション (SQLi) のシグネチャまたはヒューリスティック (コメント区切り、`' OR 1=1 --` のようなトートロジー、スタッククエリ、`UNION SELECT` など) に一致する場合、リクエストをブロックし、その試行をログに記録します。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

_NOTE: Logging the payload is dangerous and may result in log injection. Prefer recording a detection rule ID / category and the parameter name over logging the full payload._

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

_注: ペイロードをログに記録することは危険であり、ログインジェクションにつながる可能性があります。完全なペイロードを記録するよりも、検知ルール ID / カテゴリとパラメータ名を記録することを推奨します。_

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

**Level:**
CRITICAL

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

**レベル:**
CRITICAL

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

**Example:**

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

**例:**

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```
{
    "datetime": "2019-01-01 00:00:00,000",
    "appid": "foobar.netportal_auth",
    "event": "malicious_sqli:127.0.0.1,search,SQLI-UNION,Mozilla/5.0 (X11; Linux x86_64; rv:10.0) Gecko/20100101 Firefox/10.0",
    "level": "CRITICAL",
    "description": "Request from 127.0.0.1 contained a SQL injection pattern (rule SQLI-UNION) in parameter 'search'.",
    ...
}
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### malicious_cors:[userid|IP,useragent,referer]

**Description**
When attempts are made from unauthorized origins they should of course be blocked, but also logged whenever possible. Even if we block an illegal cross-origin request the fact that the request is being made could be an indication of attack.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### malicious_cors:[userid|IP,useragent,referer]

**説明**
許可されていないオリジンから試行が行われた場合、当然ブロックするべきですが、可能な限りログにも記録するべきです。不正なクロスオリジンリクエストをブロックしたとしても、そのリクエストが行われている事実は攻撃の兆候である可能性があります。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

_NOTE: Did you know that the word "referer" is misspelled in the original HTTP specification? The correct spelling should be "referrer" but the original typo persists to this day and is used here intentionally._

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

_注: "referer" という単語は元の HTTP 仕様で綴り間違いされていることをご存じでしょうか。正しい綴りは "referrer" であるべきですが、元の誤字は今日まで残っており、ここでは意図的に使用されています。_

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

**Level:**
CRITICAL

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

**レベル:**
CRITICAL

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

**Example:**

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

**例:**

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```
{
    "datetime": "2019-01-01 00:00:00,000",
    "appid": "foobar.netportal_auth",
    "event": "malicious_cors:127.0.0.1,Mozilla/5.0 (X11; Linux x86_64; rv:10.0) Gecko/20100101 Firefox/10.0,attack.evil.com",
    "level": "CRITICAL",
    "description": "An illegal cross-origin request from 127.0.0.1 was referred from attack.evil.com"
    ...
}
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### malicious_direct_reference:[userid|IP, useragent]

**Description**
A common attack against authentication and authorization is to directly access an object without credentials or appropriate access authority. Failing to prevent this flaw used to be one of the OWASP Top Ten called **Insecure Direct Object Reference**. Assuming you've correctly prevented this attack, logging the attempt is valuable to identify malicious users.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### malicious_direct_reference:[userid|IP, useragent]

**説明**
認証と認可に対する一般的な攻撃は、認証情報や適切なアクセス権限なしにオブジェクトへ直接アクセスすることです。この欠陥を防げないことは、以前の OWASP Top Ten で **Insecure Direct Object Reference** と呼ばれていました。この攻撃を正しく防止できているという前提では、その試行をログに記録することは悪意あるユーザーを識別するうえで有用です。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

**Level:**
CRITICAL

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

**レベル:**
CRITICAL

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

**Example:**

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

**例:**

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```
{
    "datetime": "2019-01-01 00:00:00,000",
    "appid": "foobar.netportal_auth",
    "event": "malicious_direct_reference:joebob1, Mozilla/5.0 (X11; Linux x86_64; rv:10.0) Gecko/20100101 Firefox/10.0",
    "level": "CRITICAL",
    "description": "User joebob1 attempted to access an object to which they are not authorized",
    ...
}
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## MCP Servers [MCP]

This section focuses on concerns related to the use of MCP servers either within productivity applications, or at the enterprise level.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## MCP サーバー [MCP]

このセクションは、生産性アプリケーション内またはエンタープライズレベルで MCP サーバーを使用することに関連する懸念に焦点を当てます。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### mcp_prompt_injection[:userid]

**Description**
When an MCP client or server detects indicators of prompt injection (for example, instructions to ignore system/developer messages, attempts to override tool policies, requests to reveal secrets, or attempts to coerce tool calls outside of the intended task), block or constrain the action and log the event for investigation.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### mcp_prompt_injection[:userid]

**説明**
MCP クライアントまたはサーバーがプロンプトインジェクションの指標 (たとえば、system/developer メッセージを無視する指示、ツールポリシーを上書きしようとする試み、シークレットの開示要求、意図されたタスク外でツール呼び出しを強制しようとする試み) を検知した場合、そのアクションをブロックまたは制約し、調査のためにイベントをログに記録します。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

_NOTE: Avoid logging the full prompt/tool I/O. Prefer logging a detection category or rule ID, the target tool/server, and request identifiers to support triage without creating a secondary sensitive-data or log-injection risk._

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

_注: 完全なプロンプトやツール I/O をログに記録することは避けてください。二次的な機密データリスクやログインジェクションリスクを作らずにトリアージを支援するため、検知カテゴリまたはルール ID、対象ツール/サーバー、リクエスト識別子を記録することを推奨します。_

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

**Level:**
WARN

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

**レベル:**
WARN

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

**Example:**

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

**例:**

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```
{
    "datetime": "2019-01-01 00:00:00,000",
    "appid": "foobar.cooldevapp_mcp_toolname",
    "event": "mcp_prompt_injection:joebob1",
    "level": "WARN",
    "description": "A possible prompt injection has occurred",
    ...
}
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### mcp_resource_exhaustion[:userid]

**Description**
When an MCP client or server detects a request pattern intended to exhaust resources (for example, unusually large prompts, repeated retries, tool-call loops, or other behavior that drives excessive token usage and cost), terminate or throttle the activity and log the attempt.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### mcp_resource_exhaustion[:userid]

**説明**
MCP クライアントまたはサーバーが、リソースを枯渇させることを意図したリクエストパターン (たとえば、異常に大きなプロンプト、反復的な再試行、ツール呼び出しループ、過剰なトークン使用量とコストを引き起こすその他の振る舞い) を検知した場合、その活動を終了またはスロットリングし、その試行をログに記録します。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

_NOTE: Avoid logging full prompts or tool inputs/outputs. Prefer logging measured usage (tokens in/out), policy thresholds, request identifiers, and the tool/model involved._

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

_注: 完全なプロンプトやツール入力/出力をログに記録することは避けてください。測定された使用量 (入出力トークン)、ポリシーしきい値、リクエスト識別子、関連するツール/モデルを記録することを推奨します。_

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

**Level:**
WARN

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

**レベル:**
WARN

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

**Example:**

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

**例:**

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```
{
    "datetime": "2019-01-01 00:00:00,000",
    "appid": "foobar.cooldevapp_mcp_toolname",
    "event": "mcp_resource_exhaustion:joebob1",
    "level": "WARN",
    "description": "Request blocked due to token budget overrun (tokens_in=18240, tokens_out=0, budget=8000)",
    ...
}
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### mcp_tool_poisoning[:userid]

**Description**
When an MCP client or server detects that a tool may be malicious or tampered with (for example, unexpected tool changes, signature/hash verification failures, suspicious tool metadata, or a tool sourced from an agent/tool marketplace with minimal validation), block or quarantine the tool and log the attempt.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### mcp_tool_poisoning[:userid]

**説明**
MCP クライアントまたはサーバーが、ツールが悪意あるもの、または改ざんされた可能性があること (たとえば、予期しないツール変更、署名/ハッシュ検証失敗、疑わしいツールメタデータ、検証が最小限のエージェント/ツールマーケットプレイスから取得されたツール) を検知した場合、そのツールをブロックまたは隔離し、その試行をログに記録します。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

_NOTE: Tool ecosystems and agent marketplaces can enable rapid proliferation of third-party tools with relatively low validation. An internal marketplace or hashed allowlist for approved tools is highly recommended._

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

_注: ツールエコシステムとエージェントマーケットプレイスは、検証が比較的低い第三者ツールの急速な拡散を可能にします。承認済みツールの内部マーケットプレイスまたはハッシュ済み許可リストを使用することを強く推奨します。_

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

**Level:**
WARN

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

**レベル:**
WARN

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

**Example:**

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

**例:**

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```
{
    "datetime": "2019-01-01 00:00:00,000",
    "appid": "foobar.cooldevapp_mcp_toolname",
    "event": "mcp_tool_poisoning:joebob1",
    "level": "WARN",
    "description": "Tool execution blocked (tool=\"calendar_sync\", source=\"https://marketplace.example/tools/calendar_sync\", version=\"2.4.1\", signature=\"missing\", policy=\"allowlist_required\")",
    ...
}
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## Privilege Changes [PRIVILEGE]

This section focuses on object privilege changes such as read/write/execute permissions or objects in a database having authorization meta-information changed.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## 権限変更 [PRIVILEGE]

このセクションは、読み取り/書き込み/実行パーミッションなどのオブジェクト権限変更、またはデータベース内のオブジェクトの認可メタ情報変更に焦点を当てます。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

Changes to user/account are covered in the User Management section.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

ユーザー/アカウントへの変更は、ユーザー管理セクションで扱います。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### privilege_permissions_changed:[userid,file|object,fromlevel,tolevel]

**Description**
Tracking changes to objects to which there are access control restrictions can uncover attempt to escalate privilege on those files by unauthorized users.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### privilege_permissions_changed:[userid,file|object,fromlevel,tolevel]

**説明**
アクセス制御制限のあるオブジェクトへの変更を追跡することで、認可されていないユーザーによるファイル権限の昇格試行を発見できます。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

**Level:**
WARN

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

**レベル:**
WARN

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

**Example:**

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

**例:**

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```
{
    "datetime": "2019-01-01 00:00:00,000",
    "appid": "foobar.netportal_auth",
    "event": "permissions_changed:joebob1, /users/admin/some/important/path,0511,0777",
    "level": "WARN",
    "description": "User joebob1 changed permissions on /users/admin/some/important/path",
    ...
}
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## Sensitive Data Changes [DATA]

It's not necessary to log or alert on changes to all files, but in the case of highly sensitive files or data it is important that we monitor and alert on changes.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## 機密データ変更 [DATA]

すべてのファイルの変更をログに記録したりアラートしたりする必要はありませんが、非常に機密性の高いファイルやデータの場合は、変更を監視しアラートすることが重要です。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### sensitive_create:[userid,file|object]

**Description**
When a new piece of data is created and marked as sensitive or placed into a directory/table/repository where sensitive data is stored, that creation should be logged and reviewed periodically.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### sensitive_create:[userid,file|object]

**説明**
新しいデータが作成され、機密としてマークされた場合、または機密データが保存されるディレクトリ/テーブル/リポジトリに配置された場合、その作成をログに記録し、定期的にレビューするべきです。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

**Level:**
WARN

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

**レベル:**
WARN

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

**Example:**

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

**例:**

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```
{
    "datetime": "2019-01-01 00:00:00,000",
    "appid": "foobar.netportal_auth",
    "event": "sensitive_create:joebob1, /users/admin/some/important/path",
    "level": "WARN",
    "description": "User joebob1 created a new file in /users/admin/some/important/path",
    ...
}
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### sensitive_read:[userid,file|object]

**Description**
All data marked as sensitive or placed into a directory/table/repository where sensitive data is stored should be have access logged and reviewed periodically.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### sensitive_read:[userid,file|object]

**説明**
機密としてマークされた、または機密データが保存されるディレクトリ/テーブル/リポジトリに配置されたすべてのデータは、アクセスをログに記録し、定期的にレビューするべきです。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

**Level:**
WARN

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

**レベル:**
WARN

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

**Example:**

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

**例:**

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```
{
    "datetime": "2019-01-01 00:00:00,000",
    "appid": "foobar.netportal_auth",
    "event": "sensitive_read:joebob1, /users/admin/some/important/path",
    "level": "WARN",
    "description": "User joebob1 read file /users/admin/some/important/path",
    ...
}
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### sensitive_update:[userid,file|object]

**Description**
All data marked as sensitive or placed into a directory/table/repository where sensitive data is stored should be have updates to the data logged and reviewed periodically.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### sensitive_update:[userid,file|object]

**説明**
機密としてマークされた、または機密データが保存されるディレクトリ/テーブル/リポジトリに配置されたすべてのデータは、データの更新をログに記録し、定期的にレビューするべきです。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

**Level:**
WARN

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

**レベル:**
WARN

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

**Example:**

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

**例:**

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```
{
    "datetime": "2019-01-01 00:00:00,000",
    "appid": "foobar.netportal_auth",
    "event": "sensitive_update:joebob1, /users/admin/some/important/path",
    "level": "WARN",
    "description": "User joebob1 modified file /users/admin/some/important/path",
    ...
}
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### sensitive_delete:[userid,file|object]

**Description**
All data marked as sensitive or placed into a directory/table/repository where sensitive data is stored should have deletions of the data logged and reviewed periodically. The file should not be immediately deleted but marked for deletion and an archive of the file should be maintained according to legal/privacy requirements.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### sensitive_delete:[userid,file|object]

**説明**
機密としてマークされた、または機密データが保存されるディレクトリ/テーブル/リポジトリに配置されたすべてのデータは、データの削除をログに記録し、定期的にレビューするべきです。ファイルは即座に削除せず、削除対象としてマークし、法務/プライバシー要件に従ってファイルのアーカイブを維持するべきです。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

**Level:**
WARN

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

**レベル:**
WARN

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

**Example:**

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

**例:**

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```
{
    "datetime": "2019-01-01 00:00:00,000",
    "appid": "foobar.netportal_auth",
    "event": "sensitive_delete:joebob1, /users/admin/some/important/path",
    "level": "WARN",
    "description": "User joebob1 marked file /users/admin/some/important/path for deletion",
    ...
}
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## Sequence Errors [SEQUENCE]

Also called a **_business logic attack_**, if a specific path is expected through a system and an attempt is made to skip or change the order of that path it could indicate malicious intent.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## シーケンスエラー [SEQUENCE]

**_ビジネスロジック攻撃_** とも呼ばれます。システム内で特定のパスが期待されているにもかかわらず、そのパスをスキップしたり順序を変更したりする試行が行われた場合、悪意ある意図を示す可能性があります。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### sequence_fail:[userid]

**Description**
When a user reaches a part of the application out of sequence it may indicate intentional abuse of the business logic and should be tracked.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### sequence_fail:[userid]

**説明**
ユーザーがアプリケーションの一部に順序外で到達した場合、ビジネスロジックの意図的な悪用を示す可能性があり、追跡するべきです。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

**Level:**
CRITICAL

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

**レベル:**
CRITICAL

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

**Example:**

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

**例:**

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```
{
    "datetime": "2019-01-01 00:00:00,000",
    "appid": "foobar.netportal_auth",
    "event": "sequence_fail:joebob1",
    "level": "CRITICAL",
    "description": "User joebob1 has reached a part of the application out of the normal application flow.",
    ...
}
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## Session Management [SESSION]

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## セッション管理 [SESSION]

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### session_created:[userid]

**Description**
When a new authenticated session is created that session may be logged and activity monitored.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### session_created:[userid]

**説明**
新しい認証済みセッションが作成された場合、そのセッションをログに記録し、アクティビティを監視してもよいです。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

**Level:**
INFO

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

**レベル:**
INFO

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

**Example:**

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

**例:**

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```
    {
    "datetime": "2019-01-01 00:00:00,000",
    "appid": "foobar.netportal_auth",
    "event": "session_created:joebob1",
    "level": "INFO",
    "description": "User joebob1 has started a new session",
    ...
}
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### session_renewed:[userid]

**Description**
When a user is warned of session to be expired/revoked and chooses to extend their session that activity should be logged. Also, if the system in question contains highly confidential data then extending a session may require additional verification.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### session_renewed:[userid]

**説明**
ユーザーがセッションの期限切れ/失効について警告され、セッション延長を選択した場合、そのアクティビティをログに記録するべきです。また、対象システムに高度に機密なデータが含まれる場合、セッション延長には追加の検証が必要になる可能性があります。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

**Level:**
INFO

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

**レベル:**
INFO

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

**Example:**

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

**例:**

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```
{
    "datetime": "2019-01-01 00:00:00,000",
    "appid": "foobar.netportal_auth",
    "event": "session_renewed:joebob1",
    "level": "INFO",
    "description": "User joebob1 was warned of expiring session and extended.",
    ...
}
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### session_expired:[userid,reason]

**Description**
When a session expires, especially in the case of an authenticated session or with sensitive data, then that session expiry may be logged and clarifying data included. The reason code may be any such as: logout, timeout, revoked, etc. Sessions should never be deleted but rather expired in the case of revocation requirement.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### session_expired:[userid,reason]

**説明**
セッションが期限切れになった場合、特に認証済みセッションや機密データを伴う場合、そのセッション期限切れをログに記録し、説明データを含めてもよいです。理由コードには logout、timeout、revoked など任意の値を指定できます。失効要件がある場合、セッションは削除せず、期限切れにするべきです。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

**Level:**
INFO

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

**レベル:**
INFO

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

**Example:**

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

**例:**

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```
{
    "datetime": "2019-01-01 00:00:00,000",
    "appid": "foobar.netportal_auth",
    "event": "session_expired:joebob1,revoked",
    "level": "INFO",
    "description": "User joebob1 session expired due to administrator revocation.",
    ...
}
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### session_use_after_expire:[userid]

**Description**
In the case a user attempts to access systems with an expire session it may be helpful to log, especially if combined with subsequent login failure. This could identify a case where a malicious user is attempting a session hijack or directly accessing another person's machine/browser.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### session_use_after_expire:[userid]

**説明**
ユーザーが期限切れのセッションでシステムへアクセスしようとした場合、特にその後のログイン失敗と組み合わさるなら、ログに記録すると有用なことがあります。これは、悪意あるユーザーがセッションハイジャックを試みている、または他人のマシン/ブラウザに直接アクセスしているケースを識別できる可能性があります。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

**Level:**
CRITICAL

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

**レベル:**
CRITICAL

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

**Example:**

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

**例:**

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```
{
    "datetime": "2019-01-01 00:00:00,000",
    "appid": "foobar.netportal_auth",
    "event": "session_use_after_expire:joebob1",
    "level": "CRITICAL",
    "description": "User joebob1 attempted access after session expired.",
    ...
}
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## System Events [SYS]

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## システムイベント [SYS]

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### sys_startup:[userid]

**Description**
When a system is first started it can be valuable to log the startup, even if the system is serverless or a container, especially if possible to log the user that initiated the system.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### sys_startup:[userid]

**説明**
システムが最初に起動された場合、その起動をログに記録することは有用です。システムがサーバーレスやコンテナであっても同様であり、可能であればシステムを起動したユーザーをログに記録するとよいです。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

**Level:**
WARN

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

**レベル:**
WARN

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

**Example:**

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

**例:**

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```
{
    "datetime": "2019-01-01 00:00:00,000",
    "appid": "foobar.netportal_auth",
    "event": "sys_startup:joebob1",
    "level": "WARN",
    "description": "User joebob1 spawned a new instance",
    ...
}
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### sys_shutdown:[userid]

**Description**
When a system is shut down it can be valuable to log the event, even if the system is serverless or a container, especially if possible to log the user that initiated the system.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### sys_shutdown:[userid]

**説明**
システムがシャットダウンされた場合、そのイベントをログに記録することは有用です。システムがサーバーレスやコンテナであっても同様であり、可能であればシステムを停止したユーザーをログに記録するとよいです。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

**Level:**
WARN

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

**レベル:**
WARN

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

**Example:**

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

**例:**

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```
{
    "datetime": "2019-01-01 00:00:00,000",
    "appid": "foobar.netportal_auth",
    "event": "sys_shutdown:joebob1",
    "level": "WARN",
    "description": "User joebob1 stopped this instance",
    ...
}
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### sys_restart:[userid]

**Description**
When a system is restarted it can be valuable to log the event, even if the system is serverless or a container, especially if possible to log the user that initiated the system.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### sys_restart:[userid]

**説明**
システムが再起動された場合、そのイベントをログに記録することは有用です。システムがサーバーレスやコンテナであっても同様であり、可能であればシステムを再起動したユーザーをログに記録するとよいです。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

**Level:**
WARN

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

**レベル:**
WARN

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

**Example:**

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

**例:**

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```
{
    "datetime": "2019-01-01 00:00:00,000",
    "appid": "foobar.netportal_auth",
    "event": "sys_restart:joebob1",
    "level": "WARN",
    "description": "User joebob1 initiated a restart",
    ...
}
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### sys_crash[:reason]

**Description**
If possible to catch an unstable condition resulting in the crash of a system, logging that event could be helpful, especially if the event is triggered by an attack.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### sys_crash[:reason]

**説明**
システムのクラッシュにつながる不安定な状態を捕捉できる場合、そのイベントをログに記録すると有用です。特に、そのイベントが攻撃によってトリガーされた場合に有用です。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

**Level:**
WARN

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

**レベル:**
WARN

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

**Example:**

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

**例:**

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```
{
    "datetime": "2019-01-01 00:00:00,000",
    "appid": "foobar.netportal_auth",
    "event": "sys_crash:outofmemory,
    "level": "WARN",
    "description": "The system crashed due to Out of Memory error.",
    ...
}
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### sys_monitor_disabled:[userid,monitor]

**Description**
If your systems contain agents responsible for file integrity, resources, logging, virus, etc. it is especially valuable to know if they are halted and by whom.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### sys_monitor_disabled:[userid,monitor]

**説明**
システムにファイル整合性、リソース、ロギング、ウイルス対策などを担当するエージェントが含まれている場合、それらが停止されたかどうか、誰によって停止されたかを知ることは特に重要です。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

**Level:**
WARN

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

**レベル:**
WARN

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

**Example:**

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

**例:**

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```
{
    "datetime": "2019-01-01 00:00:00,000",
    "appid": "foobar.netportal_auth",
    "event": "sys_monitor_disabled:joebob1,crowdstrike",
    "level": "WARN",
    "description": "User joebob1 has disabled CrowdStrike",
    ...
}
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### sys_monitor_enabled:[userid,monitor]

**Description**
If your systems contain agents responsible for file integrity, resources, logging, virus, etc. it is especially valuable to know if they are started again after being stopped, and by whom.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### sys_monitor_enabled:[userid,monitor]

**説明**
システムにファイル整合性、リソース、ロギング、ウイルス対策などを担当するエージェントが含まれている場合、それらが停止後に再開されたかどうか、誰によって再開されたかを知ることは特に重要です。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

**Level:**
WARN

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

**レベル:**
WARN

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

**Example:**

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

**例:**

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```
{
    "datetime": "2019-01-01 00:00:00,000",
    "appid": "foobar.netportal_auth",
    "event": "sys_monitor_enabled:joebob1,crowdstrike",
    "level": "WARN",
    "description": "User joebob1 has enabled CrowdStrike",
    ...
}
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## User Management [USER]

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## ユーザー管理 [USER]

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### user_created:[userid,newuserid,attributes[one,two,three]]

**Description**
When creating new users, logging the specifics of the user creation event is helpful, especially if new users can be created with administration privileges.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### user_created:[userid,newuserid,attributes[one,two,three]]

**説明**
新しいユーザーを作成する場合、ユーザー作成イベントの詳細をログに記録することは有用です。特に、新しいユーザーを管理者権限付きで作成できる場合に重要です。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

**Level:**
WARN

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

**レベル:**
WARN

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

**Example:**

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

**例:**

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```
{
    "datetime": "2019-01-01 00:00:00,000",
    "appid": "foobar.netportal_auth",
    "event": "user_created:joebob1,user1,admin:create,update,delete",
    "level": "WARN",
    "description": "User joebob1 created user1 with admin:create,update,delete privilege attributes",
    ...
}
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### user_updated:[userid,onuserid,attributes[one,two,three]]

**Description**
When updating users, logging the specifics of the user update event is helpful, especially if users can be updated with administration privileges.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### user_updated:[userid,onuserid,attributes[one,two,three]]

**説明**
ユーザーを更新する場合、ユーザー更新イベントの詳細をログに記録することは有用です。特に、ユーザーを管理者権限付きで更新できる場合に重要です。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

**Level:**
WARN

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

**レベル:**
WARN

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

**Example:**

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

**例:**

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```
{
    "datetime": "2019-01-01 00:00:00,000",
    "appid": "foobar.netportal_auth",
    "event": "user_updated:joebob1,user1,admin:create,update,delete",
    "level": "WARN",
    "description": "User joebob1 updated user1 with attributes admin:create,update,delete privilege attributes",
    ...
}
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### user_archived:[userid,onuserid]

**Description**
It is always best to archive users rather than deleting, except where required. When archiving users, logging the specifics of the user archive event is helpful. A malicious user could use this feature to deny service to legitimate users.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### user_archived:[userid,onuserid]

**説明**
必須の場合を除き、ユーザーは削除するよりもアーカイブするのが常に最善です。ユーザーをアーカイブする場合、ユーザーアーカイブイベントの詳細をログに記録することは有用です。悪意あるユーザーがこの機能を使って正当なユーザーに対するサービス拒否を行う可能性があります。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

**Level:**
WARN

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

**レベル:**
WARN

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

**Example:**

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

**例:**

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```
{
    "datetime": "2019-01-01 00:00:00,000",
    "appid": "foobar.netportal_auth",
    "event": "user_archived:joebob1,user1",
    "level": "WARN",
    "description": "User joebob1 archived user1",
    ...
}
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

### user_deleted:[userid,onuserid]

**Description**
It is always best to archive users rather than deleting, except where required. When deleting users, logging the specifics of the user delete event is helpful. A malicious user could use this feature to deny service to legitimate users.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

### user_deleted:[userid,onuserid]

**説明**
必須の場合を除き、ユーザーは削除するよりもアーカイブするのが常に最善です。ユーザーを削除する場合、ユーザー削除イベントの詳細をログに記録することは有用です。悪意あるユーザーがこの機能を使って正当なユーザーに対するサービス拒否を行う可能性があります。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

**Level:**
WARN

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

**レベル:**
WARN

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

**Example:**

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

**例:**

</div>
</div>

<div className="bilingualCommon">
<span className="bilingualLabel common">コード・画像 (共通)</span>

```
{
    "datetime": "2019-01-01 00:00:00,000",
    "appid": "foobar.netportal_auth",
    "event": "user_deleted:joebob1,user1",
    "level": "WARN",
    "description": "User joebob1 has deleted user1",
    ...
}
```

</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

## Exclusions

As important as what you DO log is what you DON'T log. Private or secret information, source code, keys, certs, etc. should never be logged.

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

## 除外事項

何をログに記録するかと同じくらい、何をログに記録しないかも重要です。プライベート情報や秘密情報、ソースコード、鍵、証明書などは、決してログに記録するべきではありません。

</div>
</div>

<div className="bilingualPair">
<div className="bilingualBlock english">
<span className="bilingualLabel english">English (原文)</span>

For comprehensive overview of items that should be excluded from logging, please see the [OWASP Logging Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html#data-to-exclude).

</div>
<div className="bilingualBlock japanese">
<span className="bilingualLabel japanese">日本語 (翻訳)</span>

ログから除外するべき項目の包括的な概要については、[OWASP Logging Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html#data-to-exclude) を参照してください。

</div>
</div>

</section>
</div>



## Attribution

<div className="attributionFooter">

- Original: Logging Vocabulary Cheat Sheet
- Source: https://cheatsheetseries.owasp.org/cheatsheets/Logging_Vocabulary_Cheat_Sheet.html
- Copyright: Cheat Sheets Series Team
- License: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
- License URL: https://creativecommons.org/licenses/by-sa/4.0/
- Changes: English original retained for comparison. Japanese translation added. Bilingual display generated from official source and local Japanese translation.
- Retrieved: 2026-05-20

</div>
