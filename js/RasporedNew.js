var professors = [];
var rooms      = [];

var schedulesP = [];
var schedulesR = [];

var setProfessors = ( data ) => professors = data;
var setSchedulesByProfessors = ( schedules ) => schedulesP.push(schedules);

var setRooms  = ( data ) => rooms = data;
var setSchedulesByRooms = ( schedules ) => schedulesR.push(schedules)


var URLS = {
     professors :'https://json2jsonp.com/?url=http://raspored.finki.ukim.mk/services/professors&callback=setProfessors'
   , rooms : 'https://json2jsonp.com/?url=http://raspored.finki.ukim.mk/services/rooms&callback=setRooms'
   , schedulesByRoom : 'https://json2jsonp.com/?url=http://raspored.finki.ukim.mk//services/ScheduleByroom?value='
   , schedulesByProfessor : 'https://json2jsonp.com/?url=http://raspored.finki.ukim.mk/services/ScheduleByprofessor?value='
}
 


function getSchedulesByRoom() {
    
      var JSONP_CALLBACK = 'setSchedulesByRooms';
      var QUERY_STRING   = '&callback=' + JSONP_CALLBACK;
      
      rooms = [];
      schedulesR = [];
     
      
      $.get( URLS.rooms, function(){
           rooms.map((room) => $.get(URLS.schedulesByRoom + room.Id + QUERY_STRING ));
      });
    
     
}

function getSchedulesByProfessors() {
     var JSONP_CALLBACK = 'setSchedulesByProfessors';
     var QUERY_STRING   = '&callback=' + JSONP_CALLBACK;
     
     professors = [];
     schedulesP = [];
     
     $.get( URLS.professors, function(){
           professors.map((professor) => $.get(URLS.schedulesByProfessor + professor.Id + QUERY_STRING ));
     });
}