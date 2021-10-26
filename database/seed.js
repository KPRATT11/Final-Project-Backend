let {randomAction, randomFollow, randomUser, randomComment, randomCommunity, randomPost, randomVote} = require('./randomCreators')

let createdUsers = []
let createdCommunities = []
let createdPosts = []
let createdComments = []

for (let i = 0; i < 10; i ++){
    randomUser()
    .then(res => {
        createdUsers.push(res.rows[0].id)
        i == 19 ? console.log(createdUsers) : ''
        return res.rows[0].id
    })
    .then((userid) => {
        let randomAmount = Math.floor(Math.random() * 2)
        for (let j = 0; j < randomAmount; j ++){
            let commId
            randomCommunity(userid)
            .then(
                res => {
                    createdCommunities.push(res.rows[0].id)
                    commId = res.rows[0].id
                }
            )
            .then(() => {
                createdUsers.forEach((user) => {
                    for (let k = 0; k < 2; k ++){
                        randomPost(user, commId)
                        .then(
                            res => {
                                createdPosts.push(res.rows[0].id)
                                return res.rows[0].id
                            }
                        )
                        .then((post_id) => {
                            randomVote(user, post_id, true)
                            .then(
                                res => {
                                }
                            )
                            return post_id
                        })
                        .then(post_id => {
                            randomComment(user, true, post_id)
                            .then(
                                res => {
                                    createdComments.push(res.rows[0].id)
                                }
                            )
                            randomVote(user, post_id, false)
                            .then(
                                res => {
                                }
                            )
                            return post_id
                        })
                    }
                })
            })
        } 
    })
}

setTimeout(() => {
    createdUsers.forEach(user => {
        randomFollow(user, createdCommunities[Math.floor(Math.random() * createdCommunities.length)])
    })
    createdUsers.forEach(user => {
        for (let i = 0; i < 3; i ++){
            randomAction(user)
        }
    })
}, 10000)
