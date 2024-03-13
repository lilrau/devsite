const updateCursor = ({ x, y }) => {
    document.documentElement.style.setProperty('--x', x);
    document.documentElement.style.setProperty('--y', y);
}

document.body.addEventListener('pointermove', updateCursor);

function command(cmd) {
  switch (cmd.toLowerCase()) {
    case 'help':
      help();
      break;
    case 'about':
      about();
      break;
    case 'social':
      social();
      break;
    case 'projects':
      projects();
      break;
    case 'history':
      history();
      break;
    case 'email':
      email();
      break;
    case 'banner':
      banner();
      break;
    case 'reload':
      reload();
      break;
    case 'clear':
      clear();
      break;
    default:
      unrecognizedCommand();
  }
}
