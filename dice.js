$( document ).ready(function() {

	$('.distribute').on('click',function(){
		let self = $(this);
		let points_to_distribute = self.prev(".points-to-distribute").val();

		
		let points_left = points_to_distribute;

		let skills = self.closest(".skill-table").find(".skill-rating");

		let max_vals = self.next().val();

		let skill_totals = new Array(skills.length).fill(0);

		if(points_left > skills.length * max_vals){
			skill_totals = new Array(skills.length).fill(max_vals);
		}
		else{
			while(points_left>0){
				for(var i=0;i<skills.length;i++){
					if(points_left == 0){
						break;
					}
					else if(skill_totals[i] == max_vals){
						continue;
					}
					if(points_left == 0){
						break;
					}
					else{
						let skill_val = Math.floor(Math.random() * (max_vals))+1;
						if(skill_val > points_left){
							skill_val = points_left;
						}
						if(skill_val + skill_totals[i] > max_vals){
							skill_val = max_vals - skill_totals[i];
						}
						points_left = points_left - skill_val;
						skill_totals[i] = skill_totals[i] +  skill_val
					}
				}
			}
		}
		shuffle(skill_totals);
		console.log(skill_totals.reduce((a,b)=>a+b,0) );
		for(var i=0;i<skills.length;i++){
			$(skills[i]).val(skill_totals[i]);
			let name = $(skills[i]).attr("name").replace("rating","pool");
			$("input[name='"+name+"']").val(skill_totals[i]);
		}
	});


	function shuffle(a) {
	    var j, x, i;
	    for (i = a.length - 1; i > 0; i--) {
	        j = Math.floor(Math.random() * (i + 1));
	        x = a[i];
	        a[i] = a[j];
	        a[j] = x;
	    }
	}


	$(".lock-table").on("click",function(){
		let self = $(this);
		// $(this).closest(".skill-table").find(".skill-rating").prop("disabled",true);
	});

});