import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const LatestCollectionRedirect = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const sub = (params.get("subcategory") || "").toLowerCase();
    if (sub) {
      navigate(`/latest-collection/${sub}`, { replace: true });
    } else {
      navigate("/", { replace: true });
    }
  }, [params, navigate]);

  return null;
};

export default LatestCollectionRedirect;

