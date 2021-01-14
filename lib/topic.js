var db = require('./db')
var template = require('./template.js');
var url = require('url');
var qs = require('querystring');

exports.home = function(request, response){
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
}

exports.page = function(request, response){
    var _url = request.url;
    var queryData = url.parse(_url, true).query; //parse = 분석
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
         var title = topic[0].title;  //topic은 배열의 형태로 오기때문에 배열로서 취급해주어야 한다.
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

exports.create = function(request, response){
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
}

exports.create_process = function(request, response){
    var body = '';
      request.on('data', function(data){
          body = body + data;
      });
      request.on('end', function(){
          var post = qs.parse(body);
          db.query(`INSERT INTO topic (title, description, created, author_id) 
            VALUES(?, ?, NOW(), ?)`, //상세보기를 만들 때 db 테이블에 인서트를 해준다 
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
}

exports.update = function(request, response){
    var _url = request.url;
    var queryData = url.parse(_url, true).query; //parse = 분석
    db.query('SELECT * FROM topic', function(error, topics){
        // fs.readdir('./data', function(error, filelist){
          // var filteredId = path.parse(queryData.id).base; //필요없는 부분
          if(error){  //예외처리
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
                    ${template.authorSelect(authors, topic[0].author_id)}
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
}

exports.update_process = function(request, response){
    var body = '';
      request.on('data', function(data){
          body = body + data;
      });
      request.on('end', function(){
          var post = qs.parse(body);
          db.query('UPDATE topic SET title=?, description=?, author_id=? WHERE id=?', [post.title, post.description, post.author, post.id], function(error, result){
            response.writeHead(302, {Location: `/?id=${post.id}`});
            response.end();
          })
      });
}

exports.delete_process = function(request, response){
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
}