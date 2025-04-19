import { test, expect } from "@playwright/test";


test('Screenshot Сторінки Логін', async ({ page }) => {
    await page.goto('http://localhost:5173/login');
    await page.screenshot({ path: `screenshots/login-${Date.now()}.png` });
  });

test("Успішний логін користувача", async ({ page }) => {
  await page.goto("http://localhost:5173/login");

  // Вводимо коректний логін і пароль
  await page.fill('input[name="email"]', "kondycka@gmail.com");
  await page.fill('input[name="password"]', "12345");

  // Натискаємо кнопку "Login"
  await page.click(".login-button");

  // Чекаємо, щоб з'явився токен у localStorage
  await page.waitForFunction(() => localStorage.getItem("token") !== null);

  // Переконуємося, що користувача перенаправлено
  await expect(page).toHaveURL(/\/$/);

  // Додаємо затримку на кілька секунд, щоб усе встигло завантажитися
  await page.waitForTimeout(2000); // 2000 мс (2 секунди)

  // Скіншот вікна в хром
  await page.screenshot({ path: `screenshots/login-${Date.now()}.png` });
});



// test('Авторизація та додавання повідомлення через автоматичний вхід', async ({ page }) => {
//   // Переходимо на сторінку логіну
//   await page.goto('http://localhost:5173/login');

//   // Вводимо коректний логін і пароль
//   await page.fill('input[name="email"]', 'kondycka@gmail.com');
//   await page.fill('input[name="password"]', '12345');

//   // Натискаємо кнопку "Login"
//   await page.click('.login-button');

//   // Чекаємо, щоб з'явився токен у localStorage
//   await page.waitForFunction(() => localStorage.getItem('token') !== null);

//   // Додатково, можна отримати токен для використання в наступних кроках, якщо треба:
//   const token = await page.evaluate(() => localStorage.getItem('token'));

//   // Перевіряємо, що токен існує
//   expect(token).not.toBeNull();

//   // Тепер переходимо на сторінку чату
//   await page.goto('http://localhost:5173/social');

//   // Додаємо затримку, щоб сторінка встигла завантажитися
//   await page.waitForTimeout(2000); // 2 секунди

//   // Вибираємо поля для введення повідомлення та кнопки відправлення
//   const chatTextArea = page.locator('.chatTextArea');
//   const sendButton = page.locator('.send-message');

//   // Заповнюємо поле для повідомлення і відправляємо
//   await chatTextArea.fill('Перевірка тесту');
//   await sendButton.click();

//   // Перевіряємо, чи нове повідомлення з'явилося
//   const lastMessage = page.locator('.blockMessage').last();
//   await expect(lastMessage).toContainText('Перевірка тесту');
//   await expect(lastMessage.locator('.userName')).toHaveText('Кондицька Ш. Ю.');
  
//   // Перевіряємо, чи є кнопка "edit"
//   const editButton = lastMessage.locator('button.btn-edit');
//   await expect(editButton).toBeVisible();
//   // Перевіряємо, чи є кнопка "delete"
//   const deleteButton = lastMessage.locator('button.btn-delete');
//   await expect(deleteButton).toBeVisible();
  
//   // Додаємо затримку на кілька секунд, щоб усе встигло завантажитися
//   await page.waitForTimeout(2000); // 2000 мс (2 секунди)

//   // Скіншот вікна в хром
//   await page.screenshot({ path: `screenshots/login-${Date.now()}.png` });
// });

// test("Перевірка відмови у доступі без токена", async ({ request }) => {
//   const response = await request.get("http://localhost:3001/me");

//   expect(response.status()).toBe(401); // Повинно бути 401 Unauthorized
// });
