import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Blog from "./Blog";

test("renders content", () => {
  const blog = {
    title: "Blog Title",
    author: "Author Name",
    url: "http://example.com",
    likes: 11,
  };

  const { container } = render(<Blog blog={blog} />);

  //eslint-disable-next-line
  expect(container).toHaveTextContent('"Blog Title" by Author Name');
  expect(container).not.toHaveTextContent("http://example.com");
  expect(container).not.toHaveTextContent("likes 11");
});

test("clicking the view button shows the blog's url and number of likes", async () => {
  const blog = {
    title: "Blog Title",
    author: "Author Name",
    url: "http://example.com",
    likes: 11,
    user: { name: "User Name" },
  };

  const mockHandler = vi.fn();

  const component = render(<Blog blog={blog} />);

  const user = userEvent.setup();
  const button = component.getByText("View");
  await user.click(button);

  expect(component.container).toHaveTextContent("http://example.com");
  expect(component.container).toHaveTextContent("likes 11");
});

test("clicking the like button twice calls the event handler twice", async () => {
  const blog = {
    title: "Blog Title",
    author: "Author Name",
    url: "http://example.com",
    likes: 11,
    user: { name: "User Name" },
  };

  const mockHandler = vi.fn();

  const component = render(<Blog blog={blog} handleLike={mockHandler} />);

  const user = userEvent.setup();
  const viewButton = component.getByText("View");
  await user.click(viewButton);

  const likeButton = component.getByText("like");
  await user.click(likeButton);
  await user.click(likeButton);

  expect(mockHandler.mock.calls).toHaveLength(2);
});
