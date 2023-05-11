// モジュール呼び出し；全てNode.js
var http=require('http');   //httpモジュールのロード：httpサーバを作成するための機能を提供
var fs=require('fs');   //fsモジュール：ファイルシステムに関連する操作の機能提供
var path=require('path');   //pathモジュール：ファイルパスやディレクトリパスを操作する機能提供

// ７行目から４５行目まで単一ブロック＋４１行目3002はサーバの待ち受けポート
http.createServer(function(request,response){   //httpサーバオブジェクト作成、引数：コールバック関数（＊リクエスト時に実行）
    console.log('request', request.url);    //リクエストのURLをコンソールに出力

    // '.' + request.url は、要求されたURLのパスの前に '.' を追加しています。
    // これにより、ファイルのパスが現在のディレクトリを基準として指定されることになります。
    // たとえば、もし request.url が /index.html の場合、filePath の値は './index.html' となります。
    // 同様に、request.url が /images/image.jpg の場合、filePath の値は './images/image.jpg' となります。
    var filePath='.'+request.url;   //？？リクエストのURLに基づいてファイルパスを作成、ドット（ . )は現在のディレクトリを表記
    if(filePath=='./'){  //リクエストされたURLがルートだった場合、ファイルパスのデフォルトをhtmlファイルに指定
        filePath='./test.html'
    }
    // 15行目から22行目：extname:pathモジュールの関数、filePathの拡張子を取得
    var extname=String(path.extname(filePath)).toLowerCase();
    var mimeTypes = {
        '.html': 'text/html',
        '.js': 'text/javascript',
        '.css': 'text/css'
    };

    var contentType = mimeTypes[extname] || 'application/octet-stream';
    //ファイルを非同期で読み込む→読み込みの完了とともにコールバック関数の実行
    fs.readFile(filePath, function(error, content){ //引数はコールバック関数のパラメータ
        if (error) {
            if (error.code == 'ENOENT') {   //ENOENT:ファイルが見つからないエラーを意味
                fs.readFile('./404.html', function(){
                    response.writeHead(404 ,{'Content-Type': 'text/html'});
                    response.end(content, 'utf-8');
                });
            } else {
                response.writeHead(500);    //レスポンスのステータスコードを500に設定する。500はサーバ内部でエラーが発生したことを示す内部サーバエラーを意味するステータスコード
                response.end('Sorry, check with the site admin for error: ' + error.code + '..\n'); //error.codeは具体的なエラーコード、エラーメッセージをレスポンスの本文として送信する
                // ＊この行は必要ない　response.end(); //レスポンスの終了を表す→この行の実行によりレスポンスがクライアントに送信される
            }
        } else {
            response.writeHead(200, {'Content-Type': contentType}); //レスポンスのステータスコードを200（成功）に設定＋レスポンスヘッダーに適切なコンテンツのMIMEタイプを設定する
            response.end(content, 'utf-8'); //読み込んだコンテンツがレスポンスの本文として送信される
        }
    });
}).listen(3002);    
console.log('Server running at http://127.0.0.1:3002');
// http://localhost:3002とすればアクセス可能

// 非同期にファイルを読み込む：プログラムがファイルの読み込みを開始した後、その処理が完了するのを待たずに他のタスクを実行できる方式

// ☆☆22行目の解説
// var contentType = mimeTypes[extname] || 'application/octet-stream'; は、指定された拡張子 (extname) を使って、MIMEタイプを取得するための処理です。

// 以下に詳細な説明をします：

// mimeTypes は、拡張子と対応するMIMEタイプのマッピングを表すオブジェクトです。例えば、.html の拡張子には 'text/html' のMIMEタイプが対応しています。

// mimeTypes[extname] は、mimeTypes オブジェクトから指定された拡張子 (extname) に対応するMIMEタイプを取得します。

