var monthName = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
var moneyChart = function(expenses, income) {
	var expData = {
		x: monthName,
		y: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		name: "Expenses",
		type: 'scatter'
	};
	for (var i = 0; i < expenses.length; i++) {
		var mon = expenses[i].date.split('-');
		var nw = parseInt(mon[1].slice(1)) - 1;
		expData.y[nw] = expData.y[nw] + parseInt(expenses[i].amount)
	}

	var incData = {
		x: monthName,
		y: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		name: "Income",
		type: 'scatter'
	};
	for (var i = 0; i < income.length; i++) {
		var mon = income[i].date.split('-');
		var nw = parseInt(mon[1].slice(1)) - 1;
		if (income[i].specific !== '-') incData.y[nw] = incData.y[nw] + parseInt(income[i].amount)
	}

	var layout = {
		autosize: true,
		// width: 700 ,
		// height: 500,
		margin: {
			l: 50,
			r: 50,
			b: 50,
			t: 20,
			pad: 0
		}
	};

	var data = [expData, incData];

	Plotly.newPlot('crtMoney', data, layout);
}

var categoryChartLine = function(expenses) {
	var newData = [];

	var tmp = {}
	for (var i = 0; i < expenses.length; i++) {
		var spcName = expenses[i].specific;
		var catName = expenses[i].category;

		var mon = expenses[i].date.split('-');
		var nw = parseInt(mon[1].slice(1)) - 1;

		if (tmp[catName] === undefined) {
			var dt = {
				x: monthName,
				y: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
				name: catName,
				type: 'scatter'
			}
			dt.y[nw] += parseInt(expenses[i].amount);
			tmp[catName] = dt

		} else {
			tmp[catName].y[nw] += parseInt(expenses[i].amount);
		}
	}

	for (var prop in tmp) {
		newData.push(tmp[prop])
	}


	var layout = {
		autosize: true,
		// width: 700 ,
		// height: 500,
		margin: {
			l: 50,
			r: 50,
			b: 50,
			t: 20,
			pad: 0
		}
	};

	Plotly.newPlot('crtCategoryLine', newData, layout);
}

var categoryCharPie = function(exp, listCategory) {
	var expenses = exp;
	var data = [{
		values: [],
		labels: [],
		type: 'pie'
	}];
	for (var x = 0; x < listCategory.length; x++) {
		var catName = listCategory[x].category;
		data[0].labels.push(catName);
		data[0].values.push(0);
		var len = expenses.length;
		for (var y = 0; y < len; y += 1) {
			if (expenses[y].category === catName) {
				data[0].values[x] += parseInt(expenses[y].amount);
				expenses.splice(y, 1);
				y -= 1;
				len -= 1;
			}
		}
	}
	var layout = {
		height: 400,
		width: 500,
		margin: {
			l: 60,
			r: 50,
			b: 50,
			t: 20,
			pad: 0
		}
	};
	Plotly.newPlot('crtCategoryPie', data, layout);
}

var specificChartLine = function(expenses, by) {
	var newData = [];
	if (by === 0) {
		var data = {
			x: monthName,
			y: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			type: 'scatter'
		}
		newData.push(data);
	} else {
		var tmp = {}
		for (var i = 0; i < expenses.length; i++) {
			var spcName = expenses[i].specific;
			if (expenses[i].category === by) {
				var mon = expenses[i].date.split('-');
				var nw = parseInt(mon[1].slice(1)) - 1;

				if (tmp[spcName] === undefined) {
					var dt = {
						x: monthName,
						y: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
						name: spcName,
						type: 'scatter'
					}
					dt.y[nw] += parseInt(expenses[i].amount);
					tmp[spcName] = dt

				} else {
					tmp[spcName].y[nw] += parseInt(expenses[i].amount);
				}
			}
		}
		for (var prop in tmp) {
			newData.push(tmp[prop])
		}
	}
	var layout = {
		autosize: true,
		// width: 700 ,
		// height: 500,
		margin: {
			l: 50,
			r: 50,
			b: 50,
			t: 20,
			pad: 0
		}
	};


	Plotly.newPlot('crtSpecificLine', newData, layout);
}

var specificCharPie = function(expenses, by) {

	var newData = [{
		values: [],
		labels: [],
		type: 'pie'
	}];

	if (by !== 0) {
		var tmp = {}
		for (var i = 0; i < expenses.length; i++) {
			var spcName = expenses[i].specific;
			if (expenses[i].category === by) {

				if (tmp[spcName] === undefined) {
					var dt = {
						values: 0,
						labels: spcName
					}
					dt.values += parseInt(expenses[i].amount);
					tmp[spcName] = dt

				} else {
					tmp[spcName].values += parseInt(expenses[i].amount);
				}
			}
		}
		console.log(tmp)
		for (var prop in tmp) {
			newData[0].labels.push(tmp[prop].labels);
			newData[0].values.push(tmp[prop].values);
		}
	}

	var layout = {
		height: 400,
		width: 500,
		margin: {
			l: 60,
			r: 50,
			b: 50,
			t: 20,
			pad: 0
		}
	};
	Plotly.newPlot('crtSpecificPie', newData, layout);
}
