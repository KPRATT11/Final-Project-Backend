const { dbQuery } = require ('../lib/dbQuery.js')

function hasUserVoted(detailsObject){
    const {user_id, for_post, target_id} = detailsObject
    return dbQuery('select is_like from votes where for_post = $1 and author_id = $2 and target_id = $3', 
    [for_post, user_id, target_id])
}

module.exports = {
    hasUserVoted
}
