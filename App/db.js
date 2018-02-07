const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const shortid = require('shortid')
const adapter = new FileSync('db.json')
const db = low(adapter)

db.defaults({
		expenses: [],
		income: [],
		category: [],
		bank: 0,
		pocket: 0
	})
	.write();

module.exports = {
	getCategory: function(done) {
		const getCat = db
			.get('category')
			.value()
		done(getCat)
	},

	postCategory: function(data, done) {
		db.get('category')
			.push({
				id: shortid.generate(),
				category: data
			})
			.write().id

		done({
			status: true
		})
	},

	getTransaction: function(filt, done) {
		var filterBy = parseInt(filt)
		var by = 1
		if (filterBy > 1970) by = 0
		const expdata = db
			.get('expenses')
			.filter(function(value, key) {
				var a = value.date.split('-');
				if (a[by] === filt) return value
				else return false
			})
			.value()

		const incdata = db
			.get('income')
			.filter(function(value, key) {
				var a = value.date.split('-');
				if (a[by] === filt) return value
				else return false
			})
			.value()

		var data = {
			expenses: expdata,
			income: incdata
		}

		done(data)
	},

	postTransaction: function(data, done) {
		var amount = parseInt(data.amount)
		if (data.transaction === "expenses") {
			db.get('expenses')
				.push({
					id: shortid.generate(),
					date: data.date,
					category: data.category,
					specific: data.specific,
					amount: amount,
					from: data.from,
					note: data.note
				})
				.write().id

			db.update(data.from, n => n - amount)
				.write()

		} else {
			const postTrc = db
				.get('income')
				.push({
					id: shortid.generate(),
					date: data.date,
					specific: data.specific,
					amount: amount
				})
				.write().id

			db.update(data.from, n => n + amount)
				.write()

			if (data.from === "pocket") {
				db.update('bank', n => n - amount)
					.write()
			}
		}
		done({
			status: true
		})
	},
	deleteTransaction: function(data, done) {
		var check = false
		var delData = db
			.get('expenses')
			.filter({
				id: data
			}).value()
		if (delData.length === 0) {
			delData = db
				.get('income')
				.filter({
					id: data
				}).value()
			check = true
		}

		if (!check) {
			db.update(delData[0].from, n => n + delData[0].amount)
				.write()
			db.get('expenses')
				.remove({
					id: data
				}).write()
		} else {
			if (delData[0].specific === '-') {
				db.update("bank", n => n + delData[0].amount)
					.write()
				db.update("pocket", n => n - delData[0].amount)
					.write()
			} else {
				db.update("bank", n => n - delData[0].amount)
					.write()
			}
			db.get('income')
				.remove({
					id: data
				}).write()
		}

		done({
			status: true
		})
	},

	getSpecification: function(data, done) {
		const spcdata = db
			.get('expenses')
			.filter({
				category: data
			})
			.map('specific')
			.uniq().value()

		done(spcdata)
	}
}
