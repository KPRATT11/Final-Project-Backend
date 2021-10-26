const express = require("express");
require("dotenv").config({ path: `${__dirname}/dev.env` });

/* --- GET HELPERS ---*/
const { newISO, numberiseDate } = require('./lib/dateHelp')
const { calcPostScore, calcCommentScore } = require('./lib/formulas/itemScore')
const { userWeight } = require('./lib/formulas/userWeight')
const { createAction } = require('./lib/actions')

/*--- DATABASE MODELERS --- */
const { insertPost, insertComment, insertVotes, insertCommunity, insertFollows, insertUser} = require("./database/inserters")
const { deletePost, deleteCommunity, deleteComment, deleteVote, deleteFollow } = require("./database/deleters")
const { 
	selectUser, 
	selectPost, 
	selectCommunity, 
	selectComment, 
	selectFollowedCommunities, 
	selectAllPostsOfCommunities, 
	selectCommentsFromPostID,
	selectSearchedCommunities, 
	selectPopularCommunities

} = require("./database/selectors")
const { patchPost, patchComment } = require("./database/patchers")
const { hasUserVoted } = require("./database/helpers")

/* --- USER AUTHENTICATION IMPORTS ---*/
const { auth } = require("express-openid-connect");
const { isFirstSignUp } = require("./lib/auth/signUp");
const { isCurrentUser, getCurrentUser } = require("./lib/auth/authUsers");


const app = express()
const port = 2000

app.use(express.json()); //Allows us to respond with JSON
app.use(
	auth({
		auth0Logout: true,
		issuerBaseURL: process.env.ISSUER_BASE_URL,
		baseURL: process.env.BASE_URL,
		clientID: process.env.CLIENT_ID,
		secret: process.env.SECRET,
		authRequired: false,
	})
);

app.get('/', (req, res) => {
	console.log(req.oidc.user.sub)
	if (req.oidc.isAuthenticated() === true){
		if (isFirstSignUp(req.oidc.user.sub)){
			insertUser({
				id: req.oidc.user.sub,
				creation_date: new Date(),
				username: 'keegan'
			})
		}
	};
	res.redirect('http://localhost:3000/')
})

app.get('/callback', (req, res) => {
	res.redirect('http://localhost:3000/')
})

//--API--//

//COMMENT
//TESTED
app.post('/api/comment', (req, res) => { 
	let {content, target_id} = req.body
	let detailsObject = {
		content,
		target_id,
		for_post: true,
		author_id: req.oidc.user.sub,
		submitted_at: newISO(),
		rating: 0
	}
	insertComment(detailsObject).then(response => {
		createAction(1, 'createComment')
		res.json(response.rows[0])
	})
})

app.delete("/api/comment", (req, res) => {
	let { id } = req.query
	let detailsObject = { id }
	deleteComment(detailsObject).then(response => {
		res.json(response.rows[0])
	})
})

app.get("/api/comment", (req, res) => {
	let { id } = req.query
	selectComment({id}).then(response => {
		let returnObject = {
			...response.rows[0],
			currentUserOwn: isCurrentUser(response.rows[0].author_id, req.oidc.user.sub)
		}
		res.json(returnObject)
	})
})

app.patch("/api/comment", (req, res) => {
	console.log(req.body)
	let {content, id} = req.body
	let detailsObject = {
		id,
		content,
	}
	patchComment(detailsObject).then(response => {
		res.json(
			response.rows[0]
		)
	})
})

//COMMUNITIES
app.get("/api/community", (req, res) => {
	let { id } = req.query
	selectCommunity({id, user_id: req.oidc.user.sub}).then(response => {
		res.json(response.rows[0])
	})
})

app.post("/api/community", (req, res) => {
	let { title, sidebar } = req.body
	let detailsObject = {
		owner_id: req.oidc.user.sub,
		title, 
		sidebar
	}
	insertCommunity(detailsObject).then(response => {
		createAction(1, 'createCommunity')
		res.json(response.rows[0])
	})
})

app.delete("/api/community", (req, res) => {
	let { id } = req.query
	deleteCommunity({id}).then(response => {
		res.json(response.rows[0])
	})
})

app.get('/api/followedCommunities', (req, res) => {
	selectFollowedCommunities({id: req.oidc.user.sub}).then(response => {
		res.json(response.rows)
	})
})

app.get('/api/searchedCommunities', (req, res) => {
	let { searchQuery } = req.query
	selectSearchedCommunities({id: req.oidc.user.sub, search: searchQuery}).then(response => {
		res.json(response.rows)
	})
})

app.get('/api/reccomendedCommunities', (req, res) => {
	selectPopularCommunities({id: req.oidc.user.sub}).then(response => {
		res.json(response.rows)
	})
})

