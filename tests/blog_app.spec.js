const { test, expect, beforeEach, describe } = require("@playwright/test");

import { createBlog } from "./helpers";

describe("Blog app", () => {
  beforeEach(async ({ page, request }) => {
    await request.post("http://localhost:8000/api/testing/reset");
    await request.post("http://localhost:8000/api/users", {
      data: {
        username: "root",
        name: "Superuser",
        password: "password",
      },
    });

    await page.goto("http://localhost:8000");

    await page.waitForURL("http://localhost:8000");
  });

  test("Login form is shown", async ({ page }) => {
    const title = page.getByText("Please Log In");

    const username = page.getByPlaceholder("username");
    const password = page.getByPlaceholder("password");

    const loginButton = page.getByText("login");

    await expect(title).toBeVisible();
    await expect(username).toBeVisible();
    await expect(password).toBeVisible();
    await expect(loginButton).toBeVisible();
  });

  describe("Login", () => {
    /*
    test("succeeds with correct credentials", async ({ page }) => {
      await page.getByTestId("username").fill("root");
      await page.getByTestId("password").fill("password");
      await page.getByRole("button", { name: "login" }).click();

      await page.waitForTimeout(1000);

      await expect(page.getByText("Logged in as Superuser")).toBeVisible();
      await page.waitForTimeout(1000);
      await expect(page.getByRole("button", { name: "Log out" })).toBeVisible();
      await page.waitForTimeout(1000);

      const localStorage = await page.evaluate(() => {
        return JSON.parse(JSON.stringify(window.localStorage));
      });

      expect(localStorage).toBeDefined();
    });

    test("fails with wrong credentials", async ({ page }) => {
      await page.getByTestId("username").fill("hello");
      await page.getByTestId("password").fill("world");
      await page.getByRole("button", { name: "login" }).click();
      await page.waitForTimeout(1000);

      await expect(page.getByText("Wrong credentials")).toBeVisible();
      await page.waitForTimeout(1000);
      await expect(page.getByText("Wrong credentials")).toHaveCSS(
        "background-color",
        "rgb(255, 153, 153)"
      );
      await page.waitForTimeout(1000);
      await expect(
        page.getByRole("button", { name: "Log out" })
      ).not.toBeVisible();
    });
    */
  });
  /*
  describe("When logged in", () => {
    beforeEach(async ({ page }) => {
      await page.getByTestId("username").fill("root");
      await page.getByTestId("password").fill("password");
      await page.getByRole("button", { name: "login" }).click();
    });

    test("a new blog can be created", async ({ page }) => {
      const title = "Test Title";
      const author = "Test Author";
      const url = "http://test.com";

      await page.getByRole("button", { name: "New Blog" }).click();

      await page.getByTestId("title").fill(title);
      await page.getByTestId("author").fill(author);
      await page.getByTestId("url").fill(url);

      await page.getByRole("button", { name: "Create" }).click();

      await page.waitForTimeout(1000);

      await expect(
        page.getByText(`A new blog ${title} by ${author} added`)
      ).toBeVisible();

      const listItem = page.locator(".blogListItem").last();

      await expect(listItem).toBeVisible();
    });

    describe("and a blog exists", () => {
      beforeEach(async ({ page }) => {
        const title = "Test Title";
        const author = "Test Author";
        const url = "http://test.com";

        await page.getByRole("button", { name: "New Blog" }).click();

        await page.getByTestId("title").fill(title);
        await page.getByTestId("author").fill(author);
        await page.getByTestId("url").fill(url);

        await page.getByRole("button", { name: "Create" }).click();
      });

      test("a blog can be edited/liked", async ({ page }) => {
        await page.getByRole("button", { name: "View" }).first().click();

        await page.getByRole("button", { name: "like" }).click();

        await expect(page.getByText("likes 1")).toBeVisible();
      });

      test("a blog can be deleted by owner", async ({ page }) => {
        const listItem = page.locator(".blogListItem").last();

        await expect(listItem).toBeVisible();

        await page.getByRole("button", { name: "View" }).first().click();

        await page.getByRole("button", { name: "delete" }).first().click();

        page.on("dialog", (dialog) => dialog.accept());

        await expect(listItem).not.toBeVisible();
      });

      test("a blog cannot be deleted by non-owner", async ({
        page,
        request,
      }) => {
        await request.post("http://localhost:8000/api/users", {
          data: {
            username: "user",
            name: "normaluser",
            password: "pass",
          },
        });

        await page.getByRole("button", { name: "Log out" }).click();

        await page.getByTestId("username").fill("user");
        await page.getByTestId("password").fill("pass");
        await page.getByRole("button", { name: "login" }).click();

        await page.getByRole("button", { name: "View" }).first().click();

        await expect(page.getByRole("button", { name: "like" })).toBeVisible();

        await expect(
          page.getByRole("button", { name: "delete" })
        ).not.toBeVisible();
      });
    });

    // May only work in debug mode for webkit explorer
    test("Blogs are sorted by likes", async ({ page }) => {
      await createBlog(page, "First", "Author", "http://first.com");
      await createBlog(page, "Second", "Author", "http://second.com");
      await createBlog(page, "Third", "Author", "http://third.com");

      const first = page.locator(".blogListItem").first();

      await expect(first).toContainText("First");

      await page.getByRole("button", { name: "View" }).last().click();
      await page.getByRole("button", { name: "like" }).click();
      await page.getByRole("button", { name: "like" }).click();

      await page.getByRole("button", { name: "hide" }).click();

      const newFirst = page.locator(".blogListItem").first();

      await expect(newFirst).toContainText("Third");
    });
  });
  */
});
