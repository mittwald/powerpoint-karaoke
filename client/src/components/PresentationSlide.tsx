import { type Slide } from "@shared/schema";
import TitleSlide from "./slides/TitleSlide";
import BioSlide from "./slides/BioSlide";
import PhotoSlide from "./slides/PhotoSlide";
import GraphSlide from "./slides/GraphSlide";
import QuoteSlide from "./slides/QuoteSlide";
import TextSlide from "./slides/TextSlide";

interface PresentationSlideProps {
  slide: Slide;
  isActive: boolean;
}

export default function PresentationSlide({ slide, isActive }: PresentationSlideProps) {
  if (!isActive) return null;

  if (slide.type === "title") {
    return <TitleSlide content={slide.content} />;
  }

  if (slide.type === "bio") {
    return <BioSlide content={slide.content} bio={slide.bio} facts={slide.facts} />;
  }

  if (slide.type === "photo" && slide.imageUrl) {
    return <PhotoSlide content={slide.content} imageUrl={slide.imageUrl} />;
  }

  if (slide.type === "graph" && slide.graphData && slide.graphData.length > 0) {
    return <GraphSlide content={slide.content} graphTitle={slide.graphTitle} graphData={slide.graphData} />;
  }

  if (slide.type === "quote" && slide.quote) {
    return <QuoteSlide quote={slide.quote} author={slide.author} authorTitle={slide.authorTitle} />;
  }

  return <TextSlide content={slide.content} />;
}
