import { useState, useEffect, useCallback } from "react";

import IngredientForm from "./IngredientForm";
import IngredientList from "./IngredientList";
import ErrorModal from "../UI/ErrorModal";
import Search from "./Search";

const Ingredients = () => {
  const [userIngredients, setUserIngredients] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();

  useEffect(() => {
    console.log("RENDERING INGREDIENTS", userIngredients);
  }, [userIngredients]);

  const filteredIngredientsHandler = useCallback(
    (filteredIngredients) => {
      setUserIngredients(filteredIngredients);
    },
    [setUserIngredients]
  );

  const addIngredientHandler = async (ingredient) => {
    setIsLoading(true);
    const response = await fetch(
      "https://react-http-ef0dc-default-rtdb.firebaseio.com/ingredients.json",
      {
        method: "POST",
        body: JSON.stringify(ingredient),
        headers: { "Content-Type": "application/json" },
      }
    );
    setIsLoading(false);
    const responseData = await response.json();
    setUserIngredients((prevIngredients) => {
      return [...prevIngredients, { id: responseData.name, ...ingredient }];
    });
  };

  const removeIngredientHandler = async (id) => {
    setIsLoading(true);
    try {
      await fetch(
        `https://react-http-ef0dc-default-rtdb.firebaseio.com/ingredients/${id}.json`,
        {
          method: "DELETE",
        }
      );
      setIsLoading(false);
      setUserIngredients((prevIngredients) => {
        return prevIngredients.filter((ingredient) => ingredient.id !== id);
      });
    } catch (error) {
      setError("Something went wrong!");
      setIsLoading(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  return (
    <div className="App">
      {error && <ErrorModal onClose={clearError}>{error}</ErrorModal>}
      <IngredientForm
        onAddIngredient={addIngredientHandler}
        loading={isLoading}
      />

      <section>
        <Search onLoadIngredients={filteredIngredientsHandler} />
        <IngredientList
          ingredients={userIngredients}
          onRemoveItem={removeIngredientHandler}
        />
      </section>
    </div>
  );
};

export default Ingredients;
