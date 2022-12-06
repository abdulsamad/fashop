import React from 'react';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';

import Item from './Item';

const getProducts = async (): Promise<any> => {
  const res = await axios.get('https://dummyjson.com/products');
  return res.data;
};

const Products = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: getProducts,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  if (isLoading || !data) {
    return <div className="animate-bounce p-5 text-center">Loading...</div>;
  }

  console.log({ data });

  return (
    <div className="grid grid-cols-2 place-items-center gap-5 p-5 lg:grid-cols-4">
      {data.products.map(({ id, title, images, price, category }: any) => (
        <Item key={id} id={id} title={title} image={images[0]} price={price} category={category} />
      ))}
    </div>
  );
};

export default Products;
