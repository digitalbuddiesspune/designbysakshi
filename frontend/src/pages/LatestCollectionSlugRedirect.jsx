import { Navigate, useParams } from "react-router-dom";

const LatestCollectionSlugRedirect = () => {
  const { slug } = useParams();
  const sub = slug || "";

  return <Navigate to={sub ? `/latest-collection?subcategory=${encodeURIComponent(sub)}` : "/latest-collection"} replace />;
};

export default LatestCollectionSlugRedirect;

