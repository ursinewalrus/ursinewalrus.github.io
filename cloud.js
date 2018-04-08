$( document ).ready(function() {

    let logged_in_user = null;
    let user_path = "users/";

    firebase.initializeApp({
      apiKey: "AIzaSyA2QkD76en09SQFhR8ey4MD9qU9Qu2Gk60",                            
      authDomain: "test-game-374da.firebaseapp.com",   
      databaseURL: "https://test-game-374da.firebaseio.com/"
    });
    
    fdb = firebase.database();
    
    const uiConfig = {
        signInSuccessUrl: "ursinewalrus.github.io",
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
      const ui = new firebaseui.auth.AuthUI(firebase.auth());
      // The start method will wait until the DOM is loaded.
     // if (ui.isPendingRedirect()) {
     // }

 firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        console.log("logged in");    
        logged_in_user = user;   
        user_path += user.uid; 
        //likely super redundant but whatever
        let update_name = {};
        update_name[user_path] = user.displayName;
        fdb.ref().update(update_name);
        // var displayName = user.displayName;
        // var email = user.email;
        // var emailVerified = user.emailVerified;
        // var photoURL = user.photoURL;
        // var isAnonymous = user.isAnonymous;
        // var uid = user.uid;
        // var providerData = user.providerData;
      } else {
          ui.start('#firebaseui-auth-container', uiConfig);
      }
  });

 /* Save current sheet stats under current name */

 $(".sheet-save").on("click",function(){
// user_time['user-activity/'+username] = {'last_checkup':Date.now(),'channel':channel};
            // fdb.ref().update(user_time);
    let stats = gather_stats();
 });

    function gather_stats(){
        let all_attrs = $(".char_attr");
        let all_char_data = {};
        all_attrs.map( (index) => {
            let attr = $(all_attrs[index]);
            all_char_data[attr.attr("name")] = attr.val();
        });
        let update_sheet = {};
        update_sheet[path] = all_char_data;
        fdb.ref().update(update_sheet);
    }

});