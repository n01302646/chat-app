const $msgForm = document.getElementById('sendMsg')
const $msgList = document.getElementById('newMessages')
const $userNameForm = document.getElementById('getUserDetails')

const socket = io()

let $username = 'Guest';
let $sentmsgtime = 0;
//User Name block
$userNameForm.addEventListener('submit',(event)=>{
	event.preventDefault()
	$msgList.style.display='flex';
	$msgForm.style.display='block';
	$userNameForm.style.display='none';
	$username = event.currentTarget.username.value;
	socket.emit('newuser', {user: `${$username} is Online`})
})

// Event listener, waiting for an incoming "newuser"
socket.on('newuser', (data) => {
	const newMsg = document.createElement('li')
	$msgList.appendChild(newMsg)
	newMsg.textContent = data.user
	newMsg.classList.add("userjoined");
})


$msgForm.addEventListener('submit', (event) => {
	event.preventDefault()

	// To Add sender msg in the message block
	const newMsg = document.createElement('li')
	$msgList.appendChild(newMsg)
	newMsg.textContent = event.currentTarget.txt.value;
	newMsg.classList.add("messagesent");

	//get time of msg sent
	getDateTime();
	console.log($sentmsgtime);


	// Emit message to others
	socket.emit('chatmsg', {msg: event.currentTarget.txt.value, sentdatetime: $sentmsgtime})
	event.currentTarget.txt.value = ''
})


// Receive message here
socket.on('chatmsg', (data) => {
	const newMsg = document.createElement('li')
	$msgList.appendChild(newMsg)
	newMsg.classList.add("messagereceive");
	newMsg.innerHTML = data.msg + "<b class='senderDetails'> - by " + $username + " at "+ data.sentdatetime +"</b>";
})

//Get date and time to add details to received message
// Code written with the help of Stackoverflow.com
function getDateTime(){
	var today = new Date();
	var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
	var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
	$sentmsgtime = date+' '+time;
}