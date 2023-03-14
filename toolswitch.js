const { Builder, By, Key, until } = require('selenium-webdriver');
const EventEmitter = require('events');
require('chromedriver');

// const startPoint = 'W45N';
// let howManyTools = 20;

const toolsList = [
	['FAZ08', '5:00:00'],
	['FAZ10', '6:00:00'],
	['FAZ06', '5:00:00'],
	['FAZ12', '6:00:00'],
	['FW0411N', '8:00:00'],
];

let undone = [];

const switchTool = async () => {
	// Stwórz driver
	let driver = await new Builder().forBrowser('chrome').build();

	// Funkcje
	const xpathClick = async (xp) => {
		await driver.wait(until.elementLocated(By.xpath(xp))).click();
	};
	const xpathKeys = async (xp, k) => {
		await driver.wait(until.elementLocated(By.xpath(xp))).sendKeys(k);
	};
	const idClick = async (i) => {
		await driver.wait(until.elementLocated(By.id(i))).click();
	};
	const idKeys = async (i, k) => {
		await driver.wait(until.elementLocated(By.id(i))).sendKeys(k);
	};
	const selectSearchFilter = async (q) => {
		idKeys('search-filter', q);
		await driver.sleep(1000);
		idKeys('search-filter', Key.RETURN);
	};
	const startFromTool = async (tName) => {
		await driver.sleep(300);
		selectSearchFilter(tName);
		await driver.sleep(500);
		xpathClick('//tbody/tr');
		await driver.sleep(500);
		for (let i = 0; i < tName.length; i++) {
			idKeys('search-filter', Key.BACK_SPACE);
		}
	};
	const goDownLoop = async (t) => {
		for (let i = 0; i < t; i++) {
			xpathKeys('/html/body', Key.ARROW_DOWN);
			await driver.sleep(300);
		}
	};
	const errorHandler = async (e) => {
		if (e.name == 'ElementClickInterceptedError') {
			xpathClick(
				'/html/body/div/div[2]/div/mat-dialog-container/dialog-edit-tool-base-data/div/mat-dialog-actions/mms-btn[3]'
			);
			let toolText = await driver
				.wait(
					until.elementLocated(
						By.xpath("//*[contains(text(),'Tool ID')]/../div")
					)
				)
				.getText();
			undone.push(toolText);
			console.log(`Obecna tablica to: ${undone}`);
			await driver.sleep(600);
		} else if (e.name == 'staleElementReferenceError') {
			(e) => console.log('No confirmation needed:', e.name);
		} else {
			(e) => console.log('NEW Error caught:', e.name);
		}
	};

	const eventEmitter = new EventEmitter({ captureRejections: true });
	eventEmitter.on('xpClick', (data) => xpathClick(data));
	eventEmitter.on('error', (e) => errorHandler(e));
	//
	//
	//
	//
	//
	//
	//
	// Wejdz na strone mms i zaloguj
	await driver.get('http://mms251107s1/#/');
	await driver.manage().window().maximize();
	xpathClick(
		'/html/body/mms-app-root/mms-language-selection/div[2]/div/div/a[3]'
	);
	xpathClick(
		'/html/body/mms-app-root/mms-home/div[2]/mms-menu/div/div[1]/a[1]'
	);

	idKeys('username', 'Ur');
	idKeys('password', 'password');
	await driver.sleep(3000);
	idKeys('password', Key.RETURN);

	// Nawiguj do katalogu tool master data
	await driver.sleep(1000);
	idClick('m1_tools');
	await driver.sleep(1000);
	idClick('m2_tool-base-data');
	await driver.sleep(1000);
	//// Zacznij od miejsca w liście
	// startFromTool(startPoint);
	// await driver.sleep(1000);

	// Pętla edytuj dane i idz w dół
	// for (let i = 0; i < howManyTools; i++) {
	for (let i = 0; i < toolsList.length; i++) {
		let doToolName = toolsList[i][0];
		let doToolTime = toolsList[i][1];

		startFromTool(doToolName);
		// Wejdz w edycje kroków operacji
		// await driver.sleep(600);
		// goDownLoop(1);
		await driver.sleep(1500);
		eventEmitter.emit(
			'xpClick',
			'/html/body/mms-app-root/datamanager-app/datamanager-tool-base-data/manager-page-header/div[2]/a[2]'
		);
		await driver.sleep(1000);
		// Potwierdż wejscie jeżeli sa isntancje narzędzia LUB nic nie rób jeśli ich nie ma (staleElementReferenceError)
		eventEmitter.emit(
			'xpClick',
			'/html/body/mms-app-root/mms-alerts-overlay/div/div/mms-confirm/div[2]/mms-btn[1]'
		);
		await driver.sleep(1000);
		// Skasuj poprzednią wartość i wprowadź nową wartość
		for (let i = 0; i < 9; i++) {
			xpathKeys(
				"//*[contains(text(),'Nominal life')]/../div/mms-input-time/input",
				Key.BACK_SPACE
			);
		}
		for (let i = 0; i < 9; i++) {
			xpathKeys(
				"//*[contains(text(),'Prewarning limit')]/../div/mms-input-time/input",
				Key.BACK_SPACE
			);
		}
		await driver.sleep(1000);
		xpathKeys(
			"//*[contains(text(),'Nominal life')]/../div/mms-input-time/input",
			doToolTime
		);

		await driver.sleep(1000);
		xpathKeys(
			"//*[contains(text(),'Prewarning limit')]/../div/mms-input-time/input",
			'00:05:00'
		);
		await driver.sleep(1000);
		// Zapisz kroki do operacji LUB anuluj jeśli nie możesz zapisać (ElementClickInterceptedError) i powiedz co na którym narzędziu skończyłeś
		eventEmitter.emit(
			'xpClick',
			'/html/body/div/div[2]/div/mat-dialog-container/dialog-edit-tool-base-data/div/mat-dialog-actions/mms-btn[2]'
		);

		await driver.sleep(1000);
	}
	console.log(undone);
	await driver.sleep(1000);
	await driver.quit();
};

switchTool();
