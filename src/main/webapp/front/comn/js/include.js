$(function () {
	$(`[data-include]`).each(function(idx, elem) {
		include($(elem)[0]);
	});
});

function include(elem) {
	const xhr = new XMLHttpRequest();
	const {include} = elem.dataset;
	xhr.open("get", include, false);
	xhr.onreadystatechange = function (){
		if(xhr.readyState === 4){
			if(xhr.status === 200 || xhr.status === 0){
				const res = xhr.responseText;
				$(elem).html(res);
			}
		}
	}
	xhr.send(null);
}