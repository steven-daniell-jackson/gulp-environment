$( document ).ready(function() {
	
	$("p").hide();

	
});


$("section").click(function(){

	$(this).find("p").slideToggle();
});
