import type { CardCopy } from "../content/chapters";

type Props = {
  partId: string;
  partNumber: string;
  copy: CardCopy;
};

/** A chapter description card. Visibility is driven by the master timeline. */
export function PartCard({ partId, partNumber, copy }: Props) {
  return (
    <div data-card={partId} className="part-card">
      <div className="card-body">
        <span data-anim className="card-index">
          Part {partNumber} / 04
        </span>
        <h2 data-anim className="card-title">
          {copy.name}
        </h2>
        <p data-anim className="card-headline">
          {copy.headline}
        </p>
        <ul className="card-list">
          {copy.bullets.map((bullet) => (
            <li key={bullet} data-anim className="card-item">
              {bullet}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
