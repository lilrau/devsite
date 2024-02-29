var before = document.getElementById("before");
var liner = document.getElementById("liner");
var command = document.getElementById("typer"); 
var textarea = document.getElementById("texter"); 
var terminal = document.getElementById("terminal");
var terminal_box = document.getElementById("terminal-box");

var git = 0;
var pw = false;
let pwd = false;
var commands = [];

setTimeout(function() {
  loopLines(banner, "", 80);
  textarea.focus();
}, 100);

window.addEventListener("keyup", enterKey);

textarea.value = "";
command.innerHTML = textarea.value;

function enterKey(e) {
  if (e.keyCode == 181) {
    document.location.reload(true);
  }
  if (e.keyCode == 13) {
      commands.push(command.innerHTML);
      git = commands.length;
      addLine("user@lilrau.dev:~$ " + command.innerHTML, "no-animation", 0);
      commander(command.innerHTML.toLowerCase());
      command.innerHTML = "";
      textarea.value = "";
    }
    if (e.keyCode == 38 && git != 0) {
      git -= 1;
      textarea.value = commands[git];
      command.innerHTML = textarea.value;
    }
    if (e.keyCode == 40 && git != commands.length) {
      git += 1;
      if (commands[git] === undefined) {
        textarea.value = "";
      } else {
        textarea.value = commands[git];
      }
      command.innerHTML = textarea.value;
    }
  }

async function commander(cmd) {
  switch (cmd.toLowerCase()) {
    case "help":
      loopLines(help, "color2 margin", 80);
      break;
    case "about":
      loopLines(about, "color2 margin", 80);
      break;
    case "sudo":
      addLine("windows > linux", "color2", 80);
      break;
    case "goat":
      addLine("I miss the GOAT...", "color2", 80);
      setTimeout(function() {
        window.open('https://www.youtube.com/watch?v=l_T7KZEv6L0&ab_channel=LazyFlavio');
      }, 1500); 
      break;
    case "social":
      loopLines(social, "color2 margin", 80);
      break;
    case "projects":
      try {
        const repositories = await getRepositories("lilrau");
        if (repositories.length === 0) {
          addLine("No repo found.", "color2", 80);
        } else {
          printRepositories(repositories);
        }
      } catch (error) {
        addLine("Error. Can't get acess Github repos.", "error", 100);
      }
      break;
    case "history":
      addLine("<br>", "", 0);
      loopLines(commands, "color2", 80);
      addLine("<br>", "command", 80 * commands.length + 50);
      break;
    case "email":
        addLine('Opening mailto:<a href="mailto:raulsscoc@hotmail.com">raulsscoc@hotmail.com</a>...', "color2", 80);
        newTab(email);
        break;
    case "clear":
      setTimeout(function() {
        terminal.innerHTML = '<a id="before"></a>';
        before = document.getElementById("before");
      }, 1);
      break;
    case "banner":
      loopLines(banner, "", 80);
      break;
    case "linkedin":
      addLine("Opening LinkedIn...", "color2", 0);
      newTab(linkedin);
      break;
    case "github":
      addLine("Opening GitHub...", "color2", 0);
      newTab(github);
      break;
    case "discord":
      addLine("Opening Discord...", "color2", 0);
      newTab(discord);
      break;
    default:
      addLine("<span class=\"inherit\">Command not found. For a list of commands, type <span class=\"command\">'help'</span>.</span>", "error", 100);
      break;
  }
}

function newTab(link) {
  setTimeout(function() {
    window.open(link, "_blank");
  }, 500);
}

function addLine(text, style, time) {
  var t = "";
  for (let i = 0; i < text.length; i++) {
    if (text.charAt(i) == " " && text.charAt(i + 1) == " ") {
      t += "&nbsp;&nbsp;";
      i++;
    } else {
      t += text.charAt(i);
    }
}

setTimeout(function() {
    var next = document.createElement("p");
    next.innerHTML = t;
    next.className = style;

    before.parentNode.insertBefore(next, before);

    terminal_box.scrollTop = terminal_box.scrollHeight;
  }, time);
}

function loopLines(name, style, time) {
  name.forEach(function(item, index) {
    addLine(item, style, index * time);
  });
}

async function getRepositories(username) {
  try {
    const response = await fetch(`https://api.github.com/users/${username}/repos`, {
      headers: {
        Authorization: `token ${gittoken}`
      }
    });
    if (!response.ok) {
      throw new Error('Error searching repositories.');
    }
    const repositories = await response.json();
    return repositories;
  } catch (error) {
    console.error('Erro:', error);
    return [];
  }
}

async function getLanguages(repo) {
  try {
    const response = await fetch(repo.languages_url, {
      headers: {
        Authorization: `token ${gittoken}`
      }
    });
    if (!response.ok) {
      throw new Error('Error searching repository languages.');
    }
    const languagesData = await response.json();
    return languagesData;
  } catch (error) {
    console.error('Error:', error);
    return {};
  }
}

async function getDescription(repo) {
  try {
    const response = await fetch(repo.url, {
      headers: {
        Authorization: `token ${gittoken}`
      }
    });
    if (!response.ok) {
      throw new Error('Error searching repository info.');
    }
    const repoData = await response.json();
    return repoData.description;
  } catch (error) {
    console.error('Error:', error);
    return '';
  }
}

async function printRepositories(repositories) {
  for (const repo of repositories) {
    try {
      const languagesData = await getLanguages(repo);
      const languages = Object.keys(languagesData).join(' | ');

      const description = await getDescription(repo);
      
      addLine(`<br><span class="repo-emote">🔗</span><a href="${repo.html_url}" class="repo" target="_blank">${repo.name}</a><br><span class="langs">${languages}</span><br>${description}<br>`, "color2", 80);
    } catch (error) {
      addLine(`Erro searching repo info: ${repo.name}.`, "error", 100);
    }
  }
}