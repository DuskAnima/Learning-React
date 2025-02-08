let xp = 0;
let health = 100;
let gold = 50;
let currentWeapon = 0;
let fighting;
let monsterHealth;
let inventory = ["stick"];
let magic = [
    {name: 'fireball', get: false},
    {name: 'thundershock', get: false},
    {name: 'earthquake', get: false}
];

let killedSlime = false;
let killedBeast = false;
let killedFlying = false;
let killedBasilisk = false;
let killedSkelleton = false;

const button1 = document.querySelector('#button1');
const button2 = document.querySelector("#button2");
const button3 = document.querySelector("#button3");
const text = document.querySelector("#text");
const xpText = document.querySelector("#xpText");
const healthText = document.querySelector("#healthText");
const goldText = document.querySelector("#goldText");
const monsterStats = document.querySelector("#monsterStats");
const monsterName = document.querySelector("#monsterName");
const monsterHealthText = document.querySelector("#monsterHealth");
const weapons = [
    { name: 'stick', power: 5 },
    { name: 'dagger', power: 30 },
    { name: 'claw hammer', power: 50 },
    { name: 'mace', power: 80 },
    { name: 'short sword', power: 100 },
    { name: 'axe', power: 130 },
    { name: 'big sword', power: 170 },
    { name: 'great sword', power: 200 },
    { name: 'dragon slayer', power: 300 }
];

/*
name, level, health, damage, weakness, spawn, place
*/
const monsters = [
    {
        name: "slime",
        level: 2,
        health: 15,
        damage: ["attack"], // damage = can receive damage
        weakness: ["fire", "thunder", "earthquake"], // weakness = is weak to (x1.5 dmg)
        spawn: 50,
        place: "cave"
    },
    {
        name: "fanged beast",
        level: 4,
        health: 70,
        damage: ["attack", "fire"],
        weakness: ["earthquake", "thunder"],
        spawn: 80,
        place: "cave"
    },
    {
        name: "winged beast",
        level: 10,
        health: 110,
        damage: ["fire", "ice"],
        weakness: ["thunder"],
        spawn: 100,
        place: "cave"
    },
    {
        name: "skelleton",
        level: 16,
        health: 280,
        damage: ["attack", "thunder", "ice", "earthquake"],
        weakness: ["fire"],
        spawn: 50,
        place: "dragon lair"
    },
    {
        name: "basilisk",
        level: 22,
        health: 450,
        damage: ["attack"],
        weakness: ["earthquake"],
        spawn: 80,
        place: "dragon lair"
    },
    {
        name: "dragon",
        level: 35,
        health: 1000,
        damage: ["attack"],
        weakness: [],
        spawn: 100,
        place: "dragon lair"
    }
]

const locations = [
    {
        name: "town square",
        "button text": ["Go to store", "Go to cave", "Go to dragon's lair"],
        "button functions": [goStore, goCave, goLair],
        text: "You are in the town square. You see a sign that says \"Store\"."
    },
    {
        name: "store",
        "button text": ["Buy 10 health (10 gold)", "Buy weapon (30 gold)", "Go to town square"],
        "button functions": [buyHealth, buyWeapon, goTown],
        text: "You enter the store."
    },
    {
        name: "spell",
        "button text": [],
        "button functions": [fightSlime, fightBeast, goTown],
        text: "Choose a spell."
    },
    {
        name: "fight",
        "button text": ["Attack", "Spell", "Run"],
        "button functions": [attack, useMagic, goTown],
        text: "You are fighting a monster."
    },
    {
        name: "kill monster",
        "button text": ["Go to town square", "Go to town square", "Go to town square"],
        "button functions": [goTown, goTown, easterEgg],
        text: 'The monster screams "Arg!" as it dies. You gain experience points and find gold.'
    },
    {
        name: "lose",
        "button text": ["REPLAY?", "REPLAY?", "REPLAY?"],
        "button functions": [restart, restart, restart],
        text: "You die. &#x2620;"
    },
    {
        name: "win",
        "button text": ["REPLAY?", "REPLAY?", "REPLAY?"],
        "button functions": [restart, restart, restart],
        text: "You defeat the dragon! YOU WIN THE GAME! &#x1F389;"
    },
    {
        name: "easter egg",
        "button text": ["2", "8", "Go to town square?"],
        "button functions": [pickTwo, pickEight, goTown],
        text: "You find a secret game. Pick a number above. Ten numbers will be randomly chosen between 0 and 10. If the number you choose matches one of the random numbers, you win!"
    }
];

