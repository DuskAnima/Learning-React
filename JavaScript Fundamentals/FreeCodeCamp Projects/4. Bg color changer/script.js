characters = "abcdef1234567890"

function getRandomCharacter(characters) {
    let color = ""
    for (let i = 0; i < 6; i++) {
        c = characters.charAt(Math.floor(Math.random() * characters.length));
        color += c;
    }
    return color;
}

const body = document.querySelector("body");
const bgHexCodeSpanElement = document.querySelector("#bg-hex-code");

function changeBackgroundColor() {
    const color = "#" + getRandomCharacter(characters);

    bgHexCodeSpanElement.innerText = color;
    body.style.backgroundColor = color;
}
const btn = document.querySelector("#btn");

btn.onclick = changeBackgroundColor;