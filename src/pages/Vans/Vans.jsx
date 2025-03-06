import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router";
import { getVans } from "../../api";

export default function Vans() {
  /** SEARCH PARAMS VARIABLES */
  const [searchParams, setSearchParams] = useSearchParams();
  /** STATE VARIABLES */
  const [vans, setVans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const typeFilter = searchParams.get("type");

  /** GET DATA FROM API */
  useEffect(() => {
    async function loadVans() {
      setLoading(true);
      try {
        const data = await getVans();
        setVans(data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    }
    loadVans();
  }, []);

  const displayedVans = typeFilter
    ? vans.filter((van) => typeFilter === van.type)
    : vans;

  /** CREATE ELEMENTS TO RENDER */
  const vanElements = displayedVans.map((van) => (
    <div key={van.id} className="van-tile">
      <Link
        to={van.id}
        state={{ search: `?${searchParams.toString()}`, type: typeFilter }} //keeps the history state in the URL (link state)
        aria-label={`View details for ${van.name}, priced at $${van.price} per day`}
      >
        <img src={van.imageUrl} alt={`Image of ${van.name}`} />
        <div className="van-info">
          <h3>{van.name}</h3>
          <p>
            ${van.price}
            <span>/day</span>
          </p>
        </div>
        <i className={`van-type ${van.type} selected`}>{van.type}</i>
      </Link>
    </div>
  ));

  if (loading) {
    return <h1 aria-live="polite">Loading...</h1>;
  }

  if (error) {
    return <h1 aria-live="assertive">There was an error: {error.message}</h1>;
  }

  return (
    <div className="van-list-container">
      <h1>Explore our van options</h1>
      <div className="van-list-filter-buttons">
        <button
          onClick={() => setSearchParams({ type: "simple" })}
          className={`van-type simple ${
            typeFilter === "simple" ? "selected" : ""
          }`}
        >
          Simple
        </button>
        <button
          onClick={() => setSearchParams({ type: "rugged" })}
          className={`van-type rugged ${
            typeFilter === "rugged" ? "selected" : ""
          }`}
        >
          Rugged
        </button>
        <button
          onClick={() => setSearchParams({ type: "luxury" })}
          className={`van-type luxury ${
            typeFilter === "luxury" ? "selected" : ""
          }`}
        >
          Luxury
        </button>
        {typeFilter ? (
          <button
            onClick={() => setSearchParams({})}
            className="van-type clear-filters"
          >
            Clear
          </button>
        ) : null}
      </div>
      <div className="van-list">{vanElements}</div>
    </div>
  );
}

/** Alternate way to set search params with Links instead of buttons (filters)
 * 
        <Link to="?type=simple" className="van-type simple">
          Simple
        </Link>
        <Link to="?type=rugged" className="van-type rugged">
          Rugged
        </Link>
        <Link to="?type=luxury" className="van-type luxury">
          Luxury
        </Link>
        <Link to="." className="van-type clear-filters">
          Clear
        </Link>

***** EXAMPLE ON HOW TO KEEP/MERGE EXISTING PARAMS IN THE URL *****
***** WITH LINKS *******
        function genNewSearchParamString(key, value) {
          const sp = new URLSearchParams(searchParams)
          if (value === null) {
            sp.delete(key)
          } else {
            sp.set(key, value)
          }
          return `?${sp.toString()}`
        }

        <Link to={genNewSearchParamString("type", "jedi")}>Jedi</Link>
        <Link to={genNewSearchParamString("type", "sith")}>Sith</Link>
        <Link to={genNewSearchParamString("type", null)}>Clear</Link>

********************************************************
****** WITH BUTTONS AND SETTER FUNCTION *******
        function handleFilterChange(key, value) {
          setSearchParams(prevParams => {
            if (value === null) {
              prevParams.delete(key)
            } else {
              prevParams.set(key, value)
            }
            return prevParams
        })
      }

        <button onClick={() => handleFilterChange("type", "jedi")}>Jedi</button>
        <button onClick={() => handleFilterChange("type", "sith")}>Sith</button>
        <button onClick={() => handleFilterChange("type", null)}>Clear</button>
 */
