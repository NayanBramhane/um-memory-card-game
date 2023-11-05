import Data from "./data";
import Card from "./Card";
import { useState } from "react";
import { useEffect } from "react";

const GameBoard = () => {
  const [cardsArray, setCardsArray] = useState([]);
  const [moves, setMoves] = useState(0);
  const [firstCard, setFirstCard] = useState(null);
  const [secondCard, setSecondCard] = useState(null);
  const [stopFlip, setStopFlip] = useState(false);
  const [won, setWon] = useState(0);

  //this function start new Game
  const newGame = () => {
    setTimeout(() => {
      const randomOrderArray = Data.sort(() => 0.5 - Math.random());
      setCardsArray(randomOrderArray);
      setMoves(0);
      setFirstCard(null);
      setSecondCard(null);
      setWon(0);
    }, 1300);
  };

  //this function helps in storing the firstCard and secondCard value
  const handleSelectedCards = (item) => {
    console.log(typeof item);
    if (firstCard !== null && firstCard.id !== item.id) {
      setSecondCard(item);
    } else {
      setFirstCard(item);
    }
  };

  // if two have been selected then we check if the images are same or not,
  //if they are same then we stop the flipping ability
  // else we turn them back
  useEffect(() => {
    if (firstCard && secondCard) {
      setStopFlip(true);
      if (firstCard.name === secondCard.name) {
        setCardsArray((prevArray) => {
          return prevArray.map((unit) => {
            if (unit.name === firstCard.name) {
              return { ...unit, matched: true };
            } else {
              return unit;
            }
          });
        });
        setWon((preVal) => preVal + 1);
        removeSelection();
      } else {
        setTimeout(() => {
          removeSelection();
        }, 1000);
      }
    }
  }, [firstCard, secondCard]);

  //after the slected images have been checked for
  //equivalency we empty the firstCard and secondCard component
  function removeSelection() {
    setFirstCard(null);
    setSecondCard(null);
    setStopFlip(false);
    setMoves((prevValue) => prevValue + 1);
  }

  //starts the game for the first time.
  useEffect(() => {
    newGame();
  }, []);

  return (
    <div className="container">
      <div className="header">
        <h1>Memory Game</h1>
      </div>
      <div className="board">
        {
          // cards component help in coverting the
          // data from array to visible data for screen
          cardsArray.map((item) => (
            <Card
              item={item}
              key={item.id}
              handleSelectedCards={handleSelectedCards}
              toggled={
                item === firstCard ||
                item === secondCard ||
                item.matched === true
              }
              stopflip={stopFlip}
            />
          ))
        }
      </div>

      {won !== 6 ? (
        <div className="comments">Moves : {moves}</div>
      ) : (
        <div className="comments">
          Congratulations! You Won in {moves} moves.
        </div>
      )}
      <button className="button" onClick={newGame}>
        New Game
      </button>
    </div>
  );
};

export default GameBoard;
