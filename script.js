let help = {
  text: [
    'type something',
    'press enter to levitate',
    'press ` to hide/show text and clock',
    'press 0 to reset'
  ],
  size: 12,
  visible: true
}
let nohelp = {
  text: [
    ':)'
  ],
  size: 12,
  visible: true
}

const MAX_TEXT_SIZE = 48;

let txt = {
  str: "",
  size: MAX_TEXT_SIZE
}
let wordMonsters = [];

let font;

function preload() {
  font = loadFont('./FredokaOne-Regular.ttf');
}

function setup() {
  createCanvas(windowWidth - 30, windowHeight - 30);
  background('lavender');
  textFont(font)
}

function draw() {
  background('lavender');
  drawHelpText();
  fitTextSizeTo(width); // updates txt.str
  drawText();
  drawMonsters();
  drawTime();
  //drawing everything
}


function drawTime() {
  if (help.visible) {
    text('current time:\n' + hour() + ":" + minute() + ":" + second(), 20, windowHeight-150, size=10);
  }
  //this is how to draw the current time. i decided to keep bundle the time with the help conditional so the screen doesn't get clustered.
}
function drawMonsters() {
  for (let monster of wordMonsters) {
    // look at translate.draw to see how this works
    push();
    translate(monster.loc.x + monster.w / 2, monster.loc.y + monster.h / 2);
    // https://p5js.org/reference/#/p5/atan2
    //rotate(atan2(monster.d.y, monster.d.x));
    // at this point we are drawing at 0,0 
    // wherever the monster is supposed to 
    // be drawn in the original coordinate 
    // system. We are also rotated to the 
    // direction the monster moving
    text(monster.word, -monster.w / 2, monster.h / 2);
    pop();
    updateMonsterDirection(monster);
    updateMonsterLocation(monster);
  }
}

function fitTextSizeTo(w) {
  textSize(MAX_TEXT_SIZE);
  txt.size = MAX_TEXT_SIZE;
  while (textWidth(txt.str) > w) {
    txt.size--;
    textSize(txt.size);
  }
}

function drawHelpText() {
  if (help.visible) {
    textSize(help.size);
    let i = 10;
    for (let line of help.text) {
      text(line, 10, i);
      i += 12;
    }
  }
  else {
    textSize(nohelp.size);
    let i = 10;
    for (let line of nohelp.text) {
      text(line, 10, i);
      i += 12;
    }
  }
  }


function drawText() {
  const tw = textWidth(txt.str);
  text(txt.str, width / 2 - tw / 2, height / 2);
}

function updateMonsterLocation(monster) {
  monster.loc.x += monster.d.x;
  monster.loc.y += monster.d.y;
}

function updateMonsterDirection(monster) {
  moveToMiddle(monster, 0, width, "x", 0.2);
  moveToMiddle(monster, 0, height, "y", 0.2);
}

function moveToMiddle(monster, leftBound, rightBound, attribute, change) {
  if (monster.loc[attribute] > rightBound) {
    monster.d[attribute] += random(-change, 0);
  } else if (monster.loc[attribute] < leftBound) {
    monster.d[attribute] += random(change);
  } else {
    monster.d[attribute] += random(-change / 2, change / 2);
  }
}

function keyPressed() {
  if (key === '`') {
    help.visible = !help.visible;
  } else if (keyCode === BACKSPACE) {
    txt.str = txt.str.slice(0, txt.str.length - 1);
  } else if (key === '0') {
    txt.size = 36;
    wordMonsters = [];
  } else if (keyCode === ENTER || keyCode === RETURN) {
    textSize(txt.size);
    const tw = textWidth(txt.str);
    let x = width / 2 - tw / 2;
    let y = height / 2;
    const space = font.textBounds(" ", 0, 0);
    for (const word of split(txt.str, " ")) {
      const rect = font.textBounds(word, x, y);
      wordMonsters.push({
        word: word,
        loc: { x: rect.x, y: rect.y },
        w: rect.w,
        h: rect.h,
        d: { x: random(-0.1, 0.1), y: random(-0.1, 0.1) }
      })
      x += rect.w + space.w; // update x to the width of the text's bounding rectangle, plus the width of a space. 
    }
    txt.str = "";
  } else if (key.length === 1 && key.match(/\w|\s/)) {
    // matches characters or spaces using a regular expression (regex). 
    // Read about regular expressions here: 
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions
    txt.str += key;
  }
}