# ロギング語彙チートシート 日本語訳

## Attribution

- Original: Logging Vocabulary Cheat Sheet
- Source: https://cheatsheetseries.owasp.org/cheatsheets/Logging_Vocabulary_Cheat_Sheet.html
- Copyright: Cheat Sheets Series Team
- License: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
- License URL: https://creativecommons.org/licenses/by-sa/4.0/
- Changes: Japanese translation added.
- Retrieved: 2026-05-21

## 日本語訳

# アプリケーションロギング語彙チートシート

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

```json
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
```text

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

```text
{
    "datetime": "2019-01-01 00:00:00,000",
    "appid": "foobar.netportal_auth",
    "event": "authn_login_success:joebob1",
    "level": "INFO",
    "description": "User joebob1 login successfully",
    ...
}
```text

---

### authn_login_successafterfail[:userid,retries]

**説明**
ユーザーが以前に失敗した後で正常にログインしました。

**レベル:**
INFO

**例:**

```text
{
    "datetime": "2019-01-01 00:00:00,000",
    "appid": "foobar.netportal_auth",
    "event": "authn_login_successafterfail:joebob1,2",
    "level": "INFO",
    "description": "User joebob1 login successfully",
    ...
}
```text

---

### authn_login_fail[:userid]

**説明**
失敗を含むすべてのログインイベントを記録するべきです。

**レベル:**
WARN

**例:**

```text
{
    "datetime": "2019-01-01 00:00:00,000",
    "appid": "foobar.netportal_auth",
    "event": "authn_login_fail:joebob1",
    "level": "WARN",
    "description": "User joebob1 login failed",
    ...
}
```text

---

### authn_login_fail_max[:userid,maxlimit(int)]

**説明**
失敗を含むすべてのログインイベントを記録するべきです。

**レベル:**
WARN

**例:**

```text
{
    "datetime": "2019-01-01 00:00:00,000",
    "appid": "foobar.netportal_auth",
    "event": "authn_login_fail_max:joebob1,3",
    "level": "WARN",
    "description": "User joebob1 reached the login fail limit of 3",
    ...
}
```text

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

```text
{
    "datetime": "2019-01-01 00:00:00,000",
    "appid": "foobar.netportal_auth",
    "event": "authn_login_lock:joebob1,maxretries",
    "level": "WARN",
    "description": "User joebob1 login locked because maxretries exceeded",
    ...
}
```text

---

### authn_password_change[:userid]

**説明**
すべてのパスワード変更は、その対象となった userid を含めてログに記録するべきです。

**レベル:**
INFO

**例:**

```text
{
    "datetime": "2019-01-01 00:00:00,000",
    "appid": "foobar.netportal_auth",
    "event": "authn_password_change:joebob1",
    "level": "INFO",
    "description": "User joebob1 has successfully changed their password",
    ...
}
```text

---

### authn_password_change_fail[:userid]

**説明**
失敗したパスワード変更の試行です。`authn_login_lock` など、他のイベントもトリガーする可能性があります。

**レベル:**
CRITICAL

**例:**

```text
{
    "datetime": "2019-01-01 00:00:00,000",
    "appid": "foobar.netportal_auth",
    "event": "authn_password_change_fail:joebob1",
    "level": "CRITICAL",
    "description": "User joebob1 failed to change their password",
    ...
}
```text

---

### authn_impossible_travel[:userid,region1,region2]

**説明**
ユーザーがある都市からログインしており、合理的な時間内には移動できないほど遠い別の都市に突然現れた場合、多くの場合、アカウント乗っ取りの可能性を示します。

**レベル:**: CRITICAL

**例:**

```text
{
    "datetime": "2019-01-01 00:00:00,000",
    "appid": "foobar.netportal_auth",
    "event": "authn_impossible_travel:joebob1,US-OR,CN-SH",
    "level": "CRITICAL",
    "description": "User joebob1 has accessed the application in two distant cities at the same time",
    ...
}
```text

---

