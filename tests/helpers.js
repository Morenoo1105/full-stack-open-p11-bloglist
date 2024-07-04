const createBlog = async (page, title, author, url) => {
  await page.getByRole("button", { name: "New Blog" }).click();

  await page.getByTestId("title").fill(title);
  await page.getByTestId("author").fill(author);
  await page.getByTestId("url").fill(url);

  await page.getByRole("button", { name: "Create" }).click();
};

module.exports = {
  createBlog,
};
