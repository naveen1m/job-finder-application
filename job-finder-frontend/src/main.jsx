import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";

const TOKEN = localStorage.getItem("token") || "token";
// console.log("TOKEN", TOKEN);

const client = new ApolloClient({
  uri: "https://job-finder-backend-wb65.onrender.com/graphql",
  // uri: "http://localhost:3000/graphql",
  headers: {
    Authorization: `JWT ${TOKEN}`,
  },
  cache: new InMemoryCache(),
});

createRoot(document.getElementById("root")).render(
  <ApolloProvider client={client}>
    <StrictMode>
      <App />
    </StrictMode>
  </ApolloProvider>
);