### authn_token_created[:userid, entitlement(s)]

**説明**
サービスアクセス用のトークンが作成された場合、それを記録するべきです。

**レベル:**: INFO

**例:**

```text
{
    "datetime": "2019-01-01 00:00:00,000",
    "appid": "aws.foobar.com",
    "event": "authn_token_created:app.foobarapi.prod,create,read,update",
    "level": "INFO",
    "description": "A token has been created for app.foobarapi.prod with create,read,update",
    ...
}
```text

---

### authn_token_revoked[:userid,tokenid]

**説明**
指定されたアカウントのトークンが失効されました。

**レベル:**: INFO

**例:**

```text
{
    "datetime": "2019-01-01 00:00:00,000",
    "appid": "aws.foobar.com",
    "event": "authn_token_revoked:app.foobarapi.prod,xyz-abc-123-gfk",
    "level": "INFO",
    "description": "Token ID: xyz-abc-123-gfk was revoked for user app.foobarapi.prod",
    ...
}
```text

---

### authn_token_reuse[:userid,tokenid]

**説明**
以前に失効されたトークンが再利用されようとしました。

**レベル:**: CRITICAL

**例:**

```text
{
    "datetime": "2019-01-01 00:00:00,000",
    "appid": "aws.foobar.com",
    "event": "authn_token_reuse:app.foobarapi.prod,xyz-abc-123-gfk",
    "level": "CRITICAL",
    "description": "User app.foobarapi.prod attempted to use token ID: xyz-abc-123-gfk which was previously revoked",
    ...
}
```text

---

### authn_token_delete[:appid]

**説明**
トークンが削除された場合、それを記録するべきです。

**レベル:**: WARN

**例:**

```text
{
    "datetime": "2019-01-01 00:00:00,000",
    "appid": "foobar.netportal_auth",
    "event": "authn_token_delete:foobarapi",
    "level": "WARN",
    "description": "The token for foobarapi has been deleted",
    ...
}
```text

---

## 認可 [AUTHZ]

---

### authz_fail[:userid,resource]

**説明**
認可されていないリソースにアクセスする試行が行われました。

**レベル:**: CRITICAL

**例:**

```text
{
    "datetime": "2019-01-01 00:00:00,000",
    "appid": "foobar.netportal_auth",
    "event": "authz_fail:joebob1,resource",
    "level": "CRITICAL",
    "description": "User joebob1 attempted to access a resource without entitlement",
    ...
}
```text

---

### authz_change[:userid,from,to]

**説明**
ユーザーまたはエンティティの権限 (entitlements) が変更されました。

**レベル:**: WARN

**例:**

```text
{
    "datetime": "2019-01-01 00:00:00,000",
    "appid": "foobar.netportal_auth",
    "event": "authz_change:joebob1,user,admin",
    "level": "WARN",
    "description": "User joebob1 access was changed from user to admin",
    ...
}
```text

---

### authz_admin[:userid,event]

**説明**
管理者などの特権ユーザーによるすべてのアクティビティを記録するべきです。

**レベル:**: WARN

**例:**

```text
{
    "datetime": "2019-01-01 00:00:00,000",
    "appid": "foobar.netportal_auth",
    "event": "authz_admin:joebob1,user_privilege_change",
    "level": "WARN",
    "description": "Administrator joebob1 has updated privileges of user foobarapi from user to admin",
    ...
}
```text

---

## 暗号化/復号 [CRYPT]

### crypt_decrypt_fail[userid]

**説明**
暗号化や復号の実行失敗は、単純なシステムエラーである場合もあれば、ユーザーが関連データに対する権限を持たないという認可失敗に関連している場合もあります。

**レベル:**: WARN

**例:**

```text
{
    "datetime": "2019-01-01 00:00:00,000",
    "appid": "foobar.netportal_auth",
    "event": "crypt_decrypt_fail:joebob1",
    "level": "WARN",
    "description": "User joebob1 was unable to perform decryption" + err,
    ...
}
```text

