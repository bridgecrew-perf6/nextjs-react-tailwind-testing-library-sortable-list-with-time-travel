import "../styles/index.css";
import { PostsContextProvider } from "../components/globalState";

function MyApp({ Component, pageProps }) {
  return (
    <PostsContextProvider>
      <Component {...pageProps} />
    </PostsContextProvider>
  );
}

export default MyApp;
