/* Include all necessary module */
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const shortid = require('shortid')
const adapter = new FileSync('db.json')
const db = low(adapter)

/* Init default json db format */
db.defaults({
		expenses: [],
		income: [],
		category: [],
		bank: 0,
		pocket: 0
	})
	.write();

/* Set all function as a module */
module.exports = {
	/**
	 * Get all category from db
	 * @param  {callback} done return the data
	 */
	getCategory: function(done) {
		const getCat = db
			.get('category')
			.value()
		done(getCat)
	},
	/**
	 * Post a new category
	 * @param  {object}   data New category
	 * @param  {callback} done return the data
	 */
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
	/**
	 * Get all the transaction
	 * By default filter by month
	 * If "by" more than 1970 then by year
	 * Split year so it can filter by "by"
	 * Split text return date array [year, month, date]
	 * If the data equals by filter value then return data
	 * if not return false (The data not included)
	 * @param  {text}   filt filter, by month or year
	 * @param  {callback} done return the data
	 */
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
	/**
	 * Post a new transaction
	 * Look at the data transaction by
	 * if expenses
	 * - save to expenses object
	 * - reduce value data from (bank / pocket)
	 * if not
	 * - save to income object
	 * - reduce value data from (bank / pocket)
	 * - if it's go to pocket money from bank then
	 *   divide the bank value
	 * @param  {object}   data all data to save
	 * @param  {callback} done return true
	 */
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
	/**
	 * Delete transaction by id
	 * for the first part
	 * check whether the data by that id in expenses or income (ridiculous)
	 * second part
	 * if it's from expenses then
	 * add the money from and then remove that data id
	 * if income then
	 * check if it's pocket money or bank
	 * if bank then give back the money from pocket to bank
	 * if not just remove the amount of money from it
	 * Delete the data by id
	 * @param  {text}   data id to delete
	 * @param  {callback} done true
	 */
	deleteTransaction: function(data, done) {
		// first part
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
		// second part
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
	/**
	 * get all the specification by category
	 * yes just the specification (.map function)
	 * .uniq so the data not double and so on
	 * @param  {text}   data the category filter param
	 * @param  {callback} done the data
	 */
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