---

### crypt_encrypt_fail[userid]

**説明**
暗号化や復号の実行失敗は、単純なシステムエラーである場合もあれば、ユーザーが関連データに対する権限を持たないという認可失敗に関連している場合もあります。

**レベル:**: WARN

**例:**

```text
{
    "datetime": "2019-01-01 00:00:00,000",
    "appid": "foobar.netportal_auth",
    "event": "crypt_encrypt_fail:joebob1",
    "level": "WARN",
    "description": "User joebob1 was unable to perform encryption" + err,
    ...
}
```text

---

## 過剰利用 [EXCESS]

### excess_rate_limit_exceeded[userid,max]

**説明**
想定されるサービス制限の上限を設定し、それを超過した場合は、単にコストやスケーリングを管理する目的であっても、アラートを出すべきです。

**レベル:**: WARN

**例:**

```text
{
    "datetime": "2019-01-01 00:00:00,000",
    "appid": "foobar.netportal_auth",
    "event": "excess_rate_limit_exceeded:app.foobarapi.prod,100000",
    "level": "WARN",
    "description": "User app.foobarapi.prod has exceeded max:100000 requests",
    ...
}
```text

---

## ファイルアップロード [UPLOAD]

### upload_complete[userid,filename,type]

**説明**
ファイルアップロードが成功した場合、検証プロセスの最初のステップはアップロードが完了したことです。

**レベル:**: INFO

**例:**

```text
    {
    "datetime": "2019-01-01 00:00:00,000",
    "appid": "foobar.netportal_auth",
    "event": "upload_complete:joebob1,user_generated_content.png,PNG",
    "level": "INFO",
    "description": "User joebob1 has uploaded user_generated_content.png",
    ...
}
```text

---

### upload_stored[filename,from,to]

**説明**
適切なファイルアップロード検証の一つのステップは、ファイルを移動またはリネームし、コンテンツをエンドユーザーに返す際に、ダウンロードで元のファイル名を参照しないことです。これはファイルシステムに保存する場合にも、ブロックストレージに保存する場合にも当てはまります。

**レベル:**: INFO

**例:**

```text
{
    "datetime": "2019-01-01 00:00:00,000",
    "appid": "foobar.netportal_auth",
    "event": "upload_stored:user_generated_content.png,kjsdhkrjhwijhsiuhdf000010202002",
    "level": "INFO",
    "description": "File user_generated_content.png was stored in the database with key abcdefghijk101010101",
    ...
}
```text

---

### upload_validation[filename,(virusscan|imagemagick|...):(FAILED|incomplete|passed)]

**説明**
すべてのファイルアップロードには、正しさ (実際にファイルタイプ x であるか) と安全性 (ウイルスを含まないか) の両方について、何らかの検証を実施するべきです。

**レベル:**: INFO|CRITICAL

**例:**

```text
{
    "datetime": "2019-01-01 00:00:00,000",
    "appid": "foobar.netportal_auth",
    "event": "upload_validation:filename,virusscan:FAILED",
    "level": "CRITICAL",
    "description": "File user_generated_content.png FAILED virus scan and was purged",
    ...
}
```text

---

### upload_delete[userid,fileid]

**説明**
通常の理由でファイルが削除された場合、それを記録するべきです。

**レベル:**: INFO

**例:**

```text
{
    "datetime": "2019-01-01 00:00:00,000",
    "appid": "foobar.netportal_auth",
    "event": "upload_delete:joebob1,",
    "level": "INFO",
    "description": "User joebob1 has marked file abcdefghijk101010101 for deletion.",
    ...
}
```text

---

## 入力検証 [INPUT]

### input_validation_fail:[(fieldone,fieldtwo...),userid]

**説明**
サーバー側で入力検証が失敗する場合、その原因は a) クライアントで十分な検証が提供されていない、または b) クライアント側検証が迂回された、のどちらかであるはずです。いずれの場合も攻撃の機会であり、迅速に緩和するべきです。