// initialize buttons
button1.onclick = goStore;
button2.onclick = goCave;
button3.onclick = goLair;

function update(location) {
    monsterStats.style.display = "none";
    button1.innerText = location["button text"][0];
    button2.innerText = location["button text"][1];
    button3.innerText = location["button text"][2];
    button1.onclick = location["button functions"][0];
    button2.onclick = location["button functions"][1];
    button3.onclick = location["button functions"][2];
    text.innerHTML = location.text;

}

function button4(text, func){
    const button4 = document.createElement("button"); // 4th button, auxiliar.
    const controls = document.getElementById("controls"); 
    button4.innerText = text;
    controls.appendChild(button4)
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function goTown() {
    update(locations[0]);
}

function goStore() {
    update(locations[1]);
}    

async function goCave() { // Chooses a random enemy from the cave, but it needs to, at least, have 1 encounter whit the weakest enemy.
    //update(locations[2]);
    text.innerText = "You enter the cave...";
    await sleep(1000);
    const caveMonsters = monsters.filter(monster => monster.place === "cave");
    const randNumber = Math.floor(Math.random() * 101);
    if (randNumber < caveMonsters[0].spawn || killedSlime === false) {
        fightSlime()
        killedSlime = true
    } else if (randNumber < caveMonsters[1].spawn && killedSlime === true || killedBeast === false) {
        fightBeast()
        killedBeast = true
    } else if (randNumber < caveMonsters[2].spawn && killedBeast === true) {
        figthFlyingBeast()
        killedFlying = true
    }
}

async function goLair() { // Chooses a random enemy from the lair, but it needs to, at least, have 1 encounter whit the weakest enemy.
    text.innerText = "You enter the dragon's lair...";
    await sleep(1000); 
    const lairMonsters = monsters.filter(monster => monster.place === "dragon lair");
    const randNumber = Math.floor(Math.random() * 101);
    if (randNumber < lairMonsters[0].spawn || killedSkelleton === false) {
        fightSkelleton()
        killedSkelleton = true
    } else if (randNumber < lairMonsters[1].spawn && killedSkelleton === true || killedBasilisk === false) {
        fightBasilisk()
        killedBasilisk = true
    } else if (randNumber < lairMonsters[2].spawn && killedBasilisk === true) {
        fightDragon()
    }    
}    

function buyHealth() {
    if (gold >= 10) {
        gold -= 10;
        health += 10;
        goldText.innerText = gold;
        healthText.innerText = health;
    } else {
        text.innerText = "You do not have enough gold to buy health.";
    }
}

function getMagic() { // set spells from de array magic "true", this is based on the enemy defeated.
    if (defeatMonster()) {
        let newSpell = magic[fighting];
        newSpell.get = true;
    } else if (lose()) {
        for (let spell of magic) {
            spell.get = false
        }
    } else { // do nothing.
    }
}

function showSpells() {
    // Mapeamos todos los hechizos, y si están disponibles (get: true), asignamos su nombre, si no, asignamos "No spell"
    let availableSpells = magic.map(spell => spell.get === true ? spell.name : "No spell");
    // Asignamos el arreglo a los botones correspondientes
    locations[2]["button text"] = availableSpells;
    button4("go back")
}

function useMagic(spell) {
    showSpells()
    update(locations[2]) //enters the spell menu

    text.innerText = "The " + monsters[fighting].name + " attacks.";
    text.innerText += " You attack it with your " + weapons[currentWeapon].name + ".";
    health -= getMonsterAttackValue(monsters[fighting].level);
    if (isMonsterHit()) {
        monsterHealth -= weapons[currentWeapon].power + Math.floor(Math.random() * xp) + 1;
    } else {
        text.innerText += " You miss.";
    }
    healthText.innerText = health;
    monsterHealthText.innerText = monsterHealth;
    if (health <= 0) {
        lose();
    } else if (monsterHealth <= 0) {
        if (fighting === monsters.length - 1) {
            winGame();
        } else {
            defeatMonster();
        }
    }
}

function buyWeapon() {
    if (currentWeapon < weapons.length - 1) {
        if (gold >= 30) {
            gold -= 30;
            currentWeapon++;
            goldText.innerText = gold;
            let newWeapon = weapons[currentWeapon].name;
            text.innerText = "You now have a " + newWeapon + ".";
            inventory.push(newWeapon);
            text.innerText += " In your inventory you have: " + inventory;
        } else {
            text.innerText = "You do not have enough gold to buy a weapon.";
        }
    } else {
        text.innerText = "You already have the most powerful weapon!";
        button2.innerText = "Sell weapon for 15 gold";
        button2.onclick = sellWeapon;
    }
}

function sellWeapon() {
    if (inventory.length > 1) {
        gold += 15;
        goldText.innerText = gold;
        let currentWeapon = inventory.shift();
        text.innerText = "You sold a " + currentWeapon + ".";
        text.innerText += " In your inventory you have: " + inventory;
    } else {
        text.innerText = "Don't sell your only weapon!";
    }
}

function fightSlime() {
    fighting = 0;
    goFight();
}

function fightBeast() {
    fighting = 1;
    goFight();
}

function figthFlyingBeast() {
    fighting = 2;
    goFight();
}

function fightSkelleton() {
    fighting = 3;
    goFight();
}

function fightBasilisk() {
    fighting = 4;
    goFight();
}

function fightDragon() {
    fighting = monsters.length - 1;
    goFight();
}

function goFight() {
    update(locations[3]);
    monsterHealth = monsters[fighting].health;
    monsterStats.style.display = "block";
    monsterName.innerText = monsters[fighting].name;
    monsterHealthText.innerText = monsterHealth;
}

function attack() {
    text.innerText = "The " + monsters[fighting].name + " attacks.";
    text.innerText += " You attack it with your " + weapons[currentWeapon].name + ".";
    health -= getMonsterAttackValue(monsters[fighting].level);
    if (isMonsterHit()) {
        monsterHealth -= weapons[currentWeapon].power + Math.floor(Math.random() * xp) + 1;
    } else {
        text.innerText += " You miss.";
    }
    healthText.innerText = health;
    monsterHealthText.innerText = monsterHealth;
    if (health <= 0) {
        lose();
    } else if (monsterHealth <= 0) {
        if (fighting === monsters.length - 1) {
            winGame();
        } else {
            defeatMonster();
        }
    }
    if (Math.random() <= .1 && inventory.length !== 1) {
        text.innerText += " Your " + inventory.pop() + " breaks.";
        currentWeapon--;
    }
}

function getMonsterAttackValue(level) {
    const hit = (level * 5) - (Math.floor(Math.random() * xp));
    console.log(hit);
    return hit > 0 ? hit : 0;
}

function isMonsterHit() {
    return Math.random() > .2 || health < 20;
}

function dodge() {
    text.innerText = "You dodge the attack from the " + monsters[fighting].name;
}

function defeatMonster() {
    gold += Math.floor(monsters[fighting].level * 6.7);
    xp += monsters[fighting].level;
    goldText.innerText = gold;
    xpText.innerText = xp;
    update(locations[4]);
}

function lose() {
    killedSlime = false
    killedBeast = false
    killedFlying = false
    killedBasilisk = false
    killedSkelleton = false

    update(locations[5]);

}

function winGame() {
    update(locations[6]);
}

function restart() {
    xp = 0;
    health = 100;
    gold = 50;
    currentWeapon = 0;
    inventory = ["stick"];
    goldText.innerText = gold;
    healthText.innerText = health;
    xpText.innerText = xp;
    goTown();
}

function easterEgg() {
    update(locations[7]);
}

function pickTwo() {
    pick(2);
}

function pickEight() {
    pick(8);
}

function pick(guess) {
    const numbers = [];
    while (numbers.length < 10) {
        numbers.push(Math.floor(Math.random() * 11));
    }
    text.innerText = "You picked " + guess + ". Here are the random numbers:\n";
    for (let i = 0; i < 10; i++) {
        text.innerText += numbers[i] + "\n";
    }
    if (numbers.includes(guess)) {
        text.innerText += "Right! You win 20 gold!";
        gold += 20;
        goldText.innerText = gold;
    } else {
        text.innerText += "Wrong! You lose 10 health!";
        health -= 10;
        healthText.innerText = health;
        if (health <= 0) {
            lose();
        }
    }
}