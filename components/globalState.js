import React, { useReducer, createContext } from "react";
import produce from "immer";

export const PostsContext = createContext();

export function PostsContextProvider({ children }) {
  // base state
  const initialState = {
    Present: [],
    Past: [],
  };

  // swap two indexes in an array without mutating the original
  const swapArrayIndexes = (array, index1, index2) => {
    let newArray = produce(array, (draftArray) => {
      // swap index positions
      [draftArray[index1], draftArray[index2]] = [
        draftArray[index2],
        draftArray[index1],
      ];
    });
    // return the new array
    return newArray;
  };

  function postsReducer(state, action) {
    switch (action.type) {
      case "INITIAL_FETCH":
        return { ...state, Present: action.payload };
      case "MOVE_DOWN": {
        // de-structure indexes to swap from payload
        const { index1, index2 } = action.payload;
        // get new array
        let newArray = swapArrayIndexes(state.Present, index1, index2);
        return { ...state, Past: state.Present, Present: newArray };
      }
      case "MOVE_UP": {
        // de-structure indexes to swap from payload
        const { index1, index2 } = action.payload;
        // get new array
        let newArray = swapArrayIndexes(state.Present, index1, index2);
        return { ...state, Past: state.Present, Present: newArray };
      }
      default:
        throw new Error("dispatched wrong action type");
    }
  }

  const [Posts, dispatchPosts] = useReducer(postsReducer, initialState);

  return (
    <PostsContext.Provider value={{ Posts, dispatchPosts }}>
      {children}
    </PostsContext.Provider>
  );
}
