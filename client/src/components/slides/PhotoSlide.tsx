interface PhotoSlideProps {
  content: string;
  imageUrl: string;
}

export default function PhotoSlide({ content, imageUrl }: PhotoSlideProps) {
  return (
    <div className="absolute inset-0 w-full h-full">
      <img
        src={imageUrl}
        alt={content}
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
    </div>
  );
}
