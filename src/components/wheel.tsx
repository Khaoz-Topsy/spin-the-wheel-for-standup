import { createEffect, createSignal, JSX, type Component } from 'solid-js';

import { WheelOption } from '../contracts/wheelOption';

interface IProps {
  options: Array<WheelOption>;
  enableName: (optId: string, isEnabled: boolean) => void;
}

const size = 512;
const viewBoxPadding = 2;
const wheelBg = 'rgb(77, 77, 77)';
const wheelStroke = 'white';
const logoSize = 100;
const shakeClass = 'animate__shakeX';

export const Wheel: Component<IProps> = (props: IProps) => {
  const [anglePerSlice, setAnglePerSlice] = createSignal<number>(360 / props.options.length);
  const [selectedAngle, setSelectedAngle] = createSignal<number>(0);
  const [rotationInc, setRotationInc] = createSignal<number>(0);
  const [isShaking, setIsShaking] = createSignal<boolean>(false);
  const [winnerIndex, setWinnerIndex] = createSignal<number>(0);
  const [isModalOpen, setModalOpen] = createSignal<boolean>(false);

  const centerPoint = size / 2 + viewBoxPadding;

  createEffect(() => {
    const value = 360 / props.options.length;
    setAnglePerSlice(Number(value.toFixed(2)));
  }, [props.options, props.options.length]);

  const spinTheWheel = () => {
    if (props.options.length < 1) return;
    const selectedItem = Math.round(Math.random() * (props.options.length - 1));
    setWinnerIndex(selectedItem);

    const selectedItemAngle = selectedItem * anglePerSlice();
    const randomAngleWithinSlice = Math.round(Math.random() * anglePerSlice());
    const randomSpotOnItem = randomAngleWithinSlice - anglePerSlice() / 2;

    const randomNumOfSpins = Math.round(Math.random() * 10) + 5;
    const randomRotationIncrement = randomNumOfSpins * 360;
    const selectedItemAngleWithRandomness = selectedItemAngle + randomSpotOnItem;
    setTimeout(() => {
      setSelectedAngle(selectedItemAngleWithRandomness);
      setRotationInc((prev) => prev + randomRotationIncrement);
    }, 250);

    if (randomNumOfSpins > 10) {
      setTimeout(() => {
        setIsShaking(true);
        setTimeout(() => {
          setIsShaking(false);
        }, 4000);
      }, 2000);
    }

    setTimeout(() => {
      setModalOpen(true);
    }, 5500);
  };

  const Outer = (outerProps: { children: JSX.Element }) => {
    return (
      <div class="wheel" onClick={spinTheWheel}>
        <div class="outer">
          <div class="selection" style={{ transform: `rotate(-${selectedAngle()}deg)` }}>
            <div class="spin" style={{ transform: `rotate(${rotationInc()}deg)` }}>
              <div
                class={`shake animate__animated ${isShaking() ? shakeClass : ''}`}
                style="--animate-duration: 2s"
              >
                <div class="wheel">{outerProps.children}</div>
              </div>
            </div>
          </div>
        </div>
        <span class="arrow">▼</span>
      </div>
    );
  };

  return (
    <>
      <Outer>
        <svg
          viewBox={`0 0 ${size + viewBoxPadding * 2} ${size + viewBoxPadding * 2}`}
          xmlns="http://www.w3.org/2000/svg"
          style={`transform: rotate(-${anglePerSlice() / 2}deg);`}
        >
          <circle
            cx={centerPoint}
            cy={centerPoint}
            r={centerPoint}
            fill={wheelBg}
            stroke={wheelStroke}
            class="pointer"
          />
          <g id="options">
            {props.options.map((opt, index) => (
              <>
                <line
                  x1={centerPoint}
                  y1={centerPoint}
                  x2={centerPoint}
                  y2={0}
                  fill={wheelBg}
                  stroke={wheelStroke}
                  style={`transform: rotate(${
                    anglePerSlice() * index
                  }deg); transform-origin: center;`}
                ></line>

                <text
                  x={centerPoint}
                  y={size / 8}
                  text-anchor="middle"
                  style={`transform: rotate(${
                    anglePerSlice() * (index + 0.5)
                  }deg); transform-origin: center;`}
                >
                  {opt.emoji}
                </text>

                <text
                  x={centerPoint}
                  y={size / 5}
                  text-anchor="middle"
                  style={`transform: rotate(${
                    anglePerSlice() * (index + 0.5)
                  }deg); transform-origin: center;`}
                >
                  {opt.name}
                </text>
              </>
            ))}
          </g>
          <circle
            cx={centerPoint}
            cy={centerPoint}
            r={(logoSize / 3) * 2}
            fill={wheelBg}
            stroke={wheelStroke}
          />
          <image
            href="/assets/img/logo.png"
            height={logoSize}
            width={logoSize}
            x={centerPoint - logoSize / 2}
            y={centerPoint - logoSize / 2}
            clip-path="inset(0% round 32px)"
            style={`transform: rotate(${anglePerSlice() / 2}deg); transform-origin: center;`}
          />
        </svg>
      </Outer>

      <dialog open={isModalOpen()}>
        <article>
          <header>
            <span class="pointer" style={{ float: 'right' }} onClick={() => setModalOpen(false)}>
              ❌
            </span>
            <strong>🎉 The winner is</strong>
          </header>
          <div class="ta-center mb-2">
            <h1>{props.options[winnerIndex()]?.emoji ?? '⁉️'}</h1>
            <h2>{props.options[winnerIndex()]?.name ?? '???'}</h2>
          </div>

          <div class="grid">
            <button
              class="secondary"
              onClick={() => props.enableName(props.options[winnerIndex()]?.id ?? '', false)}
            >
              Hide choice
            </button>
            <button onClick={() => setModalOpen(false)}>Close</button>
          </div>
        </article>
      </dialog>
    </>
  );
};