app.get('/api/allPostsOfCommunity', (req, res) => {
	let {id} = req.query
	selectAllPostsOfCommunities({id}).then(response => {
		let commentGetters = []
		response.rows.forEach((row, i) => {
			commentGetters.push(selectCommentsFromPostID({id: row.id}))
		})
		Promise.all(commentGetters).then(vals => {
			let resultsObject = vals.map((replies, i) => {
				numberiseDate(response.rows[i].posted_at)
				return {
					...response.rows[i],
					userOwns: isCurrentUser(response.rows[i].author_id, req.oidc.user.sub),
					score: calcPostScore(response.rows[i].rating, response.rows[i].posted_at, replies.rows.length),
					replyCount: replies.rows.length,
				}
			})
			let voteGetters = []
			vals.forEach(val => {
				if (val.rows.length > 0){
					voteGetters.push(hasUserVoted({ user_id: req.oidc.user.sub, for_post: true, target_id:val.rows[0].id }))
				}
			})
			Promise.all(voteGetters).then(voteVals => {
				resultsObject = resultsObject.map((post, y) => {
					if (!voteVals[y]){
						return {
							...post,
							hasUserVoted: false
						}
					}
					return {
						...post,
						hasUserVoted: voteVals[y].rows.length > 0 ? voteVals[y].rows[0] : 'false'
					}
				})
				res.json(resultsObject)
			})
		})
	})
})

//POSTS
app.get('/api/post', (req, res) => {
	let { id } = req.query
	selectPost({ id }).then(response => {
		selectCommentsFromPostID({ id }).then(commentResponse => {
			let returnObject = {
				...response.rows[0],
				userOwns: isCurrentUser(response.rows[0].author_id, req.oidc.user.sub),
				score: calcPostScore(response.rows[0].rating, response.rows[0].posted_at, commentResponse.rows.length),
				replyCount: commentResponse.rows.length,
				replies: commentResponse.rows.map(reply => {
					return {
						...reply,
						userOwns: isCurrentUser(reply.author_id, req.oidc.user.sub),
						score: calcCommentScore(reply.rating, reply.submitted_at)
					}
				})
			} 
			selectUser({id: response.rows[0].author_id}).then((userResponse) => {
				delete returnObject.author_id
				delete returnObject.rating

				returnObject.author = userResponse.rows[0]

				hasUserVoted({ user_id: req.oidc.user.sub, for_post: true, target_id:returnObject.id }).then(postVoteResponse => {
					returnObject.hasUserVoted = postVoteResponse.rows.length > 0 ? postVoteResponse.rows[0] : 'false'

					let voteGetters = []
					returnObject.replies.forEach(val => {
						voteGetters.push(hasUserVoted({ user_id: req.oidc.user.sub, for_post: false, target_id:val.id }))
					})
					Promise.all(voteGetters).then(voteVals => {
						returnObject.replies = returnObject.replies.map((post, y) => {
							return {
								...post,
								hasUserVoted: voteVals[y].rows.length > 0 ? voteVals[y].rows[0] : 'false'
							}
						})
						res.json(returnObject)
					})
				})
			})
		})
	})
})


app.post('/api/post', (req, res) => {
	let { title, content, community } = req.body
	let detailsObject = {
		title,
		content,
		community,
		author_id: req.oidc.user.sub,
		posted_at: newISO(),	
		rating: 0
	}
	insertPost(detailsObject).then(response => {
		createAction(1, 'createPost')
		res.json(response.rows)
	})
})

app.patch('/api/post', (req, res) => {
	let { title, content, id } = req.body
	let detailsObject = {
		id,
		title,
		content
	}
	patchPost(detailsObject).then(response => {
		res.json(response.rows)
	})
})

app.delete('/api/post', (req, res) => {
	let { id } = req.query
	deletePost({id}).then(response => {
		res.json(response.rows)
	})
})

//USER
//have tp get the user from database probably
app.get('/api/currentUser', (req, res) => {
	res.json({user_id: req.oidc.user.sub})
})

//VOTE
app.post('/api/vote', (req, res) => {
	let {is_like, for_post, target_id} = req.body
	console.log(req.body)
	let currentUser = req.oidc.user.sub
	selectUser({ id: currentUser }).then(response => {
		let userScore = userWeight(response.rows[0].creation_date, response.rows[0].user_weight, response.rows[0].action_weight)
		userScore = (is_like ? userScore : 0 - userScore)
		let votesDetailsObject = {
			author_id: currentUser,
			is_like: is_like,
			for_post: for_post, 
			vote_weight: parseInt(userScore),
			submitted_at: new Date(),
			target_id: target_id
		}
		insertVotes(votesDetailsObject).then(voteResponse => {
			createAction(1, 'createVote')
			res.json(voteResponse.rows[0])
		})
	})
})

app.delete('/api/vote', (req, res) => {
	let {for_post, target_id} = req.body
	console.log('vote delete')
	console.log(req.body)
	deleteVote({ id: target_id, for_post: for_post}).then((response) => {
		res.json(response.rows[0])
	})
})

//FOLLOWS
app.post('/api/follow', (req, res) => {
	console.log(req.query)
	let {target_id} = req.query
	insertFollows({community_id: target_id, user_id: req.oidc.user.sub}).then(response => {
		res.json(response.rows[0])
	})
})

app.delete('/api/follow', (req, res) => {
	console.log('delete req')
	let {target_id} = req.query
	deleteFollow({ community_id: target_id, user_id: req.oidc.user.sub }).then(response => {
		res.json(response.rows[0])
	})
})

app.listen(port)