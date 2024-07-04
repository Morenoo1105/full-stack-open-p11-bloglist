import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import PostBlog from "./PostBlog";

test("form calls event handler with the right details", async () => {
  const createBlog = vi.fn();
  const user = userEvent.setup();

  const component = render(<PostBlog handleBlogPost={createBlog} />);

  const titleInput = component.getByPlaceholderText("title");
  const authorInput = component.getByPlaceholderText("author");
  const urlInput = component.getByPlaceholderText("url");

  const submitButton = component.getByText("Create");

  await user.type(titleInput, "Blog Title");
  await user.type(authorInput, "Author Name");
  await user.type(urlInput, "http://example.com");
  await user.click(submitButton);

  expect(createBlog.mock.calls).toHaveLength(1);
  expect(createBlog.mock.calls[0][0]).toEqual({
    title: "Blog Title",
    author: "Author Name",
    url: "http://example.com",
  });
});
