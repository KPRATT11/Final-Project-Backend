
const { dbQuery } = require ('../lib/dbQuery.js')

function insertUser(detailsObject){
    console.log('insertUser')
    const { id, creation_date, username} = detailsObject
    return dbQuery('INSERT INTO users VALUES ($1, $2, $3) ON CONFLICT (id) DO NOTHING returning *', [id, creation_date, username])
}

function insertPost(detailsObject){
    console.log('insertPost')
    const { title, content, community, author_id, posted_at, rating } = detailsObject
    return dbQuery('INSERT INTO posts (title, content, community, author_id, posted_at, rating) VALUES ($1, $2, $3, $4, $5, $6) returning  *',
    [title, content, community, author_id, posted_at, rating])
}

function insertVotes(detailsObject){
    const {author_id, is_like, for_post, vote_weight, submitted_at, target_id} = detailsObject
    return dbQuery('INSERT INTO votes (author_id, is_like, for_post, vote_weight, submitted_at, target_id) VALUES ($1, $2, $3, $4, $5, $6) returning *',
    [author_id, is_like, for_post, vote_weight, submitted_at, target_id])
}

function insertComment(detailsObject){
    const {author_id, content, for_post, target_id, submitted_at, rating} = detailsObject
    return dbQuery('INSERT INTO comments (author_id, content, for_post, target_id, submitted_at, rating) VALUES ($1, $2, $3, $4, $5, $6) returning *',
    [author_id, content, for_post, target_id, submitted_at, rating])
}

function insertCommunity(detailsObject){
    const {owner_id, title, sidebar} = detailsObject
    return dbQuery('INSERT INTO communities (owner_id, title, sidebar) VALUES ($1, $2, $3) returning *',
    [owner_id, title, sidebar])
}

function insertAction(detailsObject){
    const {date_occurred, user_id, weight} = detailsObject;
    return dbQuery('INSERT INTO action (date_occured, user_id, weight) VALUES ($1, $2, $3) returning *',
    [date_occurred, user_id, weight])
}

function insertFollows(detailsObject){
    const {community_id, user_id} = detailsObject;
    return dbQuery('INSERT INTO follows (community_id, user_id) VALUES ($1, $2) returning *', 
    [community_id, user_id])
}

module.exports = {
    insertFollows,
    insertUser,
    insertAction,
    insertComment,
    insertCommunity,
    insertVotes,
    insertPost
}