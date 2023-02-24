const { Builder, By, Key, until } = require('selenium-webdriver');
const EventEmitter = require('events');
require('chromedriver');

const startPoint = 'T630';

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
			console.log(`Nie mogę zapisać`);
			xpathClick(
				'/html/body/div/div[2]/div/mat-dialog-container/dialog-edit-tool-base-data/div/mat-dialog-actions/mms-btn[3]'
			);
			await driver.sleep(300);
			goDownLoop(1);
			await driver.sleep(300);
		} else if (e.name == 'staleElementReferenceError') {
			(e) => console.log('No confirmation needed:', e.name);
		} else {
			(e) => console.log('NEW Error caught:', e.name);
		}
	};
	const eventEmitter = new EventEmitter({ captureRejections: true });
	eventEmitter.on('xpClick', xpathClick);
	eventEmitter.on('error', (e) => errorHandler(e));

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
	// Zacznij od miejsca w liście
	startFromTool(startPoint);
	await driver.sleep(1000);

	// Pętla edytuj dane i idz w dół
	for (let i = 0; i < 100; i++) {
		// Wejdz w edycje kroków operacji
		await driver.sleep(800);
		xpathClick(
			`/html/body/mms-app-root/datamanager-app/datamanager-tool-base-data/manager-page-header/div[2]/a[2]`
		);
		await driver.sleep(1000);
		// Potwierdż wejscie jeżeli sa isntancje narzędzia LUB nic nei rób jeśli ich nie ma (staleElementReferenceError)
		eventEmitter.emit(
			'xpClick',
			'/html/body/mms-app-root/mms-alerts-overlay/div/div/mms-confirm/div[2]/mms-btn[1]'
		);
		// Skasuj poprzednią wartość, zapisz dla którego narzędzia i wrpowadź nową wartość
		xpathKeys(
			"//*[contains(text(),'Tool breakage (TC_TPC1)')]/../div/input",
			Key.BACK_SPACE
		);
		await driver.sleep(400);
		let toolText = await driver
			.wait(
				until.elementLocated(By.xpath("//*[contains(text(),'Tool ID')]/../div"))
			)
			.getText();
		xpathKeys(
			"//*[contains(text(),'Tool breakage (TC_TPC1)')]/../div/input",
			'3'
		);
		await driver.sleep(1000);
		// Zapisz kroki do operacji LUB anuluj jeśli nie możesz zapisać (ElementClickInterceptedError) i powiedz co na którym narzędziu skończyłeś
		eventEmitter.emit(
			'xpClick',
			'/html/body/div/div[2]/div/mat-dialog-container/dialog-edit-tool-base-data/div/mat-dialog-actions/mms-btn[2]'
		);
		console.log(`Na przejściu ${i + 1} zrobiłem ${toolText}`);
		await driver.sleep(500);
		goDownLoop(1);
	}
	await driver.sleep(2000);
	await driver.quit();
};
switchTool();
