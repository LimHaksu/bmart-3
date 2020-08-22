import React, { useState, useEffect, createContext } from 'react';
import { useQuery } from '@apollo/react-hooks';
import { PRODUCTS_BY_CATEGORY_ID } from 'graphql/product';

export const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const { loading, error, data: products, refetch } = useQuery(PRODUCTS_BY_CATEGORY_ID, { variables: 1 });

  const [productList, setProductList] = useState([]);

  useEffect(() => {
    if (products) {
      const data = products.ProductsByCategoryId.map((product, idx) => ({
        name: product.name,
        price: product.price,
        category_id: product.category_id,
        img_url: product.img_url,
      }));
      setProductList(data);
    }
  }, [productList]);

  return <ProductContext.Provider value={[productList, setProductList]}>{children}</ProductContext.Provider>;
};
