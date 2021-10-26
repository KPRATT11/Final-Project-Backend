const { dbQuery } = require('../lib/dbQuery')

function patchComment(detailsObject){
    const { id, content} = detailsObject 
    return dbQuery('UPDATE comments SET content = $2 where id = $1 returning *',
    [id, content])
}

function patchPost(detailsObject){
    const { id, title, content } = detailsObject
    return dbQuery('UPDATE posts SET title = $2, content = $3 where id = $1 returning *',
    [id, title, content])
}

module.exports = {
    patchComment,
    patchPost
}