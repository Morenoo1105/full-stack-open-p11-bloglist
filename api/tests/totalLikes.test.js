const { test, describe } = require("node:test");
const assert = require("node:assert");
const listHelper = require("../utils/list_helper");

describe("total likes", () => {
  const listWithOneBlog = [
    {
      _id: "5a422aa71b54a676234d17f8",
      title: "Go To Statement Considered Harmful",
      author: "Edsger W. Dijkstra",
      url: "https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf",
      likes: 5,
      __v: 0,
    },
  ];

  const listWithThreeBlogs = [
    {
      _id: "5a422aa71b54a676234d17f8",
      title: "Go To Statement Considered Harmful",
      author: "Edsger W. Dijkstra",
      url: "https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf",
      likes: 5,
      __v: 0,
    },
    {
      _id: "5a422aa7b54a676234d17f8",
      title: "Go To Statement Considered Hrmful",
      author: "Edsger W. Dijksra",
      url: "https://homepages.cwi.nl/~storm/teaching/reader/Dijktra68.pdf",
      likes: 1,
      __v: 0,
    },
    {
      _id: "5a422aa71b54a676234d7f8",
      title: "Go To Statemet Considered Harmful",
      author: "Edger W. Dijkstra",
      url: "https://homepages.cwi.nl/~storm/teaching/reader/Dijkstr68.pdf",
      likes: 43,
      __v: 0,
    },
  ];

  test("of empty list is zero", () => {
    const result = listHelper.totalLikes([]);
    assert.strictEqual(result, 0);
  });

  test("when list has only one blog, equals the likes of that", () => {
    const result = listHelper.totalLikes(listWithOneBlog);
    assert.strictEqual(result, 5);
  });

  test("of a bigger list is calculated right", () => {
    const result = listHelper.totalLikes(listWithThreeBlogs);
    assert.strictEqual(result, 49);
  });
});
