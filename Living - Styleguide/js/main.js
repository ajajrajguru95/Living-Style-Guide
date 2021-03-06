jQuery(document).ready(function($){

	/*******************
	COLOR SWATCH
	********************/
	//convert rgba color to hex color
	 $.cssHooks.backgroundColor = {
		get: function (elem) {
			if (elem.currentStyle)
				var bg = elem.currentStyle["backgroundColor"];
			else if (window.getComputedStyle)
				var bg = document.defaultView.getComputedStyle(elem,
				null).getPropertyValue("background-color");
			if (bg.search('rgba') > -1) {
				return '#00ffffff';
			} else {
				if (bg.search('rgb') == -1) {
					return bg;
				} else {
					bg = bg.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
				function hex(x) {
					return ("0" + parseInt(x).toString(16)).slice(-2);
				}
					return "#" + hex(bg[1]) + hex(bg[2]) + hex(bg[3]);
				}
			}
		}
	};

	// Get color and set to bg color if not set
	$('.cd-colors .cd-box').each(function(idx,ele){
		var getColor = $(ele).find('.cd-color-swatch');
		var gettextColor = getColor.css('color');
		if(getColor.css('background-color') == '#00ffffff'){
			getColor.css('background-color',gettextColor);
		}
	})
	//set a label for each color swatch
	$('.cd-color-swatch').each(function(){
		var actual = $(this);
		$('<b class="copy">'+actual.css("backgroundColor")+'</b>').insertAfter(actual);
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
				//console.log($(value));
			}
		});
	}
	// Create structure for buttons
	createHtml('#buttons .cd-box','button');

	/*Button Dimensions for clear size visibility*/
	$('#buttons .cd-box button').each(function(idx,value){
		var cdStructure = $('.cd-box .output'),
		btnFs  = $(value).css('font-size'),
		btnLh  = $(value).css('line-height'),
		btnheight  = $(value).css('height'),
		btnWidth  = $(value).css('width'),
		btnBG  = $(value).css('background-color');
		$(value).mouseover(function() {
			btnhoverBG  = $(value).css('background-color');
			$(cdStructure).text('');
			$(cdStructure).show('fast');
			$(cdStructure).append('<span>Font-size-</span>'+btnFs+'<span>Line-Height-</span>'+btnLh+'<span>Height-</span>'+btnheight+'<span>Width-</span>'+btnWidth+'<span>Background-Color-</span>'+btnBG+'<span>Background Hover-</span>'+btnhoverBG);
		});
	});

	$(document).on('click', '.source', function(){
		$(this).prev('pre').slideToggle('500');
		 $(this).text( ($(this).text() == 'View Source' ? 'Close' : 'View Source') )
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
		$('<span class="copied">Copied</div>').appendTo($(this)).fadeOut(2000);
	});


	/*******************
	TYPOGRAPHY
	********************/

	$('.cd-typography .headings').each(function(idx,ele){
		var heading = $(ele),
		headingDescriptionText = heading.siblings('pre');
		var fontSize = Math.round(heading.css('font-size').replace('px',''))+'px',
			lineHeight = heading.css('line-height'),
			fontFamily = (heading.css('font-family').split(','))[0].replace(/\'/g, '').replace(/\"/g, ''),
			fontWeight = heading.css('font-weight');
		//setTypography(heading, headingDescriptionText);
		headingDescriptionText.html('<span>Font-size-</span>'+fontSize+'<span>Line-Height-</span>'+lineHeight+'<span>Font-Family-</span>'+fontFamily+'<span>Font-Weight-</span>'+fontWeight);
	});
	
	//Font Stack
	$('.primary-font').text($('body').css('font-family'));
	$('.secondary-font').text($('.secondary-font,.sub-font').css('font-family'));

	//Get container size and gutter
	$('.container-size').text('Max-width:  ' + $('.grid-container').css('max-width') +  'Width:  '  + $('.container,.grid-container').css('width'));
	$('.gutter-spacing').text($('.container,.grid-container').css('padding-left'));

	/*******************
	REUSABLE COMPONENTS
	********************/
	$('.util-structure').each(function(idx,ele){
		var elementHtml = $(ele).html(),
		//convertText = $(ele).text(elementHtml),
		generateContent = $('<pre class="copy"></pre>');
		$(ele).append(generateContent);
		//containerHtml = $('<pre hidden></pre>').insertAfter($(ele));
		generateContent.text(elementHtml);
		$('<button class="source">View Source</button>').insertAfter(generateContent);
	})
	

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
	        	hedearHeight = $('header').height() - 35;
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