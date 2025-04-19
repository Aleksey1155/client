import { test, expect } from "@playwright/test";


test('Screenshot Сторінки Логін', async ({ page }) => {
    await page.goto('http://localhost:5173/login');
    await page.screenshot({ path: `screenshots/login-${Date.now()}.png` });
  });

  // test('Відкриття сторінки чату з моканим токеном, користувачем і сторіз', async ({ page }) => {
  //   // 🔹 Мокаємо відповідь /me
  //   await page.route('**/me', async route => {
  //     await route.fulfill({
  //       status: 200,
  //       contentType: 'application/json',
  //       body: JSON.stringify({
  //         id: 1,
  //         email: 'euromaster.dn.ua@gmail.com',
  //         role_name: 'admin',
  //         name: 'admin',
  //         img: "/tests/img/users/admin.jpg"
  //       }),
  //     });
  //   });
  
  //   // 🔹 Мокаємо список сторіз
  //   await page.route('**/stories', async route => {
  //     await route.fulfill({
  //       status: 200,
  //       contentType: 'application/json',
  //       body: JSON.stringify([
  //         {
  //           id: 1,
  //           video: "/tests/img/stories/video_1.jpg",
  //           name: "Admin"
  //         },
  //         {
  //           id: 2,
  //           video: "/tests/img/stories/video_2.jpg",
  //           name: "User2"
  //         },
  //         {
  //           id: 3,
  //           video: "/tests/img/stories/video_3.jpg",
  //           name: "User3"
  //         },
  //         {
  //           id: 4,
  //           video: "/tests/img/stories/video_4.jpg",
  //           name: "User4"
  //         }
  //       ])
  //     });
  //   });
  
  //   // 🔹 Мокаємо токен
  //   const fakeToken = 'mocked.token.value';
  
  //   await page.goto('http://localhost:5173/admin');
  
  //   await page.addInitScript((token) => {
  //     localStorage.setItem('token', token);
  //   }, fakeToken);
  
  //   await page.goto('http://localhost:5173/admin/social');
  
  //   // 🔹 Дай час завантажитись компонентам
  //   await page.waitForTimeout(1000);
  
  //   // 🔹 Скрінимо
  //   await page.screenshot({ path: `screenshots/social-stories-${Date.now()}.png` });
  
  //   // 🔹 Перевіряємо, що чат завантажився
  //   await expect(page.locator('.chatTextArea')).toBeVisible({ timeout: 5000 });
  
  //   // 🔹 Перевіряємо, що stories видимі
  //   await expect(page.locator('.stories')).toBeVisible();
  //   await expect(page.locator('.story')).toHaveCount(3); // бо видимі лише 3
  // });
  
// test("Успішний логін користувача", async ({ page }) => {
//   await page.goto("http://localhost:5173/login");

//   // Вводимо коректний логін і пароль
//   await page.fill('input[name="email"]', "kondycka@gmail.com");
//   await page.fill('input[name="password"]', "12345");

//   // Натискаємо кнопку "Login"
//   await page.click(".login-button");

//   // Чекаємо, щоб з'явився токен у localStorage
//   await page.waitForFunction(() => localStorage.getItem("token") !== null);

//   // Переконуємося, що користувача перенаправлено
//   await expect(page).toHaveURL(/\/$/);

//   // Додаємо затримку на кілька секунд, щоб усе встигло завантажитися
//   await page.waitForTimeout(2000); // 2000 мс (2 секунди)

//   // Скіншот вікна в хром
//   await page.screenshot({ path: `screenshots/login-${Date.now()}.png` });
// });

// test('Відкриття сторінки чату зі справжнім токеном', async ({ page }) => {
//   const realToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJldXJvbWFzdGVyLmRuLnVhQGdtYWlsLmNvbSIsInJvbGVfbmFtZSI6ImFkbWluIiwiaWF0IjoxNzQ1MDUzMjUyLCJleHAiOjE3NDUxMzk2NTJ9.iy17Y9oRHAGmzBA9vo3ctj_3B5owlb5yEOjC8ynWhlU'; // <-- Встав сюди дійсний токен

//   await page.goto('http://localhost:5173/admin');

//   await page.addInitScript((token) => {
//     localStorage.setItem('token', token);
//   }, realToken);

//   await page.goto('http://localhost:5173/admin/social');

//   await page.waitForTimeout(2000);

//   await page.screenshot({ path: `screenshots/social-${Date.now()}.png` });

//   await expect(page.locator('.chatTextArea')).toBeVisible({ timeout: 10000 });
// });



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
