
window.onload = function(){
	var img = document.createElement("IMG");
	img.src = "./image/bg.jpg";
	img.addEventListener("load" , function(){
		document.getElementById("bg-container").appendChild(img);
		document.getElementById("login-field").style.display = "block";
	} , false);
}
