var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var messages = [], users = [], whoTypes = [];


app.get('/', function(req, res){
	res.sendFile(__dirname + '/main.html');
});

app.get('/script.js', function(req, res){
	res.sendFile(__dirname + '/script.js');	
});

app.get('/style.css', function(req, res){
	res.sendFile(__dirname + '/style.css');	
});

io.on('connection', function(socket){	


  	socket.on('add message', (message) =>{
  		if (messages.length >= 100)
  			messages.shift();
	  	messages.push(message);
  		io.emit('show all messages', messages);
  	});

  	socket.on('add user', (user) =>{
  		var existUser = false;
  		for (i in users){
  			if (users[i].userName == user.userName){
  				socket.emit('user name error', user.userName);
  				existUser = true;
  				break;
  			}
  			if (users[i].userNickname == user.userNickname){
  				socket.emit('user nickname error', user.userNickname);
  				existUser = true;
  				break;	
  			}
  		}

  		if (!existUser){
	  		users.push(user);
	  		io.emit('show all users', users);
			console.log('statred change status');
			setTimeout(function(){
	    		changeStatus('online', socket.id);
			}, 60000);
			io.emit('show all messages', messages);
		}
  	})

  	socket.on('disconnect', (reason) => {
  		changeStatus('offline', socket.id);	
 	});

 	socket.on('I am typing', () => {
 		for (i in users){
			if (users[i].socketId == socket.id){
				whoTypes.push(users[i].userName);
				break;
			}
		}	
  		io.emit('somebody is typing', whoTypes);	
 	});

 	socket.on('I am not typing', () => {
 		var typingUser;
 		for (i in users){
			if (users[i].socketId == socket.id){
				typingUser = users[i].userName;
				break;
			}
		}	
		for (i in whoTypes){
			if (whoTypes[i] == typingUser){
				whoTypes.splice(i, 1);
			}
		}
  		io.emit('somebody is typing', whoTypes);	
 	});
});

http.listen(3000, function(){
  console.log('App listening on port 3000!');
});


function changeStatus(status, socketId){
	for (i in users){
		if (users[i].socketId == socketId){
			users[i].status = status;
			break;
		}
	}
	io.emit('show all users', users);	
}