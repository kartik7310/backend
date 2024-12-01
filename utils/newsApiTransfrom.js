import { getImageUrl } from "./getImageUrl.js";
const newsApiTransform = (news) => {
  return {
    id: news.id,
    heading: news.title,
    news: news.content,
    image: news.image ? getImageUrl(news.image) : null,
    userId: news.userId,
    createdAt: news.createdAt,
    updatedAt: news.updatedAt,
    reporter: {
      id: news?.users.userId,
      name: news?.users.name,
      email: news?.users.email,
      profile:
        news?.users.profile !== null ? getImageUrl(news?.user?.profile) : null,
      createdAt: news?.users.createdAt,
    },
  };
};
export default newsApiTransform;
