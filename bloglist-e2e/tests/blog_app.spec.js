const { test, expect, beforeEach, describe } = require("@playwright/test");

describe("Blog app", () => {
  beforeEach(async ({ page, request }) => {
    await request.post("/api/testing/reset");
    await request.post("/api/users", {
      data: {
        name: "Matti Luukkainen",
        username: "mluukkai",
        password: "salainen",
      },
    });
    await request.post("/api/users", {
      data: {
        name: "Fake User",
        username: "fakeuser",
        password: "password",
      },
    });

    await page.goto("/");
  });

  test("Login form is shown", async ({ page }) => {
    const locator = await page.getByText("Log in to application");
    const username = await page.getByRole("textbox").first();
    const password = await page.getByRole("textbox").last();
    const login = await page.getByRole("button", { name: "login" });

    await expect(locator).toBeVisible();
    await expect(username).toBeVisible();
    await expect(password).toBeVisible();
    await expect(login).toBeVisible();
  });

  describe("Login", () => {
    test("succeeds with correct credentials", async ({ page }) => {
      await page.getByRole("textbox").first().fill("mluukkai");
      await page.getByRole("textbox").last().fill("salainen");
      await page.getByRole("button", { name: "login" }).click();
      await expect(page.getByText("Matti Luukkainen logged in")).toBeVisible();
    });

    test("fails with wrong credentials", async ({ page }) => {
      await page.getByRole("textbox").first().fill("mluukkai");
      await page.getByRole("textbox").last().fill("wrong");
      await page.getByRole("button", { name: "login" }).click();
      await expect(page.getByText("wrong username or password")).toBeVisible();
    });
  });

  describe("When logged in", () => {
    beforeEach(async ({ page }) => {
      await page.getByRole("textbox").first().fill("mluukkai");
      await page.getByRole("textbox").last().fill("salainen");
      await page.getByRole("button", { name: "login" }).click();
    });

    test("a new blog can be created", async ({ page }) => {
      await page.getByRole("button", { name: "new blog" }).click();
      const textboxes = await page.getByRole("textbox").all();
      await textboxes[0].fill("Example Title");
      await textboxes[1].fill("Example Author");
      await textboxes[2].fill("http://example.com");
      await page.getByRole("button", { name: "save" }).click();

      await expect(
        page.getByText("Example Title Example Author")
      ).toBeVisible();
    });
  });
});
