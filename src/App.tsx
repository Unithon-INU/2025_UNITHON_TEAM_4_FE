import { RouterProvider } from "react-router-dom";
import Router from "./routes/router";
import ReactQuerySetting from "./libraries/reactQuery/ReactQuerySetting";
import "./index.css";
function App() {
  return (
    <ReactQuerySetting>
      <RouterProvider router={Router}  />
    </ReactQuerySetting>
  );
}

export default App;