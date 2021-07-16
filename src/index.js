import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import './index.css';

function Square(props) {
  
  const className = props.highlighted ? 'highlightedSquare' : 'square';
  return (
    <button 
      className={className}
      onClick={props.onClick}
    >
      {props.value}
    </button>
  );
}
  
class Board extends React.Component {  
  renderSquare(i) {
    let highlighted = false;
    if (this.props.highlighted && this.props.highlighted.includes(i)) {
      highlighted = true;
    }     
    return (
      <Square 
        highlighted={highlighted} 
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  squares() {
    const squares = [];
    for (let i = 0; i < 9; ++i) {
      squares.push(i);
    }
    return squares;
  }

  render() {
    return (
      <div className="board">
        {this.squares().map((item, index) => (
          <div
            key={index}
            className="square-box"
          >
            {this.renderSquare(item)}
          </div>
        )
              
        )}
          
      </div>
    );
  }
}
  
class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
        chosenSquare: null,
      }],
      stepNumber: 0,
      xIsNext: true,
      highlighted: null,
      isReverse: false,
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[this.state.stepNumber];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares:squares,
        chosenSquare: {
          row: Math.floor(i/3),
          col: i % 3,
        },
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
            
    if (calculateWinner(squares)) {
      this.highlightSquare(calculateWinner(squares).winningCombination);
    }
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }
      
  handleMouseOver({row, col}) {
    this.setState({
      highlighted: [row*3+col],
    });
  }

  handleMouseOut() {
    this.setState({
      highlighted: null,
    });
  }

  highlightSquare(arr) {
    this.setState({
      highlighted: arr,
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);
        
    const moves = history.map((step, move) => {
      const desc = move ?
        'Перейти к ходу #' + move + '(' + step.chosenSquare.row + '; ' + step.chosenSquare.col + ')':
        'К началу игры';

      const info = move ? 
        (<li key={move}>
          <button 
            onClick={() => this.jumpTo(move)}
            onMouseOver={() => this.handleMouseOver(step.chosenSquare)}
            onMouseOut={() => this.handleMouseOut()}
          >{desc}</button>
        </li>) 
        :
        (<li key={move}>
          <button 
            onClick={() => this.jumpTo(move)}
          >{desc}</button>
        </li>);

      return info;
    });

    let status;
    if (winner) {
      status = 'Выиграл ' + winner.win;
    } else {
      status = 'Следующий ход: ' + (this.state.xIsNext ? 'X' : 'O');
    }
    if (!winner && history.length > 9) status = 'ничья'; 
        
    if (this.state.isReverse) moves.reverse();
    
    return (
      <div className="game">
        <div className="game-board">
          <Board 
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
            highlighted={this.state.highlighted}        
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
        <div >
          <button onClick={() => {
            this.setState({
              isReverse: !this.state.isReverse,
            });
          }}>reverse</button>
        </div>
      </div>
    );
  }
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return {
        win: squares[a],
        winningCombination: lines[i],
      };
    }
  }
  return null;
}
  
// ========================================
  
ReactDOM.render(
  <Game />,
  document.getElementById('root')
); 

Square.propTypes = {
  highlighted: PropTypes.boolean,
  onClick: PropTypes.func,
  value: PropTypes.string,
};

Board.propTypes = {
  highlighted: PropTypes.boolean,
  onClick: PropTypes.func,
  squares: PropTypes.Array,
};