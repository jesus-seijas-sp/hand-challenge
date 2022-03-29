const fs = require('fs');

const instructions = [...fs.readFileSync(process.argv[2] || 'input.hand', 'utf-8')];
let cursor = 0;
const data = [0];
let pointer = 0;
const loops = {};

const stack = [];
instructions.forEach((instruction, index) => {
  if (instruction === '🤜') {
    stack.push(index);
  } else if (instruction === '🤛') {
    const loopStart = stack.pop();
    loops[loopStart] = index;
    loops[index] = loopStart;
  }
});

const actions = {
  '👉': () => {
    pointer += 1;
    if (pointer >= data.length) {
      data.push(0);
    }
  },
  '👈': () => pointer -= 1,
  '👆': () => data[pointer] = data[pointer] === 255 ? 0 : data[pointer] + 1,
  '👇': () => data[pointer] = data[pointer] === 0 ? 255 : data[pointer] - 1,
  '👊': () => process.stdout.write(String.fromCharCode(data[pointer])),
  '🤜': () => {
    if (data[pointer] === 0) {
      cursor = loops[cursor];
    }
  },
  '🤛': () => {
    if (data[pointer] !== 0) {
      cursor = loops[cursor];
    }
  },
}

while (cursor < instructions.length) {
  const instruction = instructions[cursor];
  actions[instruction]();
  cursor += 1;
}


