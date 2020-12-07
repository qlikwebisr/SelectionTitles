define( [ "jquery","qlik"],

function ( $,qlik) {

	'use strict';

	return {
		support : {
			snapshot: true,
			export: true,
			exportData : false
		},
		definition: {
			type: "items",
			component: "accordion",
			items: {
				appearance: 
				{
					ref: "",
					label: "SelectionTitles - Shows selected field's title",
					type: ""
				}
			}
		},
		//http://extendingqlik.upper88.com/accessing-system-data-and-variables-in-a-qlik-sense-extension/
        initialProperties: {
		},
		//paint: function ($element,layout) {
		paint: function ($element) {

		//Get Dimension by shee
		    qlik.currApp(this).getList("DimensionList", function(reply) {
				
				let dimensions = [];

				reply.qDimensionList.qItems.forEach(function(dim) {

					let dimension = {};
					//console.log(dim);

					dimension.qName = dim.qData.info[0].qName;
					dimension.labelExpression = dim.qData.labelExpression;
					dimension.title = dim.qData.title;

					//console.log('dimension',dimension);

					dimensions.push(dimension);

				});


				//console.log('dimensions',dimensions);

				qlik.currApp(this).getList('SelectionObject', function(reply) {

					setTimeout(async function() {

					//let selected_items = document.querySelectorAll('.qvt-selections ul.list li.item .text-wrap .name');
					let selected_items_parent = document.querySelectorAll('.qvt-selections ul.list li.item');
					//let selected_items = $('.qvt-selections ul.list li.item .text-wrap .name');

					//console.log('selected_items',selected_items);
					console.log('selected_items_parent',selected_items_parent);
					console.log('selected_items_parent.length',selected_items_parent.length);

					//console.log('selected_reply',reply.qSelectionObject.qSelections[0].qReadableName); //qSelectionObject.qSelections[0].qReadableName
					//console.log('selected_reply',reply.qSelectionObject.qSelections); //qSelectionObject.qSelections[0].qReadableName
					//let selected_values = reply.qSelectionObject.qSelections

					//for (let i = 0; i < selected_values.length; i++) {

					for (let i = 0; i < selected_items_parent.length; i++) {

						let selected_name = selected_items_parent[i].querySelector('.text .text-wrap .name ').innerHTML;

						console.log('i',i);

						console.log('selected_items_parent_node',selected_name);

						let new_selected_name =  checkDimension(dimensions, selected_name);

						console.log('new_selected_name',new_selected_name);

						if (typeof(new_selected_name) != 'undefined') {

                            console.log('typeof-new_selected_name', typeof(new_selected_name));
							selected_items_parent[i].querySelector('.text .text-wrap .name ').innerHTML = new_selected_name;

						}

						//let selected_name = selected_items[i].innerHTML;
						/* let selected_name = selected_values[i].qReadableName;

						console.log('selected_name',selected_name);
						console.log('selected_values.length',selected_values.length);

						let new_selected_name = await checkDimension(dimensions, selected_name);

						if (new_selected_name != undefined) {

							console.log('new_selected_name', new_selected_name);

							selected_items[i].innerHTML =  new_selected_name;

						} */

						//$('.qvt-selections ul.list li.item:nth-child(' + (i + 1) + ') .text-wrap .name').html(new_selected_item);

						//$('.qvt-selections ul.list li.item:nth-child(' + (i + 1) + ') .text-wrap .name').html('Gnida-' + i);

						/* setTimeout(function() {

							dimensions.forEach(function(dimension) {

								let dimension_trimmed = dimension.qName.trim();

								//console.log('dimension_trimmed',dimension_trimmed);

								//if(dimension.qName.includes(selected_name)){
								
								if(dimension_trimmed == selected_name || dimension_trimmed == ('=' + selected_name) || dimension_trimmed == ('[' + selected_name + ']') ) {

									//console.log('dimension',dimension);

									if (dimension.labelExpression != undefined) {

										//dimension_trimmed = dimension.labelExpression.trim();
										//selected_items[i].innerHTML = dimension.labelExpression.trim();
										$('.qvt-selections ul.list li.item:nth-child(' + (i + 1) + ') .text-wrap .name').html(dimension.labelExpression.trim());
		
									} else {

										//selected_items[i].innerHTML = dimension.title.trim();
										$('.qvt-selections ul.list li.item:nth-child(' + (i + 1) + ') .text-wrap .name').html(dimension.title.trim());
									}


								} 

							}); 

					    }, 100); */
						
					} //for (let i = 0; i < selected_values.length; i++) {

				}, 10); //setTimeout(function() {

				}); //qlik.currApp(this).getList('SelectionObject', function(){


		    }); //qlik.currApp(this).getList("DimensionList", function(reply) {

			function checkDimension(dimensions, selected_item){

				//return new Promise(resolve => {
					
					//dimensions.forEach(function(dimension) {
					for (let dimension of dimensions) {

						let dimension_trimmed = dimension.qName.trim();

						//console.log('dimension_trimmed', dimension_trimmed);

						if(dimension_trimmed == selected_item || dimension_trimmed == ('=' + selected_item) || dimension_trimmed == ('[' + selected_item + ']') ) {

							if (dimension.labelExpression != undefined) {

								return (dimension.labelExpression.trim());

							} else {

								return (dimension.title.trim());
							}

							break;

						} 

					};
					
				//});

			}

			$element.html( "SelectionTitles Extension" );

			//Get Extension Invisible
			let style = "<style>.qv-object-SelectionTitles{display: none !important;}</style>"
			$element.append(style);
			
			//needed for export
			return qlik.Promise.resolve();

		} //paint: function ($element) {

	}; //return

});
