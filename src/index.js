import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import { Dropdown } from "./Dropdown";

const App = () => {
  return (
    <div style={{ width: "400px", margin: "50px auto" }}>
      <Dropdown
        maxNumSelections={5}
        getSearchItems={async (searchVal, setData, setErrMsg) => {
          let r = await fetch(
            `http://www.omdbapi.com/?s=${searchVal}&apikey=dd533a41`
          );
          r.json()
            .then(res => {
              if (Array.isArray(res.Search)) {
                setData(
                  res.Search.map(movie => ({
                    label: movie.Title,
                    value: movie.Title
                  }))
                );
              } else {
                throw new Error(res.Error);
              }
            })
            .catch(err => {
              setErrMsg(err.message);
            });
        }}
      />
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));
