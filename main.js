//DOM ready
document.addEventListener('DOMContentLoaded', function() {	
	var i,
		debug = 1,
		temp_url,	
		openTabs = [],		 
		outputData = "", 		
		urlExceptionLists = ["chrome://newtab/", "chrome://extensions/"],
		
		old_tabs_container = document.getElementById("old_tabs"),
		new_tabs_container = document.getElementById("new_tabs"),
		
		//For Click event.
		tab_saver_button = document.getElementById("tab_saver"),
		tab_viewer_button = document.getElementById("tab_viewer");
	
	tab_viewer_button.addEventListener("click", function(){
		chrome.tabs.query({}, function (tabs) {   		
			openTabs = [];
			temp_url = "";
			
			try {
			//Read URLs from local storage & display it to user.
				if (localStorage.stored_tabs){
					if(debug){
						console.log ('Good we have storage ready .. printing is in progress.');					
					}				
					var data = JSON.parse(localStorage.stored_tabs);				
					for(i=0;i< data.length; i++){
						outputData += "<span class='tab'>  <a href='"+data[i][1]+"'>" +(data[i][2]).substring(0, 25) + "</a></span><br>";
					}				
				}else{
					//Welcome, first time using this addon.
					if(debug){
						console.log('Thanks for saving tabs for the first time, creating fresh storage.');
					}
					for (i = 0; i < tabs.length; i++) {
						temp_url = tabs[i].url;
						if(urlExceptionLists.indexOf(temp_url) === -1){
							openTabs[i] = [tabs[i].id, temp_url, tabs[i].title];
							outputData += "<span class='tab'><a href='"+ temp_url +"'>"+(tabs[i].title).substring(0, 25) + "</a></span><br>";	
						}					
					}					
					localStorage.setItem('stored_tabs', JSON.stringify(openTabs));				
				}			
				old_tabs_container.innerHTML += outputData;
			} catch(e){
				//delete the local storage data.
				localStorage.removeItem('stored_tabs');
				old_tabs_container.innerHTML = "Some error occured. Try once again.";
			}
			
		});	
	});	
		
	//It will check the new URLs in tabs then it will add those to local storage.	
	tab_saver_button.addEventListener("click", function(){
		var comparsionArrayContainer = [],			
			outputData = "";
			
			
		//reset the data
		openTabs = [];
		temp_url = "";
		
		//Fetching the stored data from local storage.
		var data = JSON.parse(localStorage.stored_tabs);		
		//Creating old session data in array so that it will help the comparsion.
		for (var i = 0; i < data.length; i++) {        
			comparsionArrayContainer.push(data[i][1]);			
		}		
				
		chrome.tabs.query({}, function (tabs) {				
			for (i = 0; i < tabs.length; i++) {
			
				//New URL visited by the user. store it & display to user in new box.
				temp_url = tabs[i].url;
				if(urlExceptionLists.indexOf(temp_url) === -1){
					if(comparsionArrayContainer.indexOf(temp_url) === -1){					
						openTabs.push([tabs[i].id, temp_url, tabs[i].title]);
						outputData += "<br><span class='url'><a href='"+temp_url+"'>"+(tabs[i].title).substring(0, 25) + "</a></span>";				
					}				
				}					
			}

			if(	openTabs.length > 0){				
				data.push(openTabs);
				//Updating the local storage with new urls values.
				localStorage.setItem('stored_tabs', JSON.stringify(data));
				new_tabs_container.innerHTML += outputData;				
			}
		});	
	});
});

