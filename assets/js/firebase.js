var chatRef = new Firebase('http://ly-test.firebaseIO.com/');
var auth = new FirebaseSimpleLogin(chatRef, function(error, user) {
  if (error) {
    // an error occurred while attempting login
    console.log(error);
  } else if (user) {
    // user authenticated with Firebase
    data = { username: user.username, password: user.accessToken };
    irc.socket.emit('authz', data);

  } else {
    // user is logged out
    console.log('logout');
  }
});
//*/