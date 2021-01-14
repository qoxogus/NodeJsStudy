var db = require('./db')
var template = require('./template.js');

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
                `, 
                `<a href="/create">create</a>` //control
            );
            response.writeHead(200); //서버와의 약속 404이면 찾을수없다는 약속이다.
            response.end(html); //화면에 보여지는 것
        });
    });
}