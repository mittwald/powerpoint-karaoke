import PresentationTitle from "../PresentationTitle";

export default function PresentationTitleExample() {
  return (
    <div className="relative h-96 bg-gradient-to-br from-primary/10 via-accent/10 to-muted/20 border rounded-md overflow-hidden">
      <PresentationTitle
        title="The Inevitable Rise of Quantum Banana Computing"
        show={true}
      />
    </div>
  );
}
