import KeywordInput from "../KeywordInput";

export default function KeywordInputExample() {
  return (
    <KeywordInput
      onSubmit={(data) => console.log("Keywords submitted:", data)}
      isLoading={false}
    />
  );
}
