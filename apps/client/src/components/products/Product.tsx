import React, { useCallback } from 'react';

interface IProduct {
  id: string;
  title: string;
  image: string;
  price: number;
  category: string;
}

const Product = ({ id, title, image, category, price }: IProduct) => {
  const formatCurrency = useCallback((price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(price);
  }, []);

  return (
    <div className="text-center" key={id}>
      <div className="h-[150px] w-full overflow-hidden object-contain">
        <img src={image} alt={title} width={200} className="mx-auto" />
      </div>
      <div className="my-4">
        <h3 className="font-bold">{title}</h3>
        <div className="d-flex">
          <span className="italic">{formatCurrency(price)}</span>
          <span className="ml-4 capitalize">{category}</span>
        </div>
      </div>
    </div>
  );
};

export default Product;
