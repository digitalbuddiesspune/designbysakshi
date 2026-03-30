import CollectionPage from "./CollectionPage";
import { useParams } from "react-router-dom";

const toWords = (slug) =>
  String(slug || "")
    .replace(/[-_]+/g, " ")
    .trim();

const toTitle = (text) =>
  text
    .split(" ")
    .map((w) => (w ? w[0].toUpperCase() + w.slice(1) : ""))
    .join(" ");

const LatestCollection = () => {
  const { slug } = useParams();
  const name = toWords(slug);
  const title = toTitle(name);
  return <CollectionPage subcategoryName={name} title={title} />;
};

export default LatestCollection;

