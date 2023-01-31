const { Builder, By, Key, until } = require('selenium-webdriver');
require('chromedriver');

const data = ['100001', '040', '060'];
const mc = 1;

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

const test = async () => {
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
		idKeys('selection-search-filter', q);
		await driver.sleep(700);
		idKeys('selection-search-filter', Key.RETURN);
		// xpathClick(
		// 	'/html/body/div/div[4]/div/mat-dialog-container/dialog-select-nc-program/mat-dialog-actions/mms-btn[1]'
		// );
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
	// Idź do fixtures master data
	idClick('m1_masterdata');
	// Pętla dodawania fixtures
	for (let i = 0; i < fixtureList.length; i++) {
		xpathClick(
			'/html/body/mms-app-root/datamanager-app/datamanager-fixtures/manager-page-header/div[2]/a[1]'
		);
		await driver.sleep(500);
		xpathKeys(
			'/html/body/div/div[2]/div/mat-dialog-container/dialog-edit-fixture/mat-dialog-content/form/fieldset[1]/mms-input-group/div/input',
			fixtureList[i]
		);
		await driver.sleep(700);
		xpathKeys(
			'/html/body/div/div[2]/div/mat-dialog-container/dialog-edit-fixture/mat-dialog-content/form/fieldset[2]/mms-input-group/div/input',
			`Setup ${i + 1}`
		);
		await driver.sleep(1000);
		xpathClick(
			'/html/body/div/div[2]/div/mat-dialog-container/dialog-edit-fixture/mat-dialog-actions/mms-btn[1]'
		);
	}
	// Nawiguj do katalogu part master data
	await driver.sleep(1500);
	idClick('m2_part-master-data');
	// Dodaj part master data
	idClick('action_add');
	await driver.sleep(1000);
	xpathKeys(
		'/html/body/div/div[2]/div/mat-dialog-container/dialog-add-new-item/mat-dialog-content/form/fieldset[1]/mms-input-group[1]/div/input',
		detal[0]
	);
	xpathKeys(
		'/html/body/div/div[2]/div/mat-dialog-container/dialog-add-new-item/mat-dialog-content/form/fieldset[1]/mms-input-group[1]/div/input',
		Key.RETURN
	);
	// Uzupełnij pierwszą operację (usuwana na koniec)
	xpathKeys(
		'/html/body/div/div[4]/div/mat-dialog-container/dialog-add-new-operation/mat-dialog-content/form/fieldset[1]/mms-input-group/div/input',
		'400'
	);
	xpathClick(
		'/html/body/div/div[4]/div/mat-dialog-container/dialog-add-new-operation/mat-dialog-actions/mms-btn[1]'
	);
	await driver.sleep(500);
	// Pętla dodania operacji i uzupełnienia kroków
	for (let i = 0; i < operations.length; i++) {
		// Dodaj operacje
		await driver.sleep(1500);
		xpathClick("//span[text()='Add operation']");
		xpathKeys(
			'/html/body/div/div[2]/div/mat-dialog-container/dialog-add-new-operation/mat-dialog-content/form/fieldset[1]/mms-input-group/div/input',
			operations[i]
		);
		await driver.sleep(500);
		xpathKeys(
			'/html/body/div/div[2]/div/mat-dialog-container/dialog-add-new-operation/mat-dialog-content/form/fieldset[3]/mms-input-group/div/input',
			`Setup ${i + 1}`
		);
		await driver.sleep(500);
		xpathKeys(
			'/html/body/div/div[2]/div/mat-dialog-container/dialog-add-new-operation/mat-dialog-content/form/fieldset[3]/mms-input-group/div/input',
			Key.RETURN
		);
		// Dodaj kroki do operacji i wypełnij je danymi
		// Dodaj krok operacji
		await driver.sleep(1000);
		xpathClick(
			`/html/body/mms-app-root/datamanager-app/datamanager-part-master-data/manager-page-content/manager-page-detail/datamanager-part-details/div/div[${
				i + 2
			}]/div/div[1]/mms-btn[2]`
		);
		// Dodaj Fixture
		await driver.sleep(1000);
		xpathClick(
			'/html/body/div/div[2]/div/mat-dialog-container/dialog-process-plan-edit/mat-dialog-content/form[1]/div[2]/div/datamanager-edit-fms-process-plan/fieldset[1]/mms-input-group[2]/div/mms-btn'
		);
		selectSearchFilter(fixtureList[i]);
		await driver.sleep(1000);
		// Loading
		xpathClick(
			'/html/body/div/div[2]/div/mat-dialog-container/dialog-process-plan-edit/mat-dialog-content/form[1]/div[2]/div/datamanager-edit-fms-process-plan/fieldset[2]/div[1]/datamanager-edit-loading-step/div/div[2]/input'
		);
		xpathKeys(
			'/html/body/div/div[2]/div/mat-dialog-container/dialog-process-plan-edit/mat-dialog-content/form[1]/div[2]/div/datamanager-edit-fms-process-plan/fieldset[2]/div[1]/datamanager-edit-loading-step/div/mms-input-group/div/mms-input-time/input',
			'5:00'
		);
		await driver.sleep(1000);
		// Unloading
		xpathClick('//li[3]/span');
		xpathClick(
			'/html/body/div/div[2]/div/mat-dialog-container/dialog-process-plan-edit/mat-dialog-content/form[1]/div[2]/div/datamanager-edit-fms-process-plan/fieldset[2]/div[3]/datamanager-edit-unloading-step/div/div[2]/input'
		);
		xpathKeys(
			'/html/body/div/div[2]/div/mat-dialog-container/dialog-process-plan-edit/mat-dialog-content/form[1]/div[2]/div/datamanager-edit-fms-process-plan/fieldset[2]/div[3]/datamanager-edit-unloading-step/div/mms-input-group/div/mms-input-time/input',
			'5:00'
		);
		await driver.sleep(1000);
		// Pętla dodaj kroki Machining i zaznacz maszynę
		for (let i = 0; i < 3; i++) {
			await driver.sleep(1000);
			xpathClick(`//li[${2 + i}]/span`);
			xpathClick(
				`/html/body/div/div[2]/div/mat-dialog-container/dialog-process-plan-edit/mat-dialog-content/form[1]/div[2]/div/datamanager-edit-fms-process-plan/fieldset[2]/div[${
					2 + i
				}]/datamanager-edit-machining-step/div/div[2]/div[2]/div[1]/div[${mc}]/input`
			);
			xpathClick(
				'/html/body/div/div[2]/div/mat-dialog-container/dialog-process-plan-edit/mat-dialog-content/form[1]/div[2]/div/datamanager-edit-fms-process-plan/fieldset[2]/nav/ul/div/mms-btn[2]'
			);
			xpathClick(
				'/html/body/div/div[4]/div/mat-dialog-container/dialog-select-step-type/mat-dialog-content/div/button[1]'
			);
		}
		await driver.sleep(700);
		// Dodanie ostatniego MC poza petla
		xpathClick(`//li[${5}]/span`);
		xpathClick(
			`/html/body/div/div[2]/div/mat-dialog-container/dialog-process-plan-edit/mat-dialog-content/form[1]/div[2]/div/datamanager-edit-fms-process-plan/fieldset[2]/div[${5}]/datamanager-edit-machining-step/div/div[2]/div[2]/div[1]/div[${mc}]/input`
		);
		// DODWANIE PRAGRAMÓW ZEROWANIA
		// Wybierz krok, kliknij dodaj program, wyszukaj i dodaj program x2
		xpathClick(`//li[${2}]/span`);
		xpathClick(
			`/html/body/div/div[2]/div/mat-dialog-container/dialog-process-plan-edit/mat-dialog-content/form[1]/div[2]/div/datamanager-edit-fms-process-plan/fieldset[2]/div[${2}]/datamanager-edit-machining-step/div/div[2]/div[2]/div[3]/mms-btn`
		);
		selectSearchFilter('zerowanie');
		await driver.sleep(1000);
		xpathClick(`//li[${4}]/span`);
		xpathClick(
			`/html/body/div/div[2]/div/mat-dialog-container/dialog-process-plan-edit/mat-dialog-content/form[1]/div[2]/div/datamanager-edit-fms-process-plan/fieldset[2]/div[${4}]/datamanager-edit-machining-step/div/div[2]/div[2]/div[3]/mms-btn`
		);
		selectSearchFilter('zerowanie');
		await driver.sleep(1000);
		// DODWANIE PROGRAMU CZYSZCZENIA
		xpathClick(`//li[${5}]/span`);
		xpathClick(
			`/html/body/div/div[2]/div/mat-dialog-container/dialog-process-plan-edit/mat-dialog-content/form[1]/div[2]/div/datamanager-edit-fms-process-plan/fieldset[2]/div[${5}]/datamanager-edit-machining-step/div/div[2]/div[2]/div[3]/mms-btn`
		);
		selectSearchFilter('cleaning');
		await driver.sleep(1000);
		// DODWANIE PROGRAMU NC
		xpathClick(`//li[${3}]/span`);
		xpathClick(
			`/html/body/div/div[2]/div/mat-dialog-container/dialog-process-plan-edit/mat-dialog-content/form[1]/div[2]/div/datamanager-edit-fms-process-plan/fieldset[2]/div[${3}]/datamanager-edit-machining-step/div/div[2]/div[2]/div[3]/mms-btn`
		);
		await driver.sleep(1000);
		selectSearchFilter(detal[0] + operations[i]);
		// Zapisz kroki do operacji
		xpathClick(
			`/html/body/div/div[2]/div/mat-dialog-container/dialog-process-plan-edit/mat-dialog-actions/mms-btn[3]`
		);
	}

	// Usuwanie operacji dodanej jako pierwsza
	xpathClick(
		`//*[@id="page-content"]/manager-page-detail/datamanager-part-details/div/div[${
			operations.length + 2
		}]/div/div[1]/mms-btn[1]`
	);
	xpathClick(
		'/html/body/mms-app-root/mms-alerts-overlay/div/div/mms-confirm/div[2]/mms-btn[1]'
	);
};
test();
