import "./Loader.css";

const Loader = () => {
  return (
    <div className="loader-container" role="status" aria-label="Loading">
      <span className="loader-dot" />
      <span className="loader-dot" />
      <span className="loader-dot" />
    </div>
  );
};

export default Loader;
