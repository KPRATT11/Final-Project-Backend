const { insertUser, insertPost, insertVotes, insertComments, insertCommunity, insertAction, insertFollows, insertComment } = require('./inserters')

insertComment({
    author_id: 1,
    content: 'Parent Comment',
    for_post: true,
    target_id: 1,
    vote_weight: 12,
    submitted_at: new Date()
})


insertComment({
    author_id: 1,
    content: 'Parent Comment',
    for_post: false,
    target_id: 2,
    vote_weight: 12,
    submitted_at: new Date()
})

insertComment({
    author_id: 1,
    content: 'Parent Comment',
    for_post: false,
    target_id: 2,
    vote_weight: 12,
    submitted_at: new Date()
})

insertComment({
    author_id: 1,
    content: 'Parent Comment',
    for_post: false,
    target_id: 3,
    vote_weight: 12,
    submitted_at: new Date()
})