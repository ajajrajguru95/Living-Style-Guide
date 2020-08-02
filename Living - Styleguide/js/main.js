jQuery(document).ready(function($){

	/*******************
	COLOR SWATCH
	********************/
	//convert rgba color to hex color
	$.cssHooks.backgroundColor = {
	    get: function(elem) {
	        if (elem.currentStyle)
	            var bg = elem.currentStyle["background-color"];
	        else if (window.getComputedStyle)
	            var bg = document.defaultView.getComputedStyle(elem,
	                null).getPropertyValue("background-color");
	        if (bg.search("rgb") == -1)
	            return bg;
	        else {
	            bg = bg.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
	            function hex(x) {
	                return ("0" + parseInt(x).toString(16)).slice(-2);
	            }
	            return "#" + hex(bg[1]) + hex(bg[2]) + hex(bg[3]);
	        }
	    }
	}
	//set a label for each color swatch
	$('.cd-color-swatch').each(function(){
		var actual = $(this);
		$('<b class="copy">'+actual.css("background-color")+'</b>').insertAfter(actual);
	});


	/*******************
	COMMON STRUCTURE FUNCTION
	********************/
	
	function createHtml(id,structure){
		var elementWrapper = $(id),
			elementHtml = elementWrapper.html(),
			containerHtml = $('<div class="cd-box structure"></div>').insertAfter(elementWrapper),
			elementHtmlText = elementHtml.split('</' + structure + '>'),
			//buttonTag = $('#buttons .cd-box button');
			elementTag = $(id + structure);

		// Button tag creator
		$.map(elementHtmlText, function(value){
			if(value.indexOf(structure) >= 0 ) {
				var splitText = value.split('class="'),
					block1 = splitText[0]+'class="';
					block2 = splitText[1].split('"');
				
				var wrapperElement = $('<p></p>').text(block1),
					spanElement = $('<span></span>').text(block2[0]);
				spanElement.appendTo(wrapperElement);
				wrapperElement.appendTo(containerHtml);
				wrapperElement.append('"'+block2[1]+'&lt;/' + structure + '&gt;');
				console.log($(value));
			}
		});
	}
	// Create structure for buttons
	createHtml('#buttons .cd-box','button');

	/*Button Dimensions for clear size visibility*/
	$('#buttons .cd-box button').each(function(idx,value){
		var cdStructure = $('.cd-box .output'),
			//btnBG  = $(value).css('background-color');
			btnFs  = $(value).css('font-size'),
			btnLh  = $(value).css('line-height'),
			btnheight  = $(value).css('height'),
			btnWidth  = $(value).css('width');
			$(value).mouseover(function() {
				$(cdStructure).text('');
				$(cdStructure).append('Font-size- ' + btnFs + ' Line-Height - '+ btnLh + ' Height- ' + btnheight + ' Width-  ' + btnWidth + 'Background-' + $(value).css('background-color'));
			});
			// $(cdStructure).each(function(idx, ele){
			// 	$(ele).append('Font-size- ' + btnFs + ' Line-Height - '+ btnLh + ' Height- ' + btnheight + ' Width-  ' + btnWidth);
			// })
	});


	/*******************
	COPY TO CLIPBOARD	
	********************/

	$(document).on('click', '.copy', function(){
		var $temp = $("<input>");
		$("body").append($temp);
		$temp.val($(this).text()).select();
		document.execCommand("copy");
		$temp.remove();
	});


	/*******************
	TYPOGRAPHY
	********************/

	$('.cd-typography .headings').each(function(idx,ele){
		var heading = $(ele),
			headingDescriptionText = heading.siblings('pre');
			console.log($(ele).html());
			// body = heading.next('p'),
			// bodyDescriptionText = body.children('span').eq(0);
			
		//setTypography(body, bodyDescriptionText);
		// $(window).on('resize', function(){
		// 	setTypography(heading, headingDescriptionText);
		// 	setTypography(body, bodyDescriptionText);
		// });

		var fontSize = Math.round(heading.css('font-size').replace('px',''))+'px',
			lineHeight = heading.css('line-height'),
			fontFamily = (heading.css('font-family').split(','))[0].replace(/\'/g, '').replace(/\"/g, ''),
			fontWeight = heading.css('font-weight');
		//setTypography(heading, headingDescriptionText);
		headingDescriptionText.text('Font-size- ' + fontSize + ' Line-Height - '+ lineHeight + ' Font-Family- ' + fontFamily + ' Font-Weight-  ' + fontWeight);
	});
	
	//Font Stack
	$('.primary-font').text($('body').css('font-family'));
	$('.secondary-font').text($('h1').css('font-family'));


	/*******************
	FORM-ElEMENTS
	********************/

	createHtml('#form .cd-box','input');


	/*******************
	MAIN  NAVIGATION
	********************/
	var contentSections = $('main section');
	//open navigation on mobile
	$('.cd-nav-trigger').on('click', function(){
		$('header').toggleClass('nav-is-visible');
	});
	//smooth scroll to the selected section
	$('.cd-main-nav a[href^="#"]').on('click', function(event){
	        event.preventDefault();
	        $('header').removeClass('nav-is-visible');
	        var target= $(this.hash),
	        	topMargin = target.css('marginTop').replace('px', ''),
	        	hedearHeight = $('header').height();
	        $('body,html').animate({'scrollTop': parseInt(target.offset().top - hedearHeight - topMargin)}, 200); 
	    });

	    //update selected navigation element
	    $(window).on('scroll', function(){
	    	updateNavigation();
	    });

    	function updateNavigation() {
		contentSections.each(function(){
			var actual = $(this),
				actualHeight = actual.height(),
				topMargin = actual.css('marginTop').replace('px', ''),
				actualAnchor = $('.cd-main-nav').find('a[href="#'+actual.attr('id')+'"]');
			
			if ( ( parseInt(actual.offset().top - $('.cd-main-nav').height() - topMargin )<= $(window).scrollTop() ) && ( parseInt(actual.offset().top +  actualHeight - topMargin )  > $(window).scrollTop() +1 ) ) {
				actualAnchor.addClass('selected');
			}else {
				actualAnchor.removeClass('selected');
			}
		});
	}

});