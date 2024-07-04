import axios from "axios";
const baseUrl = "/api/blogs";

let token = null;

const setToken = (newToken) => {
  token = `Bearer ${newToken}`;
};

const getAll = () => {
  const request = axios.get(baseUrl);
  return request.then((response) => response.data);
};

const create = async (newObject) => {
  const config = {
    headers: { Authorization: token },
  };

  const response = await axios.post(baseUrl, newObject, config);
  return response.data;
};

const update = async (id, newObject) => {
  const request = await axios.put(`${baseUrl}/${id}`, newObject);
  return request.then((response) => response.data);
};

const like = async (blog) => {
  const headersConfig = {
    headers: { Authorization: token },
  };

  const response = await axios.put(
    `${baseUrl}/${blog.id}`,
    { ...blog, likes: blog.likes + 1 },
    headersConfig
  );
  return response.data;
};

const deleteBlog = async (blog) => {
  const headersConfig = {
    headers: { Authorization: token },
  };

  await axios.delete(`${baseUrl}/${blog.id}`, headersConfig);
};

export default { getAll, create, update, setToken, like, deleteBlog };
