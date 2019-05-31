//make sure the DOM is fully loaded before doing anything
$(document).ready(function() {
  //variable to hold total price
  let totalPrice = 0;
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
		}//hide 'js puns' colors option when 'heart js is selected
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
  
  //form validation section

  function validateName(){
    //name field must not be empty
    const regexName = /^[a-zA-z-.\s]+$/i
    const name = $('#name').val();
    if(regexName.test(name)){
      $('#name').css({border: ""});
      return true;
    } else {
      $('#name').css({border: "2px solid red"});
      return false;
    }
  }

  function validateEmail(){
    const mail = $('#mail').val();
    const regexMail = /^\w+@\w+\.\w{1,5}$/
    if(regexMail.test(mail)){
      $('#mail').css({border: ""});
      return true;
    } else {
      $('#mail').css({border: "2px solid red"});
      return false;
    }
  }

  function validateActivities(){
    //check if at least one activity was selected

    //create a warning element
    const $warning = $(`<div id="warning" 
                        style="background-color: red; 
                        color: black; width: 50%; height: 30px; line-height: 30px; margin: 0 auto;">
                        <p style="text-align: center;">You need to register for at least one activity<p>
                        </div>`);
    
    //if no activity is selected append the warning and show it to the user
    if( $('.activities input:checked').length > 0 ){
      return true;
    } else {
      $($warning).appendTo($('.activities')).hide();
      $('#warning').fadeIn(800).delay(4000).slideUp(500);
      return false
    }
  }

  //validate all three needed field for credit card payments
  function validateCreditCard(){
    const ccNumber = $('#cc-num').val();
    const regexCC = /^\d{13,16}$/;
      
    const zipCode = $('#zip').val();
    const regexZIP = /^\d{5}$/;
      
    const cvv = $('#cvv').val();
    const regexCVV = /^\d{3}$/;
    
    if ( $('#payment option:selected').val() === 'credit card'){
      
      if ( regexCC.test(ccNumber) ){
        $('#cc-num').css({border: "2px solid lightgreen"});
      } else {
        $('#cc-num').css({border: "2px solid red"});      
      }
      
      if(regexZIP.test(zipCode)){
        $('#zip').css({border: "2px solid lightgreen"});      
      }else {
        $('#zip').css({border: "2px solid red"});     
      }

      if(regexCVV.test(cvv)){
        $('#cvv').css({border: "2px solid lightgreen"});
      }else {
        $('#cvv').css({border: "2px solid red"});
      }
    }
    //if any of the three credi card field is not valid return false
    if( !(regexCC.test(ccNumber)) || !(regexZIP.test(zipCode)) || !(regexCVV.test(cvv)) ){
      return false;
    }else {
      return true;
    }
    
  }
  //event listener for submit button and validation processes
  $('form').on('submit', function(event){

    //call all the validator so all the missing/invalid input are highlighted in red
    validateName();
    validateEmail();
    validateActivities();
    validateCreditCard();

    //if any validator is false, meaning data typed from the user were not ok, prevent the form submission
    if( !validateName() || !validateEmail() || !validateActivities() || !validateCreditCard() ) {
      event.preventDefault();
      $('button[type="submit"]').prop('disabled', true);
      $('button[type="submit"]').prop('disabled', false);
    }
  })
//finish documnent ready
});