**レベル:**
WARN

**例:**

```text
{
    "datetime": "2019-01-01 00:00:00,000",
    "appid": "foobar.netportal_auth",
    "event": "input_validation_fail:(zip,date_of_birth),joebob1",
    "level": "WARN",
    "description": "User joebob1 submitted data that failed validation.",
    ...
}
```text

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
```text

---

## 悪意ある振る舞い [MALICIOUS

### malicious_excess_404:[userid|IP,useragent]

**説明**
ユーザーが存在しないファイルに対して多数のリクエストを行う場合、それは存在する可能性のあるファイルを「force-browse」しようとする試みの指標であることが多く、悪意ある意図を示す振る舞いであることがよくあります。

**レベル:**
WARN

**例:**

```text
{
    "datetime": "2019-01-01 00:00:00,000",
    "appid": "foobar.netportal_auth",
    "event": "malicious_excess404:123.456.789.101,M@l1c10us-Hax0rB0t0-v1",
    "level": "WARN",
    "description": "A user at 123.456.789.101 has generated a large number of 404 requests.",
    ...
}
```text

---

### malicious_extraneous:[userid|IP,inputname,useragent]

**説明**
ユーザーがバックエンドハンドラーに想定外のデータを送信する場合、入力検証エラーを探る行為を示す可能性があります。バックエンドサービスが処理しない、または入力として持たないデータを受け取る場合、それは悪意ある悪用の可能性を示します。

**レベル:**
CRITICAL

**例:**

```text
{
    "datetime": "2019-01-01 00:00:00,000",
    "appid": "foobar.netportal_auth",
    "event": "malicious_extraneous:dr@evil.com,creditcardnum,Mozilla/5.0 (X11; Linux x86_64; rv:10.0) Gecko/20100101 Firefox/10.0",
    "level": "CRITICAL",
    "description": "User dr@evil.com included field creditcardnum in the request which is not handled by this service.",
    ...
}
```text

---

### malicious_attack_tool:[userid|IP,toolname,useragent]

**説明**
明らかな攻撃ツールがシグネチャまたはユーザーエージェントによって識別された場合、それらをログに記録するべきです。

たとえば、ツール "Nikto" はデフォルトで **_"Mozilla/5.00 (Nikto/2.1.6) (Evasions:None) (Test:Port Check)"_** のような文字列をユーザーエージェントに残します。

**レベル:**
CRITICAL

**例:**

```text
{
    "datetime": "2019-01-01 00:00:00,000",
    "appid": "foobar.netportal_auth",
    "event": "malicious_attack_tool:127.0.0.1,nikto,Mozilla/5.00 (Nikto/2.1.6) (Evasions:None) (Test:Port Check)",
    "level": "CRITICAL",
    "description": "Attack traffic indicating use of Nikto coming from 127.0.0.1",
    ...
}
```text

---

### malicious_sqli:[userid|IP,parameter,ruleid,useragent]

**説明**
リクエスト入力が SQL インジェクション (SQLi) のシグネチャまたはヒューリスティック (コメント区切り、`' OR 1=1 --` のようなトートロジー、スタッククエリ、`UNION SELECT` など) に一致する場合、リクエストをブロックし、その試行をログに記録します。

_注: ペイロードをログに記録することは危険であり、ログインジェクションにつながる可能性があります。完全なペイロードを記録するよりも、検知ルール ID / カテゴリとパラメータ名を記録することを推奨します。_

**レベル:**
CRITICAL

**例:**

```text
{
    "datetime": "2019-01-01 00:00:00,000",
    "appid": "foobar.netportal_auth",
    "event": "malicious_sqli:127.0.0.1,search,SQLI-UNION,Mozilla/5.0 (X11; Linux x86_64; rv:10.0) Gecko/20100101 Firefox/10.0",
    "level": "CRITICAL",
    "description": "Request from 127.0.0.1 contained a SQL injection pattern (rule SQLI-UNION) in parameter 'search'.",
    ...
}
```text

