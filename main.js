const { Builder, By, Key, until } = require('selenium-webdriver');
require('chromedriver');

const data = ['100001', '040', '070', '090'];
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
	// Nawiguj do kaatalogu z mocowaniami
	let driver = await new Builder().forBrowser('chrome').build();
	await driver.get('http://mms251107s1/#/');
	await driver
		.wait(until.elementLocated(By.xpath('//*[@id="en-US"]/img')), 2000)
		.click();
	await driver.wait(until.elementLocated(By.xpath('//a[1]')), 5000).click();
	await driver
		.wait(until.elementLocated(By.id('username')), 2000)
		.sendKeys('Ur');
	await driver
		.wait(until.elementLocated(By.id('password')), 2000)
		.sendKeys('password', Key.RETURN);
	await driver.wait(until.elementLocated(By.id('m1_masterdata')), 2000).click();

	//Dodaj fixtures master data
	for (let i = 0; i < fixtureList.length; i++) {
		await driver.sleep(400);
		await driver
			.wait(until.elementLocated(By.id('action_add_fixture')), 2000)
			.click();
		await driver
			.wait(
				until.elementLocated(
					By.xpath('//fieldset[1]/mms-input-group/div/input')
				)
			)
			.sendKeys(fixtureList[i]);
		await driver
			.wait(
				until.elementLocated(
					By.xpath('//fieldset[2]/mms-input-group/div/input')
				)
			)
			.sendKeys(`Setup ${i + 1}`);
		await driver
			.wait(until.elementLocated(By.id('edit_fixture_save')), 2000)
			.click();
	}

	// Nawiguj do katalogu part master data
	await driver
		.wait(until.elementLocated(By.id('m2_part-master-data')), 2000)
		.click();
	await driver.wait(until.elementLocated(By.id('action_add')), 2000).click();

	// Dodaj part master data
	await driver
		.findElement(By.xpath('//fieldset[1]/mms-input-group[1]/div/input'))
		.sendKeys(detal[0], Key.RETURN);
	await driver
		.wait(
			until.elementLocated(
				By.xpath(
					'/html/body/div/div[4]/div/mat-dialog-container/dialog-add-new-operation/mat-dialog-actions/mms-btn[1]'
				)
			),
			2000
		)
		.click();
	// Dodaj operacje
	for (let i = 0; i < operations.length; i++) {
		await driver.sleep(1000);
		await driver
			.wait(
				until.elementLocated(By.xpath("//span[text()='Add operation']")),
				2000
			)
			.click();

		await driver
			.wait(
				until.elementLocated(
					By.xpath(
						'/html/body/div/div[2]/div/mat-dialog-container/dialog-add-new-operation/mat-dialog-content/form/fieldset[1]/mms-input-group/div/input'
					)
				),
				2000
			)
			.sendKeys(operations[i]);
		await driver.sleep(500);
		await driver
			.wait(
				until.elementLocated(
					By.xpath(
						'/html/body/div/div[2]/div/mat-dialog-container/dialog-add-new-operation/mat-dialog-content/form/fieldset[3]/mms-input-group/div/input'
					)
				),
				2000
			)
			.sendKeys(`Setup ${i + 1}`, Key.RETURN);

		// Dodaj kroki do operacji i wypełnij je danymi
		await driver.sleep(500);
		// Dodaj kroki operacji
		await driver
			.wait(
				until.elementLocated(
					By.xpath(
						'/html/body/mms-app-root/datamanager-app/datamanager-part-master-data/manager-page-content/manager-page-detail/datamanager-part-details/div/div[2]/div/div[1]/mms-btn[2]'
					)
				),
				2000
			)
			.click();
		// Dodaj Fixture
		await driver
			.wait(
				until.elementLocated(
					By.xpath(
						'/html/body/div/div[2]/div/mat-dialog-container/dialog-process-plan-edit/mat-dialog-content/form[1]/div[2]/div/datamanager-edit-fms-process-plan/fieldset[1]/mms-input-group[2]/div/mms-btn'
					)
				),
				2000
			)
			.click();
		await driver
			.wait(until.elementLocated(By.id('selection-search-filter')), 2000)
			.sendKeys(fixtureList[i]);
		await driver
			.wait(until.elementLocated(By.xpath("//span[text()='Select']")), 2000)
			.click();
		// Loading
		await driver
			.wait(
				until.elementLocated(
					By.xpath(
						'/html/body/div/div[2]/div/mat-dialog-container/dialog-process-plan-edit/mat-dialog-content/form[1]/div[2]/div/datamanager-edit-fms-process-plan/fieldset[2]/div[1]/datamanager-edit-loading-step/div/div[2]/input'
					)
				),
				2000
			)
			.click();
		await driver
			.wait(
				until.elementLocated(
					By.xpath(
						'/html/body/div/div[2]/div/mat-dialog-container/dialog-process-plan-edit/mat-dialog-content/form[1]/div[2]/div/datamanager-edit-fms-process-plan/fieldset[2]/div[1]/datamanager-edit-loading-step/div/mms-input-group/div/mms-input-time/input'
					)
				),
				2000
			)
			.sendKeys('5:00');
		// Unloading
		await driver.sleep(500);
		await driver
			.wait(until.elementLocated(By.xpath('//li[3]/span')), 2000)
			.click();

		await driver
			.wait(
				until.elementLocated(
					By.xpath(
						'/html/body/div/div[2]/div/mat-dialog-container/dialog-process-plan-edit/mat-dialog-content/form[1]/div[2]/div/datamanager-edit-fms-process-plan/fieldset[2]/div[3]/datamanager-edit-unloading-step/div/div[2]/input'
					)
				),
				2000
			)
			.click();

		await driver
			.wait(
				until.elementLocated(
					By.xpath(
						'/html/body/div/div[2]/div/mat-dialog-container/dialog-process-plan-edit/mat-dialog-content/form[1]/div[2]/div/datamanager-edit-fms-process-plan/fieldset[2]/div[3]/datamanager-edit-unloading-step/div/mms-input-group/div/mms-input-time/input'
					)
				),
				2000
			)
			.sendKeys('5:00');
		// Dodaj kroki Machining
		for (let i = 0; i < 3; i++) {
			await driver.sleep(500);

			await driver
				.wait(until.elementLocated(By.xpath(`//li[${2 + i}]/span`)), 2000)
				.click();
			await driver
				.wait(
					until.elementLocated(
						By.xpath(
							`/html/body/div/div[2]/div/mat-dialog-container/dialog-process-plan-edit/mat-dialog-content/form[1]/div[2]/div/datamanager-edit-fms-process-plan/fieldset[2]/div[${
								2 + i
							}]/datamanager-edit-machining-step/div/div[2]/div[2]/div[1]/div[${mc}]/input`
						)
					),
					2000
				)
				.click();
			await driver
				.wait(
					until.elementLocated(
						By.xpath(
							'/html/body/div/div[2]/div/mat-dialog-container/dialog-process-plan-edit/mat-dialog-content/form[1]/div[2]/div/datamanager-edit-fms-process-plan/fieldset[2]/nav/ul/div/mms-btn[2]'
						)
					),
					2000
				)
				.click();
			await driver
				.wait(
					until.elementLocated(
						By.xpath(
							'/html/body/div/div[4]/div/mat-dialog-container/dialog-select-step-type/mat-dialog-content/div/button[1]'
						)
					),
					2000
				)
				.click();
		}

		// Dodanie ostatniego MC poza petla
		await driver
			.wait(until.elementLocated(By.xpath(`//li[${5}]/span`)), 2000)
			.click();
		await driver
			.wait(
				until.elementLocated(
					By.xpath(
						`/html/body/div/div[2]/div/mat-dialog-container/dialog-process-plan-edit/mat-dialog-content/form[1]/div[2]/div/datamanager-edit-fms-process-plan/fieldset[2]/div[${5}]/datamanager-edit-machining-step/div/div[2]/div[2]/div[1]/div[${mc}]/input`
					)
				),
				2000
			)
			.click();
		// Dodanie zerowan
		await driver
			.wait(until.elementLocated(By.xpath(`//li[${2}]/span`)), 2000)
			.click();
		await driver
			.wait(
				until.elementLocated(
					By.xpath(
						`/html/body/div/div[2]/div/mat-dialog-container/dialog-process-plan-edit/mat-dialog-content/form[1]/div[2]/div/datamanager-edit-fms-process-plan/fieldset[2]/div[${2}]/datamanager-edit-machining-step/div/div[2]/div[2]/div[3]/mms-btn`
					)
				),
				2000
			)
			.click();
		//funkcja selection search filter
		await driver
			.wait(until.elementLocated(By.id('selection-search-filter')), 2000)
			.sendKeys('zerowanie');
		await driver.sleep(500);
		await driver
			.wait(until.elementLocated(By.xpath("//span[text()='Select']")), 2000)
			.click();

		await driver
			.wait(until.elementLocated(By.xpath(`//li[${4}]/span`)), 2000)
			.click();
		await driver
			.wait(
				until.elementLocated(
					By.xpath(
						`/html/body/div/div[2]/div/mat-dialog-container/dialog-process-plan-edit/mat-dialog-content/form[1]/div[2]/div/datamanager-edit-fms-process-plan/fieldset[2]/div[${4}]/datamanager-edit-machining-step/div/div[2]/div[2]/div[3]/mms-btn`
					)
				),
				2000
			)
			.click();

		await driver
			.wait(until.elementLocated(By.id('selection-search-filter')), 2000)
			.sendKeys('zerowanie');
		await driver.sleep(500);
		await driver
			.wait(until.elementLocated(By.xpath("//span[text()='Select']")), 2000)
			.click();

		// Cleaning program

		await driver
			.wait(until.elementLocated(By.xpath(`//li[${5}]/span`)), 2000)
			.click();
		await driver
			.wait(
				until.elementLocated(
					By.xpath(
						`/html/body/div/div[2]/div/mat-dialog-container/dialog-process-plan-edit/mat-dialog-content/form[1]/div[2]/div/datamanager-edit-fms-process-plan/fieldset[2]/div[${5}]/datamanager-edit-machining-step/div/div[2]/div[2]/div[3]/mms-btn`
					)
				),
				2000
			)
			.click();
		//funkcja selection search filter
		await driver
			.wait(until.elementLocated(By.id('selection-search-filter')), 2000)
			.sendKeys('cleaning');
		await driver.sleep(500);
		await driver
			.wait(until.elementLocated(By.xpath("//span[text()='Select']")), 2000)
			.click();

		//nc program dodanie
		await driver
			.wait(until.elementLocated(By.xpath(`//li[${3}]/span`)), 2000)
			.click();
		await driver
			.wait(
				until.elementLocated(
					By.xpath(
						`/html/body/div/div[2]/div/mat-dialog-container/dialog-process-plan-edit/mat-dialog-content/form[1]/div[2]/div/datamanager-edit-fms-process-plan/fieldset[2]/div[${3}]/datamanager-edit-machining-step/div/div[2]/div[2]/div[3]/mms-btn`
					)
				),
				2000
			)
			.click();
		//funkcja selection search filter
		await driver
			.wait(until.elementLocated(By.id('selection-search-filter')), 2000)
			.sendKeys(detal[0] + operations[i]);
		await driver.sleep(500);
		await driver
			.wait(until.elementLocated(By.xpath("//span[text()='Select']")), 2000)
			.click();
	}

	//Usuwanie op10
	await driver.sleep(500);
	await driver
		.wait(
			until.elementLocated(
				By.xpath(
					'//*[@id="page-content"]/manager-page-detail/datamanager-part-details/div/div[2]/div/div[1]/mms-btn[1]'
				)
			),
			2000
		)
		.click();
	await driver
		.wait(
			until.elementLocated(
				By.xpath(
					'/html/body/mms-app-root/mms-alerts-overlay/div/div/mms-confirm/div[2]/mms-btn[1]'
				)
			),
			2000
		)
		.click();
};
test();
