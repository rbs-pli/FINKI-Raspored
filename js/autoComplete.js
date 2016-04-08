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