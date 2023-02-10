import { useReducer, useCallback } from "react";

const initialState = {
  isLoading: false,
  error: null,
  responseData: null,
  reqExtra: null,
  reqIdentifier: null,
};

const httpReducer = (currentHttpState, action) => {
  switch (action.type) {
    case "SEND":
      return {
        isLoading: true,
        error: null,
        responseData: null,
        reqExtra: null,
        reqIdentifier: null,
      };
    case "RESPONSE":
      return {
        ...currentHttpState,
        isLoading: false,
        error: null,
        responseData: action.responseData,
        reqExtra: action.reqExtra,
        reqIdentifier: action.reqIdentifier,
      };
    case "ERROR":
      return {
        isLoading: false,
        error: action.errorMessage,
        responseData: null,
        reqExtra: null,
        reqIdentifier: null,
      };
    case "CLEAR":
      return initialState;
    default:
      throw new Error("Should not be reached!");
  }
};

const useHttp = () => {
  const [httpState, dispatchHttp] = useReducer(httpReducer, initialState);

  const clear = useCallback(() => dispatchHttp({ type: "CLEAR" }), []);

  const sendRequest = useCallback(
    async (url, method, body, reqExtra, reqIdentifier) => {
      try {
        // When we use dispatchHttp inside the custom hook it will update the state
        // and therefore it will retrigger the component that uses our hook to rebuild itself.
        dispatchHttp({ type: "SEND" });
        const response = await fetch(url, {
          method: method,
          body: body,
          headers: {
            "Content-Type": "application/json",
          },
        });
        const responseData = await response.json();
        if (!response.ok) {
          if (responseData.error) {
            throw new Error(responseData.error);
          } else {
            throw new Error("http response was not successful (status is not in the range 200-299)");
          }
        }
        dispatchHttp({
          type: "RESPONSE",
          responseData: responseData,
          reqExtra: reqExtra,
          reqIdentifier: reqIdentifier,
        });
      } catch (error) {
        dispatchHttp({ type: "ERROR", errorMessage: error.message });
      }
    },
    []
  );

  return {
    sendRequest: sendRequest,
    isLoading: httpState.isLoading,
    error: httpState.error,
    responseData: httpState.responseData,
    reqExtra: httpState.reqExtra,
    reqIdentifier: httpState.reqIdentifier,
    clear: clear,
  };
};

export default useHttp;
