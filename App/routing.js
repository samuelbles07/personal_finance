const db = require('./db.js')

module.exports = {
	startRoute: function(app) {

		app.get('/', function(req, res) {
			res.sendFile('index.html')
		})

		//------------------------------------------CATEGORY---------------
		app.route('/category')
			.get(function(req, res) {
				db.getCategory(function(data) {
					res.json(JSON.stringify(data))
				})
			})

			.post(function(req, res) {
				db.postCategory(req.body.category, function(result) {
					res.json(JSON.stringify(result))
				})
			})

			.put(function(req, res) {

			})

			.delete(function(req, res) {

			})

		//------------------------------------------TRANSACTION---------------
		app.route('/transaction')
			.get(function(req, res) {
				db.getTransaction(req.query.by, function(data) {
					res.json(JSON.stringify(data))
				})
			})
			.post(function(req, res) {
				db.postTransaction(req.body, function(result) {
					res.json(JSON.stringify(result))
				})
			})
			.put(function(req, res) {

			})

			.delete(function(req, res) {
				db.deleteTransaction(req.body.id, function(result) {
					res.json(JSON.stringify(result))
				})
			})
		// -------------------------------------------SPECIFIC------------------
		app.get('/specific', function(req, res) {
			db.getSpecification(req.query.category, function(result) {
				res.json(JSON.stringify(result))
			})
		})
		//--------------------------------------------
	}
}
