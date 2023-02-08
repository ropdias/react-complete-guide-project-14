import { useReducer, useEffect, useCallback, useMemo } from "react";

import IngredientForm from "./IngredientForm";
import IngredientList from "./IngredientList";
import ErrorModal from "../UI/ErrorModal";
import Search from "./Search";
import useHttp from "../../hooks/http";

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

const Ingredients = () => {
  const [userIngredients, dispatchUserIngredients] = useReducer(
    ingredientsReducer,
    []
  );
  const {
    sendRequest,
    isLoading,
    error,
    responseData,
    reqExtra,
    reqIdentifier,
    clear,
  } = useHttp();

  useEffect(() => {
    switch (reqIdentifier) {
      case "REMOVE_INGREDIENT":
        dispatchUserIngredients({ type: "DELETE", id: reqExtra });
        break;
      case "ADD_INGREDIENT":
        dispatchUserIngredients({
          type: "ADD",
          ingredient: { id: responseData.name, ...reqExtra },
        });
        break;
      default:
        break;
    }
  }, [reqIdentifier, responseData, reqExtra]);

  const filteredIngredientsSuccessHandler = useCallback(
    (filteredIngredients) => {
      dispatchUserIngredients({
        type: "SET",
        ingredients: filteredIngredients,
      });
    },
    []
  );

  const addIngredientHandler = useCallback(
    (ingredient) => {
      sendRequest(
        "https://react-http-ef0dc-default-rtdb.firebaseio.com/ingredients.json",
        "POST",
        JSON.stringify(ingredient),
        ingredient,
        "ADD_INGREDIENT"
      );
    },
    [sendRequest]
  );

  const removeIngredientHandler = useCallback(
    (id) => {
      sendRequest(
        `https://react-http-ef0dc-default-rtdb.firebaseio.com/ingredients/${id}.json`,
        "DELETE",
        null,
        id,
        "REMOVE_INGREDIENT"
      );
    },
    [sendRequest]
  );

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
      {error && <ErrorModal onClose={clear}>{error}</ErrorModal>}
      <IngredientForm
        onAddIngredient={addIngredientHandler}
        loading={isLoading}
      />

      <section>
        <Search
          onSuccessLoadingIngredients={filteredIngredientsSuccessHandler}
        />
        {ingredientList}
      </section>
    </div>
  );
};

export default Ingredients;
