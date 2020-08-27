import {
  getProducts,
  getProductById,
  getProductsByCategoryId,
  getPagedProductsByChildCategoryId,
  getPagedProductsByParentCategoryId,
  getNewRelease,
  getPopularItems,
  getRandItems,
  getTimeSaleItems,
  toggleLiked,
} from '../product';
import { getCategoriesParent, getCategoriesChild } from '../category';
export default async function () {
  return {
    Query: {
      Products: async () => await getProducts(),
      Product: async (_, { id }) => await getProductById(id),
      ProductsByCategoryId: async (_, { categoryId, limit }) => await getProductsByCategoryId(categoryId, limit),
      PagedProductsByChildCategoryId: async (_, { categoryId, id, cursor, ordertype, limit, direction }) =>
        await getPagedProductsByChildCategoryId(categoryId, id, cursor, ordertype, limit, direction),
      PagedProductsByParentCategoryId: async (_, { categoryId, id, cursor, ordertype, limit, direction }) =>
        await getPagedProductsByParentCategoryId(categoryId, id, cursor, ordertype, limit, direction),
      CategoriesParent: async () => {
        const categoriesParent = await getCategoriesParent();
        return categoriesParent.map(async (categoryParent) => {
          categoryParent.categoriesChild = await getCategoriesChild(categoryParent.id);
          return categoryParent;
        });
      },
      CategoriesChild: async (_, { parentId }) => await getCategoriesChild(parentId),
      GetNewRelease: async (_, { limit }) => await getNewRelease(limit),
      GetPopularItems: async (_, { limit }) => await getPopularItems(limit),
      GetRandItems: async (_, { limit }) => await getRandItems(limit),
      GetTimeSaleItems: async (_, { limit }) => await getTimeSaleItems(limit),
    },
    Mutation: {
      ToggleLiked: async (_, { id, liked }) => await toggleLiked(id, liked),
    },
  };
}
