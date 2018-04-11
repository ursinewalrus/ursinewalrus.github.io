let room_name;
let room_pass;

$( document ).ready(function() {
// https://medium.com/front-end-hacking/fun-with-firebase-security-rules-3c0304efa29 rules matching stuff
// https://stackoverflow.com/questions/33794709/firebase-validate-with-newdata
//https://stackoverflow.com/questions/37693029/firebase-security-rule-checking-value-of-new-data-to-authenticate
    let logged_in_user = null;
    let user_path = "users/";
    let saved_sheets = {};
    let room_in = null;


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
        update_name[user_path + "/user-info/"] = {"display name": user.displayName};
        fdb.ref().update(update_name);
        get_saved_sheets();
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
        let all_attrs = $(".char_attr");
        let all_char_data = {};
        all_attrs.map( (index) => {
            let attr = $(all_attrs[index]);
            all_char_data[attr.attr("name")] = attr.val();
        });
        let update_sheet = {};
        let sheet_name = $(".sheet-name").val();
        if(sheet_name == ""){
            alert("Name the sheet");
            return;
        }
        update_sheet[user_path + "/sheets/" + sheet_name] = all_char_data;
        fdb.ref().update(update_sheet);
        alert("Saved sheet: " + sheet_name);
    });

    function get_saved_sheets(){
        $('.sheet-select').find('option').remove().append('<option value="-1">Select</option>');
        fdb.ref(user_path + "/sheets").on('value',function(snapshot){
            let sheets = snapshot.val()
            saved_sheets = sheets;
            if(!sheets){
                return;
            }
            Object.keys(sheets).forEach(function(sheet){
                $('.sheet-select').append($("<option value="+sheet+">"+sheet+"</option>"));
            });
        });
    }

    $('.choose-sheet').on('click',function(){
        let selected = $('.sheet-select').val();
        let selected_skills = saved_sheets[selected];
        $(".sheet-header").html(selected);
        $(".sheet-name").val(selected);
        Object.keys(selected_skills).map ( (key) => {
            $("input[name='"+key+"']").val(selected_skills[key]);
            $("textarea[name='"+key+"']").val(selected_skills[key]);
        });
    });

    $('.room-info-submit').on("click",function(){
        room_name = $(".room-name").val();
        room_pass = $(".room-password").val();
        fdb.ref("rooms/"+room_name+"/"+room_pass+"/data").on('value',function(snapshot){
            let snap = snapshot.val();
            if(snap){
                //join
                grid_matrix = JSON.parse(snap.grid);
                update_grid();
            }
            else{
                //new
                let new_room = {};
                new_room["rooms/"+room_name+"/"+room_pass+"/data/grid/"] = JSON.stringify(grid_matrix);
                fdb.ref().update(new_room);
            }

        });
    });

});
//rooms
//    RoomName
//           password
//                   data: 'json1'