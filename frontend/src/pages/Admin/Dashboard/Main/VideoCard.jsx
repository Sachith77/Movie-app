const VideoCard = ({ image, title, date, comments }) => {
  return (
    <>
      <div className="flex items-center w-[90%] mt-5 p-3 glass rounded-lg border border-gray-700/50 hover:border-teal-500/30 transition-colors">
        <div className="flex-shrink-0">
          <div className="relative w-16 h-16 rounded-lg overflow-hidden">
            <img 
              src={image} 
              alt={title} 
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = "https://via.placeholder.com/64x64?text=No+Image";
              }}
            />
          </div>
        </div>

        <div className="ml-4 flex-grow">
          <h2 className="text-lg text-white font-semibold line-clamp-1">{title}</h2>
          <p className="text-gray-500 text-sm">{date}</p>
        </div>

        <div className="flex-shrink-0 flex items-center gap-2 px-3 py-1 bg-teal-500/20 border border-teal-500/30 rounded-full">
          <svg className="w-4 h-4 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          <span className="text-white font-semibold">{comments}</span>
        </div>
      </div>
    </>
  );
};

export default VideoCard;

