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
      <a href="/author">author</a>
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
  },authorSelect:function(authors, author_id){
      var tag = '';
      var i = 0;
      while(i < authors.length){
        var selected = '';
        if(authors[i].id === author_id) {
          selected = 'selected';
        }
      tag += `<option value="${authors[i].id}"${selected}>${authors[i].name}</option>}`;
        i++;
    }
    return `
    <select name="author">
    ${tag}
    </select>
    `
  },authorTable:function(authors){
    var tag = '<table>';
    var i = 0;
    while(i < authors.length){
        tag += `
            <tr>
                <td>${authors[i].name}</td>
                <td>${authors[i].profile}</td>
                <td><a href="/author/update?id=${authors[i].id}">update</a></td>
                <td>delete</td>
            </tr>
        `
        i++;
    }
    tag += '</table>';
    return tag;
  }
}