---

### malicious_cors:[userid|IP,useragent,referer]

**説明**
許可されていないオリジンから試行が行われた場合、当然ブロックするべきですが、可能な限りログにも記録するべきです。不正なクロスオリジンリクエストをブロックしたとしても、そのリクエストが行われている事実は攻撃の兆候である可能性があります。

_注: "referer" という単語は元の HTTP 仕様で綴り間違いされていることをご存じでしょうか。正しい綴りは "referrer" であるべきですが、元の誤字は今日まで残っており、ここでは意図的に使用されています。_

**レベル:**
CRITICAL

**例:**

```text
{
    "datetime": "2019-01-01 00:00:00,000",
    "appid": "foobar.netportal_auth",
    "event": "malicious_cors:127.0.0.1,Mozilla/5.0 (X11; Linux x86_64; rv:10.0) Gecko/20100101 Firefox/10.0,attack.evil.com",
    "level": "CRITICAL",
    "description": "An illegal cross-origin request from 127.0.0.1 was referred from attack.evil.com"
    ...
}
```text

---

### malicious_direct_reference:[userid|IP, useragent]

**説明**
認証と認可に対する一般的な攻撃は、認証情報や適切なアクセス権限なしにオブジェクトへ直接アクセスすることです。この欠陥を防げないことは、以前の OWASP Top Ten で **Insecure Direct Object Reference** と呼ばれていました。この攻撃を正しく防止できているという前提では、その試行をログに記録することは悪意あるユーザーを識別するうえで有用です。

**レベル:**
CRITICAL

**例:**

```text
{
    "datetime": "2019-01-01 00:00:00,000",
    "appid": "foobar.netportal_auth",
    "event": "malicious_direct_reference:joebob1, Mozilla/5.0 (X11; Linux x86_64; rv:10.0) Gecko/20100101 Firefox/10.0",
    "level": "CRITICAL",
    "description": "User joebob1 attempted to access an object to which they are not authorized",
    ...
}
```text

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

```text
{
    "datetime": "2019-01-01 00:00:00,000",
    "appid": "foobar.cooldevapp_mcp_toolname",
    "event": "mcp_prompt_injection:joebob1",
    "level": "WARN",
    "description": "A possible prompt injection has occurred",
    ...
}
```text

---

### mcp_resource_exhaustion[:userid]

**説明**
MCP クライアントまたはサーバーが、リソースを枯渇させることを意図したリクエストパターン (たとえば、異常に大きなプロンプト、反復的な再試行、ツール呼び出しループ、過剰なトークン使用量とコストを引き起こすその他の振る舞い) を検知した場合、その活動を終了またはスロットリングし、その試行をログに記録します。

_注: 完全なプロンプトやツール入力/出力をログに記録することは避けてください。測定された使用量 (入出力トークン)、ポリシーしきい値、リクエスト識別子、関連するツール/モデルを記録することを推奨します。_

**レベル:**
WARN

**例:**

```text
{
    "datetime": "2019-01-01 00:00:00,000",
    "appid": "foobar.cooldevapp_mcp_toolname",
    "event": "mcp_resource_exhaustion:joebob1",
    "level": "WARN",
    "description": "Request blocked due to token budget overrun (tokens_in=18240, tokens_out=0, budget=8000)",
    ...
}
```text

---

### mcp_tool_poisoning[:userid]

**説明**
MCP クライアントまたはサーバーが、ツールが悪意あるもの、または改ざんされた可能性があること (たとえば、予期しないツール変更、署名/ハッシュ検証失敗、疑わしいツールメタデータ、検証が最小限のエージェント/ツールマーケットプレイスから取得されたツール) を検知した場合、そのツールをブロックまたは隔離し、その試行をログに記録します。

_注: ツールエコシステムとエージェントマーケットプレイスは、検証が比較的低い第三者ツールの急速な拡散を可能にします。承認済みツールの内部マーケットプレイスまたはハッシュ済み許可リストを使用することを強く推奨します。_

