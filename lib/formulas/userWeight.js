const { numberiseDate } = require('./../dateHelp')

function userWeight(user_age, actions_score, user_votes){
    user_age = numberiseDate(user_age)
    actions_score = Math.min(actions_score, 40)
    return (user_age + actions_score)
}

module.exports = {
    userWeight
}