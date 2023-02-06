import { useReducer, useEffect, useCallback, useMemo } from "react";

import IngredientForm from "./IngredientForm";
import IngredientList from "./IngredientList";
import ErrorModal from "../UI/ErrorModal";
import Search from "./Search";

const ingredientsReducer = (currentIngredients, action) => {
  switch (action.type) {
    case "SET":
      return action.ingredients;
    case "ADD":
      return [...currentIngredients, action.ingredient];
    case "DELETE":
      return currentIngredients.filter(
        (ingredient) => ingredient.id !== action.id
      );
    default:
      throw new Error("Should not be reached!");
  }
};

const httpReducer = (currentHttpState, action) => {
  switch (action.type) {
    case "SEND":
      return { loading: true, error: null };
    case "RESPONSE":
      return { ...currentHttpState, loading: false };
    case "ERROR":
      return { loading: false, error: action.errorMessage };
    case "CLEAR_ERROR":
      return { ...currentHttpState, error: null };
    default:
      throw new Error("Should not be reached!");
  }
};

const Ingredients = () => {
  const [userIngredients, dispatchUserIngredients] = useReducer(
    ingredientsReducer,
    []
  );
  const [httpState, dispatchHttp] = useReducer(httpReducer, {
    loading: false,
    error: null,
  });

  useEffect(() => {
    console.log("RENDERING INGREDIENTS", userIngredients);
  }, [userIngredients]);

  const filteredIngredientsSuccessHandler = useCallback(
    (filteredIngredients) => {
      dispatchUserIngredients({
        type: "SET",
        ingredients: filteredIngredients,
      });
    },
    []
  );

  const filteredIngredientsErrorHandler = useCallback((errorMessage) => {
    dispatchHttp({ type: "ERROR", errorMessage: errorMessage });
  }, []);

  const addIngredientHandler = useCallback(async (ingredient) => {
    try {
      dispatchHttp({ type: "SEND" });
      const response = await fetch(
        "https://react-http-ef0dc-default-rtdb.firebaseio.com/ingredients.json",
        {
          method: "POST",
          body: JSON.stringify(ingredient),
          headers: { "Content-Type": "application/json" },
        }
      );
      dispatchHttp({ type: "RESPONSE" });
      const responseData = await response.json();
      dispatchUserIngredients({
        type: "ADD",
        ingredient: { id: responseData.name, ...ingredient },
      });
    } catch (error) {
      dispatchHttp({ type: "ERROR", errorMessage: "Something went wrong!" });
    }
  }, []);

  const removeIngredientHandler = useCallback(async (id) => {
    try {
      dispatchHttp({ type: "SEND" });
      await fetch(
        `https://react-http-ef0dc-default-rtdb.firebaseio.com/ingredients/${id}.json`,
        {
          method: "DELETE",
        }
      );
      dispatchHttp({ type: "RESPONSE" });
      dispatchUserIngredients({ type: "DELETE", id: id });
    } catch (error) {
      dispatchHttp({ type: "ERROR", errorMessage: "Something went wrong!" });
    }
  }, []);

  const clearError = useCallback(() => {
    dispatchHttp({ type: "CLEAR_ERROR" });
  }, []);

  const ingredientList = useMemo(() => {
    return (
      <IngredientList
        ingredients={userIngredients}
        onRemoveItem={removeIngredientHandler}
      />
    );
  }, [userIngredients, removeIngredientHandler]);

  return (
    <div className="App">
      {httpState.error && (
        <ErrorModal onClose={clearError}>{httpState.error}</ErrorModal>
      )}
      <IngredientForm
        onAddIngredient={addIngredientHandler}
        loading={httpState.loading}
      />

      <section>
        <Search
          onSuccessLoadingIngredients={filteredIngredientsSuccessHandler}
          onErrorLoadingIngredients={filteredIngredientsErrorHandler}
        />
        {ingredientList}
      </section>
    </div>
  );
};

export default Ingredients;
