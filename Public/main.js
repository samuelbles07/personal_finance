function startJS() {

	currentDate(function(date) {
		$('#inputDate1').val(date);
		$('#inputDate2').val(date);
	});

	/**
	 * LOAD CATEGORY
	 */

	reqToServ("category", "GET", "", function(data) {
		// For the expenses tab option category
		var html = "";
		for (var prop in data) {
			html = html + "<option value='" + data[prop].category + "'>" + data[prop].category + "</option>";
		}
		$("#inputCategory1").append(html);
		$("#categorySelect2").append(html);
		// For the chart specific by category
	})

	/**
	 * START EVENT
	 */
	startEvent();


	/**
	 * STATS RESULT
	 */
	specificChartLine(0, 0);
	specificCharPie(0, 0);
	var now = new Date();
	var dt = {
		by: now.getFullYear()
	}
	reqToServ("transaction", "GET", dt, function(result) {
		// console.log(result);
		moneyChart(result.expenses, result.income);
		categoryChartLine(result.expenses);
		reqToServ("category", "GET", "", function(cat) {
			categoryCharPie(result.expenses, cat);
		})
	})

}
