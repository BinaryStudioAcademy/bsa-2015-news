document.getElementById('appsBtn').onclick = function() {
	document.getElementById("notificationBlock").style.visibility = "hidden";
    var block = document.getElementById("appsBlock");
    if(block.style.visibility == "visible"){
    	block.style.visibility = "hidden";
    }
    else{
    	block.style.visibility = "visible";
    }	
};

document.getElementById('notificationBtn').onclick = function() {
	document.getElementById("appsBlock").style.visibility = "hidden";
    var block = document.getElementById("notificationBlock");
    if(block.style.visibility == "visible"){
    	block.style.visibility = "hidden";
    }
    else{
    	block.style.visibility = "visible";
    }	
};
