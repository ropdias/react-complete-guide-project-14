import { useReducer, useEffect, useCallback } from "react";

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
  // const [userIngredients, setUserIngredients] = useState([]);
  // const [isLoading, setIsLoading] = useState(false);
  // const [error, setError] = useState();

  useEffect(() => {
    console.log("RENDERING INGREDIENTS", userIngredients);
  }, [userIngredients]);

  const filteredIngredientsHandler = useCallback((filteredIngredients) => {
    // setUserIngredients(filteredIngredients);
    dispatchUserIngredients({ type: "SET", ingredients: filteredIngredients });
  }, []);

  const addIngredientHandler = async (ingredient) => {
    // setIsLoading(true);
    dispatchHttp({ type: "SEND" });
    const response = await fetch(
      "https://react-http-ef0dc-default-rtdb.firebaseio.com/ingredients.json",
      {
        method: "POST",
        body: JSON.stringify(ingredient),
        headers: { "Content-Type": "application/json" },
      }
    );
    // setIsLoading(false);
    dispatchHttp({ type: "RESPONSE" });
    const responseData = await response.json();
    // setUserIngredients((prevIngredients) => {
    //   return [...prevIngredients, { id: responseData.name, ...ingredient }];
    // });
    dispatchUserIngredients({
      type: "ADD",
      ingredient: { id: responseData.name, ...ingredient },
    });
  };

  const removeIngredientHandler = async (id) => {
    // setIsLoading(true);
    dispatchHttp({ type: "SEND" });
    try {
      await fetch(
        `https://react-http-ef0dc-default-rtdb.firebaseio.com/ingredients/${id}.json`,
        {
          method: "DELETE",
        }
      );
      // setIsLoading(false);
      dispatchHttp({ type: "RESPONSE" });
      // setUserIngredients((prevIngredients) => {
      //   return prevIngredients.filter((ingredient) => ingredient.id !== id);
      // });
      dispatchUserIngredients({ type: "DELETE", id: id });
    } catch (error) {
      dispatchHttp({ type: "ERROR", errorMessage: "Something went wrong!" });
      // setError("Something went wrong!");
      // setIsLoading(false);
    }
  };

  const clearError = () => {
    // setError(null);
    dispatchHttp({ type: "CLEAR_ERROR" });
  };

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
