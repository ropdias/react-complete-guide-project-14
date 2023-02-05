import { memo, useState, useEffect } from "react";

import Card from "../UI/Card";
import "./Search.css";

const Search = memo(({ onLoadIngredients }) => {
  const [enteredFilter, setEnteredFilter] = useState("");

  useEffect(() => {
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
  }, [enteredFilter, onLoadIngredients]);

  return (
    <section className="search">
      <Card>
        <div className="search-input">
          <label>Filter by Title</label>
          <input
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