**レベル:**
WARN

**例:**

```text
{
    "datetime": "2019-01-01 00:00:00,000",
    "appid": "foobar.cooldevapp_mcp_toolname",
    "event": "mcp_tool_poisoning:joebob1",
    "level": "WARN",
    "description": "Tool execution blocked (tool=\"calendar_sync\", source=\"https://marketplace.example/tools/calendar_sync\", version=\"2.4.1\", signature=\"missing\", policy=\"allowlist_required\")",
    ...
}
```text

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

```text
{
    "datetime": "2019-01-01 00:00:00,000",
    "appid": "foobar.netportal_auth",
    "event": "permissions_changed:joebob1, /users/admin/some/important/path,0511,0777",
    "level": "WARN",
    "description": "User joebob1 changed permissions on /users/admin/some/important/path",
    ...
}
```text

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

```text
{
    "datetime": "2019-01-01 00:00:00,000",
    "appid": "foobar.netportal_auth",
    "event": "sensitive_create:joebob1, /users/admin/some/important/path",
    "level": "WARN",
    "description": "User joebob1 created a new file in /users/admin/some/important/path",
    ...
}
```text

---

### sensitive_read:[userid,file|object]

**説明**
機密としてマークされた、または機密データが保存されるディレクトリ/テーブル/リポジトリに配置されたすべてのデータは、アクセスをログに記録し、定期的にレビューするべきです。

**レベル:**
WARN

**例:**

```text
{
    "datetime": "2019-01-01 00:00:00,000",
    "appid": "foobar.netportal_auth",
    "event": "sensitive_read:joebob1, /users/admin/some/important/path",
    "level": "WARN",
    "description": "User joebob1 read file /users/admin/some/important/path",
    ...
}
```text

---

### sensitive_update:[userid,file|object]

**説明**
機密としてマークされた、または機密データが保存されるディレクトリ/テーブル/リポジトリに配置されたすべてのデータは、データの更新をログに記録し、定期的にレビューするべきです。

**レベル:**
WARN

**例:**

```text
{
    "datetime": "2019-01-01 00:00:00,000",
    "appid": "foobar.netportal_auth",
    "event": "sensitive_update:joebob1, /users/admin/some/important/path",
    "level": "WARN",
    "description": "User joebob1 modified file /users/admin/some/important/path",
    ...
}
```text

---

### sensitive_delete:[userid,file|object]

**説明**
機密としてマークされた、または機密データが保存されるディレクトリ/テーブル/リポジトリに配置されたすべてのデータは、データの削除をログに記録し、定期的にレビューするべきです。ファイルは即座に削除せず、削除対象としてマークし、法務/プライバシー要件に従ってファイルのアーカイブを維持するべきです。

**レベル:**
WARN

**例:**

```text
{
    "datetime": "2019-01-01 00:00:00,000",
    "appid": "foobar.netportal_auth",
    "event": "sensitive_delete:joebob1, /users/admin/some/important/path",
    "level": "WARN",
    "description": "User joebob1 marked file /users/admin/some/important/path for deletion",
    ...
}
```text

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

```text
{
    "datetime": "2019-01-01 00:00:00,000",
    "appid": "foobar.netportal_auth",
    "event": "sequence_fail:joebob1",
    "level": "CRITICAL",
    "description": "User joebob1 has reached a part of the application out of the normal application flow.",
    ...
}
```text

---

## セッション管理 [SESSION]

### session_created:[userid]

**説明**
新しい認証済みセッションが作成された場合、そのセッションをログに記録し、アクティビティを監視してもよいです。

**レベル:**
INFO

**例:**

```text
    {
    "datetime": "2019-01-01 00:00:00,000",
    "appid": "foobar.netportal_auth",
    "event": "session_created:joebob1",
    "level": "INFO",
    "description": "User joebob1 has started a new session",
    ...
}
```text

---

### session_renewed:[userid]

