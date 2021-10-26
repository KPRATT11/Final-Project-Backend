const faker = require('faker');
const { insertUser, insertPost, insertVotes, insertComment, insertCommunity, insertAction, insertFollows } = require('./inserters')

function randomUser(){
    let data = {
        id: faker.datatype.uuid(),
        creation_date: faker.date.recent(),
        username: faker.name.firstName(),
        user_weight: Math.random() * 300
    }
    return insertData = insertUser(data)
}

function randomPost(userId, communityId){
    console.log(`Random Post Using ${userId}`)
    let data = {
        title: faker.random.words(),
        content: faker.random.words(),
        community: communityId,
        author_id: userId,
        posted_at: faker.date.recent(),
        rating: Math.floor(Math.random() * 500),
    }
    return insertPost(data)
}

function randomVote(user_id ,target_id, for_post){
    console.log(`Random Votes Using ${user_id}, ${target_id}, ${for_post}`)
    let data = {
        author_id: user_id,
        is_like: Math.round(Math.random()),
        for_post: for_post,
        vote_weight: Math.floor(Math.random() * 10),
        submitted_at: faker.date.recent(),
        target_id
    }    
    return insertVotes(data)
}

function randomComment(user_id, for_post, target_id){
    console.log(`Random Comment Using ${user_id}, ${for_post}, ${target_id}`)
    let data = {
        author_id: user_id,
        content: faker.random.words(),
        for_post: for_post,
        target_id: target_id,
        submitted_at: faker.date.recent(),
        rating: Math.floor(Math.random() * 500)
    }
    return insertComment(data)
}

function randomCommunity(user_id) {
    console.log(`Random Community using ${user_id}`)
    let data = {
        owner_id: user_id,
        title: faker.random.word(),
        sidebar: faker.random.words()
    }
    return insertData = insertCommunity(data)
}

function randomAction(user_id) {
    console.log(`Random Action using ${user_id}`)
    let data  = {
        date_occured: faker.date.recent(),
        user_id: user_id,
        weight: Math.floor(Math.random() * 3) 
    }
    let insertData = insertAction(data)
    console.log(insertData)
}

function randomFollow(user_id, community_id) {
    console.log(`Random Follow using ${user_id}, ${community_id}`)
    let data = {
        community_id: community_id,
        user_id: user_id,
    }
    let insertData = insertFollows(data)
    console.log(insertData)
}

module.exports = {
    randomAction,
    randomFollow,
    randomUser,
    randomComment,
    randomCommunity,
    randomPost,
    randomVote
}