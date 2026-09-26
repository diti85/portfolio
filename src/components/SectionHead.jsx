// The running header that opens every section: what it is on the left, what
// you'll find in it on the right. It is the page's table of contents, in place.
export default function SectionHead({ label, note }) {
  return (
    <div className="frame">
      <div className="flex items-baseline justify-between gap-6 border-t border-bone/15 pt-4 text-xs">
        <span className="text-bone">{label}</span>
        <span className="text-right text-moss">{note}</span>
      </div>
    </div>
  );
}

// Marks a chapter inside a section. Chapters are read in order, so they are numbered.
export function ChapterMark({ numeral, name }) {
  return (
    <p className="flex items-baseline gap-3 text-sm text-moss">
      <span className="display text-lg italic text-brass">{numeral}</span>
      {name}
    </p>
  );
}

// Every piece of professional work is told problem first.
export function ProblemSolution({ problem, solution, className = "" }) {
  return (
    <dl className={`grid gap-6 ${className}`}>
      <div>
        <dt className="text-xs text-moss">The problem</dt>
        <dd className="mt-2 max-w-[56ch] text-base text-bone/85 md:text-lg">{problem}</dd>
      </div>
      <div>
        <dt className="text-xs text-gilt">What I built</dt>
        <dd className="mt-2 max-w-[56ch] text-base md:text-lg">{solution}</dd>
      </div>
    </dl>
  );
}