// || 'application/octet-stream' は、取得したMIMEタイプが存在しない場合のデフォルト値を指定しています。
// || 演算子は、左側の値が存在しない (falsy) 場合に右側の値を使用します。
// つまり、指定された拡張子に対応するMIMEタイプが mimeTypes オブジェクトに存在しない場合、デフォルト値として 'application/octet-stream' が使用されます。

// この処理は、拡張子に基づいて適切なMIMEタイプを特定し、それを contentType 変数に格納します。
// MIMEタイプは、ブラウザに送信されるコンテンツの種類を示すため、ブラウザはその情報を使ってコンテンツを適切に解釈します。

// MIME（Multipurpose Internet Mail Extensions）タイプは、インターネット上でデータの種類を識別するために使用される識別子です。
// 主にコンテンツの種類を示すために使用されます。例えば、テキスト文書、画像、動画、音声など、さまざまな種類のデータがあります。
// MIMEタイプは、ブラウザや他のクライアントがリソースを正しく解釈し、適切なアクションを実行できるようにするために使用されます。

// MIMEタイプは通常、拡張子と関連付けられます。拡張子はファイルの種類を示すために使用され、それに応じて適切なMIMEタイプが関連付けられます。
// 例えば、.html 拡張子はHTML文書を示し、関連付けられたMIMEタイプは 'text/html' です。
// 同様に、.jpg 拡張子はJPEG画像を示し、関連付けられたMIMEタイプは 'image/jpeg' です。


//以下はhttps化＋セキュリティ対策をしたソース
// var https = require('https');
// var fs = require('fs');
// var path = require('path');


////Node.jsでhttpsサーバを作成するために使用されるss証明書のあぷしょんを定義している
////ssl(secure sockets layer)：セキュアな通信を確立するためのプロトコル
////hhts(http over ssl)、ssl証明書はサーバとクライアント間の通信を暗号化し、信頼性とセキュリティを提供する
// var options = {  //httpsサーバを作成時に必要なssl証明書の情報を提供する→サーバ暗号化されたセキュアな通信を確立し、クライアントとの間で安全なデータのやり取りが可能
//   key: fs.readFileSync('ssl/privateKey.pem'),  // SSL証明書の秘密鍵を同期的に読み込む；実際にあ非同期な読み込みが推奨される→アプリケーションの応答性とスケーラビリティの向上
//   cert: fs.readFileSync('ssl/certificate.pem') // SSL証明書の公開鍵
// };

// https.createServer(options, function(request, response) {
//   console.log('request', request.url);   //リクエストのURLをコンソールに出力する、request.url：クライアントからのリクエストに含まれるURLパスやクエリパラメータなどの情報
////開発者はリクエストの処理やデバッグ時にコンソールの出力を確認sるうことで、正しいリクエストが送信されているか、または問題が発生しているかを把握することができ、それにより必要な処理やデバッグを行うことができる

//   var filePath = '.' + request.url;
//   if (filePath == './') {
//     filePath = './test.html';
//   }

//   var extname = String(path.extname(filePath)).toLowerCase();
//   var mimeTypes = {
//     '.html': 'text/html',
//     '.js': 'text/javascript',
//     '.css': 'text/css'
//   };

//   var contentType = mimeTypes[extname] || 'application/octet-stream';

//   fs.readFile(filePath, function(error, content) {
//     if (error) {
//       if (error.code == 'ENOENT') {
//         fs.readFile('./404.html', function() {
//           response.writeHead(404, {'Content-Type': 'text/html'});
//           response.end(content, 'utf-8');
//         });
//       } else {
//         response.writeHead(500);
//         response.end('Sorry, check with the site admin for error: ' + error.code + '..\n');
//       }
//     } else {
//       response.writeHead(200, {'Content-Type': contentType});
//       response.end(content, 'utf-8');
//     }
//   });
// }).listen(3002);

// console.log('Server running at https://127.0.0.1:3002');


////追記：スケーラビリティ＝システムやソフトウェアが負荷や需要の増加に対して柔軟に対応できる能力を指します。
////システムのスケーラビリティが高いということは、追加のリソースやユーザー数の増加などの変化に対して効率的に対応できるということを意味