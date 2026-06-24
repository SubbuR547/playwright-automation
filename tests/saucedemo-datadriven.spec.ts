import { test } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { ProductsPage } from '../pages/ProductsPage';
import { ExcelReader } from '../utils/ExcelReader';

// Read data from Excel
const users = ExcelReader.readExcelData(
  'test-data/saucedemo-users.xlsx',
  'Users'
);

// Run test for each row
for (const user of users) {
  test(`Login - ${user.username}`, async ({ page }) => {
    test.setTimeout(60000);

    const loginPage = new LoginPage(page);
    const productsPage = new ProductsPage(page);

    await loginPage.login(user.username, user.password);

    if (user.expectedResult === 'success') {
      await productsPage.verifyPageLoaded();
      console.log(` ${user.username} login success!`);
    } else {
      await loginPage.verifyLoginError('Epic sadface');
      console.log(` ${user.username} correctly blocked!`);
    }
  });
}