import React, { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

/* 3D showroom — perspective mouse-tilt stage with floating chips + animated glow. */
const Showroom3D = () => {
  const stageRef = useRef(null);
  const [t, setT] = useState({ rx: -8, ry: 12 });
  const [car, setCar] = useState(null);

  useEffect(() => {
    fetch(process.env.PUBLIC_URL + '/cars.json')
      .then((r) => r.json())
      .then((all) => setCar(all[4] || all[0]))
      .catch(() => {});
  }, []);

  const onMove = (e) => {
    const r = stageRef.current.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    setT({ rx: -y * 16, ry: x * 22 });
  };

  return (
    <section className="cb-3d" onMouseMove={onMove} onMouseLeave={() => setT({ rx: -8, ry: 12 })}>
      <div className="cb-wrap cb-3d-grid">
        <div>
          <span className="cb-eyebrow">Interactive showroom</span>
          <h2 className="cb-h2" style={{ color: '#fff' }}>Feel the car.<br />Before you book it.</h2>
          <p className="cb-3d-lead">
            Move your cursor over the stage — every listing comes with HD photos,
            a full 120-point inspection report and transparent history.
          </p>
          <Link to="/morecars" className="cb-btn cb-btn-amber">Open the showroom</Link>
        </div>
        <div className="cb-3d-stage" ref={stageRef} style={{ perspective: '1100px' }}>
          <div className="cb-3d-card" style={{ transform: `rotateX(${t.rx}deg) rotateY(${t.ry}deg)` }}>
            {car && <img src={car.img} alt={car.name} />}
            <div className="cb-3d-badge b1" style={{ transform: 'translateZ(70px)' }}>🛡 120-point check</div>
            <div className="cb-3d-badge b2" style={{ transform: 'translateZ(90px)' }}>⚡ Instant booking</div>
            <div className="cb-3d-badge b3" style={{ transform: 'translateZ(55px)' }}>
              {car ? `${car.name} · $${Number(car.price).toLocaleString()}` : '…'}
            </div>
          </div>
          <div className="cb-3d-glow" />
        </div>
      </div>
    </section>
  );
};

export default Showroom3D;