**説明**
ユーザーがセッションの期限切れ/失効について警告され、セッション延長を選択した場合、そのアクティビティをログに記録するべきです。また、対象システムに高度に機密なデータが含まれる場合、セッション延長には追加の検証が必要になる可能性があります。

**レベル:**
INFO

**例:**

```text
{
    "datetime": "2019-01-01 00:00:00,000",
    "appid": "foobar.netportal_auth",
    "event": "session_renewed:joebob1",
    "level": "INFO",
    "description": "User joebob1 was warned of expiring session and extended.",
    ...
}
```text

---

### session_expired:[userid,reason]

**説明**
セッションが期限切れになった場合、特に認証済みセッションや機密データを伴う場合、そのセッション期限切れをログに記録し、説明データを含めてもよいです。理由コードには logout、timeout、revoked など任意の値を指定できます。失効要件がある場合、セッションは削除せず、期限切れにするべきです。

**レベル:**
INFO

**例:**

```text
{
    "datetime": "2019-01-01 00:00:00,000",
    "appid": "foobar.netportal_auth",
    "event": "session_expired:joebob1,revoked",
    "level": "INFO",
    "description": "User joebob1 session expired due to administrator revocation.",
    ...
}
```text

---

### session_use_after_expire:[userid]

**説明**
ユーザーが期限切れのセッションでシステムへアクセスしようとした場合、特にその後のログイン失敗と組み合わさるなら、ログに記録すると有用なことがあります。これは、悪意あるユーザーがセッションハイジャックを試みている、または他人のマシン/ブラウザに直接アクセスしているケースを識別できる可能性があります。

**レベル:**
CRITICAL

**例:**

```text
{
    "datetime": "2019-01-01 00:00:00,000",
    "appid": "foobar.netportal_auth",
    "event": "session_use_after_expire:joebob1",
    "level": "CRITICAL",
    "description": "User joebob1 attempted access after session expired.",
    ...
}
```text

---

## システムイベント [SYS]

### sys_startup:[userid]

**説明**
システムが最初に起動された場合、その起動をログに記録することは有用です。システムがサーバーレスやコンテナであっても同様であり、可能であればシステムを起動したユーザーをログに記録するとよいです。

**レベル:**
WARN

**例:**

```text
{
    "datetime": "2019-01-01 00:00:00,000",
    "appid": "foobar.netportal_auth",
    "event": "sys_startup:joebob1",
    "level": "WARN",
    "description": "User joebob1 spawned a new instance",
    ...
}
```text

---

### sys_shutdown:[userid]

**説明**
システムがシャットダウンされた場合、そのイベントをログに記録することは有用です。システムがサーバーレスやコンテナであっても同様であり、可能であればシステムを停止したユーザーをログに記録するとよいです。

**レベル:**
WARN

**例:**

```text
{
    "datetime": "2019-01-01 00:00:00,000",
    "appid": "foobar.netportal_auth",
    "event": "sys_shutdown:joebob1",
    "level": "WARN",
    "description": "User joebob1 stopped this instance",
    ...
}
```text

---

### sys_restart:[userid]

**説明**
システムが再起動された場合、そのイベントをログに記録することは有用です。システムがサーバーレスやコンテナであっても同様であり、可能であればシステムを再起動したユーザーをログに記録するとよいです。

**レベル:**
WARN

**例:**

```text
{
    "datetime": "2019-01-01 00:00:00,000",
    "appid": "foobar.netportal_auth",
    "event": "sys_restart:joebob1",
    "level": "WARN",
    "description": "User joebob1 initiated a restart",
    ...
}
```text

---

### sys_crash[:reason]

**説明**
システムのクラッシュにつながる不安定な状態を捕捉できる場合、そのイベントをログに記録すると有用です。特に、そのイベントが攻撃によってトリガーされた場合に有用です。

**レベル:**
WARN

**例:**

```text
{
    "datetime": "2019-01-01 00:00:00,000",
    "appid": "foobar.netportal_auth",
    "event": "sys_crash:outofmemory,
    "level": "WARN",
    "description": "The system crashed due to Out of Memory error.",
    ...
}
```text

