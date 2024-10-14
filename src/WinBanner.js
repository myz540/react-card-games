const WinBanner = ({ onPlayAgain }) => {
  return (
    <div className="win-banner-overlay">
      <div className="win-banner">
        <h2>Congratulations!</h2>
        <p>You've won the game!</p>
        <button onClick={onPlayAgain}>Play Again</button>
      </div>
    </div>
  );
};

export default WinBanner;
