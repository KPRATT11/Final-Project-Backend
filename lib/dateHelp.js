function formatDate(date) {
	return date.toLocaleDateString("en-gb", {
		year: "numeric",
		month: "long",
		day: "numeric",
		timeZone: "AEDT",
	});
}

function newISO() {
	return new Date().toISOString();
}

function numberiseDate(date) {
	let dateDifference = getTimeInPast(date)
	return dateDifference / (1000 * 60 * 60 * 2)
}

function getTimeInPast(date) {
	let oldDate = new Date(date)
	let currentDate = new Date()
	return currentDate - oldDate 
}

module.exports = {
    newISO,
    formatDate,
	numberiseDate
}