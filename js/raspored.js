  //Data
  instructors = []; // Професори autocomplete
  allCourses = []; // Курсеви autocomplete
  schedule = []; // Распоред 
  courses = []; // Листа на курсеви 
  instructorsWithID = []; //Професори со ID 

  $(document).ready(function() {
  	$(".addCourse").hide()
      courses = JSON.parse(localStorage.getItem("courses"));
      if (courses != null)
      {
      	$(".loaderStatus").hide();
          loadByInstructor();
          }
      else
         {
        // 	$(".loaderStatus").show();
        $(".loaderStatus").hide();
         	courses = [];
         }

  });

function addCourses()
{
	$("#addbtn").hide();
	$(".loaderStatus").show();
	setAutocomplete();
}
  function sleep(milliseconds) {
      var start = new Date().getTime();
      for (var i = 0; i < 1e7; i++) {
          if ((new Date().getTime() - start) > milliseconds) {
              break;
          }
      }
  }

function loadByInstructor()
{
	for(i=0;i<courses.length;i++)
	{
		//console.log(courses[i]);
		 $.get('https://jsonp.afeld.me/?url=http://raspored.finki.ukim.mk/services/ScheduleByprofessor?value=' + courses[i].ID, function(data){
    		//console.log(courses);
    		//console.log(i);
    		for( c = 0; c<data.length;c++)
    		{

    			for(k=0;k<courses.length;k++)
    			{
    			var course = courses[k].course;
    			if(data[c].title.indexOf(course)!= -1)
    			{
    				var start = moment(data[c].start).format();
    				var end = moment(data[c].end).format();
    				var room = data[c].title.split("Просторија:")[1];
    				start = parseInt(start.split("T")[1].split(":"));
                    end = parseInt(end.split("T")[1].split(":")[0]);

                    while (start <= end) {
                                  $("tbody tr:nth-child( " + (start - 7) + ")>:nth-child(" + (1 + parseInt(data[c].daynum)) + ")").html("<b >" + room + "</b> <br>" + courses[k].instructor + "<br>" + courses[k].course).addClass("err");
                                  start += 1;
                              }
    			}
    		}
    		}
  		});
		
	}
}

  function saveCourses() {
      if (document.getElementById("Предмет").value.length == 0)
          return;
      instructor = document.getElementById("Професор").value;
      var id = null;
      for (i = 0; i < instructorsWithID.length; i++) {
          if (instructor.localeCompare(instructorsWithID[i].Name) == 0) {
              id = instructorsWithID[i].Id;
              break;
          }
      }
      if (id == null)
      	return;
      courses.push({
          ID: id,
          course: document.getElementById("Предмет").value,
          instructor: instructor
      });
      localStorage.setItem("courses", JSON.stringify(courses));
      loadByInstructor();
      document.getElementById("Предмет").value = "";
      document.getElementById("Професор").value = "";
  }

  function loadRooms() {
      $.get('https://jsonp.afeld.me/?url=http://raspored.finki.ukim.mk/services/rooms', function(rooms) {
          //var rooms = data;
          var roomsSchedule = [];
          for (i = 0; i < rooms.length; i++) {
              //console.log(rooms[i]);
              $.get('https://jsonp.afeld.me/?url=http://raspored.finki.ukim.mk//services/ScheduleByroom?value=' + rooms[i].Id, function(roomData) {
                  for (r = 0; r < roomData.length; r++) {
                      for (c = 0; c < courses.length; c++) {
                          //console.log(roomData[r].title);
                          if (roomData[r].title.indexOf(courses[c].course) != -1 && roomData[r].title.indexOf(courses[c].instructor) != -1) {
                              roomData[r].start = moment(roomData[r].start).format();
                              var test = moment(roomData[r].start).format();
                              roomData[r].end = moment(roomData[r].end).format();
                              schedule.push(roomData[r]);
                              var room = roomData[r].title.split("Просторија:");
                              var start = parseInt(roomData[r].start.split("T")[1].split(":"));
                              var end = parseInt(roomData[r].end.split("T")[1].split(":")[0]);
                              while (start <= end) {
                                  // console.log("Time " + (start - 7) + " Den " + ( 1 + parseInt(roomData[r].daynum)) + " Data " + roomData[r].title  );
                                  $("tbody tr:nth-child( " + (start - 7) + ")>:nth-child(" + (1 + parseInt(roomData[r].daynum)) + ")").html("<b >" + room[1] + "</b> <br>" + room[0].substring(0, room[0].length - 2)).addClass("err");
                                  start += 1;
                              }
                          }
                      }
                  }

              });
              sleep(250);
          }
      });
  };

  function setAutocomplete() {

      //Profesori & Предмети
      $.get('https://jsonp.afeld.me/?url=http://raspored.finki.ukim.mk/services/professors', function(data) {
          instructorsWithID = data;
          for (i = 0; i < data.length; i++) {
              instructors.push(data[i].Name);
              $.get('https://jsonp.afeld.me/?url=http://raspored.finki.ukim.mk/services/ScheduleByprofessor?value=' + data[i].Id, function(cData) {
                  for (c = 0; c < cData.length; c++) {
                      var title = cData[c].title.split("- Просторија:")[0];
                     // console.log(title);
                      //	console.log(allCourses.indexOf(title));
                      if (allCourses.indexOf(title) == -1) {
                          allCourses.push(title);
                      }

                  }
                   $(".loaderStatus").html("Loading " + i + " out of " + data.length);
              });
             
              sleep(320);
            $(".loaderStatus").hide();
      		$(".addCourse").show();
          }
      });
      var input = document.getElementById("Професор");
      var awesomplete = new Awesomplete(input);
      awesomplete.list = instructors;
      input = document.getElementById("Предмет");
      awesomplete = new Awesomplete(input);
      awesomplete.list = allCourses;
  }