import React, { useReducer, createContext } from "react";
import produce from "immer";

export const PostsContext = createContext();

export function PostsContextProvider({ children }) {
  // base state
  const initialState = {
    Present: [],
    Past: [],
  };

  // swap two indices in an array without mutating the original
  // this is to avoid race conditions when updating state
  const swapArrayIndices = (array, index1, index2) => {
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
      case "MOVE_UP_AND_DOWN": {
        // de-structure indices to swap from payload
        const { index1, index2 } = action.payload;
        // get new array
        let newArray = swapArrayIndices(state.Present, index1, index2);
        return {
          Past: [...state.Past, state.Present],
          Present: newArray,
        };
      }
      case "TIME_TRAVEL": {
        // de-structure the former state to push to Present from payload
        // and it's index in Past.reverse() to remove later states from
        const { formerState, indexInReversePast } = action.payload;

        // store state to push to present in immutable state to prevent race conditions
        let formerStateBufferArray = produce(formerState, () => {});

        // actually time travel
        // i.e remove all future states from the index of the given former state
        // i.e all items right of given index in Past array
        // same as all items left of given index in reversed Past array
        let restoredPast = produce([...state.Past].reverse(), (draftArray) => {
          // remove all items between zero and index+1
          draftArray.splice(0, indexInReversePast + 1);
        });

        // reverse again to get right Past order
        return {
          Past: [...restoredPast].reverse(),
          Present: formerStateBufferArray,
        };
      }
      default:
        throw new Error("dispatched wrong action");
    }
  }

  const [Posts, dispatchPosts] = useReducer(postsReducer, initialState);

  return (
    <PostsContext.Provider value={{ Posts, dispatchPosts }}>
      {children}
    </PostsContext.Provider>
  );
}
