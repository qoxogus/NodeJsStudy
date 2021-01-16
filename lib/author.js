var db = require('./db')
var template = require('./template.js');
var qs = require('querystring');

exports.home = function(request, response){
    db.query(`SELECT * FROM topic`, function(error, topics) {
        db.query(`SELECT * FROM author`, function(error2, authors) {
            var title = 'author';
            var list = template.list(topics);
            var html = template.HTML(title, list,
                `
                ${template.authorTable(authors)}
                <style>
                    table{
                        border-collapse: collapes;
                    }
                    td{
                        border:1px solid black;
                    }
                </style>
                <form action="author/create_process" method="post">
                    <p>
                        <input type="text" name="name" placeholder="name">
                    </p>
                    <p>
                        <textarea  name="profile" placeholder="description"></textarea>
                    </p>
                    <p>
                        <input type="submit">
                    </p>
                </form>
                `, 
                ``
            );
            response.writeHead(200); //서버와의 약속 404이면 찾을수없다는 약속이다.
            response.end(html); //화면에 보여지는 것
        });
    });
}

exports.create_process = function(request, response){
    var body = '';
      request.on('data', function(data){
          body = body + data;
      });
      request.on('end', function(){
          var post = qs.parse(body);
          db.query(`INSERT INTO author (name, profile) 
            VALUES(?, ?)`, //상세보기를 만들 때 db 테이블에 인서트를 해준다 
            [post.name, post.profile],
            function(error, result){
              if(error){
                throw error;
              }
              response.writeHead(302, {Location: `/author`}); //다른 페이지로 팅궈버리는 로케이션
              response.end();
            }
          )
      });
}