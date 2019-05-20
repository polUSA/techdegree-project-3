//make sure the DOM is fully loaded before doing anything
$(document).ready(function() {
	//position the cursor on the name input field
	$("#other-job-container").hide();
	$("#name").focus();

  //show text input when Job Role "Other" is selected
	$("#title").on("change", function(event) {
		if ($(this).val() === "other") {
			$("#other-job-container").slideDown(800);
		} else {
			$("#other-job-container").slideUp(800);
		}
	});
});
