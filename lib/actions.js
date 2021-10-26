const { insertAction } = require('./../database/inserters')

function getActionScore(action){
    const actionObject = {
        createPost: 4,
        createComment: 2,
        vote: 1,
        createCommunity: 6
    }
    return actionObject[action]
}

function createAction(user_id, action){
    let actionScore = getActionScore(action)
    insertAction({date_occured: new Date(), user_id: user_id, weight: actionScore})
}

module.exports = {
    createAction,
}