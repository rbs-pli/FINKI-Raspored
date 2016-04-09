  //Data
  allInstructors = [];  // Професори autocomplete
  allCourses = [];     // Курсеви autocomplete
  allRooms = []       // Простории autocomplete
  schedule = [];      // Распоред 
  courses = []; 	 // Листа на курсеви 
  rooms = [];		 // Листа на соби
  $(document).ready(function() {
      $(".addCourse").hide();
      courses = JSON.parse(localStorage.getItem("courses"));
      if (courses != null) {
          $(".loaderStatus").hide();
          loadRooms();
      } else {
          $(".loaderStatus").hide();
          courses = [];
      }

      var instructor = document.getElementById("Професор");
      var awesomplete = new Awesomplete(instructor);
      awesomplete.list = allInstructors;
      var course = document.getElementById("Предмет");
      var awesomplete = new Awesomplete(course);
      awesomplete.list = allCourses;
      var room = document.getElementById("Просторија");
      var awesomplete = new Awesomplete(room);
      awesomplete.list = allRooms;
  });


  function reset() {
      for (var i = 0; i < schedule.length; i++) {
          var ID = schedule[i].ID;
          var start = schedule[i].start;
          var end = schedule[i].end;
          var room = schedule[i].room;
          var title = schedule[i].title;
          var instructor = schedule[i].instructor;
          while (start <= end) {
              var x = start - 7;
              var y = 1 + schedule[i].daynum;
              $("tbody tr:nth-child( " + x + ")>:nth-child(" + y + ")").html("").removeClass("err");
              start += 1;
          }
      }
  }

  function deleteCourse(id) {
      courses.splice(id, 1);
      localStorage.setItem("courses", JSON.stringify(courses));
      reset();
      schedule = [];
      loadRooms();
  }

  function addCourses() {
      $("#addbtn").hide();
      $(".loaderStatus").show();
      setAutocomplete();
  }


  function draw(i) {
      var ID = schedule[i].ID;
      var start = schedule[i].start;
      var end = schedule[i].end;
      var room = schedule[i].room;
      var title = schedule[i].title.split("Просторија:")[0];
      var title = title.substring(0, title.length - 2);
      var instructor = schedule[i].instructor;
      while (start <= end) {
          var x = start - 7;
          var y = 1 + schedule[i].daynum;
          $("tbody tr:nth-child( " + x + ")>:nth-child(" + y + ")").html("<b >" + room + "</b> <a href=\"#\"> <img onclick=\"deleteCourse(\'" + ID + "\' )\" src=\"close.png\" class=\"delete\"></a> <br>" + title).addClass("err");
          start += 1;
      }
  }


  function getRoomSchedule(data) {
      for (var i = 0; i < data.length; i++) {
          rooms.push(data[i]);
          var title = data[i].title;
          var start = moment(data[i].start).format();
          var end = moment(data[i].end).format();
          var room = data[i].title.split("Просторија:")[1];
          var start = parseInt(start.split("T")[1].split(":"));
          var end = parseInt(end.split("T")[1].split(":")[0]);

          for (var c = 0; c < courses.length; c++) {
              var cinstructor = courses[c].instructor;
              var ctitle = courses[c].course;
              var cstart = courses[c].start;
              var cdaynum = courses[c].daynum;
              var croom = courses[c].room;
              if (title.indexOf(ctitle) != -1 && title.indexOf(cinstructor) != -1 && title.indexOf(croom) != -1) {
                  if (cdaynum != null && cdaynum != data[i].daynum)
                      continue;
                  if (cstart != null && cstart != start)
                      continue;
                  schedule.push({
                      ID: c,
                      daynum: parseInt(data[i].daynum),
                      start: start,
                      end: end,
                      room: room,
                      title: title,
                  });
                  draw(schedule.length - 1);
              }

          }
      }
  }

  function getRooms(data) {
      for (var rIndex = 0; rIndex < data.length; rIndex++) {
          $.get('https://json2jsonp.com/?url=http://raspored.finki.ukim.mk/services/ScheduleByRoom?value=' + data[rIndex].Id + '&callback=getRoomSchedule');
      }
  }

  function loadRooms() {
      $.get('https://json2jsonp.com/?url=http://raspored.finki.ukim.mk/services/rooms&callback=getRooms');
  }

  function cancel() {
      $(".addCourse").hide();
      $("#addbtn").show();
  }

  function saveCourses() {
      var room = document.getElementById("Просторија").value;
      if (room == undefined)
          var room = "";
      courses.push({
          course: document.getElementById("Предмет").value,
          instructor: document.getElementById("Професор").value,
          room: room,
          daynum: $("#Ден").val(),
          start: $("#Време").val()
      });
      localStorage.setItem("courses", JSON.stringify(courses));
      loadRooms();
  }



  function getInstructorData(cData) {
      for (var c = 0; c < cData.length; c++) {
          var title = cData[c].title.split("- Просторија:")[0];
          if (allCourses.indexOf(title) == -1) {
              allCourses.push(title);
          }
          var room = cData[c].title.split("- Просторија:")[1];
          if (allRooms.indexOf(room) == -1) {
              allRooms.push(room);
          }

      }
  }

  function getInstructorID(data) {
      for (var i = 0; i < data.length; i++) {
          allInstructors.push(data[i].Name);
          $.get('https://json2jsonp.com/?url=http://raspored.finki.ukim.mk/services/ScheduleByprofessor?value=' + data[i].Id + '&callback=getInstructorData');
      }
      $(".loaderStatus").hide();
      $(".addCourse").show();
  }

  function setAutocomplete() {
      $.get('https://json2jsonp.com/?url=http://raspored.finki.ukim.mk/services/professors&callback=getInstructorID');
  }