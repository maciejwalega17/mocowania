const { Builder, By, Key, until } = require('selenium-webdriver');
require('chromedriver');

const data = ['5042057', '040', '060'];
const mcInit = 3;
const mcFinal = 5;

const detal = data.slice(0, 1);
const operations = data.slice(1);

const switchMc = async () => {
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
		const query = `${q}`;
		idKeys('search-filter', query);
		await driver.sleep(1000);
	};

	// Wejdz na strone mms i zaloguj
	await driver.get('http://mms251107s1/#/');
	xpathClick(
		'/html/body/mms-app-root/mms-language-selection/div[2]/div/div/a[3]'
	);
	xpathClick(
		'/html/body/mms-app-root/mms-home/div[2]/mms-menu/div/div[1]/a[1]'
	);
	idKeys('username', 'Ur');
	idKeys('password', 'password');
	await driver.sleep(2000);
	idKeys('password', Key.RETURN);

	// Nawiguj do katalogu part master data
	await driver.sleep(1000);
	idClick('m1_masterdata');
	await driver.sleep(1000);
	idClick('m2_part-master-data');
	await driver.sleep(1000);

	// Wyszukaj part master data
	SearchFilter(detal);
	await driver.sleep(1000);

	// Pętla wejścia i edycji operacji
	for (let i = 0; i < operations.length; i++) {
		// Wejdz w edycje kroków operacji
		await driver.sleep(1000);
		xpathClick(
			`/html/body/mms-app-root/datamanager-app/datamanager-part-master-data/manager-page-content/manager-page-detail/datamanager-part-details/div/div[${
				2 + i
			}]/div/div[3]/div/datamanager-fms-process-plan/div[2]/div[2]/mms-btn[1]`
		);

		await driver.sleep(700);

		// Pętla kliknij w kroki Machining, odznacz maszynę i zaznacz maszynę
		for (let i = 0; i < 4; i++) {
			await driver.sleep(400);
			xpathClick(`//li[${2 + i}]/span`);
			await driver.sleep(400);
			xpathClick(
				`/html/body/div/div[2]/div/mat-dialog-container/dialog-process-plan-edit/mat-dialog-content/form[1]/div[2]/div/datamanager-edit-fms-process-plan/fieldset[2]/div[${
					2 + i
				}]/datamanager-edit-machining-step/div/div[2]/div[2]/div[1]/div[${mcInit}]/input`
			);
			xpathClick(
				`/html/body/div/div[2]/div/mat-dialog-container/dialog-process-plan-edit/mat-dialog-content/form[1]/div[2]/div/datamanager-edit-fms-process-plan/fieldset[2]/div[${
					2 + i
				}]/datamanager-edit-machining-step/div/div[2]/div[2]/div[1]/div[${mcFinal}]/input`
			);
		}

		// Zapisz kroki do operacji
		await driver.sleep(400);
		xpathClick(
			`/html/body/div/div[2]/div/mat-dialog-container/dialog-process-plan-edit/mat-dialog-actions/mms-btn[3]`
		);
	}
	await driver.sleep(2000);
	await driver.quit();
};
switchMc();
