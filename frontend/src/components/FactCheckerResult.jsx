export default function FactCheckerResult({ result }) {
  if (!result) return null;
  return (
    <div className="result">
      <h3>Result: {result.verdict}</h3>
      {/* <div>Evidence: {result.evidence.join(", ")}</div> */}
      <div>Claim: {result.claim_text}</div>
    </div>
  );
}

