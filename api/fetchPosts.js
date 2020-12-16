export const fetchPosts = () =>
  // fetch all posts for userId=1
  fetch("https://jsonplaceholder.typicode.com/posts?userId=1").then((resp) =>
    resp.json()
  );
