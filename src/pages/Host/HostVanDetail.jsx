import { useState, useEffect } from "react";
import { useParams, Link, NavLink, Outlet } from "react-router";

export default function HostVanDetail() {
  const params = useParams();
  const [van, setVan] = useState(null);

  const activeStyle = {
    fontWeight: "bold",
    textDecoration: "underline",
    color: "#161616",
  };

  useEffect(() => {
    fetch(`/api/host/vans/${params.id}`)
      .then((res) => res.json())
      .then((data) => setVan(data.vans));
  }, [params.id]);

  return (
    <div>
      {van ? (
        <section>
          <Link to=".." relative="path" className="back-button">
            &larr;<span>Back to all vans</span>
          </Link>
          <div className="host-van-detail-layout-container">
            <div className="host-van-detail">
              <img src={van.imageUrl} />
              <div className="host-van-detail-info-text">
                <i className={`van-type van-type-${van.type}`}>{van.type}</i>
                <h3>{van.name}</h3>
                <h4>${van.price}/day</h4>
              </div>
            </div>
            <nav className="host-van-detail-nav">
              <NavLink
                to="."
                end
                style={({ isActive }) => (isActive ? activeStyle : null)}
              >
                Details
              </NavLink>
              <NavLink
                to="pricing"
                style={({ isActive }) => (isActive ? activeStyle : null)}
              >
                Pricing
              </NavLink>
              <NavLink
                to="photos"
                style={({ isActive }) => (isActive ? activeStyle : null)}
              >
                Photos
              </NavLink>
            </nav>
            <Outlet />
          </div>
        </section>
      ) : (
        <h2>Loading...</h2>
      )}
    </div>
  );
}
