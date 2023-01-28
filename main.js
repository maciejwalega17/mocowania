const data = ['123456', '040', '070', '090'];

const detal = data.slice(0, 1);
const operations = data.slice(1);

// Dodanie fixtures

let fixtureList = [];

const fixtureCreate = (detNr, opNr) => {
	const fixtureName = `${detNr}_${opNr}`;
	fixtureList.push(fixtureName);
};

for (const op of operations) {
	fixtureCreate(detal, op);
}

for (let i = 0; i < fixtureList.length; i++) {
	console.log(fixtureList[i]);
	console.log(`Setup ${i + 1}`);
}

// Dodanie part master data

console.log(detal[0]);

for (const op of operations) {
	console.log(op);
}
