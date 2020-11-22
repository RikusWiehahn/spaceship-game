import { Dialog } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import {
  GiBattleMech,
  GiDefenseSatellite,
  GiSpaceship,
  GiStarfighter,
} from 'react-icons/gi';

type Enemy = 'SPACESHIP' | 'SATELLITE' | 'MECH';

interface State {
  balls: { x: number; y: number; type: Enemy; key: string }[];
  score: number;
}

const DEFAULT_STATE = {
  balls: [
    {
      x: 1000,
      y: 250,
      type: 'SPACESHIP' as Enemy,
      key: 'jhgjhgj',
    },
  ],
  score: 0,
};

function App() {
  let timeout: NodeJS.Timeout | null = null;
  const [state, setState] = useState<State>(DEFAULT_STATE);
  const [rocket, setRocket] = useState<{ x: number; y: number }>({
    x: 100,
    y: 250,
  });
  const [open, setOpen] = useState(false);

  useEffect(() => {
    _startGame();

    return () => {
      if (timeout) {
        clearTimeout(timeout);
      }
    };
  });

  useEffect(() => {
    for (const ball of state.balls) {
      if (
        ball.x < rocket.x + 40 &&
        ball.x > rocket.x - 40 &&
        ball.y < rocket.y + 60 &&
        ball.y > rocket.y - 60
      ) {
        _stopGame();
        setOpen(true);
      }
    }
  }, [state.balls, rocket.x, rocket.y, timeout]);

  const _startGame = () => {
    timeout = setTimeout(() => {
      _updateFrame();
      _startGame();
    }, 50);
  };

  const _stopGame = () => {
    setState({ score: 0, balls: [] });
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = null;
  };

  const _onUp = () => {
    setRocket({
      x: rocket.x,
      y: rocket.y < 490 ? rocket.y + 10 : rocket.y,
    });
  };

  const _onDown = () => {
    setRocket({
      x: rocket.x,
      y: rocket.y > 10 ? rocket.y - 10 : rocket.y,
    });
  };

  const _updateFrame = () => {
    const newBall = Math.random() * 1000;
    const newBalls: { x: number; y: number; type: Enemy; key: string }[] = [];
    for (const { x, y, type, key } of state.balls) {
      if (x > -150 && y > -150) {
        newBalls.push({ x: x - 10, y, type, key });
      }
    }
    if (newBall < 24) {
      const newBallX = 1200;
      const type: Enemy =
        newBall <= 8 ? 'SPACESHIP' : newBall <= 16 ? 'SATELLITE' : 'MECH';
      const newBallY = Math.random() * 500;
      newBalls.push({
        x: newBallX,
        y: newBallY,
        type,
        key: `${type}-${newBallY}-${newBall}`,
      });
    }
    // update
    setState({ ...state, balls: newBalls, score: state.score + 1 });
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gray-800">
      <div
        className="relative bg-gray-900 rounded-lg shadow-xl overflow-hidden"
        style={{ width: 1000, height: 500 }}
      >
        {open ? null : (
          <div className="absolute top-0 right-0 p-4">
            <div className="text-white z-10">{`Score: ${state.score}`}</div>
          </div>
        )}
        {state.balls.map(({ x, y, type, key }) =>
          type === 'MECH' ? (
            <GiBattleMech
              key={`ball-${key}`}
              style={{ left: x, bottom: y }}
              className="absolute h-24 w-24 text-red-900 transform translate-x-1/2 translate-y-1/2"
            />
          ) : type === 'SPACESHIP' ? (
            <GiStarfighter
              key={`ball-${key}`}
              style={{ left: x, bottom: y }}
              className="absolute h-24 w-24 text-red-900 transform -rotate-90 translate-x-1/2 translate-y-1/2"
            />
          ) : (
            <GiDefenseSatellite
              key={`ball-${key}`}
              style={{ left: x, bottom: y }}
              className="absolute h-24 w-24 text-red-900 transform translate-x-1/2 translate-y-1/2"
            />
          )
        )}
        {open ? null : <Rocket rocket={rocket} onUp={_onUp} onDown={_onDown} />}
      </div>
      <div className="text-white mt-4">
        Use the up/down arrow keys to control the spaceship
      </div>
      <Dialog
        open={open}
        onClose={() => {
          setOpen(false);
          setState({ score: 0, balls: [] });
        }}
        disableBackdropClick
        PaperProps={{ elevation: 0 }}
      >
        <div className="p-4 w-64">
          <div className="text-2xl font-bold mb-4 text-center">You died</div>
          <button
            className="bg-red-700 hover:bg-red-800 text-white py-2 px-8 rounded-lg w-full"
            onClick={() => {
              setOpen(false);
              setState({ score: 0, balls: [] });
            }}
          >
            Back
          </button>
        </div>
      </Dialog>
    </div>
  );
}

const Rocket = ({
  rocket,
  onUp,
  onDown,
}: {
  rocket: { x: number; y: number };
  onUp: () => void;
  onDown: () => void;
}) => {
  useEffect(() => {
    window.addEventListener('keydown', _handleArrowKey);
    return () => {
      window.removeEventListener('keydown', _handleArrowKey);
    };
  });

  const _handleArrowKey = (e: KeyboardEvent) => {
    if (e.code === 'ArrowUp') {
      onUp();
    }
    if (e.code === 'ArrowDown') {
      onDown();
    }
  };

  return (
    <GiSpaceship
      key="Spaceship"
      style={{ left: rocket.x, bottom: rocket.y }}
      className="absolute h-16 w-16 text-green-500 transform duration-75 rotate-90 translate-x-1/2 translate-y-1/2"
    />
  );
};

export default App;
