//NodeJs Mysql 생활코딩 강의를 보기 위해 다운로드 받은 코드
var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');
var template = require('./lib/template.js');

var path = require('path'); // uri를 바꿔 보면 안되는 페이지를 볼 수 없게 만들기위해 쓰는 것.
var sanitizeHtml = require('sanitize-html'); //보안을 위해 <script></script> 같은 태그들을 무시하기 위해 쓰는 것.
var mysql = require('mysql2');
var db = mysql.createConnection({
  host    : 'localhost',
  user    : 'root',
  password: '11111111',
  database: 'opentutorials'
});
db.connect();

var app = http.createServer(function(request,response){
    var _url = request.url;
    var queryData = url.parse(_url, true).query; //parse = 분석
    var pathname = url.parse(_url, true).pathname;
    if(pathname === '/'){
      if(queryData.id === undefined){
        db.query(`SELECT * FROM topic`, function(error, topics) {
          // console.log(topics);
          var title = 'Welcome';
          var description = 'Hello, Node.js';
          var list = template.list(topics);
          var html = template.HTML(title, list,
              `<h2>${title}</h2>${description}`, //body
              `<a href="/create">create</a>` //control
          );
          response.writeHead(200); //서버와의 약속 404이면 찾을수없다는 약속이다.
          response.end(html); //화면에 보여지는 것
        });
      } else {
        /*
        fs.readdir('./data', function(error, filelist){  //글 목록 가져오기
          var filteredId = path.parse(queryData.id).base;
          fs.readFile(`data/${filteredId}`, 'utf8', function(err, description){
            var title = queryData.id;
            var sanitizedTitle = sanitizeHtml(title);
            var sanitizedDescription = sanitizeHtml(description, {
              allowedTags:['h1']
            });
            var list = template.list(filelist);
            var html = template.HTML(sanitizedTitle, list,
              `<h2>${sanitizedTitle}</h2>${sanitizedDescription}`,
              ` <a href="/create">create</a>
                <a href="/update?id=${sanitizedTitle}">update</a>
                <form action="delete_process" method="post">
                  <input type="hidden" name="id" value="${sanitizedTitle}">
                  <input type="submit" value="delete">
                </form>`
            );
            response.writeHead(200);
            response.end(html);
          });
        });
        */
       db.query(`SELECT * FROM topic`, function(error, topics) {
         if(error){
           throw error;
         }
         db.query(`SELECT * FROM topic LEFT JOIN author ON topic.author_id=author.id WHERE topic.id=?`, [queryData.id], function(error2, topic){ //보안 문제 때문에 id값에 '?'를 주고 2번째 인자값으로 []안에 '?'에 들어갈 무언가를 넣어준다.   id=${queryData.id} == [queryData.id]
           if(error2){
             throw error2;
           }
          //  console.log(topic[0].title) //topic은 배열의 형태로 오기때문에 배열로서 취급해주어야 한다.
          console.log(topic);
          var title = topic[0].title;
          var description = topic[0].description;
          var list = template.list(topics);
          var html = template.HTML(title, list,
              `
              <h2>${title}</h2>${description}
              <p>by ${topic[0].name}</p>
              `,
              ` <a href="/create">create</a>
              <a href="/update?id=${queryData.id}">update</a>
              <form action="delete_process" method="post">
                <input type="hidden" name="id" value="${queryData.id}">
                <input type="submit" value="delete">
              </form>`
          );
          response.writeHead(200); //서버와의 약속 404이면 찾을수없다는 약속이다.
          response.end(html); //화면에 보여지는 것
         })
      });
      }
    } else if(pathname === '/create'){
      db.query(`SELECT * FROM topic`, function(error, topics) {
        db.query('SELECT * FROM author', function(error2, authors){
          // console.log(authors);
          var title = 'Create';
          var list = template.list(topics);
          var html = template.HTML(title, list,
              `
              <form action="/create_process" method="post">
                <p><input type="text" name="title" placeholder="title"></p>
                <p>
                  <textarea name="description" placeholder="description"></textarea>
                </p>
                <p>
                  ${template.authorSelect(authors)}
                </p>
                <p>
                  <input type="submit">
                </p>
              </form>
              `, 
              `<a href="/create">create</a>` //control
          );
          response.writeHead(200); //서버와의 약속 404이면 찾을수없다는 약속이다.
          response.end(html); //화면에 보여지는 것
        });
        // console.log(topics);
      });
    } else if(pathname === '/create_process'){
      var body = '';
      request.on('data', function(data){
          body = body + data;
      });
      request.on('end', function(){
          var post = qs.parse(body);
          db.query(`INSERT INTO topic (title, description, created, author_id)
            VALUES(?, ?, NOW(), ?)`,
            [post.title, post.description, post.author],
            function(error, result){
              if(error){
                throw error;
              }
              response.writeHead(302, {Location: `/?id=${result.insertId}`}); //다른 페이지로 팅궈버리는 로케이션
              response.end();
            }
          )
      });
    } else if(pathname === '/update'){
      db.query('SELECT * FROM topic', function(error, topics){
      // fs.readdir('./data', function(error, filelist){
        // var filteredId = path.parse(queryData.id).base; //필요없는 부분
        if(error){
          throw error;
        }
        db.query(`SELECT * FROM topic WHERE id=?`, [queryData.id], function(error2, topic){
          if(error2){
            throw error2;
          }
          db.query('SELECT * FROM author', function(error2, authors){
            var list = template.list(topics);
            var html = template.HTML(topic[0].title, list,
              `
              <form action="/update_process" method="post">
                <input type="hidden" name="id" value="${topic[0].id}">
                <p><input type="text" name="title" placeholder="title" value="${topic[0].title}"></p>
                <p>
                  <textarea name="description" placeholder="description">${topic[0].description}</textarea>
                </p>
                <p>
                  <input type="submit">
                </p>
              </form>
              `,
              `<a href="/create">create</a> <a href="/update?id=${topic[0].id}">update</a>`
            );
            response.writeHead(200);
            response.end(html);
          });
        // fs.readFile(`data/${filteredId}`, 'utf8', function(err, description){
          // var title = queryData.id;
        });
      });
    } else if(pathname === '/update_process'){
      var body = '';
      request.on('data', function(data){
          body = body + data;
      });
      request.on('end', function(){
          var post = qs.parse(body);
          var id = post.id;
          var title = post.title;
          var description = post.description;
          fs.rename(`data/${id}`, `data/${title}`, function(error){
            fs.writeFile(`data/${title}`, description, 'utf8', function(err){
              response.writeHead(302, {Location: `/?id=${title}`});
              response.end();
            })
          });
      });
    } else if(pathname === '/delete_process'){
      var body = '';
      request.on('data', function(data){
          body = body + data;
      });
      request.on('end', function(){
          var post = qs.parse(body);
          db.query('DELETE FROM topic WHERE id=?', [post.id], function(error, result){
            if(error){
              throw error;
            }
            response.writeHead(302, {Location: `/`});
            response.end();
          });
      });
    } else {
      response.writeHead(404); //404page
      response.end('Not found');
    }
});
app.listen(3000); //3000포트에서
