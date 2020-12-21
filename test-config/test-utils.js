import { render } from "@testing-library/react";
import { PostsContextProvider } from "../components/globalState";

const ContextRenderer = ({ children }) => {
  return <PostsContextProvider>{children}</PostsContextProvider>;
};

const customRender = (ui, options) =>
  render(ui, {
    wrapper: ContextRenderer,
    ...options,
  });

export * from "@testing-library/react";
export { customRender as render };
