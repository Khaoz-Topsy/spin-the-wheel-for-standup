import { createSignal, onMount, type Component } from 'solid-js';

import { Wheel } from './wheel';
import { WheelForm } from './wheelForm';
import { WheelOption } from '../contracts/wheelOption';
import JSConfetti from 'js-confetti';
import { WheelMeta } from '../contracts/wheelMeta';

const optionsLocalKey = 'spin-the-wheel-options';
const metaLocalKey = 'spin-the-wheel-meta';

export const WheelPanel: Component = () => {
  const jsConfetti = new JSConfetti();
  const [isSpinning, setIsSpinning] = createSignal<boolean>(false);
  const [options, setOptions] = createSignal<Array<WheelOption>>([]);
  const [meta, setMeta] = createSignal<WheelMeta>({
    duration: 5000,
  });

  onMount(() => {
    const optionsFromLocalStr = localStorage.getItem(optionsLocalKey);
    if (optionsFromLocalStr != null) setOptions(JSON.parse(optionsFromLocalStr));

    const metaFromLocalStr = localStorage.getItem(metaLocalKey);
    if (metaFromLocalStr != null) setMeta(JSON.parse(metaFromLocalStr));
  });

  const addOption = (opt: WheelOption) => {
    setOptions((prev) => {
      const newOpts = [...prev, opt];
      localStorage.setItem(optionsLocalKey, JSON.stringify(newOpts));
      return newOpts;
    });
  };

  const enableName = (id: string, isEnabled: boolean) => {
    setOptions((prev) => {
      const newOpts = prev.map((opt) => {
        if (opt.id == id) {
          return {
            ...opt,
            enabled: isEnabled,
          };
        }
        return opt;
      });
      localStorage.setItem(optionsLocalKey, JSON.stringify(newOpts));
      return newOpts;
    });
  };

  const removeOption = (opt: WheelOption) => {
    setOptions((prev) => {
      const newOpts = prev.filter((p) => p.id != opt.id);
      localStorage.setItem(optionsLocalKey, JSON.stringify(newOpts));
      return newOpts;
    });
  };

  const setAndSaveMeta = (newMeta: WheelMeta) => {
    setMeta(newMeta);
    localStorage.setItem(metaLocalKey, JSON.stringify(newMeta));
  };

  const showConfetti = (emojis: Array<string>) => {
    jsConfetti.addConfetti({
      emojis,
      emojiSize: 50,
    });
  };

  return (
    <div class="grid">
      <Wheel
        options={options().filter((opt) => opt.enabled == true)}
        meta={meta()}
        isSpinning={isSpinning()}
        setIsSpinning={setIsSpinning}
        setMeta={setAndSaveMeta}
        showConfetti={showConfetti}
        enableName={enableName}
      />
      <WheelForm
        options={options()}
        meta={meta()}
        isSpinning={isSpinning()}
        setMeta={setAndSaveMeta}
        addName={addOption}
        enableName={enableName}
        removeName={removeOption}
      />
    </div>
  );
};