---

### sys_monitor_disabled:[userid,monitor]

**説明**
システムにファイル整合性、リソース、ロギング、ウイルス対策などを担当するエージェントが含まれている場合、それらが停止されたかどうか、誰によって停止されたかを知ることは特に重要です。

**レベル:**
WARN

**例:**

```text
{
    "datetime": "2019-01-01 00:00:00,000",
    "appid": "foobar.netportal_auth",
    "event": "sys_monitor_disabled:joebob1,crowdstrike",
    "level": "WARN",
    "description": "User joebob1 has disabled CrowdStrike",
    ...
}
```text

---

### sys_monitor_enabled:[userid,monitor]

**説明**
システムにファイル整合性、リソース、ロギング、ウイルス対策などを担当するエージェントが含まれている場合、それらが停止後に再開されたかどうか、誰によって再開されたかを知ることは特に重要です。

**レベル:**
WARN

**例:**

```text
{
    "datetime": "2019-01-01 00:00:00,000",
    "appid": "foobar.netportal_auth",
    "event": "sys_monitor_enabled:joebob1,crowdstrike",
    "level": "WARN",
    "description": "User joebob1 has enabled CrowdStrike",
    ...
}
```text

---

## ユーザー管理 [USER]

### user_created:[userid,newuserid,attributes[one,two,three]]

**説明**
新しいユーザーを作成する場合、ユーザー作成イベントの詳細をログに記録することは有用です。特に、新しいユーザーを管理者権限付きで作成できる場合に重要です。

**レベル:**
WARN

**例:**

```text
{
    "datetime": "2019-01-01 00:00:00,000",
    "appid": "foobar.netportal_auth",
    "event": "user_created:joebob1,user1,admin:create,update,delete",
    "level": "WARN",
    "description": "User joebob1 created user1 with admin:create,update,delete privilege attributes",
    ...
}
```text

---

### user_updated:[userid,onuserid,attributes[one,two,three]]

**説明**
ユーザーを更新する場合、ユーザー更新イベントの詳細をログに記録することは有用です。特に、ユーザーを管理者権限付きで更新できる場合に重要です。

**レベル:**
WARN

**例:**

```text
{
    "datetime": "2019-01-01 00:00:00,000",
    "appid": "foobar.netportal_auth",
    "event": "user_updated:joebob1,user1,admin:create,update,delete",
    "level": "WARN",
    "description": "User joebob1 updated user1 with attributes admin:create,update,delete privilege attributes",
    ...
}
```text

---

### user_archived:[userid,onuserid]

**説明**
必須の場合を除き、ユーザーは削除するよりもアーカイブするのが常に最善です。ユーザーをアーカイブする場合、ユーザーアーカイブイベントの詳細をログに記録することは有用です。悪意あるユーザーがこの機能を使って正当なユーザーに対するサービス拒否を行う可能性があります。

**レベル:**
WARN

**例:**

```text
{
    "datetime": "2019-01-01 00:00:00,000",
    "appid": "foobar.netportal_auth",
    "event": "user_archived:joebob1,user1",
    "level": "WARN",
    "description": "User joebob1 archived user1",
    ...
}
```text

---

### user_deleted:[userid,onuserid]

**説明**
必須の場合を除き、ユーザーは削除するよりもアーカイブするのが常に最善です。ユーザーを削除する場合、ユーザー削除イベントの詳細をログに記録することは有用です。悪意あるユーザーがこの機能を使って正当なユーザーに対するサービス拒否を行う可能性があります。

**レベル:**
WARN

**例:**

```text
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

## ASVS との対応

| ASVS 項目 | 関連内容 |
| --- | --- |
| V16.1 Security Logging Documentation | ログイベント名、分類、属性、レベルの標準化 |
| V16.3 Security Events | 認証、認可、セッション、機密データ、システムイベントの語彙化 |
