const { test, describe } = require("node:test");
const assert = require("node:assert");
const listHelper = require("../utils/list_helper");

describe("favourite blog", () => {
  const favouriteBlog = [
    {
      _id: "3",
      title: "Considered Harmful",
      author: "Dijkstra",
      url: "https://homepages.cwi.nl/~storm/teaching/reader/Dijkstr68.pdf",
      likes: 43,
      __v: 0,
    },
  ];
  const noLikesBlog = [
    {
      _id: "3",
      title: "Harmful",
      author: "Dijkstra",
      url: "https://homepages.cwi.nl/~storm/teaching/reader/Dijkstr68.pdf",
      likes: 0,
      __v: 0,
    },
  ];

  const blogList = [
    {
      _id: "1",
      title: "Go To",
      author: "Edsger",
      url: "https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf",
      likes: 5,
      __v: 0,
    },
    {
      _id: "2",
      title: "Statement",
      author: "W.",
      url: "https://homepages.cwi.nl/~storm/teaching/reader/Dijktra68.pdf",
      likes: 1,
      __v: 0,
    },
    {
      _id: "3",
      title: "Considered Harmful",
      author: "Dijkstra",
      url: "https://homepages.cwi.nl/~storm/teaching/reader/Dijkstr68.pdf",
      likes: 43,
      __v: 0,
    },
  ];

  test("of empty list is empty object", () => {
    const result = listHelper.favoriteBlog([]);
    assert.deepStrictEqual(result, {});
  });

  test("when list has only one blog selects it (when likes = 0)", () => {
    const result = listHelper.favoriteBlog(noLikesBlog);
    assert.deepStrictEqual(result, noLikesBlog[0]);
  });

  test("when list has only one blog selects it (when likes > 0)", () => {
    const result = listHelper.favoriteBlog(favouriteBlog);
    assert.deepStrictEqual(result, favouriteBlog[0]);
  });

  test("of a bigger list is the most liked one", () => {
    const result = listHelper.favoriteBlog(blogList);
    assert.deepStrictEqual(result, favouriteBlog[0]);
  });
});
