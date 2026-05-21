# パスワード忘れ対応チートシート 日本語訳

## Attribution

- Original: Forgot Password Cheat Sheet
- Source: https://cheatsheetseries.owasp.org/cheatsheets/Forgot_Password_Cheat_Sheet.html
- Copyright: Cheat Sheets Series Team
- License: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
- License URL: https://creativecommons.org/licenses/by-sa/4.0/
- Changes: Japanese translation added.
- Retrieved: 2026-05-21

## 日本語訳

# パスワード忘れ対応チートシート

## はじめに

適切なユーザー管理システムを実装するため、システムは利用者がパスワードリセットを要求できる **パスワード忘れ対応 (Forgot Password)** サービスを組み込む。

この機能は単純で実装しやすいように見えるが、よく知られた [ユーザー列挙攻撃](https://owasp.org/www-project-web-security-testing-guide/stable/4-Web_Application_Security_Testing/03-Identity_Management_Testing/04-Testing_for_Account_Enumeration_and_Guessable_User_Account.html) など、脆弱性の一般的な発生源である。

以下の短いガイドラインは、パスワード忘れ対応サービスを保護するためのクイックリファレンスとして使用できる。

- **存在するアカウントと存在しないアカウントの両方に、一貫したメッセージを返す。**
- **ユーザーへの応答メッセージにかかる時間が一定になるようにする。**
- **パスワードをリセットする方法を伝えるためにサイドチャネルを使用する。**
- **最も単純で迅速な実装には [URL トークン](#url-トークン) を使用する。**
- **生成されるトークンやコードが以下を満たすようにする。**
    - **暗号学的に安全なアルゴリズムを使用してランダムに生成される。**
    - **総当たり攻撃に耐える十分な長さがある。**
    - **安全に保存される。**
    - **単回使用であり、適切な期間後に失効する。**
- **アカウントのロックアウトなど、有効なトークンが提示されるまでアカウントに変更を加えない。**

このチートシートは、利用者のパスワードリセットに焦点を当てている。多要素認証 (MFA) のリセットに関するガイダンスについては、[多要素認証チートシート](https://cheatsheetseries.owasp.org/cheatsheets/Multifactor_Authentication_Cheat_Sheet.html#resetting-mfa) の関連セクションを参照する。

## パスワード忘れ対応サービス

パスワードリセットプロセスは、以下のセクションで詳述する二つの主なステップに分けられる。

### パスワード忘れ対応リクエスト

利用者がパスワード忘れ対応サービスを使用し、ユーザー名またはメールアドレスを入力する場合、安全なプロセスを実装するために以下に従うべきである。

- 存在するアカウントと存在しないアカウントの両方に、一貫したメッセージを返す。
- 攻撃者がどのアカウントが存在するかを列挙できないよう、応答が一貫した時間で返るようにする。これは非同期呼び出しを使用する、または早期終了方式ではなく同じロジックが実行されるようにすることで実現できる。
- アカウント単位のレート制限、CAPTCHA の要求、その他の制御など、過剰な自動送信に対する保護を実装する。そうしない場合、攻撃者は特定アカウントに対して 1 時間に何千件ものパスワードリセット要求を行い、利用者の受信システム (メール受信箱や SMS など) を無用な要求であふれさせる可能性がある。
- [SQL インジェクション防止方法](https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html) や [入力検証](https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html) など、通常のセキュリティ対策を適用する。

### 利用者によるパスワードリセット

利用者が (メールで送信された) トークン、または (SMS やその他の仕組みで送信された) コードを提示して本人性を証明したら、新しい安全なパスワードにリセットすべきである。このステップを保護するために取るべき対策は以下である。

- 利用者は、設定するパスワードを 2 回入力して確認すべきである。
- 安全なパスワードポリシーが導入され、アプリケーションの他の部分と一貫していることを確認する。
- [安全なプラクティス](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html) に従ってパスワードを更新し保存する。
- パスワードがリセットされたことを利用者に知らせるメールを送信する (メールにパスワードを含めてはならない)。
- 新しいパスワードを設定した後、利用者は通常の仕組みでログインすべきである。利用者を自動的にログインさせてはならない。これは認証およびセッション処理コードに追加の複雑さを持ち込み、脆弱性を混入させる可能性を高めるためである。
- 既存のすべてのセッションを無効化するか利用者に確認する、または自動的にセッションを無効化する。

## 方法

利用者がパスワードリセットを要求できるようにするには、利用者を識別する何らかの方法、またはサイドチャネルを通じて利用者に連絡する手段が必要である。

これは以下のいずれかの方法で実現できる。

- [URL トークン](#url-トークン)。
- [PIN](#pin)
- [オフライン方式](#オフライン方式)
- [秘密の質問](#秘密の質問)。

これらの方法は、利用者が主張どおりの本人であることに対する保証度を高めるために併用できる。いずれの場合でも、サポートチームに連絡してスタッフに本人性を証明する必要があるとしても、利用者が常にアカウントを回復する手段を持つようにしなければならない。

### 一般的なセキュリティプラクティス

リセット識別子 (トークン、コード、PIN など) には、適切なセキュリティプラクティスを適用することが不可欠である。有効期間の制限など、一部の事項は [オフライン方式](#オフライン方式) には適用されない。すべてのトークンとコードは以下を満たすべきである。

- [暗号学的に安全な乱数生成器](https://cheatsheetseries.owasp.org/cheatsheets/Cryptographic_Storage_Cheat_Sheet.html#secure-random-number-generation) を使用して生成する。
    - ランダムトークンの代わりに JSON Web Token (JWT) を使用することも可能だが、[JSON Web Token チートシート](https://cheatsheetseries.owasp.org/cheatsheets/JSON_Web_Token_for_Java_Cheat_Sheet.html) で説明されているような追加の脆弱性を持ち込む可能性がある。
- 総当たり攻撃に耐える十分な長さにする。
- データベース内の個別利用者に紐付ける。
- 使用後に無効化する。
- [パスワードストレージチートシート](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html) で説明されているように、安全な方法で保存する。

### URL トークン

URL トークンは URL のクエリ文字列で渡され、通常はメールで利用者に送信される。プロセスの基本的な概要は以下のとおりである。

1. 利用者用のトークンを生成し、URL クエリ文字列に付加する。
2. このトークンをメールで利用者に送信する。
   - リセット URL の作成時には、[Host](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Host) ヘッダーに依存してはならない。これは [Host ヘッダーインジェクション](https://owasp.org/www-project-web-security-testing-guide/stable/4-Web_Application_Security_Testing/07-Input_Validation_Testing/17-Testing_for_Host_Header_Injection) 攻撃を避けるためである。URL はハードコードするか、信頼済みドメインのリストに照らして検証すべきである。
   - URL が HTTPS を使用していることを確認する。
3. 利用者はメールを受け取り、付加されたトークンを含む URL にアクセスする。
   - リファラ漏えいを避けるため、パスワードリセットページが `noreferrer` 値を持つ [Referrer Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Referrer-Policy) タグを追加するようにする。
   - レート制限など、利用者が URL 内のトークンを総当たりできないようにする適切な保護を実装する。
4. 必要に応じて、利用者に [秘密の質問](#秘密の質問) への回答を要求するなど、追加の検証ステップを実行する。
5. 利用者に新しいパスワードを作成して確認させる。アプリケーションの他の場所で使用しているものと同じパスワードポリシーが適用されることを確認する。

*注:* URL トークンは、トークンから制限付きセッションを作成することで、[PIN](#pin) と同じ挙動に従うこともできる。判断は開発者のニーズと専門性に基づいて行うべきである。

### PIN

PIN は、SMS などのサイドチャネルを通じて利用者に送信される数字 (6 から 12 桁) である。

1. PIN を生成する。
2. SMS または別の仕組みで利用者に送信する。
   - PIN をスペースで区切ると、利用者が読み取り入力しやすくなる。
3. 利用者はパスワードリセットページで、ユーザー名とともに PIN を入力する。
4. その PIN から、利用者のパスワードリセットのみを許可する制限付きセッションを作成する。
5. 利用者に新しいパスワードを作成して確認させる。アプリケーションの他の場所で使用しているものと同じパスワードポリシーが適用されることを確認する。

### オフライン方式

オフライン方式は、利用者がバックエンドから特別な識別子 (トークンや PIN など) を要求せずにパスワードをリセットできる点で、他の方式と異なる。ただし、要求が正当であることを確認するため、認証は引き続きバックエンドで行う必要がある。オフライン方式では、登録時、または利用者が設定したいときに特定の識別子を提供する。

これらの識別子はオフラインかつ安全な方法 (*例:* パスワードマネージャー) で保存されるべきであり、バックエンドは [一般的なセキュリティプラクティス](#一般的なセキュリティプラクティス) に適切に従うべきである。一部の実装は、[ハードウェア OTP トークン](https://cheatsheetseries.owasp.org/cheatsheets/Multifactor_Authentication_Cheat_Sheet.html#hardware-otp-tokens)、[証明書](https://cheatsheetseries.owasp.org/cheatsheets/Multifactor_Authentication_Cheat_Sheet.html#certificates)、またはエンタープライズ内で使用できるその他の実装に基づいている。これらはこのチートシートの対象外である。

アカウントで MFA が有効化されており、MFA 回復を探している場合は、対応する [多要素認証チートシート](https://cheatsheetseries.owasp.org/cheatsheets/Multifactor_Authentication_Cheat_Sheet.html#resetting-mfa) に別の方法が記載されている。

### 秘密の質問

秘密の質問は、その回答が攻撃者に推測されやすい、または入手されやすいことが多いため、パスワードリセットの唯一の仕組みとして使用すべきではない。ただし、このチートシートで説明した他の方法と組み合わせることで、追加のセキュリティ層を提供できる。使用する場合は、[秘密の質問チートシート](https://cheatsheetseries.owasp.org/cheatsheets/Choosing_and_Using_Security_Questions_Cheat_Sheet.html) で説明されているように、安全な質問が選ばれていることを確認する。

## アカウントロックアウト

パスワード忘れ攻撃に応答してアカウントをロックアウトすべきではない。これは、既知のユーザー名を持つ利用者へのアクセスを拒否するために悪用される可能性があるためである。アカウントロックアウトの詳細については、[認証チートシート](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html) を参照する。

## ASVS との対応

| ASVS 項目 | 関連内容 |
| --- | --- |
| V6.3 | リセットトークン、PIN、制限付きセッション、既存セッション失効の安全な取り扱い |
| V6.4 | 秘密の質問を単独の回復手段として使わない設計 |
| V6.6 | アカウント列挙、過剰リセット要求、ロックアウト悪用、パスワード変更通知への対策 |
