
  instructors = []; // Професори autocomplete
  allCourses = []; // Курсеви autocomplete
  schedule = []; // Распоред 
  courses = []; // Листа на курсеви 
  instructorsWithID = []; //Професори со ID

const get = (url) => fetch(url).then(data => data.json()) 
var SCHEDULESbyProfessor = [];
var urls = 
 	{ 
 	    professors:  'https://jsonp.afeld.me/?url=http://raspored.finki.ukim.mk/services/professors'
      , rooms :'https://jsonp.afeld.me/?url=http://raspored.finki.ukim.mk/services/rooms'
      , schedulesByRoom: 'https://jsonp.afeld.me/?url=http://raspored.finki.ukim.mk//services/ScheduleByroom?value='
      , schedulesByProfessor: 'https://jsonp.afeld.me/?url=http://raspored.finki.ukim.mk/services/ScheduleByprofessor?value='
    };

//Interface functionality
 $(document).ready(function() {
      $(".addCourse").hide()
      courses = JSON.parse(localStorage.getItem("courses"));
      if (courses != null) {
          $(".loaderStatus").hide();
          loadByInstructor();
      } else {
          // 	$(".loaderStatus").show();
          $(".loaderStatus").hide();
          courses = [];
          getSchedulesByProfessor();
      }

  });

//Api requests
function getSchedulesByProfessor(){
	get( urls.professors )
   		.then( professors => {
		   	 
   			   var mapper = (professor) => getScheduleByProfessor.bind(null,professor.Id)
 			   var CALLBACK_LIST = professors.map( mapper );
 				
 			   // Ovde ti e klucnoto smeni ja ovaa funkcija vo odnos na toa sto sakas da se izvrsi otkako vo 
 			   // SCHEDULESbyProfessor nizata ke gi dobies baranjata (site requesti se zavrseni); 
 			   // Samo smeni ja ovaa funkcija primer da se  izrenderira nesto vo html-ot takvo nesto
 			   var ACTION = function(){
 			   	 console.log(SCHEDULESbyProfessor)
 			   }



		       makeAllRequestsSequentialy(CALLBACK_LIST,(_) => console.log(SCHEDULESbyProfessor));
		});
}
 
function getScheduleByProfessor(professorId) {
  return new Promise( (resolve,reject) => 
		get( urls.schedulesByProfessor + professorId).then(schedule => {
		  SCHEDULESbyProfessor.push(schedule);
		  resolve(schedule);
	}));
}




function makeAllRequestsSequentialy(actions,byRoomORbyProfessor){ 
   return actions.shift()()
            .then(
    	          actions.length 
    	          ?  makeAllRequestsSequentialy.bind(null,actions,byRoomORbyProfessor) 
    	          :  byRoomORbyProfessor
    	    );  
}