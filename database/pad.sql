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
    LIMIT 3;



SELECT id, owner_id, owner_id, title, sidebar, 
(
    SELECT COUNT(id) > 0 
    FROM FOLLOWS 
    WHERE user_id = $2
    AND community_id = $1
    ) as 
user_following FROM communities WHERE id = $1;
        
SELECT 
comments.id, 
author_id, 
users.username AS author_username, 
content, 
for_post, 
submitted_at, 
rating FROM comments
JOIN users ON comments.author_id = users.id;