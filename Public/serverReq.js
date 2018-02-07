/**
 * request to server
 * path   link path
 * type   routing dataType
 * data   data to send
 * result callback data
 */
var reqToServ = function(path, type, data, result) {
	$.ajax({ // request it
		type: type, // roting type
		url: "http://127.0.0.1:8888/" + path,
		data: data,
		dataType: 'JSON', // get json datatype
		success: function(res) { // result callback : data
			result(JSON.parse(res))
		},
		error: function(err) {
			console.log(err)
			alert("err");
		}
	});
}
