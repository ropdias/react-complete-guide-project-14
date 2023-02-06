import { memo, useState, useEffect, useRef } from "react";

import Card from "../UI/Card";
import "./Search.css";

const Search = memo(
  ({ onSuccessLoadingIngredients, onErrorLoadingIngredients }) => {
    const [enteredFilter, setEnteredFilter] = useState("");
    const inputRef = useRef();

    useEffect(() => {
      const timer = setTimeout(() => {
        if (enteredFilter === inputRef.current.value) {
          const query =
            enteredFilter.length === 0
              ? ""
              : `?orderBy="title"&equalTo="${enteredFilter}"`;
          const fetchData = async () => {
            try {
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
              onSuccessLoadingIngredients(loadedIngredients);
            } catch (error) {
              onErrorLoadingIngredients("Something went wrong when trying to filter !");
            }
          };
          fetchData();
        }
      }, 500);

      // The cleanup function will run the NEXT time this useEffect runs and BEFORE the actual function code
      return () => {
        // This will make sure that we clear the previous timer if this useEffect runs again
        // and the previous timer is still running
        clearTimeout(timer);
      };
    }, [
      enteredFilter,
      onSuccessLoadingIngredients,
      onErrorLoadingIngredients,
      inputRef,
    ]);

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
  }
);

export default Search;
