const { dbQuery } = require ('../lib/dbQuery.js')

function deletePost(detailsObject){
    const { id } = detailsObject
    return dbQuery('delete from posts where id = $1 returning  *',
    [id])
}

function deleteVote(detailsObject){
    const { id, for_post } = detailsObject
    return dbQuery('delete from votes where target_id = $1 and for_post = $2 returning  *',
    [id, for_post])
}

function deleteComment(detailsObject){
    const { id } = detailsObject 
    return dbQuery('delete from comments where id = $1 returning  *',
    [id])
}

function deleteCommunity(detailsObject){
    const { id } = detailsObject
    return dbQuery('delete from communities where id = $1 returning  *',
    [id])
}

function deleteFollow(detailsObject){
    const { community_id, user_id } = detailsObject
    return dbQuery('delete from follows where community_id = $1 and user_id = $2 returning  *',
    [community_id, user_id])
}

module.exports = {
    deleteComment,
    deleteFollow,
    deleteCommunity,
    deletePost,
    deleteVote
}