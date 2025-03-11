import React from 'react';

const Card = ({ data }) => {
  const stars = Math.floor(data.review);
  const halfStar = data.review % 1 !== 0;

  return (
    <div className="max-w-sm rounded-2xl overflow-hidden shadow-lg bg-white">
      <img
        className="w-full h-48 object-cover"
        src={data.img || "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80"}
        alt={data.username}
      />
      <div className="p-4">
        <h2 className="text-xl font-semibold">{data.username}</h2>
        <p className="text-gray-600 mt-2">{data.desp}</p>
        <p className="text-2xl font-medium mt-2">${data.price ?? 'N/A'}</p>
        <div className="mt-3 text-gray-500 text-sm">
          <p>Review Date: <span className="font-medium">{data.date}</span></p>
          <div className="flex items-center mt-1">
            <span className="text-yellow-500 text-lg">
              {'★'.repeat(stars)}{halfStar ? '☆' : ''}
            </span>
            <span className="ml-2 text-gray-600">{data.review}</span>
          </div>
        </div>
      </div>
      <div className="p-4 flex gap-2">
        <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
          Buy now
        </button>
        <button className="border border-gray-400 text-gray-600 px-4 py-2 rounded-lg hover:bg-gray-100">
          Add to cart
        </button>
      </div>
    </div>
  );
};

export default Card;
