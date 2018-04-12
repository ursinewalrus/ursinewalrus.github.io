$( document ).ready(function() {
	
	$('.die input').on("click",function(e){
		e.stopPropagation();
	});

	$('.die').on("click",function(e){
		let self = $(this);
		let number_dice = self.find('input').val();
		let die_val = self.find('input').data('dval');
		let message = {};
		let roll_sum = 0;
		let roll_string = "D"+die_val+"(s):";
		for(var i=0;i<number_dice;i++){
			let roll = Math.floor(Math.random() * (die_val)) + 1;
			roll_string += " "+roll;
			roll_sum += roll;
		}
		roll_string += " = " + roll_sum;
		let key = fdb.ref().push().key;
		let message_message = {};
		message_message["rooms/"+room_name+"/"+room_pass+"/data/messages/"+key+"-ROLL"] = roll_string;
		fdb.ref().update(message_message);
	});

	$('.text-input-area').on('keyup',function(e){
		let self = $(this);
		if(e.keyCode == 13){
			let message = displayName+"->"+self.val();
			self.val("");
			let key = fdb.ref().push().key;
			let message_message = {};
			message_message["rooms/"+room_name+"/"+room_pass+"/data/messages/"+key] = message;
			fdb.ref().update(message_message);
		}
	});

});