import React from "react";

export const Dropdown = ({ getSearchItems, maxNumSelections }) => {
  const [isFocussed, setIsFocussed] = React.useState(false);
  const [searchData, setSearchData] = React.useState([]);
  const [hasSearchError, setHasSearchError] = React.useState(null);
  const [searchErrorMsg, setSearchErrorMsg] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [selectedItems, setSelectedItems] = React.useState([]);
  const inputRef = React.useRef(null);
  const topElRef = React.useRef(null);
  const onInputChangeRef = React.useRef(null);
  onInputChangeRef.current = searchStr => {
    setIsLoading(true);
    getSearchItems(
      searchStr,
      data => {
        if (searchStr === inputRef.current.value) {
          setSearchData(data);
          setIsLoading(false);
          setHasSearchError(false);
        }
      },
      errMsg => {
        if (searchStr === inputRef.current.value) {
          setHasSearchError(true);
          setSearchErrorMsg(errMsg);
          setIsLoading(false);
        }
      }
    );
  };
  const debFetchSearchItems = React.useCallback(
    debounce(searchStr => {
      onInputChangeRef.current(searchStr);
    }, 200)
  );

  React.useEffect(() => {
    const handleOutsideClick = e => {
      if (!topElRef.current.contains(e.target)) {
        setIsFocussed(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  const focusComponent = () => {
    setIsFocussed(true);
    inputRef.current.focus();
  };


  return (
    <div
      ref={topElRef}
      style={{
        border: "1px solid grey",
        position: "relative",
        paddingBottom: "5px",
        borderRadius: "5px"
      }}
      tabIndex={0}
      onClick={focusComponent}
      onFocus={e => {
        if (e.target === topElRef.current) {
          focusComponent();
        }
      }}
    >
      <div style={{ display: "flex", flexWrap: "wrap" }}>
        {selectedItems.map(sel => {
          return (
            <div
              key={sel.value}
              title={sel.label}
              style={{
                fontSize: "14px",
                height: "25px",
                display: "flex",
                width: "calc(33% - 10px)",
                border: "1px solid black",
                borderRadius: "1000px",
                padding: "0px 10px",
                margin: "5px 5px 0px 5px",
                justifyContent: "space-between",
                alignItems: "center"
              }}
            >
              <div
                style={{
                  maxWidth: "80%",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis"
                }}
              >
                {sel.label}
              </div>
              <div
                style={{ fontSize: "18px", cursor: "pointer" }}
                onClick={() => {
                  let newSelectedItems = [...selectedItems];
                  newSelectedItems.splice(
                    newSelectedItems.findIndex(i => i.value === sel.value),
                    1
                  );
                  setSelectedItems(newSelectedItems);
                }}
              >
                x
              </div>
            </div>
          );
        })}
        <input
          style={{
            height: "25px",
            width: "calc(33% - 10px)",
            margin: "5px 5px 0px 5px",
            padding: "5px"
          }}
          tabIndex={-1}
          ref={inputRef}
          onChange={e => {
            const searchStr = e.target.value;
            inputRef.current.value = searchStr;
            debFetchSearchItems(searchStr);
          }}
        />
      </div>
      {isFocussed && selectedItems.length<maxNumSelections && inputRef.current.value.trim() ? (
        <div
          style={{
            width: "100%",
            background: "white",
            position: "absolute",
            right: "0px",
            border: "1px solid grey",
            boxShadow: "grey 1px 1px 1px 1px",
            padding: "5px 10px"
          }}
        >
          {(() => {
            if (isLoading) {
              return "Loading...";
            }
            if (hasSearchError) {
              return searchErrorMsg;
            }
            if (searchData.length === 0) {
              return "No results found";
            }
            return searchData
              .filter(d => !selectedItems.some(i => i.value === d.value))
              .map(d => {
                return (
                  <div
                    key={d.value}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      padding: "5px 0px"
                    }}
                    onClick={() => {
                      let newSelectedItems = [...selectedItems, d];
                      setSelectedItems(newSelectedItems);
                    }}
                  >
                    {d.label}
                  </div>
                );
              });
          })()}
        </div>
      ) : null}
    </div>
  );
};

const debounce = (func, delay) => {
  let debounceTimer;
  return function() {
    const context = this;
    const args = arguments;
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => func.apply(context, args), delay);
  };
};
