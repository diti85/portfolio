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
