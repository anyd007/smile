import { useState } from "react";
import "./AppImage.scss";

const AppImage = ({
  src,
  alt = "",
  className = "",
  width = "100%",
  height = "100%",
  fallback = null,
}) => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  return (
    <div
      className={`app-image-wrapper ${className}`}
      style={{ width, height }}
    >
      {!loaded && !error && <div className="app-image-placeholder" />}

      {!error ? (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          className={`app-image ${loaded ? "loaded" : ""}`}
          onLoad={() => setLoaded(true)}
          onError={() => setError(true)}
        />
      ) : (
        fallback || <div className="app-image-fallback">Brak obrazu</div>
      )}
    </div>
  );
};

export default AppImage;