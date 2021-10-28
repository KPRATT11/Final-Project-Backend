const axios = require("axios").default;
require("dotenv").config({ path: `${__dirname}/dev.env` });

async function getMetaData(userId) {
	var config = {
		method: "get",
		url: `https://dev-o2a5ilyv.us.auth0.com/api/v2/users/${userId}?include_fields=true&fields=user_metadata`,
		headers: {
			Authorization: `Bearer ${process.env.AUTH_BEARER_TOKEN}`,
		},
	};

	let metaData = await axios(config)
	return metaData
}

function getCurrentUser(){
	return '377e93ec-e846-4589-ab53-afa10c222fef'
}

function isCurrentUser(userId, currentUserId){
	if (userId === currentUserId){
		return true
	}else {
		return false
	}
}

module.exports = {
	getCurrentUser,
	getMetaData,
	isCurrentUser
}