

// Listen for the 'submit' of a form
// 	 event.preventDefault()  (prevent the form from leaving the page)
//   Emit a message using "chatmsg"
// Listen for "chatmsg"
//   add a <li> with the chat msg to the <ol>

const $msgForm = document.getElementById('sendMsg')
const $msgList = document.getElementById('messages')
const $userNameForm = document.getElementById('userdetails')

const socket = io()

let $username = 'Guest';
let $sentmsgtime = 0;

// Function to get user name
$userNameForm.addEventListener('submit',(event)=>{
	event.preventDefault()

	//enable msg box and chats only after entering username
	$msgForm.style.display='block';
	$msgList.style.display='flex';
	$userNameForm.style.display='none';
	$username = event.currentTarget.username.value;

	// Send a message to say that I've connected
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


// To receive msg
socket.on('chatmsg', (data) => {
	const newMsg = document.createElement('li')
	$msgList.appendChild(newMsg)
	newMsg.classList.add("messagereceive");
	//newMsg.textContent = data.msg;
	newMsg.innerHTML = data.msg + "<b class='senderDetails'> - by " + $username + " at "+ data.sentdatetime +"</b>";
})

//referenced code from https://tecadmin.net/get-current-date-time-javascript/#:~:text=Current%20Time%20in%20JavaScript,%3Ai%3As%E2%80%9D%20format.&text=var%20today%20%3D%20new%20Date()%3B,()%20%2B%20%22%3A%22%20%2B
function getDateTime(){
	var today = new Date();
	var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
	var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
	$sentmsgtime = date+' '+time;
}