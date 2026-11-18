"use client";

/** A number whose digits roll up and down (same effect as the calculator's price). */
export default function SlidingNumber({ value }: { value: string }) {
  return (
    <span className="inline-flex tabular-nums" aria-hidden>
      {value.split("").map((char, i) => {
        if (!/\d/.test(char)) return <span key={i}>{char}</span>;
        return (
          <span key={i} className="inline-block h-[1em] overflow-hidden leading-none">
            <span
              className="flex flex-col transition-transform duration-500 ease-out"
              style={{ transform: `translateY(-${Number(char)}em)` }}
            >
              {Array.from({ length: 10 }, (_, d) => (
                <span key={d} className="h-[1em] leading-none">
                  {d}
                </span>
              ))}
            </span>
          </span>
        );
      })}
    </span>
  );
}
