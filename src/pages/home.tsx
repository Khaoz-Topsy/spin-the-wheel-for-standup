import { createSignal, onMount, type Component } from 'solid-js';

import { Wheel } from '../components/wheel';
import { WheelForm } from '../components/wheelForm';
import { WheelOption } from '../contracts/wheelOption';

const localKey = 'options';
export const Home: Component = () => {
  const [options, setOptions] = createSignal<Array<WheelOption>>([]);

  onMount(() => {
    const optionsFromLocalStr = localStorage.getItem(localKey) ?? '[]';
    setOptions(JSON.parse(optionsFromLocalStr));
  });

  const addOption = (opt: WheelOption) => {
    setOptions((prev) => {
      const newOpts = [...prev, opt];
      localStorage.setItem(localKey, JSON.stringify(newOpts));
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
      localStorage.setItem(localKey, JSON.stringify(newOpts));
      return newOpts;
    });
  };

  const removeOption = (opt: WheelOption) => {
    setOptions((prev) => {
      const newOpts = prev.filter((p) => p.id != opt.id);
      localStorage.setItem(localKey, JSON.stringify(newOpts));
      return newOpts;
    });
  };

  return (
    <main class="home container">
      <div class="grid">
        <Wheel options={options().filter((opt) => opt.enabled == true)} enableName={enableName} />
        <WheelForm
          options={options()}
          addName={addOption}
          enableName={enableName}
          removeName={removeOption}
        />
      </div>
    </main>
  );
};
