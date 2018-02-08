/**
 * HANDLE ALL THE JAVASCRIPT FIRST RUN WHEN PAGE LOADED
 */
function startJS() {

	/**
	 * Set the current date to expenses and income input date
	 */
	currentDate(function(date) {
		$('#inputDate1').val(date);
		$('#inputDate2').val(date);
	});

	/**
	 * LOAD CATEGORY
	 * append to expenses tab category input and
	 * show specific expenses by category
	 */

	reqToServ("category", "GET", "", function(data) {
		var html = "";
		for (var prop in data) {
			html = html + "<option value='" + data[prop].category + "'>" + data[prop].category + "</option>";
		}
		$("#inputCategory1").append(html); // expenses
		$("#categorySelect2").append(html); // specific chart
	})

	/**
	 * START EVENT
	 */
	startEvent();


	/**
	 * STATS RESULT FIRST TIME LOAD
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
