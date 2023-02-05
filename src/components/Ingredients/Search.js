import { memo, useState, useEffect, useRef } from "react";

import Card from "../UI/Card";
import "./Search.css";

const Search = memo(({ onLoadIngredients }) => {
  const [enteredFilter, setEnteredFilter] = useState("");
  const inputRef = useRef();

  // We are still creating a lot of timers on every key stroke, we will fix this soon
  useEffect(() => {
    setTimeout(() => {
      if (enteredFilter === inputRef.current.value) {
        const query =
          enteredFilter.length === 0
            ? ""
            : `?orderBy="title"&equalTo="${enteredFilter}"`;
        const fetchData = async () => {
          const response = await fetch(
            "https://react-http-ef0dc-default-rtdb.firebaseio.com/ingredients.json" +
              query
          );
          const responseData = await response.json();
          const loadedIngredients = [];
          for (const key in responseData) {
            loadedIngredients.push({
              id: key,
              title: responseData[key].title,
              amount: responseData[key].amount,
            });
          }
          onLoadIngredients(loadedIngredients);
        };
        fetchData();
      }
    }, 500);
  }, [enteredFilter, onLoadIngredients, inputRef]);

  return (
    <section className="search">
      <Card>
        <div className="search-input">
          <label>Filter by Title</label>
          <input
            ref={inputRef}
            type="text"
            value={enteredFilter}
            onChange={(event) => setEnteredFilter(event.target.value)}
          />
        </div>
      </Card>
    </section>
  );
});

export default Search;
