function startEvent() {

	/**
	 * TRANSACTION TAB EVENT
	 * Show all the transaction by month
	 * overview:
	 * - Empty all list at the main div
	 * - Get all transaction data by month
	 * - then the callback
	 * - filter data to {sum, dt} (total amount value, the data)
	 * - call append data function
	 * - loop through all the data object
	 * - append main panel by that date
	 * - then loop through all data (dt) by that date  to child panel
	 * - set the event for delete and edit for every child panel
	 * - and so on
	 * Every main panel has an unique id (listInc)
	 * for child panel loop if the data have category object or not
	 * if yes then it's expenses
	 * if no then it's income, Set the from bank/pocket for income
	 * edit and delete icon, have the same value for the class name and id for chile panel
	 * so it can called by just 1 event call for edit and delete
	 * the name value to check if it's edit/delete icon clicked
	 * at the end of main panel loop, increment listInc
	 */
	$("#transactionSelect").change(function() {
		$("#panelList").empty();
		var data = {
			by: this.value
		}

		reqToServ("transaction", "GET", data, function(result) {
			var newData = filterByDate(result);
			appendData(newData)
		})

		var appendData = function(data) {
			var listInc = 1;
			for (var key in data) {
				// skip loop if the property is from prototype
				if (!data.hasOwnProperty(key)) continue;
				var obj = data[key],
					mainList = "",
					memberList = "";
				var newData = obj.dt;
				if (newData[0] !== undefined) {
					mainList = "<div class=\"panel panel-primary\"><div class=\"panel-heading\"><h3 class=\"panel-title pull-left\">" + newData[0].date + "</h3><h3 class=\"panel-title pull-right\">Rp " + currencyFormat(parseInt(obj.sum)) + "</h3><div class=\"clearfix\"></div></div><div class=\"list-group\" id='list" + listInc + "'></div></div>";
					$("#panelList").append(mainList);
				}

				for (var prop in newData) {
					if (newData[prop].hasOwnProperty("category")) {
						memberList =
							"<div class=\"list-group-item\" id='" + newData[prop].id +
							"'><div class=\"row\"><div class=\"col-sm-10\"><h4 class=\"list-group-item-heading\">" + newData[prop].category + " - " + newData[prop].specific + "</h4></div><div class=\"col-sm-2\"><div class=\"text-right\"><button type=\"button\" id='" + newData[prop].id +
							"' style=\"padding:0; line-height:0;\" class=\"btn btn-link " + newData[prop].id + "\" name='edit'><span class=\"glyphicon glyphicon-pencil\"></span></button><button type=\"button\" id='" +
							newData[prop].id +
							"' style=\"padding:0; line-height:0;\" class=\"btn btn-link " + newData[prop].id +
							"\" name='delete'><span class=\"glyphicon glyphicon-remove\"></span></button></div></div></div><div class=\"row\"><div class=\"col-sm-8\"><h5>" + newData[prop].from + " &emsp;-&emsp; <i><font color=\"#adafb2\">" + newData[prop].note + "</font></i></h5></div><div class=\"col-sm-4\"><div class=\"text-right\"><h5>Rp -" + currencyFormat(parseInt(newData[prop].amount)) + "</h5></div></div></div></div>";
					} else {
						var _from = "Bank Account";
						if (newData[prop].specific === '-') _from = "Pocket Money"
						memberList =
							"<div class=\"list-group-item\" id='" + newData[prop].id +
							"'><div class=\"row\"><div class=\"col-sm-10\"><h4 class=\"list-group-item-heading\">Income - " + newData[prop].specific + "</h4></div><div class=\"col-sm-2\"><div class=\"text-right\"><button type=\"button\" id='" + newData[prop].id +
							"' style=\"padding:0; line-height:0;\" class=\"btn btn-link " + newData[prop].id + "\" name='edit'><span class=\"glyphicon glyphicon-pencil\"></span></button><button type=\"button\" id='" +
							newData[prop].id +
							"' style=\"padding:0; line-height:0;\" class=\"btn btn-link " + newData[prop].id +
							"\" name='delete'><span class=\"glyphicon glyphicon-remove\"></span></button></div></div></div><div class=\"row\"><div class=\"col-sm-8\"><h5>" + _from + "</h5></div><div class=\"col-sm-4\"><div class=\"text-right\"><h5>Rp " + currencyFormat(parseInt(newData[prop].amount)) + "</h5></div></div></div></div>";
					}


					$("#list" + listInc).append(memberList);

					$("." + newData[prop].id).click(function() {
						// var yo = this;
						if (this.name === "delete") {
							var data = {
								id: this.id
							}
							$("#" + this.id + "").remove();
							reqToServ("transaction", "delete", data, function(result) {
								alert(result.status);
							})
						} else if (this.name === "edit") {
							// var parentID = $(this).parents().eq(4).attr('id');
							var parentID = "list" + listInc;
							// console.log(parentID);
						}
					});
				}
				listInc++;
			}
		}

	})


	/**
	 * Seperate money number with dot
	 */
	$("#inputAmount1").keyup(function(e) {
		var amount = currencyFormat($("#inputAmount1").val());
		$("#inputAmount").html(amount);
	});
	$("#inputAmount2").keyup(function(e) {
		var amount = currencyFormat($("#inputAmount2").val());
		$("#inputAmount3").html(amount);
	});

	/**
	 * choose whether income or pocket money
	 */
	$("#radIncome").click(function() {
		$("#inputSpec2").val("");
		$("#inputSpec2").prop('disabled', false);
	})
	$("#radPocket").click(function() {
		$("#inputSpec2").val("-");
		$("#inputSpec2").prop('disabled', true);
	})

	/**
	 * EXPENSES TAB
	 */

	//  Add category
	$("#catButton").click(function() {
		var input = $("#addCategoryInput").val();
		if (input === "") {
			alert("Please fill the input box")
		} else {
			var data = {
				"category": input
			}
			reqToServ("category", "POST", data, function(result) {
				alert(result.status);
				$('#addCategoryModal').modal('hide')
			})
		}
	})

	/**
	 * suggestion value for expenses tab after pick category
	 */
	$("#inputCategory1").change(function() {
		$("#suggestions").empty();
		var data = {
			category: this.value
		}
		reqToServ("specific", "GET", data, function(result) {
			// console.log(result)
			var html = "";
			for (var prop in result) {
				html = html + "<option value='" + result[prop] + "'>";
			}
			$("#suggestions").append(html);
		})
	})

	/**
	 * Insert expenses
	 */
	$("#expButton").click(function() {
		var ctv = $("#inputCategory1").val();
		var spcv = $("#inputSpec1").val();
		var amov = $("#inputAmount1").val();
		var frmv = $("#inputFrom1").val();
		var notv = $("#inputNote").val();

		if (ctv === "" || spcv === "" || amov === "" || frmv === "") {
			alert("Please fill all input form");
		} else {
			var data = {
				transaction: "expenses",
				date: $("#inputDate1").val(),
				category: ctv,
				specific: spcv,
				amount: amov,
				from: frmv,
				note: notv
			}
			reqToServ("transaction", "POST", data, function(result) {
				alert(result.status);
				$("#inputCategory1").val("");
				$("#inputSpec1").val("");
				$("#inputAmount1").val("");
				$("#inputFrom1").val("");
				$("#inputNote").val("");
				$("#suggestions").empty();
			})
		}
	})

	/**
	 * Insert income
	 */
	$("#incButton").click(function() {
		var amov = $("#inputAmount2").val();
		var spcv = $("#inputSpec2").val();

		if (amov === "" || spcv === "") {
			alert("Please fill all input form");
		} else {
			var data = {
				transaction: "income",
				date: $("#inputDate2").val(),
				specific: spcv,
				amount: amov,
				from: $('input[name=optradio]:checked').val()
			}
			reqToServ("transaction", "POST", data, function(result) {
				alert(result.status);
				$("#inputSpec2").val("");
				$("#inputAmount2").val("");
				$("#radIncome").prop("checked", true);
				$("#inputSpec2").prop('disabled', false);
			})
		}
	})

	/**
	 * category select event for Specific chart
	 */
	$("#categorySelect2").change(function() {
		var by = this.value;
		var now = new Date();
		var dt = {
			by: now.getFullYear()
		}
		reqToServ("transaction", "GET", dt, function(result) {
			specificChartLine(result.expenses, by);
			specificCharPie(result.expenses, by);
		})
	})
}
