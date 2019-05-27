//variable to hold total price
let totalPrice = 0;

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

  //create the HTML element to show total price
  const $total = $('<p id="total-price">TOTAL PRICE: $<span>0</span></p>');
  $('.activities').append($total);
  
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
	$(".activities").on("change", 'input[type="checkbox"]', function(event) {
		const $activities = $(".activities label input");
    //contains jQuery input element (event.target)
    const $clicked = $(this);
    //contains a string
		const $clickedText = $(this).parent().text().replace(/\s+/g, "");
		//contains a regex obj
		const regexDate = /\w+\s*\d{1,2}(am|pm)-\d{1,2}(am|pm)/gi;

    //match and 'extract' the regex pattern and remove any space, date is a string.
    //conditional if is used to avoid an error on the first activity that does not include a date
    //which returns null to the variable date and not an array. therefore [0] will throw an error
    let date;
    if(regexDate.test($clickedText)){
		date = $clickedText.match(regexDate)[0].replace(/\s+/g, "");
    }
    //priceCliked is a string in this format "100"
    const priceClicked = $clickedText.match(/\d{3}$/)[0];
    
    //total price
    if($(this).prop('checked')){
      totalPrice += parseInt(priceClicked,10)
    } else{
      totalPrice -= parseInt(priceClicked,10)
    }

    $('#total-price span').text(totalPrice);
    //looping the activities (input checkboxes) to enable/disable those with conflicting time
    $activities.each(function(i, item) {
      const $currentItemText = $(this).parent().text().replace(/\s+/g, "");
      //if an activity is ticked, verify if other elements includes the same date/time and if so
      //disable and strike-thorough those elements that are not the selected one
			if ( $clicked.prop("checked") && $currentItemText.includes(date) && !$(item).is($clicked) ) {     
          $(item).prop("disabled", true);
          $(item).parent().css({textDecoration: 'line-through', color: 'red'});
          
			} else if($clicked.prop("checked") && $currentItemText.includes(date) && $(item).is($clicked)) { 
          $(item).prop("disabled", false);
          $(item).parent().css({textDecoration: 'none', color: 'black'});
          
          
      } else if (!$clicked.prop("checked") && $currentItemText.includes(date) && $(item).prop('disabled')){
        //enable other itme with the same date
        $(item).prop("disabled", false);
        $(item).parent().css({textDecoration: 'none', color: 'black'});
        
      }
    });
    
    
    
    
  });
  
  //set credit card as default payment and hide info about paypal and bitcoin
  $('#payment option[value="credit card"]').prop('selected',true)
  $('#paypal-info').hide();
  $('#bitcoin-info').hide();
  //Display payment sections based on the payment option chosen
  $('#payment').on('change',function(event){
    switch($(this).val()) {
      case 'credit card':
          $('#credit-card').fadeIn(400);
          $('form').attr({action: 'index.html', method: 'POST'});
          $('#paypal-info').hide();
          $('#bitcoin-info').hide();
          break;
      case "paypal":
          $('#credit-card').fadeOut(400);
          //set the form to redirect to paypal website
          $('form').attr({action: 'https://www.paypal.com/', method: '', target: "_blank"});
          $('#paypal-info').show();
          $('#bitcoin-info').hide();
          break;
      case "bitcoin":
          $('#credit-card').fadeOut(400);
          $('form').attr({action: 'https://www.coinbase.com/', method: '', target: "_blank"});
          $('#paypal-info').hide();
          $('#bitcoin-info').show();
          break;
      default:
          $('form').attr({action: 'index.html', method: 'POST'});      
    }


  });
  
  
  

//finish documnent ready
});
