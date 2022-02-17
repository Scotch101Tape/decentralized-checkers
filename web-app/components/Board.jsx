function Board(props) {
  const style = {
    display: "grid",
    gridTemplateColumns: "repeat(8, 50px)",
    gridTemplateRows: "repeat(8, 50px)",
    borderStyle: "solid",
    borderWidth: "4px",
    width: "401px",
    height: "401px",
    borderRadius: "5px",
    padding: "2px",
    background: "black",
    borderColor: "black"
  }

  return (<div className="grid" style={style}>
    {props.children}
  </div>)
}

export default Board