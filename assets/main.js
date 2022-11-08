window.onload = async () => {
  var altInfo = await turtl.getData();

  var altCloud = document.getElementById("altMenu");

  var selectedAlt = "NONE";

  for (var x of altInfo.alts) {
    var cloudItem = document.createElement("h5");
    cloudItem.id = x[0];
    cloudItem.innerHTML = x[0] + "<h4 style='color: gray'>@" + x[2] + "</h4>";
    altCloud.appendChild(cloudItem);
    cloudItem.onclick = () => {
      [...altCloud.children].forEach((altCloudItem) => {
        altCloudItem.classList.remove("selected");
      });
      cloudItem.classList.add("selected");
      selectedAlt = [x[0], x[1], x[2]];
    };
  }

  var selection = "";

  [...document.getElementById("tabs").children].forEach((child) => {
    child.onclick = () => {
      console.log(child.id);
      [...document.getElementById("tabs").children].forEach((child1) => {
        child1.classList.remove("selected");
      });
      child.classList.add("selected");
      selection = child.id;
      [...document.getElementById("panels").children].forEach((child2) => {
        child2.classList.remove("selected");
        if (child2.dataset.associatesWith === selection) {
          console.log("true");
          child2.classList.add("selected");
        }
      });
    };
  });

  document.getElementById("tabs").children[0].classList.add("selected");
  document.getElementById("panels").children[0].classList.add("selected");

  selection = document.getElementById("tabs").children[0].id;

  document.getElementById("loginBtn").onclick = async () => {
    if (selection === "userpass") {
      var r;
      if (selectedAlt == 'NONE') {
        var dta = [
          document.getElementById("user").value,
          document.getElementById("pass").value,
          document.getElementById("instance").value
        ];
        r = await turtl.uPassLogin(dta);
      }
      else
        r = await turtl.uPassLogin([
          selectedAlt[0],
          selectedAlt[1],
          document.getElementById("instance").value
        ]);
      if (r == true) window.location.replace("pages/stats.html");
      else document.getElementById(selection).style.color = "red !important";
    } else {
      var r = await turtl.login([
        document.getElementById("session").value,
        document.getElementById("instance").value || "v2.blacket.org"
      ]);
      if (r == true) window.location.replace("pages/stats.html");
      else document.getElementById(selection).style.color = "red !important";
    }
  };
};
