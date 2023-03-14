const { Builder, By, Key, until } = require('selenium-webdriver');
require('chromedriver');

const data = '5101138080';
// mm/dd/yyyy
const time = ['02/01/2023', '02/28/2023'];

const scrap = async () => {
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
	const SearchFilter = async (q) => {
		idKeys('search-filter', q);
	};

	const clearInput = async (xp, t) => {
		for (let i = 0; i < t; i++) {
			xpathKeys(xp, Key.BACK_SPACE);
		}
	};

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

	// Nawiguj do katalogu NC program statistics
	await driver.sleep(1000);
	idClick('m1_ncprograms');
	await driver.sleep(1000);
	idClick('m2_nc-statistics');
	await driver.sleep(1000);

	// Filtruj zakres
	xpathClick(
		'/html/body/mms-app-root/datamanager-app/datamanager-nc-statistics/manager-page-header/div[5]/mms-btn'
	);
	await driver.sleep(800);
	const dateFrom =
		'/html/body/div/div[2]/div/mat-dialog-container/dialog-edit-nc-statistic-dates/mat-dialog-content/fieldset/mms-input-group[1]/div/input';
	const dateTo =
		'/html/body/div/div[2]/div/mat-dialog-container/dialog-edit-nc-statistic-dates/mat-dialog-content/fieldset/mms-input-group[2]/div/input';
	clearInput(dateFrom, 10);
	await driver.sleep(800);
	xpathKeys(dateFrom, time[0]);
	await driver.sleep(800);
	clearInput(dateTo, 10);
	await driver.sleep(800);
	xpathKeys(dateTo, time[1]);
	await driver.sleep(800);
	xpathClick(
		'/html/body/div/div[2]/div/mat-dialog-container/dialog-edit-nc-statistic-dates/mat-dialog-actions/mms-btn[1]'
	);
	await driver.sleep(1200);
	// Wyszukaj program
	SearchFilter(data);
	await driver.sleep(2500);
	SearchFilter(Key.BACK_SPACE);
	await driver.sleep(2500);
	SearchFilter('0');
	await driver.sleep(10000);

	// Pobierz tabele
	const thead = await driver
		.wait(
			until.elementLocated(
				By.xpath(
					'/html/body/mms-app-root/datamanager-app/datamanager-nc-statistics/manager-page-content-vertical/manager-page-detail-vertical/datamanager-nc-statistics-details/div/manager-detail-table/thead'
				)
			)
		)
		.getText();

	const tbody = await driver
		.wait(
			until.elementLocated(
				By.xpath(
					'/html/body/mms-app-root/datamanager-app/datamanager-nc-statistics/manager-page-content-vertical/manager-page-detail-vertical/datamanager-nc-statistics-details/div/manager-detail-table/tbody'
				)
			)
		)
		.getText();

	await driver.sleep(5000);
	console.log(tbody);
	// console.log(tbody);
	await driver.quit();
};

scrap();
