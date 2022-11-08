var sqs = (qs) => document.querySelector(qs);
var id = (id3) => document.getElementById(id3);

function roundup(v) {
  return Math.pow(10, Math.ceil(Math.log10(v)));
}

var globalBlooks = (await turtl.getBlooks()).blooks;

var uCache2 = {};

var rarities = {
  Common: 0,
  Uncommon: 1,
  Rare: 2,
  Epic: 3,
  Legendary: 4,
  Chroma: 5,
  Mystical: 6,
  Iridescent: 7,
};

// Common, Uncommon, Rare, Epic, Legendary, Chroma, Mystical, Iridescent

function calculateScore(user) {
  if (!uCache2[user.username].score) {
    var score = 0;
    for (var x of Object.keys(user.blooks)) {
      var fard =
        globalBlooks[x] === undefined || globalBlooks[x] == null ? "SKIP" : "";

      if (fard == "SKIP") continue;
      var rare = rarities[globalBlooks[x].rarity];
      if ((rare == null || rare == undefined ? 0 : rare) > 0)
        score += 1 * (rare / 2);
      else if (score > 0) score -= 1;
    }
    score += Math.round(user.exp / 1000);
    uCache2[user.username].score = Math.round(score);
    return Math.round(score);
  } else {
    return uCache2[user.username].score;
  }
}

function abbreviateNumber(value) {
  var newValue = value;
  if (value >= 1000) {
    var suffixes = ["", "k", "m", "b", "t"];
    var suffixNum = Math.floor(("" + value).length / 3);
    var shortValue = "";
    for (var precision = 2; precision >= 1; precision--) {
      shortValue = parseFloat(
        (suffixNum != 0
          ? value / Math.pow(1000, suffixNum)
          : value
        ).toPrecision(precision)
      );
      var dotLessShortValue = (shortValue + "").replace(/[^a-zA-Z 0-9]+/g, "");
      if (dotLessShortValue.length <= 2) {
        break;
      }
    }
    if (shortValue % 1 != 0) shortValue = shortValue.toFixed(1);
    newValue = shortValue + suffixes[suffixNum];
  }
  return newValue;
}

function numberWithCommas(n) {
  var parts = n.toString().split(".");
  return (
    parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",") +
    (parts[1] ? "." + parts[1] : "")
  );
}

async function main(user, config) {
  var inst = await turtl.getInstance();
  document.getElementsByClassName("stuff")[0].style.backgroundImage =
    'url("https://' + inst + user.banner + '")';
  document.getElementsByClassName("stuff")[0].style.backgroundSize = "cover";
  document.getElementsByClassName("stuff")[0].style.backgroundRepeat =
    "no-repeat";
  document.getElementById("pfp").src = "https://" + inst + user.avatar;
  document.getElementById("username").textContent = user.username;
  document.getElementById("username").style.color = user.color;
  document.getElementById("role").textContent = user.role;

  document.getElementById("confName").textContent = config.name;
  document.getElementById("instanceName").textContent = "@" + inst;

  user.level = 0;
  for (let i = 0; i <= 27915; i++) {
    user.needed = 5 * Math.pow(user.level, config.exp.difficulty) * user.level;
    if (user.exp >= user.needed) {
      user.exp -= user.needed;
      user.level++;
    }
  }
  id("exp-inner").style.transform =
    "scaleX(" + (user.exp / user.needed).toString() + ")";
  id("cexlevel").textContent = user.level;
  id("tokens-inner").style.transform =
    "scaleX(" + (user.tokens / roundup(user.tokens)).toString() + ")";
  id("tokenlevel").textContent = abbreviateNumber(user.tokens);
  id("tokenIcon").src = "https://" + inst + "/content/tokenIcon.png";
  id("tokensLabel").textContent = numberWithCommas(user.tokens) + " tokens";
  id("topBlook").src =
    "https://" +
    inst +
    "/content/blooks/" +
    encodeURIComponent(
      Object.keys(
        Object.fromEntries(
          Object.entries(user.blooks).sort(
            ([key1, value1], [key2, value2]) => value2 - value1
          )
        )
      )[0]
    ) +
    ".png";
  id("blookCount").textContent = Object.values(
    Object.fromEntries(
      Object.entries(user.blooks).sort(
        ([key1, value1], [key2, value2]) => value2 - value1
      )
    )
  )[0];
  var rmeses = await turtl.getChatMessages();
  for (var x of rmeses) {
    var checkInPlace = true;
    if (!uCache2[x.from]) {
      var averageAnimeLover = await turtl.getUser(x.from);
      averageAnimeLover = (averageAnimeLover == undefined || averageAnimeLover == false || averageAnimeLover.error == true) ? false : averageAnimeLover;
      if (averageAnimeLover !== false) {
        uCache2[x.from] = averageAnimeLover.user;
        uCache2[x.from].score = calculateScore(averageAnimeLover.user);
      } else {
        uCache2[x.from] = averageAnimeLover.error;
        checkInPlace = false;
      }
    }

    var use = uCache2[x.from];

    if (checkInPlace) {
      id(
        "rmeses"
      ).innerHTML += `<div class="message">
        <img style="aspect-ratio: 1/1; width: auto; height: 20px;" src="${
          (use.avatar == null
            ? ""
            : use.avatar
          ).startsWith("https://")
            ? ""
            : "https://" + inst
        }${
          use.avatar == null
            ? "/content/blooks/Blacket.png"
            : use.avatar
        }">
        <text style="color: ${x.color};">
        ${x.role}
        </text>
        <text class="score" style="color: #fff; margin-left: 5px;">
          ${use.score.toString()}
        </text>
        <text class="${
          use.color === "rainbow" ? "rainbow" : ""
        }" style="color: ${
        use.color === "rainbow" ? "#fff" : use.color
        }; margin-left: 5px; margin-right: 5px;">
        ${x.from}
        </text>
        <text>${
          x.msg
        }
        </text>
      </div>`;
    } else {
      id(
        "rmeses"
      ).innerHTML += `<div class="message">
        <img style="aspect-ratio: 1/1; width: auto; height: 20px;" src="https://${inst}/content/blooks/Blacket.png">
        <text style="color: ${x.color};">
        ${x.role}
        </text>
        <text style="margin-left: 5px; margin-right: 5px; color: #fff;">
        ${x.from}
        </text>
        <text>${
          x.msg
        }
        </text>
      </div>`;
    }
  }
}

var user = (await turtl.getUser()).user;
var config = await turtl.getConfig();

if (user !== false && config !== false) {
  await main(user, config);
}
