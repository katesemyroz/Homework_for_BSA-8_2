var listOfUsers = document.getElementById('displayUsers');
var enterChatButton = document.getElementById('enterChatButton');
var inputUserName = document.getElementById('inputUserName');
var inputUserNickname = document.getElementById('inputUserNickname');
var textPlace = document.getElementById('textPlace');
var inputMessage = document.getElementById('inputMessage');
var sendMessageButton = document.getElementById('sendMessageButton');
var userNameFiled = document.getElementById('userName');
var userNicknameFiled = document.getElementById('userNickname');
var whoTypesField = document.getElementById('whoTypes');
var errorPopupFiled = document.getElementById('errorPopupFiled');
var popup = document.getElementById('popup');



var user, message;


var socket = io.connect();



enterChatButton.addEventListener( 'click' , enterChat);
sendMessageButton.addEventListener('click', sendMessage);
inputMessage.onfocus = function() {
  socket.emit('I am typing');
};

inputMessage.onblur = function() {
  socket.emit('I am not typing');
};

function enterChat(){

	if ((inputUserName.value == "") || (inputUserNickname.value == "")){
		errorPopupFiled.innerHTML = "You should fill all fields!";
	}
	else{

		user = {
			userName: inputUserName.value,
			userNickname: inputUserNickname.value, 
			status: 'just appeared',
			socketId: socket.id
		}

		userNameFiled.innerHTML = inputUserName.value;
		userNicknameFiled.innerHTML = ('@' + inputUserNickname.value);

		socket.emit('add user', user);

		popup.style.top = "99999px";
	}

}

socket.on('show all users', (users) =>{
	listOfUsers.innerHTML = '';
	for (var i in users){
		var el = document.createElement('li');
		el.innerHTML = (users[i].userName + " " + users[i].status);
		listOfUsers.appendChild(el);
	}
})

function sendMessage(){

	message = {
		text: inputMessage.value,
		senderName: userNameFiled.innerHTML,
		senderNickname: userNicknameFiled.innerHTML,
		time: new Date().toLocaleString()
	}
	inputMessage.value = '';
	socket.emit('add message', message);
}

socket.on('show all messages', (messages) =>{
	textPlace.innerHTML = '';
	for (var i in messages){
		var el = document.createElement('li');
		el.innerHTML = ('Sender: ' + messages[i].senderName + " (@" + messages[i].senderNickname + ")" + 
		", time: " + messages[i].time + '\n\n' + messages[i].text);
		if (messages[i].text.indexOf(userNicknameFiled.innerHTML) != -1){
			el.style.backgroundColor = "grey";
		}
		textPlace.appendChild(el);
	}
});


socket.on('somebody is typing', (whoTypes) => {
	whoTypesField.innerHTML = '';
	if (whoTypes.length > 0){
		for (var i in whoTypes){
			whoTypesField.innerHTML = (whoTypesField.innerHTML + whoTypes[i] + " ");
		}
		whoTypesField.innerHTML = (whoTypesField.innerHTML + 'typing...');
	}
});

socket.on('user name error', (userName) =>{
	popup.style.top = "0px";
	errorPopupFiled.innerHTML = ("User with name " + userName + " already exists.");
});


socket.on('user nickname error', (userNickname) =>{
	popup.style.top = "0px";
	errorPopupFiled.innerHTML = ("User with nickname " + userNickname + " already exists.");
});