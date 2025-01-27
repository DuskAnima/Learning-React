//Learnign Introductory JavaScript by Building a Pyramid Generator

const character = "#";
const count = 8;
const rows = [];
let inverted = 4;

function padRow(rowNumber, rowCount) {
  return " ".repeat(rowCount - rowNumber) + character.repeat(2 * rowNumber - 1) + " ".repeat(rowCount - rowNumber);
}


function padRowSide(rowNumber) {
  return character.repeat(rowNumber - 1);
}

function padRowSideOther(rowNumber, rowCount) {
  return " ".repeat(rowCount - rowNumber) + character.repeat(rowNumber - 1);
}

for (let i = 1; i <= count; i++) {
  if (inverted === 1) {
    rows.unshift(padRow(i, count));
  } else if (inverted === 2) {
    rows.push(padRow(i, count));
  } else if (inverted === 3) {
    if (i <= count + 1) {
      rows.push(padRowSide(i));
    }
    if (i === count) {
      for (let j = count - 1; j > 0; j--) {
        rows.push(padRowSide(j));
      }
    }
  } else {
    if (i <= count) {
      // Para la parte de la pirámide apuntando a la izquierda
      rows.push(padRowSideOther(i, count)); // Primero creamos las filas crecientes
    }
    if (i === count) {
      // Luego decrecemos las filas para simular la pirámide
      for (let j = count - 1; j > 0; j--) {
        rows.push(padRowSideOther(j, count)); // Filas decrecientes
      }
    }
  }
}
// Store the result

let result = ""

for (const row of rows) {
  result = result + row + "\n";
}

console.log(result);