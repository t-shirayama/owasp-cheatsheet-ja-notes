# REST 評価チートシート 日本語訳

## Attribution

- Original: REST Assessment Cheat Sheet
- Source: https://cheatsheetseries.owasp.org/cheatsheets/REST_Assessment_Cheat_Sheet.html
- Copyright: Cheat Sheets Series Team
- License: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
- License URL: https://creativecommons.org/licenses/by-sa/4.0/
- Changes: Japanese translation added.
- Retrieved: 2026-05-21

## 日本語訳

## About RESTful Web Services

Web サービスは、マシン間通信に使われる Web 技術の実装です。そのため、アプリケーション間通信、Web 2.0、マッシュアップ、デスクトップアプリケーションやモバイルアプリケーションからサーバーを呼び出す用途に使われます。

RESTful Web サービス（しばしば単に REST と呼ばれます）は、RESTful 設計パターンに基づく軽量な Web サービスの一種です。実際には、RESTful Web サービスは通常の HTTP 呼び出しに似た HTTP リクエストを使用します。これは、複雑なプロトコルを使用する SOAP など他の Web サービス技術とは対照的です。

## Key relevant properties of RESTful web services

- 要求された操作の主な動詞として、HTTP メソッド（`GET`、`POST`、`PUT`、`DELETE`）を使用します。
- 標準的ではないパラメータ指定:
    - URL の一部として指定されます。
    - ヘッダー内で指定されます。
- パラメータ値、リクエストボディ、またはレスポンスボディで、JSON や XML を使った構造化パラメータとレスポンスを使用します。これは、機械が利用できる情報を伝達するために必要です。
- カスタム認証とセッション管理を使用し、多くの場合はカスタムセキュリティトークンを利用します。これは、マシン間通信ではログインシーケンスを許容しないため必要になります。
- 公式なドキュメントが不足しがちです。RESTful Web サービスを記述するための提案標準である [WADL](http://www.w3.org/Submission/wadl/) は Sun Microsystems によって提出されましたが、正式には採用されませんでした。

## The challenge of security testing RESTful web services

- アプリケーションを調査しても、RESTful Web サービスで使われる URL やパラメータ構造などの攻撃対象領域が明らかにならないことがあります。その理由は次のとおりです。
    - どのアプリケーションも、サービスが公開するすべての機能とパラメータを使用するわけではありません。
    - 使用される機能は、ページ内のリンクではなくクライアント側コードによって動的に有効化されることがよくあります。
    - クライアントアプリケーションが Web アプリケーションではないことが多く、起動リンクや関連コードを検査できない場合があります。
- パラメータが標準的ではないため、何が URL の一部または固定ヘッダーであり、何が [fuzzing](https://owasp.org/www-community/Fuzzing) すべきパラメータであるかを判断しにくくなります。
- マシンインターフェースとして、使用されるパラメータ数は非常に多くなることがあります。たとえば、JSON 構造に数十個のパラメータが含まれる場合があります。それぞれを [fuzzing](https://owasp.org/www-community/Fuzzing) すると、テストに必要な時間が大幅に長くなります。
- カスタム認証メカニズムはリバースエンジニアリングを必要とし、一般的なツールはログインセッションを追跡できないため有用でなくなることがあります。

## How to pentest a RESTful web service

ドキュメントを通じて攻撃対象領域を判断します。RESTful のペネトレーションテストでは、ある程度のクリアボックステストが許可され、サービスに関する情報を得られる方がうまく進む場合があります。

この情報により、攻撃対象領域をより完全にカバーできます。探すべき情報は次のとおりです。

- 公式なサービス記述。他の種類の Web サービス、たとえば SOAP では通常 WSDL による公式な記述が利用できることが多い一方で、REST ではまれです。ただし、WSDL 2.0 または WADL が REST を記述でき、使用される場合もあります。
- サービス利用のための開発者ガイド。詳細度は低いかもしれませんが、一般的に見つかることが多く、opaque-box テストと見なせる場合もあります。
- アプリケーションのソースまたは設定。dotNet を含む多くのフレームワークでは、REST サービス定義をコードではなく設定ファイルから容易に取得できる場合があります。

[プロキシ](https://www.zaproxy.org/) を使って完全なリクエストを収集します。これはペネトレーションテストで常に重要な手順ですが、REST ベースのアプリケーションでは、アプリケーション UI が実際の攻撃対象領域の手がかりを与えないことがあるため、より重要です。

REST サービスは GET パラメータ以外も利用するため、プロキシは URL だけでなく完全なリクエストを収集できなければならない点に注意してください。

収集したリクエストを分析し、攻撃対象領域を判断します。

- 標準的ではないパラメータを探します。
    - 異常な HTTP ヘッダーを探します。多くの場合、それらはヘッダーベースのパラメータです。
    - URL セグメントが URL 間で繰り返しパターンを持つかを判断します。そのようなパターンには、日付、数値、ID のような文字列が含まれることがあり、その URL セグメントが URL 埋め込みパラメータであることを示します。
        - 例: `http://server/srv/2013-10-21/use.php`
    - 構造化されたパラメータ値を探します。それらは JSON、XML、または標準的ではない構造である可能性があります。
    - URL の最後の要素に拡張子がない場合、それはパラメータである可能性があります。アプリケーション技術が通常は拡張子を使う場合、または前のセグメントに拡張子がある場合は特にそうです。
        - 例: `http://server/svc/Grid.asmx/GetRelatedListItems`
    - 大きく変化する URL セグメントを探します。多数の値を持つ単一の URL セグメントは、物理ディレクトリではなくパラメータである可能性があります。
        - たとえば URL `http://server/src/XXXX/page` が `XXXX` に数百の値を持って繰り返される場合、`XXXX` はパラメータである可能性が高いです。

標準的ではないパラメータを検証します。すべての場合ではありませんが、パラメータと疑われる URL セグメントの値を無効であることが期待される値に設定すると、それがパス要素なのかパラメータなのかを判断しやすくなることがあります。パス要素であれば Web サーバーは *404* メッセージを返します。一方、パラメータへの無効値であれば、その値は Web サーバーレベルでは妥当なため、アプリケーションレベルのメッセージが返されます。

[fuzzing](https://owasp.org/www-community/Fuzzing) を最適化するために収集リクエストを分析します。fuzzing 対象になり得るパラメータを特定した後、それぞれの収集値を分析して次を判断します。

- 有効値と無効値。[fuzzing](https://owasp.org/www-community/Fuzzing) が境界付近の無効値に集中できるようにします。
    - たとえば、常に正の整数であることが分かっている値に対して *0* を送信します。
- 現在のユーザーに割り当てられていると推定される範囲を超えて fuzzing できるシーケンス。

最後に、[fuzzing](https://owasp.org/www-community/Fuzzing) を行う際には、使用されている認証メカニズムをエミュレートすることを忘れないでください。

## Related Resources

- [REST Security Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/REST_Security_Cheat_Sheet.html) - このチートシートのもう一方の側面
- [YouTube: RESTful services, web security blind spot](https://www.youtube.com/watch?v=pWq4qGLAZHI) - このチートシートのほとんどのトピックを詳しく説明する動画プレゼンテーション

## ASVS との対応

| ASVS 項目 | 関連内容 |
| --- | --- |
| V4.1 | RESTful Web サービスの攻撃対象領域、非標準パラメータ、認証機構、リクエスト収集と fuzzing 観点 |
