//NodeJs Mysql 생활코딩 강의를 보기 위해 다운로드 받은 코드
var http = require('http');
// var fs = require('fs');
var url = require('url');
var qs = require('querystring');
var template = require('./lib/template.js');
// var path = require('path'); // uri를 바꿔 보면 안되는 페이지를 볼 수 없게 만들기위해 쓰는 것.
// var sanitizeHtml = require('sanitize-html'); //보안을 위해 <script></script> 같은 태그들을 무시하기 위해 쓰는 것. (사용자한테 입력받는 값을 살균해주자!(데이터베이스에서 가져오는 값)) (저장된 정보가 바깥쪽으로 나올때 사용자를 공격할 의도를 담을수있는 script태그나 아이프레임같은 태그를 sanitizeHtml라이브러리로 필터링)
var db = require('./lib/db')
var topic = require('./lib/topic');
const { authorSelect } = require('./lib/template.js');
var author = require('./lib/author')

var app = http.createServer(function(request,response){
    var _url = request.url;
    var queryData = url.parse(_url, true).query; //parse = 분석
    var pathname = url.parse(_url, true).pathname;
    if(pathname === '/'){
      if(queryData.id === undefined){
        topic.home(request, response);
      } else {
        topic.page(request, response);
      }
    } else if(pathname === '/create'){
      topic.create(request, response);
    } else if(pathname === '/create_process'){
      topic.create_process(request, response);
    } else if(pathname === '/update'){
      topic.update(request, response);
    } else if(pathname === '/update_process'){
      topic.update_process(request, response);
    } else if(pathname === '/delete_process'){
      topic.delete_process(request, response);
    } else if(pathname === '/author'){
      author.home(request, response);
    } else if(pathname === '/author/create_process'){
      author.create_process(request, response);
    } else if(pathname === '/author/update'){
      author.update(request, response);
    } else if(pathname === '/author/update_process'){
      author.update_process(request, response);
    } else if(pathname === '/author/delete_process'){
      author.delete_process(request, response);
    }
    else {
      response.writeHead(404); //404page
      response.end('Not found');
    }
});
app.listen(3000); //3000포트에서
