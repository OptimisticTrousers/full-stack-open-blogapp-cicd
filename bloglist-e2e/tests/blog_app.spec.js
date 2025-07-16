const { test, expect, beforeEach, describe } = require("@playwright/test");

describe("Blog app", () => {
  beforeEach(async ({ page, request }) => {
    await request.post("http://localhost:3003/api/testing/reset");
    await request.post("http://localhost:3003/api/users", {
      data: {
        name: "Matti Luukkainen",
        username: "mluukkai",
        password: "salainen",
      },
    });
    await request.post("http://localhost:3003/api/users", {
      data: {
        name: "Fake User",
        username: "fakeuser",
        password: "password",
      },
    });

    await page.goto("http://localhost:5173");
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

    test("blogs sorted in ascending order by likes", async ({ page }) => {
      await page.getByRole("button", { name: "new blog" }).click();
      const textboxes1 = await page.getByRole("textbox").all();
      await textboxes1[0].fill("Example Title 1");
      await textboxes1[1].fill("Example Author 1");
      await textboxes1[2].fill("http://example1.com");
      await page.getByRole("button", { name: "save" }).click();

      const blogText1 = await page.getByText(
        "Example Title 1 Example Author 1"
      );
      const blogElement1 = await blogText1.locator("..");
      await blogElement1.getByRole("button", { name: "view" }).click();
      const likeButton1 = await blogElement1.getByRole("button", {
        name: "like",
      });
      await likeButton1.click();
      await blogElement1.getByText("likes 1").waitFor();
      await likeButton1.click();
      await blogElement1.getByText("likes 2").waitFor();
      await likeButton1.click();
      await blogElement1.getByText("likes 3").waitFor();
      await likeButton1.click();
      await blogElement1.getByText("likes 4").waitFor();
      await likeButton1.click();
      await blogElement1.getByText("likes 5").waitFor();

      await page.getByRole("button", { name: "new blog" }).click();
      const textboxes2 = await page.getByRole("textbox").all();
      await textboxes2[0].fill("Example Title 2");
      await textboxes2[1].fill("Example Author 2");
      await textboxes2[2].fill("http://example2.com");
      await page.getByRole("button", { name: "save" }).click();

      const blogText2 = await page.getByText(
        "Example Title 2 Example Author 2"
      );
      const blogElement2 = await blogText2.locator("..");
      await blogElement2.getByRole("button", { name: "view" }).last().click();
      const likeButton2 = await blogElement2
        .getByRole("button", {
          name: "like",
        })
        .last();
      await likeButton2.click();
      await blogElement2.getByText("likes 1").waitFor();

      await page.getByRole("button", { name: "new blog" }).click();
      const textboxes3 = await page.getByRole("textbox").all();
      await textboxes3[0].fill("Example Title 3");
      await textboxes3[1].fill("Example Author 3");
      await textboxes3[2].fill("http://example2.com");
      await page.getByRole("button", { name: "save" }).click();

      const blogText3 = await page.getByText(
        "Example Title 3 Example Author 3"
      );
      const blogElement3 = await blogText3.locator("..");
      await blogElement3.getByRole("button", { name: "view" }).last().click();
      const likeButton3 = await blogElement3
        .getByRole("button", {
          name: "like",
        })
        .last();
      await likeButton3.click();
      await blogElement3.getByText("likes 1").waitFor();
      await likeButton3.click();
      await blogElement3.getByText("likes 2").waitFor();
      await likeButton3.click();
      await blogElement3.getByText("likes 3").waitFor();

      await page.reload()

      const blog1 = await page
        .getByRole("button", { name: "view" })
        .nth(0)
        .locator("..");
      await expect(
        blog1.getByText("Example Title 1 Example Author 1")
      ).toBeVisible();
      const blog2 = await page
        .getByRole("button", { name: "view" })
        .nth(1)
        .locator("..");
      await expect(
        blog2.getByText("Example Title 3 Example Author 3")
      ).toBeVisible();
      const blog3 = await page
        .getByRole("button", { name: "view" })
        .nth(2)
        .locator("..");
      await expect(
        blog3.getByText("Example Title 2 Example Author 2")
      ).toBeVisible();
    });

    describe("and a blog exists", () => {
      beforeEach(async ({ page }) => {
        await page.getByRole("button", { name: "new blog" }).click();
        const textboxes = await page.getByRole("textbox").all();
        await textboxes[0].fill("Example Title");
        await textboxes[1].fill("Example Author");
        await textboxes[2].fill("http://example.com");
        await page.getByRole("button", { name: "save" }).click();
      });

      test("it cannot be deleted if the user is not the one who created the blog", async ({
        page,
      }) => {
        await page.getByRole("button", { name: "log out" }).click();

        await page.getByRole("textbox").first().fill("fakeuser");
        await page.getByRole("textbox").last().fill("password");
        await page.getByRole("button", { name: "login" }).click();

        const blogText = await page.getByText("Example Title Example Author");
        const blogElement = await blogText.locator("..");

        await blogElement.getByRole("button", { name: "view" }).click();
        await expect(
          blogElement.getByRole("button", { name: "remove" })
        ).not.toBeVisible();
      });

      test("it can be liked", async ({ page }) => {
        const blogText = await page.getByText("Example Title Example Author");
        const blogElement = await blogText.locator("..");

        await blogElement.getByRole("button", { name: "view" }).click();
        const blogLikes = await page.getByText("likes 0");
        const likeButton = await blogLikes.locator("..");
        await likeButton.getByRole("button", { name: "like" }).click();

        await expect(page.getByText("likes 1")).toBeVisible();
      });

      test("it can be deleted", async ({ page }) => {
        const blogText = await page.getByText("Example Title Example Author");
        const blogElement = await blogText.locator("..");

        await blogElement.getByRole("button", { name: "view" }).click();
        page.on("dialog", (dialog) => dialog.accept());
        await blogElement.getByRole("button", { name: "remove" }).click();
        await expect(
          page.getByText("Example Title Example Author")
        ).not.toBeVisible();
      });
    });
  });
});
