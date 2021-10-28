
const axios = require("axios").default;
require("dotenv").config({ path: `${__dirname}/dev.env` });

function isFirstSignUp(userId) {
	var config = {
		method: "get",
		url: `https://dev-o2a5ilyv.us.auth0.com/api/v2/users/${userId}?fields=logins_count&include_fields=true`,
		headers: {
			Authorization: `Bearer ${process.env.AUTH_BEARER_TOKEN}`,
		},
	};

	return axios(config)
		.then(function (response) {
			let amount = response.data.logins_count;
			console.log(amount)
			return true //should only be here for testing
			//return parseInt(amount) === 1;
		})
		.catch(function (error) {
		});
}

module.exports = {
	isFirstSignUp
}
