import { StepsDiagram } from "@/components/illustrations";
import { insuranceSteps, insuranceTerms } from "@/lib/care-facts";

/** Coverage-check steps and plain-language insurance terms, shared by insurance pages. */
export function InsuranceExplainer({ insurerName }: { insurerName?: string }) {
  return <>
    <section className="section section-snug" id="check-coverage"><div className="shell">
      <div className="section-heading"><div><h2>How to check your {insurerName ? `${insurerName} ` : ""}coverage</h2><p>A listing shows what a provider reports accepting. Only your plan can confirm what it will pay.</p></div></div>
      <StepsDiagram steps={insuranceSteps} />
    </div></section>
    <section className="section section-snug section-tint" id="terms"><div className="shell">
      <div className="section-heading"><div><h2>Insurance terms to know</h2><p>The words you are likely to hear when you call.</p></div></div>
      <dl className="term-grid">{insuranceTerms.map((item) => <div key={item.term}><dt>{item.term}</dt><dd>{item.meaning}</dd></div>)}</dl>
      <p className="section-caution" style={{ marginTop: 18 }}>Federal parity rules generally require health plans that cover mental health and substance use care to apply limits no stricter than those for medical and surgical care. Plans still differ, so ask your insurer how the rules apply to you.</p>
    </div></section>
  </>;
}
