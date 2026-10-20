/** Fixed atmospheric layer — content sits above with transparent glass panels. */
export function SiteBackdrop() {
  return (
    <div aria-hidden className="site-canvas">
      <div className="site-canvas__mesh" />
      <div className="site-canvas__orb site-canvas__orb--1" />
      <div className="site-canvas__orb site-canvas__orb--2" />
      <div className="site-canvas__orb site-canvas__orb--3" />
      <div className="site-canvas__grid" />
      <div className="site-canvas__noise" />
    </div>
  );
}
