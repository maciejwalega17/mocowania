const { Builder, By, Key } = require('selenium-webdriver');
require('chromedriver');
const assert = require('assert');

// const test = async () => {
// 	let driver = await new Builder().forBrowser('chrome').build();
// 	await driver.get('https://lambdatest.github.io/sample-todo-app/');
// 	await driver
// 		.findElement(By.id('sampletodotext'))
// 		.sendKeys('Learn Selenium')
// 		await driver.findElement(By.id('addbutton')).click();
// 	let todoText = await driver
// 		.findElement(By.xpath('//li[last()]'))
// 		.getText()
// 		.then((value) => value);
// 	assert.strictEqual(todoText, 'Learn Selenium');
// 	// await driver.quit();
// };

const test = async () => {
	let driver = await new Builder().forBrowser('chrome').build();
	await driver.get('http://mms251107s1/#/');
	setTimeout(async function () {
		await driver.findElement(By.xpath('//*[@id="en-US"]/img')).click();
	}, 500);
	setTimeout(async function () {
		await driver.findElement(By.xpath('//a[1]')).click();
	}, 1500);
	setTimeout(async function () {
		await driver.findElement(By.id('username')).sendKeys('engineering');
	}, 2500);
	setTimeout(async function () {
		await driver
			.findElement(By.id('password'))
			.sendKeys('engineering1', Key.RETURN);
	}, 2500);
	setTimeout(async function () {
		await driver.findElement(By.id('m1_masterdata')).click();
	}, 3500);
	setTimeout(async function () {
		await driver.findElement(By.id('action_add_fixture')).click();
	}, 3600);
};

test();

// const data = ['123456', '040', '070', '090'];

// const detal = data.slice(0, 1);
// const operations = data.slice(1);

// Dodanie fixtures

// let fixtureList = [];

// const fixtureCreate = (detNr, opNr) => {
// 	const fixtureName = `${detNr}_${opNr}`;
// 	fixtureList.push(fixtureName);
// };

// for (const op of operations) {
// 	fixtureCreate(detal, op);
// }

// for (let i = 0; i < fixtureList.length; i++) {
// 	console.log(fixtureList[i]);
// 	console.log(`Setup ${i + 1}`);
// }

// // Dodanie part master data

// console.log(detal[0]);

// for (const op of operations) {
// 	console.log(op);
// }
