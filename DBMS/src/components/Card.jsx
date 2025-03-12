import React from 'react';

const Card = ({ data }) => {
  const stars = Math.floor(data.rating);
  const halfStar = data.rating % 1 !== 0;

  return (
    <div className="w-[500px] rounded-2xl overflow-hidden shadow-lg bg-white border border-gray-200">
      <img
        className="w-full h-56 object-cover"
        src={data.img || "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80"}
        alt={data.eventName}
      />
      <div className="p-5">
        <h2 className="text-2xl font-semibold text-gray-800">{data.eventName}</h2>
        <p className="text-gray-500 mt-2 text-sm">{data.category}</p>
        <p className="text-gray-600 mt-2">{data.description}</p>
        <p className="text-lg font-medium mt-2">Date: <span className="font-semibold text-blue-600">{data.date}</span></p>
        <p className="text-lg font-medium mt-2">Location: <span className="font-semibold text-blue-600">{data.location}</span></p>
        <p className="text-xl font-semibold text-blue-500 mt-2">${data.price ?? 'Free'}</p>
        <div className="mt-3 text-gray-500 text-sm">
          <p>Attendees: <span className="font-medium text-gray-800">{data.attendees}</span></p>
          <div className="flex items-center mt-1">
            <span className="text-yellow-500 text-lg">
              {'★'.repeat(stars)}{halfStar ? '☆' : ''}
            </span>
            <span className="ml-2 text-gray-600">{data.rating}</span>
          </div>
        </div>
      </div>
      <div className="p-4 flex gap-3 justify-center">
        <button className="bg-blue-950 text-white px-5 py-2 rounded-lg font-medium hover:bg-blue-800">
          Book Now
        </button>
        <button className="border border-gray-400 text-gray-700 px-5 py-2 rounded-lg font-medium hover:bg-gray-100">
          Save Event
        </button>
      </div>
    </div>
  );
};

export default Card;
