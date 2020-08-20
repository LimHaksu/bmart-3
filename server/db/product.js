import executeQuery from './share/execute-query';
import { getProductsQuery, getProductByIdQuery, getProductsByCategoryIdQuery } from './query/product';

const getProducts = async () => {
  try {
    const rows = await executeQuery(getProductsQuery());
    return rows;
  } catch (err) {
    throw err;
  }
};

const getProductById = async (id) => {
  try {
    const [row] = await executeQuery(getProductByIdQuery(id));
    return row;
  } catch (err) {
    throw err;
  }
};

const getProductsByCategoryId = async (categoryId) => {
  try {
    const rows = await executeQuery(getProductsByCategoryIdQuery(categoryId));
    return rows;
  } catch (err) {
    throw err;
  }
};

export { getProducts, getProductById, getProductsByCategoryId };
