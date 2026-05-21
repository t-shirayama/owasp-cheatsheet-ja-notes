# Webサービスセキュリティチートシート 日本語訳

## Attribution

- Original: Web Service Security Cheat Sheet
- Source: https://cheatsheetseries.owasp.org/cheatsheets/Web_Service_Security_Cheat_Sheet.html
- Copyright: Cheat Sheets Series Team
- License: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
- License URL: https://creativecommons.org/licenses/by-sa/4.0/
- Changes: Japanese translation added.
- Retrieved: 2026-05-21

## 日本語訳

# Webサービスセキュリティチートシート

## はじめに

この記事は、Webサービスを保護し、Webサービスに関連する攻撃を防ぐためのガイダンスを提供することに焦点を当てています。

フレームワークごとに実装が異なるため、このチートシートは高いレベルの内容に留めていることに注意してください。

## 転送時の機密性

転送時の機密性は、サーバーとの間で行われるWebサービス通信に対する盗聴や中間者攻撃から保護します。

**ルール**: 機密性の高い機能、認証済みセッション、または機密データの転送を含むWebサービスとの通信、およびWebサービス間のすべての通信は、適切に構成された [TLS](https://en.wikipedia.org/wiki/Transport_Layer_Security) を使用して暗号化する必要があります。メッセージ自体が暗号化されている場合でも、これは推奨されます。[TLS](https://en.wikipedia.org/wiki/Transport_Layer_Security) はトラフィックの機密性だけでなく、整合性保護、リプレイ防御、サーバー認証など多くの利点を提供するためです。これを適切に行う方法の詳細については、[Transport Layer Security Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Transport_Layer_Security_Cheat_Sheet.html) を参照してください。

## サーバー認証

**ルール**: サービスコンシューマーに対してサービスプロバイダーを認証するために、TLS を使用する必要があります。サービスコンシューマーは、サーバー証明書が信頼できるプロバイダーによって発行されていること、有効期限が切れていないこと、失効していないこと、サービスのドメイン名と一致していること、およびサーバーが公開鍵証明書に関連付けられた秘密鍵を保持していることを証明していることを検証する必要があります。これは、何かに適切に署名する、または関連付けられた公開鍵で暗号化されたものを正常に復号することによって証明されます。

## ユーザー認証

ユーザー認証は、サービスに接続しようとしているユーザーまたはシステムの身元を検証します。このような認証は、通常、Webサービスのコンテナの機能です。

**ルール**: Basic Authentication を使用する場合は [TLS](https://en.wikipedia.org/wiki/Transport_Layer_Security) 上で実施する必要があります。ただし、Basic Authentication は HTTP ヘッダー内でシークレットを平文 (base64 エンコード) として開示するため推奨されません。

**ルール**: [Mutual-TLS](https://en.wikipedia.org/wiki/Transport_Layer_Security) を使用するクライアント証明書認証は、一般的な認証方式であり、適切な場合に推奨されます。参照: [Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)。

## 転送エンコーディング

[SOAP](https://en.wikipedia.org/wiki/SOAP) のエンコーディングスタイルは、ソフトウェアオブジェクト間のデータを XML 形式へ、また XML 形式から戻すためのものです。

**ルール**: クライアントとサーバーの間で同じエンコーディングスタイルを強制してください。

## メッセージ整合性

これは保存データに関するものです。転送中データの整合性は [TLS](https://en.wikipedia.org/wiki/Transport_Layer_Security) によって容易に提供できます。

[公開鍵暗号](https://en.wikipedia.org/wiki/Public-key_cryptography)を使用する場合、暗号化は機密性を保証しますが、受信者の公開鍵は公開されているため整合性は保証しません。同じ理由で、暗号化は送信者の身元も保証しません。

**ルール**: XML データについては、送信者の秘密鍵を使用した XML デジタル署名によりメッセージ整合性を提供してください。この署名は、送信者のデジタル証明書 (公開鍵) を使用して受信者が検証できます。

## メッセージ機密性

機密として保持する必要があるデータ要素は、ブルートフォースを抑止するため、十分な鍵長を持つ強力な暗号化方式を使用して暗号化する必要があります。

**ルール**: 機密データを含むメッセージは、強力な暗号化方式を使用して暗号化する必要があります。これは転送暗号化でもメッセージ暗号化でもかまいません。

**ルール**: 受信後も保存時に暗号化されたままでなければならない機密データを含むメッセージは、転送暗号化だけでなく、強力なデータ暗号化で暗号化する必要があります。

## 認可

Webアプリケーションがユーザーを認可するのと同じように、WebサービスもWebサービスクライアントを認可する必要があります。Webサービスは、Webサービスクライアントが、要求されたデータ (細粒度) に対して特定のアクション (粗粒度) を実行する権限を持っていることを確認する必要があります。

**ルール**: Webサービスは、クライアントが対象のメソッドにアクセスできるかどうかを認可するべきです。認証チャレンジの後、Webサービスは、要求元エンティティの権限を確認し、要求されたリソースにアクセスできるかどうかをチェックするべきです。これはすべてのリクエストで実施するべきであり、パスワード変更、メールアドレスなどの主連絡先情報、住所、支払いまたは配送指示などの機密リソースには、チャレンジレスポンスの認可メカニズムを追加するべきです。

**ルール**: Webサービスアプリケーション内の管理機能および運用管理機能へのアクセスが、Webサービス管理者に限定されていることを確認してください。理想的には、管理機能は、これらの機能によって管理されるWebサービスとは完全に分離されたアプリケーション内に置き、通常ユーザーをこれらの機密機能から完全に分離します。

## スキーマ検証

スキーマ検証は、スキーマによって定義された制約と構文を強制します。

**ルール**: Webサービスは、[SOAP](https://en.wikipedia.org/wiki/SOAP) ペイロードを、関連する XML スキーマ定義 ([XSD](https://www.w3schools.com/xml/schema_intro.asp)) に照らして検証する必要があります。

**ルール**: [SOAP](https://en.wikipedia.org/wiki/SOAP) Webサービス用に定義される [XSD](https://www.w3schools.com/xml/schema_intro.asp) は、少なくとも、Webサービスに出入りすることが許可されるすべてのパラメータについて、最大長と文字セットを定義するべきです。

**ルール**: [SOAP](https://en.wikipedia.org/wiki/SOAP) Webサービス用に定義される [XSD](https://www.w3schools.com/xml/schema_intro.asp) は、固定形式のすべてのパラメータ (郵便番号、電話番号、リスト値など) について、強力な、理想的には許可リスト方式の検証パターンを定義するべきです。

## コンテンツ検証

**ルール**: どのWebアプリケーションとも同様に、Webサービスは入力を使用する前に検証する必要があります。XML 入力のコンテンツ検証には、以下を含めるべきです。

- 不正な形式の XML エンティティに対する検証。
- [XML Bomb 攻撃](https://en.wikipedia.org/wiki/Billion_laughs_attack)に対する検証。
- 強力な許可リストを使用した入力検証。
- [外部エンティティ攻撃](https://owasp.org/www-community/vulnerabilities/XML_External_Entity_%28XXE%29_Processing)に対する検証。

## 出力エンコーディング

Webサービスは、クライアントに送信する出力が、スクリプトではなくデータとして消費されるようにエンコードされていることを確認する必要があります。これは、Webサービスクライアントが出力を使用して、直接または AJAX オブジェクトを介して間接的に HTML ページをレンダリングする場合に特に重要になります。

**ルール**: 出力エンコーディングのすべてのルールは、[Cross Site Scripting Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html) に従って適用されます。

## ウイルス対策

[SOAP](https://en.wikipedia.org/wiki/SOAP) は、[SOAP](https://en.wikipedia.org/wiki/SOAP) メッセージにファイルやドキュメントを添付する機能を提供します。これにより、攻撃者がこれらの [SOAP](https://en.wikipedia.org/wiki/SOAP) メッセージにウイルスやマルウェアを添付する機会が生じます。

**ルール**: ウイルススキャン技術が導入されていること、できればファイルや添付ファイルがディスクに保存される前にチェックできるようインラインで導入されていることを確認してください。

**ルール**: ウイルススキャン技術が、最新のウイルス定義やルールで定期的に更新されていることを確認してください。

## メッセージサイズ

WebサービスはWebアプリケーションと同様に、数千件の大きな [SOAP](https://en.wikipedia.org/wiki/SOAP) メッセージをWebサービスへ自動送信する DoS 攻撃の標的になり得ます。これによりアプリケーションが機能不全になり、正当なメッセージに応答できなくなるか、完全に停止する可能性があります。

**ルール**: [SOAP](https://en.wikipedia.org/wiki/SOAP) メッセージのサイズは、適切なサイズ上限に制限するべきです。上限が大きい場合、または上限がまったくない場合、DoS 攻撃が成功する可能性が高まります。

## 可用性

### リソース制限

通常運用中、Webサービスは CPU サイクルやメモリなどの計算能力を必要とします。誤動作時や攻撃を受けている間、Webサービスが過剰なリソースを必要とし、ホストシステムを不安定にする可能性があります。

**ルール**: 安定したシステムを維持するため、予想されるサービスレートに基づいて、Webサービスが使用できる CPU サイクル量を制限してください。

**ルール**: システムのメモリ枯渇を避けるため、Webサービスが使用できるメモリ量を制限してください。場合によっては、ホストシステムがメモリを解放するためにプロセスを強制終了し始めることがあります。

**ルール**: 同時に開かれるファイル、ネットワーク接続、起動されるプロセスの数を制限してください。

### メッセージスループット

スループットは、特定の時間内に処理されるWebサービスリクエストの数を表します。

**ルール**: DoS に似た状況に陥ることを避けるため、最大メッセージスループットに合わせて構成を最適化するべきです。

### XML サービス不能攻撃からの保護

XML サービス不能攻撃は、おそらくWebサービスに対する最も深刻な攻撃です。そのため、Webサービスは以下の検証を提供する必要があります。

**ルール**: 再帰的なペイロードに対する検証。

**ルール**: 過大なペイロードに対する検証。

**ルール**: [XML エンティティ展開](https://www.ws-attacks.org/XML_Entity_Expansion)に対する保護。

**ルール**: 過度に長い要素名に対する検証。[SOAP](https://en.wikipedia.org/wiki/SOAP) ベースのWebサービスを扱っている場合、要素名はそれらの [SOAP](https://en.wikipedia.org/wiki/SOAP) アクションです。

この保護は、XML パーサーまたはスキーマバリデータによって提供されるべきです。検証するには、パーサーがこれらの種類の攻撃に耐性を持つことを確認するテストケースを作成してください。

## エンドポイントセキュリティプロファイル

**ルール**: Webサービスは、少なくとも [Web Services-Interoperability (WS-I)](https://en.wikipedia.org/wiki/Web_Services_Interoperability) Basic Profile に準拠する必要があります。

## ASVS との対応

| ASVS 項目 | 関連内容 |
| --- | --- |
| V2.2, V4 | Webサービスの認証、認可、入力検証、暗号化、可用性保護 |
