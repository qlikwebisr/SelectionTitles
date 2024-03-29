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
					label: "SelectionTitles - Shows selected field's title", //Get Name in settings panel
					type: ""
				}
			}
		},
		//http://extendingqlik.upper88.com/accessing-system-data-and-variables-in-a-qlik-sense-extension/
        initialProperties: {
		},
		//paint: function ($element,layout) {
		paint: function ($element) {

		//Get Dimensions from master items
		    qlik.currApp(this).getList("DimensionList", function(reply) {
				
				//array of master items
				let dimensions = [];

				reply.qDimensionList.qItems.forEach(function(dim) {

					let dimension = {};

					dimension.qName = dim.qData.info[0].qName;
					dimension.labelExpression = dim.qData.labelExpression;
					dimension.title = dim.qData.title;

					dimensions.push(dimension);

				});

			    //console.log('dimensions',dimensions);

				qlik.currApp(this).getList('SelectionObject', function(reply) {

					//need for the first selection
					setTimeout(async function() {

						//Get selected tabs nodes - array of DOM objects from li
						//let selected_items = document.querySelectorAll('.qvt-selections ul.list li.item .text-wrap .name');

						//old version 
						//let selected_items_parent = document.querySelectorAll('.qvt-selections ul.list li.item');
						console.log('qvt-selections ul.list', document.querySelectorAll('.qvt-selections ul.list li.item').length);
						console.log('div[tid="qs-sub-toolbar"]', document.querySelectorAll('div[tid="qs-sub-toolbar"] div[data-testid="qs-sub-toolbar-selection-list"] > div').length);

						//Aug 2023 version
						let selected_items_parent = (document.querySelectorAll('.qvt-selections ul.list li.item').length > 0 ) ? document.querySelectorAll('.qvt-selections ul.list li.item') : document.querySelectorAll('div[tid="qs-sub-toolbar"] div[data-testid="qs-sub-toolbar-selection-list"] > div');

						//console.log('selected_items',selected_items);
						//console.log('selected_items_parent',selected_items_parent);

						//console.log('selected_reply',reply.qSelectionObject.qSelections[0].qReadableName); //qSelectionObject.qSelections[0].qReadableName
						//console.log('selected_reply',reply.qSelectionObject.qSelections); //qSelectionObject.qSelections[0].qReadableName

						//let selected_values = reply.qSelectionObject.qSelections

						//for (let i = 0; i < selected_values.length; i++) {

						for (let i = 0; i < selected_items_parent.length; i++) {

							//get value from selection tab
							
							//Aug 2023 qlik version
							// 	let selected_name = selected_items_parent[i].querySelector('.current-selections-item p[tid="selection-name"]').innerHTML;
							//old qlik version 
							// 	let selected_name = selected_items_parent[i].querySelector('.text .text-wrap .name ').innerHTML;

							if(selected_items_parent[i].querySelector('.text .text-wrap .name ') == null){ //Aug 2023 qlik version
 
								//console.log('new version');

								let selected_name = selected_items_parent[i].querySelector('.current-selections-item p[tid="selection-name"]').innerHTML;

								let new_selected_name = checkDimension(dimensions, selected_name);

								if (typeof(new_selected_name) != 'undefined') {
									selected_items_parent[i].querySelector('.current-selections-item p[tid="selection-name"]').innerHTML = new_selected_name;
								}

							} else { //old qlik version 
								//console.log('old version');

								let selected_name = selected_items_parent[i].querySelector('.text .text-wrap .name').innerHTML;

								let new_selected_name = checkDimension(dimensions, selected_name);

								if (typeof(new_selected_name) != 'undefined') {
									selected_items_parent[i].querySelector('.text .text-wrap .name').innerHTML = new_selected_name;
								}
							}
							
						} //for (let i = 0; i < selected_values.length; i++) {

					}, 10); //setTimeout(function() {

				}); //qlik.currApp(this).getList('SelectionObject', function(){

		    }); //qlik.currApp(this).getList("DimensionList", function(reply) {

			function checkDimension(dimensions, selected_item){
					
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
