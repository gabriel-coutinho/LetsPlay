const postService = require('../services/post.service');
const { STATUS } = require('./constants');

const expirePosts = async () => {
  const posts = await postService.getAllNoPagination();
  const now = new Date();
  posts.map(async (post) => {
    if (post.date.getTime() < now && post.status !== STATUS.EXPIRED) {
      const updatedPost = { ...post };
      updatedPost.status = STATUS.EXPIRED;
      await postService.update(updatedPost.id, updatedPost);
    }
  });
};

module.exports = {
  expirePosts,
};
