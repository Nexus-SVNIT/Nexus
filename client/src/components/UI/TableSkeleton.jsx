// Skeleton.js
const Skeleton = ({ count }) => {
    return (
      <div className="flex flex-col space-y-2">
        {[...Array(count)].map((_, index) => (
          <div key={index} className="h-4 bg-gray-300 animate-pulse rounded" />
        ))}
      </div>
    );
  };
  
  export default Skeleton;
  