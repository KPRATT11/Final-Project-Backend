const { dbQuery } = require('../lib/dbQuery')

function selectComment(detailsObject){
    const { id } = detailsObject 
    return dbQuery('select * from comments where id = $1',
    [id])
}

function selectVotes(detailsObject){
    const { id } = detailsObject 
    return dbQuery('select * from votes where id = $1',
    [id])
}

function selectUser(detailsObject){
    const { id } = detailsObject 
    return dbQuery(`
        SELECT users.id, users.creation_date, users.username, users.user_weight, (
            SELECT SUM(id) FROM action WHERE action.user_id= users.id
        ) as action_weight
        FROM users
        WHERE users.id = $1;
    `,
    [id])
}

function selectPost(detailsObject){
    const { id } = detailsObject 
    return dbQuery(`
    SELECT 
    id, 
    title, 
    content, 
    community, 
    author_id, 
    posted_at, 
    (SELECT sum(vote_weight) from votes WHERE for_post = true and target_id = $1) AS rating
    FROM posts 
    WHERE id = $1;`,
    [id])
}

function selectCommunity(detailsObject){
    const { id, user_id } = detailsObject
    return dbQuery(`
        SELECT id, owner_id, owner_id, title, sidebar, 
        (
            SELECT COUNT(id) > 0 
            FROM FOLLOWS 
            WHERE user_id = $2
            AND community_id = $1
            ) as 
        user_following FROM communities WHERE id = $1;
        `,
    [id, user_id])
}

function selectFollowedCommunities(detailsObject){
    const { id } = detailsObject
    return dbQuery(`
    SELECT 
    ($1 = owner_id) AS user_owns,
    Count(follows.id) AS followers, 
    users.id AS owner_id,
    users.username AS owner_username,
    communities.id,
    title,
    sidebar
    FROM communities 
    JOIN users ON users.id = communities.owner_id
    JOIN follows ON follows.community_id = communities.id
    WHERE follows.user_id = $1
    GROUP BY users.id, users.username, communities.id, title, sidebar;`,
    [id]);
}

function selectSearchedCommunities(detailsObject){
    const { id, search } = detailsObject
    return dbQuery(`
    SELECT 
    ($1 = owner_id) AS user_owns,
    Count(follows.id) AS followers, 
    users.id AS owner_id,
    users.username AS owner_username,
    communities.id,title,sidebar
    FROM communities 
    JOIN users ON users.id = communities.owner_id
    JOIN follows ON follows.community_id = communities.id
    WHERE communities.title LIKE '%${search}%'
    GROUP BY users.id, users.username, communities.id, title, sidebar;`,
    [id]);
}

function selectPopularCommunities(detailsObject){
    const { id } = detailsObject
    return dbQuery(`
    SELECT 
    Count(follows.id) AS followers, 
    users.id AS owner_id,
    users.username AS owner_username,
    communities.id,
    title,
    sidebar,
    ($1 = owner_id) AS user_owns
    FROM communities 
    JOIN users ON users.id = communities.owner_id
    JOIN follows ON follows.community_id = communities.id
    WHERE (
    SELECT Count(id) 
    FROM follows 
    WHERE community_id = communities.id) 
    > 1
    AND 
    owner_id != $1
    AND (
    SELECT count(community_id) 
    from follows 
    WHERE community_id = communities.id  
    AND user_id = $1)
    = 0
    GROUP BY users.id, users.username, communities.id, title, sidebar
    ORDER BY RANDOM()
    LIMIT 3;`,
    [id]);
}

function selectAllPostsOfCommunities(detailsObject){
    console.log('Select All Posts of Communities')
    const { id } = detailsObject
    return dbQuery(`
    SELECT 
    id, 
    title, 
    content, 
    community, 
    author_id, 
    posted_at, 
    (SELECT sum(vote_weight) from votes WHERE for_post = true and target_id = posts.id) AS rating
    FROM posts 
    WHERE community = $1;`, 
    [id])
}

function selectCommentsFromPostID(detailsObject){
    const { id } = detailsObject
    return dbQuery(`
    select id, author_id, content, target_id, submitted_at, 
        (select sum(vote_weight) from votes WHERE for_post = false and target_id = comments.id) AS rating
    from comments where target_id = $1;`, 
    [id])
}

module.exports = {
    selectAllPostsOfCommunities,
    selectComment,
    selectCommunity,
    selectPost,
    selectFollowedCommunities,
    selectVotes,
    selectUser,
    selectCommentsFromPostID,
    selectSearchedCommunities,
    selectPopularCommunities
}