//make sure the DOM is fully loaded before doing anything
$(document).ready(function() {
	//hide not needed elementns for now
	$("#other-job-container").hide();
	$("#colors-js-puns").hide();
	//position the cursor on the name input field
	$("#name").focus();

	//show text input when Job Role "Other" is selected
	$("#title").on("change", function(event) {
		if ($(this).val() === "other") {
			$("#other-job-container").slideDown(800);
		} else {
			$("#other-job-container").slideUp(800);
		}
	});

	//handy hide all function - accept a jquery collection
	function hideAll(collection) {
		collection.each(function() {
			$(this).hide();
		});
	}

	//t-shirts
	$("#design").on("change", function(event) {  
    const $colors = $("#color option");
		$colors.hide();
    //show color only when a design is selected (change event is triggered)
    
		//hide 'heart js' colors option when 'js puns is selected
		if ($(this).val() === "js puns") {
      hideAll($colors);
      $("#colors-js-puns").fadeIn(300);
			//deselect any previously selected (if any)
			$("#color option:selected").removeAttr("selected");
			//select the first color for the selected design
			$colors.eq(0).attr("selected", true);
			for (let i = 0; i < 3; i++) {
				$colors.eq(i).show();
			}
		}
		//hide 'js puns' colors option when 'heart js is selected
		else if ($(this).val() === "heart js") {
      hideAll($colors);
      $("#colors-js-puns").fadeIn(300);
			$("#color option:selected").removeAttr("selected");
			//select the appropriate color when design is changed
			$colors.eq(3).attr("selected", true);
			for (let i = 3; i < 6; i++) {
				$colors.eq(i).show();
			}
		} else {
			//NO THEME SELECTED
			//remove selected elements to prevent to send information not visually selected by the user
      $("#color option:selected").removeAttr("selected");
			$("#colors-js-puns").fadeOut(200);
		}
  });
  
  //activities
  
});
