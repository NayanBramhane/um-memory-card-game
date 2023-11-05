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
  const [startTime, setStartTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  // Function to start the timer
  const startTimer = () => {
    setStartTime(Date.now());
    setIsTimerRunning(true);
  };

  // Handle starting a new game
  const newGame = () => {
    // Function to reset the timer
    setStartTime(null);
    setElapsedTime(0);
    
    setTimeout(() => {
      const randomOrderArray = Data.sort(() => 0.5 - Math.random());
      setCardsArray(randomOrderArray);
      setMoves(0);
      setFirstCard(null);
      setSecondCard(null);
      setWon(0);
      startTimer(); // Start the timer when a new game begins
    }, 1300);
  };

  //this function helps in storing the firstCard and secondCard value
  const handleSelectedCards = (item) => {
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
  const removeSelection = () => {
    setFirstCard(null);
    setSecondCard(null);
    setStopFlip(false);
    setMoves((prevValue) => prevValue + 1);
  };

  // Effect to update the elapsed time
  useEffect(() => {
    if (isTimerRunning && won !== 6) {
      // Check if the game is not won
      const interval = setInterval(() => {
        setElapsedTime(Date.now() - startTime);
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [isTimerRunning, startTime, won]);

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
        <div className="comments">
          Moves: {moves} | Time: {Math.floor(elapsedTime / 1000)} seconds
        </div>
      ) : (
        <div className="comments">
          Congratulations! You Won in {moves} moves and{" "}
          {Math.floor(elapsedTime / 1000)} seconds.
        </div>
      )}
      <button className="button" onClick={newGame}>
        New Game
      </button>
    </div>
  );
};

export default GameBoard;
