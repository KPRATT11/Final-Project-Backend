const { numberiseDate } = require('./../dateHelp')

function calcPostScore(votes, date, comments){
    if (votes == null){
        votes = 1
    }
    date = Math.min(numberiseDate(date), 300)
    votes = Math.max(-200, Math.min(votes, 300))
    comments = Math.max(1, Math.min(comments, 100))
    let score = (votes + (comments * (500 - date * (date / 80)) / 100)/ 1.8) - (date * (date/(votes/(date/50))+(comments/4)))
    return Math.max(score, -300)
}

function calcCommentScore(votes, date){
    if (votes == null){
        votes = 1
    }
    date = Math.min(numberiseDate(date), 300)
    votes = Math.max(-200, Math.min(votes, 300))
    return (votes + ((500 - date * (date / 80)) / 100)/ 1.8) - (date * (date/(votes/(date/50))+(1/4)))
}

module.exports = {
    calcPostScore,
    calcCommentScore
}