module.exports = {
  HTML:function(title, list, body, control){
    return `
    <!doctype html>
    <html>
    <head>
      <title>WEB1 - ${title}</title>
      <meta charset="utf-8">
    </head>
    <body>
      <h1><a href="/">WEB</a></h1>
      ${list}
      ${control}
      ${body}
    </body>
    </html>
    `;
  },list:function(topics){
    var list = '<ul>';
    var i = 0;
    while(i < topics.length){
      list = list + `<li><a href="/?id=${topics[i].id}">${topics[i].title}</a></li>`; //id를 추가하며 table안에 있는 id인자값을 사용해 url도 바뀌며 [objectid]라고 표시가 안됨, title을 씀으로써 [object]에서 table에 있는 title로 바뀌었다. 쓰지 않으면 그냥 객체를 가르키는것.
      i = i + 1;
    }
    list = list+'</ul>';
    return list;
  }
}
