// Get current date function
var currentDate = function(done) {
	var now = new Date();

	var day = ("0" + now.getDate()).slice(-2);
	var month = ("0" + (now.getMonth() + 1)).slice(-2);

	var today = now.getFullYear() + "-" + (month) + "-" + (day);
	done(today);
}

// change the currenct format view
var currencyFormat = function(bilangan) {
	var minus = false;
	if (bilangan < 0) {
		bilangan = -(bilangan);
		minus = true;
	}

	var number_string = bilangan.toString(),
		sisa = number_string.length % 3,
		rupiah = number_string.substr(0, sisa),
		ribuan = number_string.substr(sisa).match(/\d{3}/g);

	if (ribuan) {
		separator = sisa ? '.' : '';
		rupiah += separator + ribuan.join('.');
	}

	if (minus) rupiah = "-" + rupiah;
	return rupiah;
}

// stake a new object by date
var filterByDate = function(data) {
	var returnData = {
		1: {
			sum: 0,
			dt: []
		},
		2: {
			sum: 0,
			dt: []
		},
		3: {
			sum: 0,
			dt: []
		},
		4: {
			sum: 0,
			dt: []
		},
		5: {
			sum: 0,
			dt: []
		},
		6: {
			sum: 0,
			dt: []
		},
		7: {
			sum: 0,
			dt: []
		},
		8: {
			sum: 0,
			dt: []
		},
		9: {
			sum: 0,
			dt: []
		},
		10: {
			sum: 0,
			dt: []
		},
		11: {
			sum: 0,
			dt: []
		},
		12: {
			sum: 0,
			dt: []
		},
		13: {
			sum: 0,
			dt: []
		},
		14: {
			sum: 0,
			dt: []
		},
		15: {
			sum: 0,
			dt: []
		},
		16: {
			sum: 0,
			dt: []
		},
		17: {
			sum: 0,
			dt: []
		},
		18: {
			sum: 0,
			dt: []
		},
		19: {
			sum: 0,
			dt: []
		},
		20: {
			sum: 0,
			dt: []
		},
		21: {
			sum: 0,
			dt: []
		},
		22: {
			sum: 0,
			dt: []
		},
		23: {
			sum: 0,
			dt: []
		},
		24: {
			sum: 0,
			dt: []
		},
		25: {
			sum: 0,
			dt: []
		},
		26: {
			sum: 0,
			dt: []
		},
		27: {
			sum: 0,
			dt: []
		},
		28: {
			sum: 0,
			dt: []
		},
		29: {
			sum: 0,
			dt: []
		},
		30: {
			sum: 0,
			dt: []
		},
		31: {
			sum: 0,
			dt: []
		}
	};
	for (var prop in data.income) {
		var days = data.income[prop].date;
		var nw = days.split('-');
		var xxx = parseInt(nw[2])
		returnData[xxx].dt.push(data.income[prop]);
		returnData[xxx].sum += data.income[prop].amount;
	}
	for (var prop in data.expenses) {
		var days = data.expenses[prop].date;
		var nw = days.split('-');
		var xxx = parseInt(nw[2])
		returnData[xxx].dt.push(data.expenses[prop]);
		returnData[xxx].sum -= data.expenses[prop].amount;
	}
	return returnData;
}
