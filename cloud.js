$( document ).ready(function() {

	firebase.initializeApp({
	  apiKey: "AIzaSyA2QkD76en09SQFhR8ey4MD9qU9Qu2Gk60",                            
	  authDomain: "test-game-374da.firebaseapp.com",         
	});

	var uiConfig = {
      //  signInSuccessUrl: '/',
        signInOptions: [
          // Leave the lines as is for the providers you want to offer your users.
          firebase.auth.GoogleAuthProvider.PROVIDER_ID,
          // firebase.auth.GithubAuthProvider.PROVIDER_ID,
          firebase.auth.EmailAuthProvider.PROVIDER_ID,
        ],
        // Terms of service url.
        // tosUrl: '<your-tos-url>'
      };

      // Initialize the FirebaseUI Widget using Firebase.
      var ui = new firebaseui.auth.AuthUI(firebase.auth());
      // The start method will wait until the DOM is loaded.
     // if (ui.isPendingRedirect()) {
		  ui.start('#firebaseui-auth-container', uiConfig);
	 // }

 firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        console.log(user);
        
        var displayName = user.displayName;
        var email = user.email;
        var emailVerified = user.emailVerified;
        var photoURL = user.photoURL;
        var isAnonymous = user.isAnonymous;
        var uid = user.uid;
        var providerData = user.providerData;
        console.log(user);
      } else {
       console.log("nope");
      }
  });

});
