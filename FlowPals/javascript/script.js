// // share functie
$(function(){
    testingShare();
})

function testingShare() {
	console.log("start testing Sharing");


      if ("share" in navigator) {
           console.log("sharing works");
           clickConnect();
      } else {
          console.log("sharing doesn't work");


}
function clickConnect() {

    $(".sharingPost").click(function (ev) {
           navigator.share({
			       title: "FlowPals",
             text: "Your friend wants you to look at this post!",
			       url: "index.html" //verander naar url
           })
    });
  }
}

//notifications

function displayFirstNotification(){
    $("#btnEnableNotifications").hide();

    var options = {
        body: "You are successfully subscribed to FlowPals notifications! Thank you very much!",


    }

    navigator.serviceWorker.ready.then(function(registration){
        registration.showNotification("Successfully subscribed!!", options)
    })
}


function askForNotificationPermission(){
    Notification.requestPermission(function(result){
        console.log("user Choice", result);
        if(result != "granted"){
            console.log("No permission granted");
        } else {
            console.log("Permission granted!!!");
            displayFirstNotification();
        }

    })
}


$(function(){

    if('Notification' in window){
        $("#btnEnableNotifications").show();
        $("#btnEnableNotifications").click(askForNotificationPermission);
    }

})





//vanaf hier is de camera functie
var videoPlayer;
function startVideo(){
	//doet de camera aan
	if('mediaDevices' in navigator){
		navigator.mediaDevices.getUserMedia({ video: true })
			.then(function(stream){

				// vraagt om toestemming


				videoPlayer = document.querySelector("#player");
				videoPlayer.srcObject = stream;


				$("#divSelfie").css("display", "block");

			})
			.catch(function(error){
				//all errors here
				console.log("There was an error", error);

				$("#pickImage").css("display", "block");
			})
	}

}
function captureImage(){
	navigator.mediaDevices.getUserMedia({ video: true })
			.then(function(stream){
				var mediaStreamTrack = stream.getVideoTracks()[0];
			  	var imageCapture = new ImageCapture(mediaStreamTrack);
				var img = document.querySelector('img');
				imageCapture.takePhoto()
					.then(blob => {
						img.src = URL.createObjectURL(blob);
						img.onload = () => { URL.revokeObjectURL(this.src); }
					})
					.catch(error => console.error('takePhoto() error:', error));
		});
}

function pickImage(){
	stopStreaming();


	$("#pickImage").css("display", "block");
}
function stopStreaming(){
	if(videoPlayer){
		videoPlayer.srcObject.getVideoTracks()
			.forEach(function(track){
				track.stop();
			})
	}


	$("#divSelfie").css("display", "none");
}

function captureImagePick(input){
	var reader = new FileReader();
	reader.onload = function(e) {
		document.getElementById("pickImage").src = '"'+ e.target.result +'"';

    	$("img").attr('src', e.target.result)
    };
	reader.readAsDataURL(input.target.files[0]);
}

(function() {

	$(".cameraKnop").click(startVideo);
	$("#vastleggenFoto").click(captureImage);
	$("#bestandKnop").click(pickImage);
	$("#imagePicker").on('change', captureImagePick);
})();
