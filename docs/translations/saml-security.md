# SAML セキュリティチートシート 日本語訳

## Attribution

- Original: SAML Security Cheat Sheet
- Source: https://cheatsheetseries.owasp.org/cheatsheets/SAML_Security_Cheat_Sheet.html
- Copyright: Cheat Sheets Series Team
- License: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
- License URL: https://creativecommons.org/licenses/by-sa/4.0/
- Changes: Japanese translation added.
- Retrieved: 2026-05-21

## 日本語訳

# SAML セキュリティチートシート

## はじめに

**S**ecurity **A**ssertion **M**arkup **L**anguage ([SAML](https://en.wikipedia.org/wiki/Security_Assertion_Markup_Language)) は、認可および認証情報を交換するためのオープン標準です。*Redirect/POST バインディングを使用する Web Browser SAML/SSO Profile* は、最も一般的な SSO 実装の一つです。このチートシートは主にそのプロファイルに焦点を当てます。

## メッセージの機密性と完全性を検証する

[TLS 1.2](https://cheatsheetseries.owasp.org/cheatsheets/Transport_Layer_Security_Cheat_Sheet.html) は、トランスポート層でメッセージの機密性と完全性を保証する最も一般的な解決策です。追加情報については [SAML Security (section 4.2.1)](https://docs.oasis-open.org/security/saml/v2.0/saml-sec-consider-2.0-os.pdf) を参照してください。この手順は、次の攻撃への対策に役立ちます。

- 盗聴 7.1.1.1
- ユーザー認証情報の窃取 7.1.1.2
- Bearer Token の窃取 7.1.1.3
- メッセージ削除 7.1.1.6
- メッセージ改ざん 7.1.1.7
- 中間者攻撃 7.1.1.8

認定された鍵でデジタル署名されたメッセージは、メッセージの完全性と認証を保証する最も一般的な解決策です。追加情報については [SAML Security (section 4.3)](https://docs.oasis-open.org/security/saml/v2.0/saml-sec-consider-2.0-os.pdf) を参照してください。この手順は、次の攻撃への対策に役立ちます。

- 中間者攻撃 6.4.2
- 偽造された Assertion 6.4.3
- メッセージ改ざん 7.1.1.7

Assertion は、転送後に機密属性が漏えいすることを防ぐため、XMLEnc によって暗号化できます。追加情報については [SAML Security (section 4.2.2)](https://docs.oasis-open.org/security/saml/v2.0/saml-sec-consider-2.0-os.pdf) を参照してください。この手順は、次の攻撃への対策に役立ちます。

- ユーザー認証情報の窃取 7.1.1.2

## プロトコル使用方法を検証する

これはセキュリティ上の抜けが生じやすい一般的な領域です。実例として [Google SSO vulnerability](https://www.kb.cert.org/vuls/id/612636/) を参照してください。この SSO プロファイルは、悪意ある SP (Service Provider) からの中間者攻撃に対して脆弱でした。

SSO Web Browser Profile は、信頼済みパートナーからの攻撃を最も受けやすいものです。この特定のセキュリティ欠陥は、SAML Response に、安全なメッセージ交換に必要な必須データ要素がすべて含まれていなかったために露呈しました。[SAML Profile](https://docs.oasis-open.org/security/saml/v2.0/saml-profiles-2.0-os.pdf) の AuthnRequest (4.1.4.1) および Response (4.1.4.2) の使用要件に従うことは、この攻撃への対策に役立ちます。

*AVANTSSAR* チームは、次のデータ要素を必須にすべきだと提案しました。

- **AuthnRequest(ID, SP):** `AuthnRequest` には `ID` と `SP` を含める必要があります。`ID` はリクエストを一意に識別する文字列であり、`SP` はリクエストを開始した `Service Provider` を識別します。さらに、リクエストの `ID` 属性はレスポンスで返されなければなりません (`InResponseTo="<requestId>"`)。`InResponseTo` は、信頼済み IdP からのレスポンスの真正性を保証する助けになります。これは Google の SSO を脆弱にした欠落属性の一つでした。
- **Response(ID, SP, IdP, {AA} K -1/IdP):** Response にはこれらすべての要素を含める必要があります。`ID` はレスポンスを一意に識別する文字列です。`SP` はレスポンスの受信者を識別します。`IdP` はレスポンスを認可する identity provider を識別します。`{AA} K -1/IdP` は、`IdP` の秘密鍵でデジタル署名された Assertion です。
- **AuthAssert(ID, C, IdP, SP):** 認証 Assertion は Response 内に存在しなければなりません。これには `ID`、クライアント `(C)`、identity provider `(IdP)`、service provider `(SP)` の識別子を含める必要があります。

### 署名を検証する

XML Signature Wrapping 攻撃による SAML 実装の脆弱性は、2012 年の [On Breaking SAML: Be Whoever You Want to Be](https://www.usenix.org/system/files/conference/usenixsecurity12/sec12-final91-8-23-12.pdf) で説明されています。

これに対応して、次の推奨事項が提案されました ([Secure SAML validation to prevent XML signature wrapping attacks](https://arxiv.org/pdf/1401.7483v1.pdf))。

- 例外なく、XML ドキュメントをセキュリティ関連の目的で使用する前に、必ずスキーマ検証を行います。
    - 検証には、必ずローカルの信頼済みスキーマコピーを使用します。
    - 第三者の場所からスキーマを自動ダウンロードすることを許可してはいけません。
    - 可能であれば、スキーマを検査し、ワイルドカード型や緩い処理文を無効化するためにスキーマを堅牢化します。
- デジタル署名を安全に検証します。
    - 署名鍵が一つだけ想定される場合は、`StaticKeySelector` を使用します。鍵は identity provider から直接取得し、ローカルファイルに保存し、ドキュメント内の `KeyInfo` 要素は無視します。
    - 複数の署名鍵が想定される場合は、`X509KeySelector` (JKS バリアント) を使用します。これらの鍵は identity provider から直接取得し、ローカル JKS に保存し、ドキュメント内の `KeyInfo` 要素は無視します。
- 署名ラッピング攻撃を避けます。
    - 事前の検証なしに、XML ドキュメント内のセキュリティ関連要素を選択する目的で `getElementsByTagName` を使用してはいけません。
    - 堅牢化されたスキーマで検証している場合を除き、要素の選択には必ず絶対 XPath 式を使用します。

## プロトコル処理ルールを検証する

これも、確認すべき手順が非常に多いために、セキュリティ上の抜けが生じやすい一般的な領域です。

SAML レスポンスの処理はコストの高い操作ですが、すべての手順を検証しなければなりません。

- AuthnRequest の処理ルールを検証します。すべての AuthnRequest 処理ルールについては [SAML Core](https://docs.oasis-open.org/security/saml/v2.0/saml-core-2.0-os.pdf) (3.4.1.4) を参照してください。この手順は、次の攻撃への対策に役立ちます。
    - 中間者攻撃 (6.4.2)
- Response の処理ルールを検証します。すべての Response 処理ルールについては [SAML Profiles](https://docs.oasis-open.org/security/saml/v2.0/saml-profiles-2.0-os.pdf) (4.1.4.3) を参照してください。この手順は、次の攻撃への対策に役立ちます。
    - 盗まれた Assertion (6.4.1)
    - 中間者攻撃 (6.4.2)
    - 偽造された Assertion (6.4.3)
    - ブラウザ状態の露出 (6.4.4)

## バインディング実装を検証する

- HTTP Redirect Binding については [SAML Binding](https://docs.oasis-open.org/security/saml/v2.0/saml-bindings-2.0-os.pdf) (3.4) を参照してください。エンコーディング例を確認するには、[Google's reference implementation](https://developers.google.com/google-apps/sso/saml_reference_implementation_web) 内の RequestUtil.java を参照するとよいでしょう。
- HTTP POST Binding については [SAML Binding](https://docs.oasis-open.org/security/saml/v2.0/saml-bindings-2.0-os.pdf) (3.5) を参照してください。キャッシュに関する考慮事項も非常に重要です。SAML プロトコルメッセージがキャッシュされると、後で盗まれた Assertion (6.4.1) やリプレイ (6.4.5) 攻撃に使用される可能性があります。

## セキュリティ対策を検証する

[SAML Security](https://docs.oasis-open.org/security/saml/v2.0/saml-sec-consider-2.0-os.pdf) ドキュメントに存在する各セキュリティ脅威を再確認し、特定の実装に存在し得る脅威に対して適切な対策を適用していることを確認します。

追加で検討すべき対策には、次のものがあります。

- 適切な場合は IP フィルタリングを優先します。たとえば、Google が各信頼済みパートナーに別々のエンドポイントを提供し、各エンドポイントに IP フィルタを設定していれば、この対策により Google の初期のセキュリティ欠陥を防げた可能性があります。この手順は、次の攻撃への対策に役立ちます。
    - 盗まれた Assertion (6.4.1)
    - 中間者攻撃 (6.4.2)
- SAML Response の短い有効期間を優先します。この手順は、次の攻撃への対策に役立ちます。
    - 盗まれた Assertion (6.4.1)
    - ブラウザ状態の露出 (6.4.4)
- SAML Response の OneTimeUse を優先します。この手順は、次の攻撃への対策に役立ちます。
    - ブラウザ状態の露出 (6.4.4)
    - リプレイ (6.4.5)

アーキテクチャ図が必要ですか。[SAML technical overview](https://www.oasis-open.org/committees/download.php/11511/sstc-saml-tech-overview-2.0-draft-03.pdf) には最も充実した図が含まれています。Redirect/POST バインディングを使用する Web Browser SSO Profile については、4.1.3 節を参照してください。実際、SAML ドキュメント全体の中でも、この技術概要は高レベルの観点から最も有用です。

## Unsolicited Response (つまり IdP Initiated SSO) に関する Service Provider 向け考慮事項

Unsolicited Response は、**ログイン [CSRF](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html#possible-csrf-vulnerabilities-in-login-forms)** 保護がないため、設計上、本質的に安全性が低くなります。この制限は、Service Provider (SP) が事前ログインセッションを作成したり、認証リクエストがユーザーによって意図的に開始されたことを検証したりする機会を持たないことから生じます。

この設計は、IdP-initiated SSO を中間者攻撃 (MITM) に固有に脆弱にするものではありません。トランスポートセキュリティが侵害された場合、それらのリスクは SP-initiated フローにも等しく当てはまります。しかし、この設計はログイン意図の検証という重要な層を取り除きます。

こうした懸念はあるものの、IdP-initiated SSO は後方互換性のために、特に SAML 1.1 との互換性のために、引き続きサポートされています。有効化する必要がある場合は、上記に加えて次の手順がこのフローの保護に役立ちます。

- [SAML Profiles (section 4.1.5)](https://docs.oasis-open.org/security/saml/v2.0/saml-profiles-2.0-os.pdf) に記載された検証プロセスに従います。この手順は、次の攻撃への対策に役立ちます。
    - リプレイ (6.1.2)
    - メッセージ挿入 (6.1.3)
- `RelayState` パラメータの契約が URL である場合、その URL が検証され、明示的に許可リストに含まれていることを確認します。この手順は、次の攻撃への対策に役立ちます。
    - [オープンリダイレクト](https://cheatsheetseries.owasp.org/cheatsheets/Unvalidated_Redirects_and_Forwards_Cheat_Sheet.html)
- レスポンスレベルまたは Assertion レベルで適切なリプレイ検出を実装します。これは、次の攻撃への対策に役立ちます。
    - リプレイ (6.1.2)

## Identity Provider と Service Provider の考慮事項

SAML プロトコル自体が好んで選ばれる攻撃ベクトルになることはまれですが、堅牢であることを確認するためのチートシートは重要です。実際には、さまざまなエンドポイントの方が標的にされやすいため、SAML トークンがどのように生成され、どのように消費されるかの両方が重要です。

### X.509 証明書の考慮事項

通常、Identity Provider (IdP) と Service Provider (SP) のセキュリティ上の関連付けは、SP が IdP の X.509 署名証明書を信頼することを明示的に選択したときに作成されます。これがどのように行われるかは、全体的なセキュリティ態勢に大きく影響します。証明書の生成方法、証明書の内容、証明書に対応する秘密鍵の保護方法は、いずれもセキュリティ態勢に大きく影響します。たとえば、攻撃者が IdP の署名鍵を使用できる場合、任意の Assertion を含む SAML レスポンスを発行できます。

多くの場合、この関連付けを手動で設定する方法は、理想的ではない [Certificate Pinning](https://cheatsheetseries.owasp.org/cheatsheets/Pinning_Cheat_Sheet.html) に近いものです。IdP や SP のソフトウェア、またはさまざまな設計上の考慮事項によっては、これを避けられないことがあります。

証明書の署名タイプは、XML ドキュメントの署名タイプとは異なり得ることに注意してください。XML ドキュメントへの署名に使用できる唯一の鍵は、証明書に対応する秘密鍵ですが、署名アルゴリズムは IdP の裁量で選択されます。最も一般的にサポートされている署名アルゴリズムは rsa-sha256 です。

#### SAML 関係者と組織

最も一般的な SAML ユースケースは Business-to-Business (B2B) です。これは、二つの関係者が異なるセキュリティポリシー、プラクティス、リスク許容度を持つことを意味します。このガイダンスは主に B2B ユースケースに焦点を当てています。ただし、SAML ベースのフェデレーションや SSO は組織内部でも一般的に使用されます。この場合、third-party CA という用語は当てはまりません。その CA は企業標準に基づいて構築および運用されている可能性が高く、SAML システムに対して過不足ないリスクをもたらします。third-party CA という用語は、第三者が運用する private CA を示すことを意図しています。

#### 証明書のユースケース

SAML システムには、実際には証明書のユースケースが 5 つあります。このドキュメントは主に IdP の SAML 署名証明書について説明していますが、セキュリティ上の考慮事項は 4 つすべての SAML 関連証明書に適用されます。5 つ目の証明書である IdP の TLS サーバー証明書は、他のサーバー証明書と比べて特別に扱う必要があるわけではありません。

##### IdP SAML 署名

これは、SP が IdP の SAML レスポンスを検証するために使用する証明書です。IdP は、その証明書に対応する秘密鍵でレスポンスに署名します。これは、SP に送信される ID Assertion を保護するため、多くの場合、最も重要な証明書と秘密鍵です。

##### IdP SAML 暗号化

これはあまり一般的には使用されません。SP が IdP に送信する SAML リクエストを、改ざんだけでなく情報漏えいからも保護したい場合に使用されるためです。SAML リクエストには機密情報を含めるべきではないため、使用頻度は低くなります。使用する場合、証明書と秘密鍵は SAML 署名証明書とは別のものでなければなりません。

##### SP 署名

必須ではありませんが、SP と IdP が IdP Initiated SSO を許可しないことはベストプラクティスです。これは、呼び出し元が SP で SAML フローを開始し、SP が IdP 向けに署名付き SAML リクエストを生成することを意味します。

##### SP 暗号化

IdP の SAML レスポンスに機密データを配置しないことがベストプラクティスですが、避けられない場合もあります。これにはユーザー名やその他の PII が含まれ得ます。情報漏えいが考慮事項になる場合、SP は SAML 暗号化証明書を持ちます。IdP は SAML レスポンスを暗号化するために、この証明書と埋め込まれた公開鍵を使用します。SP は、SAML 署名と暗号化に別々の証明書および鍵ペアを使用しなければなりません。

#### 証明書の内容

SAML の署名と暗号化の文脈では、X.509 証明書は多くの場合、署名検証や SAML 暗号化用の対称鍵ラッピングに使用される公開鍵を保持する単なるラッパーとして扱われます。それでも、証明書にはセキュリティをさらに強化するために使用できる属性を含められます。

OWASP は、IdP と SP が後述の EKU、KU、鍵の有効期間を採用する方向へ移行することを推奨します。これらは実際にセキュリティを強化し、検証側が自らをさらに保護できるようにします。また、PKI の規範への準拠を示す助けにもなります。

##### 鍵と署名アルゴリズム

鍵ペアのサイズと種類、および署名アルゴリズムの選択は、セキュリティと相互運用性に大きく影響します。すべての IdP や SP のソフトウェアパッケージまたはライブラリが、すべての組み合わせをサポートしているわけではありません。一つの IdP が多くの SP と関連付けられることが多いため、唯一の選択肢は、安全と見なされる範囲で最も弱い選択肢を選ぶことになります。最も広くサポートされ、現在安全な組み合わせは、RSA 2048 ビット鍵と SHA-256 ハッシュ/署名を使用することです。これは証明書の署名アルゴリズムを指しており、SAML XML 署名を指すものではありません。

ポスト量子アルゴリズムがより普及し、最終的に必須になるにつれて、これはさらに複雑になります。SAML SP および IdP ソフトウェアを作成する人は、より多くの鍵と署名アルゴリズムをサポートする選択肢の検討を始めるべきです。

###### 鍵

ECC 鍵は RSA 鍵よりもはるかに小さくでき、より高いセキュリティを提供でき、関連する数学的処理も高速です。すべての関係者が使用できる場合は、ECC 鍵が望まれます。ECC 鍵は 256 ビット程度でも安全であり得ます。RSA 鍵は相互運用性が高いです。RSA 鍵の最小サイズは 2048 ビットとすべきです。少なくとも主要ベンダーの一つである [Microsoft Entra](https://learn.microsoft.com/en-us/entra/identity/hybrid/connect/how-to-connect-fed-saml-idp) は ECC 鍵をサポートしていません。

###### 署名アルゴリズム

公開鍵暗号がデータ署名に使用される場合、データはまず選択されたアルゴリズムでハッシュされ、その後、そのハッシュが秘密鍵で署名されます。

どの IdP も、証明書署名ハッシュとして SHA-1 を使用すべきではありません。SHA-256 が最低基準です。とはいえ、可能であれば SHA-384 や SHA-512 のようなより大きなハッシュアルゴリズムへ移行することで、サービスの将来耐性を高められます。この文脈で述べているのは証明書の署名アルゴリズムであり、SAML レスポンス XML への署名に使用されるアルゴリズムではありません。

##### 証明書の有効期間

証明書には NotBefore と NotOnorAfter 属性が含まれます。ほとんどの IdP は、証明書ローテーションが期限どおりに行われなかった場合でも稼働時間を保証するために、これらを無視します。SAML 証明書の有効期間は、これらを無視する必要がない程度に適切に扱われるべきです。証明書の有効期間を無視することは、根本的に悪い考えです。[NIST SP 800-57 (Part 1, Rev. 5)](https://csrc.nist.gov/pubs/sp/800/57/pt1/r5/final) は RSA 2048 ビット鍵の 3 年間の使用を許容していますが、SAML 署名証明書の最大有効期間は 2 年とすべきです。秘密鍵が Hardware Security Module (HSM) などで十分に保護されていない場合、それでも安全には長すぎる可能性があります。

##### Extended Key Usage (EKU) と Key Usage (KU)

[EKU](https://www.rfc-editor.org/rfc/rfc5280#section-4.2.1.12) は、その証明書が意図する特定のユースケースを説明します。これにはサーバー認証、クライアント認証、コード署名などがありますが、これらは SAML 署名には適していません。SAML 署名用として広く受け入れられている EKU はありませんが、[RFC 9336](https://www.rfc-editor.org/rfc/rfc9336.txt) は理想的なものとして id-kp-documentSigning (1.3.6.1.5.5.7.3.36) を定義しています。IdP と SP は、この EKU に標準化することを検討できます。

[KU](https://www.rfc-editor.org/rfc/rfc5280#section-4.2.1.3) は、秘密鍵が意図する基礎的な暗号操作を説明します。digitalSignature、nonRepudiation、keyEncipherment などがあります。IdP と SP は digitalSignature を必須にし、さらに他の KU を持つ証明書を許可しないことを検討できます。証明書は一つのユースケースにのみ使用すべきだからです。たとえば、IdP の TLS サーバー証明書を SAML 署名証明書にしてはなりません。

##### CRL Distribution Point (CDP)

[Certificate Revocation List (CRL) Distribution Point](https://www.rfc-editor.org/rfc/rfc5280#section-4.2.1.13) は、CA がもはや信頼すべきではないと示す証明書の一覧です。多くの場合 HTTP 経由で配布され、CRL URL は一般に各 CA 発行証明書へ埋め込まれます。[CRL](https://www.rfc-editor.org/rfc/rfc5280#appendix-C.4) は CA によって署名されているため、HTTP に対する中間者攻撃は、一覧を改ざんして無効にすること以外には、その完全性を損なえません。つまり、攻撃者が変更することはできません。CRL を持てるのは CA 署名証明書だけです。SAML 証明書に CRL が記載されている場合、検証側から到達可能であるべきであり、検証側はそれを[検証](https://www.rfc-editor.org/rfc/rfc5280#section-6.3)すべきです。

リスクの大きさ、秘密鍵が侵害された場合の影響、そして IdP と SP の関係が比較的小規模であることを考慮すると、SAML システムの関係者は、インシデント時に迅速に通知し証明書をローテーションするための連絡先一覧付き計画を確立すべきです。多くの SAML 製品やライブラリは失効確認をサポートしておらず、調整された置き換えなしに単に証明書を失効させると停止につながります。

##### Online Certificate Status Protocol (OCSP)

[OCSP](https://datatracker.ietf.org/doc/html/rfc6960) は、証明書が失効しているかどうかを確認するもう一つの方法です。OCSP URL は CRL と同様に証明書に埋め込まれ、HTTP 経由で到達可能であるべきです。レスポンスは署名されるため、MITM 攻撃は完全性上の懸念ではありません。OCSP は、そのやり取りがプライバシー上の懸念を生むため、以前ほど好まれなくなっています。呼び出し元の IP アドレスが見え、使用されている証明書が開示されます。SAML では宛先 Web サイトを開示しないため、この懸念は小さく、全体的な使用は減少しています。チェーン内の任意の証明書に OCSP URL が存在する場合、証明書が失効しているか確認するために使用すべきです。

#### 証明書階層

SAML 署名証明書は、三つのいずれかによって署名されます。証明書は自己署名、public CA 署名、private CA 署名のいずれかです。それぞれ長所と短所がありますが、WebPKI (public) と private PKI の現在の状況を踏まえると、証明書交換に適切な予防策を取る場合、自己署名 SAML 証明書が明らかに最適です。

##### Certificate Issuer

すべての X.509 証明書は、[Issuer](https://www.rfc-editor.org/rfc/rfc5280#section-4.1.2.4) と呼ばれる主体によって、秘密鍵を使用して署名されます。これは CA の場合もあれば、自己署名証明書の場合はその証明書に対応する秘密鍵の場合もあります。CA 署名証明書の場合、署名者も Issuer を持つ証明書を持つことがあり、それが続く場合があります。これはチェーンまたはパスと呼ばれ、Root CA (定義上、自己署名) で終端すべきです。Issuer は検査されるべきです。Issuer が CA である場合、EKU、KU、CRL などの属性も検証される場合があります。これは [path](https://datatracker.ietf.org/doc/html/rfc5280#section-3.2) 内の各証明書について、ルートまで行われるべきです。

##### Public Certificate Authority (CA) 署名

この証明書タイプでは、Public CA が自らのルールおよび [CA Browser Forum](https://cabforum.org/) (CABF) のルールに従って証明書を発行します。これらの public root CA は、主要ブラウザベンダーが維持するトラストストアに組み込まれます。Web 上の多くのものがこれらを信頼するのは、誰かがトラストストアを必要な場所に確実に配置しているためです。

IdP が SAML 署名証明書をローテーションする場合、各 SP はその証明書への明示的な信頼を同時に更新しなければなりません。これは SP が少数でも困難な場合があります。多数の場合はほぼ不可能です。この苦痛により、可能な限り長い有効期間を持つ SAML 署名証明書が使用されるようになりました。以前は public CA では 2 年、その後 398 日でした。WebPKI 標準と CABF の焦点は TLS 用サーバー証明書にあります。証明書有効期間に関する最近および進行中の変更により、Public CA 発行証明書の魅力は低下しています。これは、CABF が public CA 発行証明書をわずか [47 日](https://cabforum.org/2025/04/11/ballot-sc081v3-introduce-schedule-of-reducing-validity-and-data-reuse-periods/)まで短縮する方向性を持っているためです。IdP は証明書を取得し、合理的な期間を置いて変更を通知し、その後変更を実行しなければならないため、これは IdP と SP が絶え間ない証明書更新状態に置かれることを意味します。

CABF は SAML 証明書の使用や取得に関するガバナンスを持っていないことに注意する価値があります。加盟 CA からの証明書は、広く Public CA と見なされています。つまり、ブラウザ、オペレーティングシステム、さまざまな開発フレームワークによって広く信頼されています。

Public CA 署名証明書を使用すると失効確認が可能になり、セキュリティを高められます。しかし、証明書交換が保護されていない場合、誤った安心感につながる可能性があります。

##### Private CA 署名

ほとんどの IdP と SP は X.509 証明書を明示的な信頼として扱うため、private CA と PKI を使用できます。private CA がどのように設計、構築、運用されるかは大きく異なり、CA を適切に運用することは最終的に非常に高コストです。第三者の CA を信頼するには、CA のライフサイクルを明確に理解する必要があります。これをカバーする監査タイプは二つありますが、CA の構築と運用に加えて、どちらも非常に高コストです。第三者 CA に依存する場合、その CA は [WebTrust](http://www.webtrust.org/)、[ETSI](http://www.etsi.org/technologies-clusters/technologies/security/certification-authorities-and-other-certification-service-providers)、または [SOC 2 Type II](https://www.aicpa-cima.com/topic/audit-assurance/audit-and-assurance-greater-than-soc-2) の監査を受けているべきです。

第三者 CA を信頼することを不適切に行うと、TLS やコード署名などに対して意図しない過剰な信頼をもたらす可能性があります。第三者 CA を信頼することを選択する場合、IdP 署名検証のプロセスにのみ信頼されるようにしてください。

第三者 CA を使用する場合でも、[NIST、NSA など](https://www.keylength.com/en/)の標準化団体のガイダンスに基づく基礎鍵ペアの有効期間を超える SAML 署名証明書を発行すべきではありません。最も強力な秘密鍵タイプを使用する場合、上限は 2 年になります。

##### 自己署名

ほとんどの SAML セキュリティ関連付けは明示的であるため、自己署名証明書はこのユースケースに理想的です。証明書の内容と有効期間は、public であれ private であれ、発行 CA のポリシーやプロセスに制約されません。SAML 証明書のローテーションは苦痛で労力がかかる場合があるため、安全に可能な限り長い有効期間を設定することが重要です。TLS 脅威モデルに焦点を置いているため、十分に長い有効期間を許可する CA はほとんどありません。

###### 自己署名 SAML 証明書の作成

Hardware Security Module (HSM) を使用している場合は、ベンダーの指示に従ってください。このプロセスでは openssl を使用します。例では過度に汎用的な distinguished name を使用しています。Common Name (CN) は意味があり具体的なものにすべきです。

1. 秘密鍵を生成します。

```bash
openssl genrsa -out private.key 2048
```text

または

```bash
openssl ecparam -genkey -name prime256v1 -out private.pem
```text

2. 設定ファイルを作成します (例: cert.cnf)。

```ini
[req]
distinguished_name = req_distinguished_name
x509_extensions = v3_ca
prompt = no

[req_distinguished_name]
C = US
ST = California
L = San Francisco
O = MyOrganization
OU = MyUnit
CN = SAML Signing

[v3_ca]
basicConstraints = CA:FALSE
keyUsage = digitalSignature
extendedKeyUsage = 1.3.6.1.5.5.7.3.36
```text

3. 自己署名証明書を生成します。

```bash
openssl req -x509 -new -nodes -key private.key -sha256 -days 365 -out certificate.crt -config cert.cnf -extensions v3_ca
```

#### 証明書メタデータ URL

多くの IdP は、SAML 署名証明書を含む基本的な設定情報を含むメタデータ URL を公開しています。多くの SP は IdP からデータを取得し、Signing 証明書情報をほぼリアルタイムで更新できます。これらの選択肢を使用することが理想的です。このモデルは、ピンニングを使用しなければならない場合の [Certificate and Public Key Pinning](https://owasp.org/www-community/controls/Certificate_and_Public_Key_Pinning) の意図と完全に一致します。

メタデータ URL は TLS で保護されるべきであり、そのサーバー証明書は広く信頼される WebPKI CA から発行され、[Transport Layer Security Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Transport_Layer_Security_Cheat_Sheet.html#certificates) のガイダンスに一致している必要があります。

IdP と SP の関係における理想的な状態は、使用する証明書タイプにかかわらず、メタデータ URL を使用することです。メタデータ URL を使用しない場合、攻撃者が SP に誤った証明書を信頼させないよう、細心の注意を払う必要があります。証明書をメールで送ることは避けてください。代わりに、メタデータ URL と同様、適切に設定された TLS 経由で提示してください。

#### 署名鍵の保護

SAML 署名鍵は最重要のセキュリティ資産であり、[攻撃者の標的](https://www.microsoft.com/en-us/security/blog/2023/07/14/analysis-of-storm-0558-techniques-for-unauthorized-email-access/)です。鍵の作成時、および必要に応じて IdP クラスタのノードへコピーする際には、細心の注意を払う必要があります。ファイルベースの鍵は、アクセス権を得た攻撃者にとって持ち出しが容易です。IdP 運用者は、Hardware Security Module (HSM) を使用して秘密鍵を保護することを強く検討すべきです。[HSM](https://en.wikipedia.org/wiki/Hardware_security_module) により、アプリケーションは鍵をエクスポートまたはコピー可能にすることなく使用できます。HSM には、HSM の外部に鍵を露出させることなく、フェイルオーバー HSM へ安全に鍵を複製する仕組みがあります。高品質な HSM は [FIPS 140-2](https://csrc.nist.gov/pubs/fips/140-2/upd2/final) または [FIPS 140-3](https://csrc.nist.gov/pubs/fips/140-3/final) の評価を受けているでしょう。

### Identity Provider (IdP) の考慮事項

- アルゴリズム互換性、暗号強度、輸出規制、および上記の内容について X.509 証明書を検証します。
- SAML トークン生成に使用する強力な認証オプションを検証します。
- IDP 検証、つまりどの IDP がトークンを発行するかを検証します。
- 共通のインターネット時刻ソースへ同期します。
- ID 検証の保証レベルを定義します。
- ID Assertion には、個人を特定できる情報 (SSN など) よりも非対称識別子を優先します。
- 各 Assertion 個別、または Response 要素全体に署名します。

### Service Provider (SP) の考慮事項

- ユーザーのセッション状態を検証します。
- SAML トークンを消費する際の認可コンテキスト設定の粒度を決めます。グループ、ロール、属性のどれを使用するかを検討します。
- 各 Assertion または Response 要素全体が署名されていることを確認します。
- [署名を検証します](#署名を検証する)。
- 認可された IdP によって署名されているか検証します。
- IDP 証明書に CRL/OCSP が存在する場合、それらに対して失効を検証します。
- `<samlp:Response>` の `Destination` 属性が SP の期待する Assertion Consumer Service (ACS) URL と完全に一致することを検証します ([SAML Core 2.0 §3.2.2.1](https://docs.oasis-open.org/security/saml/v2.0/saml-core-2.0-os.pdf))。`Destination` が欠落しているレスポンス、または一致しないレスポンスを拒否します。これは SP 間の Assertion リプレイを防ぎます。
- `<saml:Audience>` が SP の EntityID と一致することを検証します。
- NotBefore と NotOnorAfter を検証します。
- Recipient 属性、`InResponseTo`、および `<saml:SubjectConfirmationData>` (`Recipient`、`NotOnOrAfter`、`InResponseTo`) を検証します。
- 署名アルゴリズムが少なくとも RSA-SHA-256 以上であることを明示的に検証します。SHA-1 ベースのアルゴリズム (`http://www.w3.org/2000/09/xmldsig#rsa-sha1`、`...#hmac-sha1`) と `<ds:DigestMethod Algorithm="...sha1">` を拒否します。NIST SP 800-131A Rev. 2 はデジタル署名における SHA-1 を許可していません。
- XML 署名内の `<ds:Reference URI>` が、信頼される `<saml:Assertion>` 要素を対象としていることを検証します。これは [XML Signature Wrapping](https://arxiv.org/pdf/1401.7483v1.pdf) 攻撃を軽減します。
- SAML ログアウトの基準を定義します。
- Assertion は TLS のような安全なトランスポート上でのみ交換します。
- セッション管理の基準を定義します。
- 可能な場合は、SAML チケット Assertion から得たユーザー ID を検証します。

## 入力検証

SAML がセキュリティプロトコルであるからといって、入力検証が不要になるわけではありません。

- すべての SAML provider/consumer が適切な[入力検証](https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html)を行うようにします。

## 暗号

暗号アルゴリズムに依存するソリューションは、暗号解析の最新動向に追随する必要があります。

- チェーン内のすべての SAML 要素が[強力な暗号](https://cheatsheetseries.owasp.org/cheatsheets/Cryptographic_Storage_Cheat_Sheet.html#algorithms)を使用するようにします。
- [安全でない XMLEnc アルゴリズム](https://www.w3.org/TR/xmlenc-core1/#sec-RSA-1_5)のサポート廃止を検討します。

## ASVS との対応

| ASVS 項目 | 関連内容 |
| --- | --- |
| V9.1 | SAML レスポンス、Assertion、署名、Audience、宛先、時刻、リプレイ防止、暗号強度、トークン処理に関する管理策 |
