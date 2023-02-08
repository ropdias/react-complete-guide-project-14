import { memo, useState, useEffect, useRef } from "react";

import Card from "../UI/Card";
import useHttp from "../../hooks/http";
import ErrorModal from "../UI/ErrorModal";
import "./Search.css";

const Search = memo(({ onSuccessLoadingIngredients }) => {
  const [enteredFilter, setEnteredFilter] = useState("");
  const inputRef = useRef();
  const { isLoading, responseData, error, sendRequest, clear } = useHttp();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (enteredFilter === inputRef.current.value) {
        const query =
          enteredFilter.length === 0
            ? ""
            : `?orderBy="title"&equalTo="${enteredFilter}"`;
        sendRequest(
          "https://react-http-ef0dc-default-rtdb.firebaseio.com/ingredients.json" +
            query,
          "GET"
        );
      }
    }, 500);

    // The cleanup function will run the NEXT time this useEffect runs and BEFORE the actual function code
    return () => {
      // This will make sure that we clear the previous timer if this useEffect runs again
      // and the previous timer is still running
      clearTimeout(timer);
    };
  }, [enteredFilter, inputRef, sendRequest]);

  useEffect(() => {
    if (!isLoading && !error && responseData) {
      const loadedIngredients = [];
      for (const key in responseData) {
        loadedIngredients.push({
          id: key,
          title: responseData[key].title,
          amount: responseData[key].amount,
        });
      }
      onSuccessLoadingIngredients(loadedIngredients);
    }
  }, [responseData, isLoading, error, onSuccessLoadingIngredients]);

  return (
    <section className="search">
      {error && <ErrorModal onClose={clear}>{error}</ErrorModal>}
      <Card>
        <div className="search-input">
          <label>Filter by Title</label>
          {isLoading && <span>Loading...</span>}
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
