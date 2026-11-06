import { CategoryIcon } from "@/components/public/CategoryIcon";

/** A small 3D isometric cube for cards and steps, with a crisp icon or number resting on top. */
export function IsoTile({ icon, num }: { icon?: string; num?: string }) {
  return (
    <span className="iso-tile" aria-hidden>
      <span className="iso-tile-world">
        <span
          className="cub"
          style={{ "--w": "46px", "--d": "46px", "--h": "30px" } as React.CSSProperties}
        >
          <i className="ft" />
          <i className="fs" />
          <i className="fe" />
        </span>
      </span>
      <span className="iso-tile-glyph">
        {icon ? <CategoryIcon icon={icon} /> : num ? <span className="num">{num}</span> : null}
      </span>
    </span>
  );
}
