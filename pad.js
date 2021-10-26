replys: replies.rows.map(reply => {
    return {
        ...reply,
        score: calcCommentScore(reply.rating, reply.submitted_at)
    }
})