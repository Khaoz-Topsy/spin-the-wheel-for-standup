import { createSignal, onMount, type Component } from 'solid-js';
import 'emoji-picker-element';

import { WheelOption } from '../contracts/wheelOption';
import { uuidv4 } from '../helpers/guidHelper';

interface IProps {
  options: Array<WheelOption>;
  addName: (newOpt: WheelOption) => void;
  enableName: (id: string, isEnabled: boolean) => void;
  removeName: (optToRemove: WheelOption) => void;
}

const defaultEmoji = '😁';
export const WheelForm: Component<IProps> = (props: IProps) => {
  const [name, setName] = createSignal<string>('');
  const [emoji, setEmoji] = createSignal<string>(defaultEmoji);
  const [isOpen, setIsOpen] = createSignal<boolean>(false);

  onMount(() => {
    const pickerElem = document?.querySelector('emoji-picker');
    if (pickerElem == null) {
      console.error('Could not find picker element');
      return;
    }

    pickerElem.addEventListener('emoji-click', (event) => {
      setIsOpen(false);
      setEmoji(event.detail.unicode ?? defaultEmoji);
    });
  });

  const toggleEmojiPanel = (ev: any) => {
    ev?.preventDefault?.();
    setIsOpen((prev) => !prev);
  };

  const onAdd = (ev: any) => {
    ev?.preventDefault?.();
    props.addName({
      id: uuidv4(),
      name: name(),
      emoji: emoji(),
      enabled: true,
    });
  };

  return (
    <form>
      <fieldset role="group" class="emoji-wrapper">
        <button class="secondary" onClick={toggleEmojiPanel}>
          {emoji()}
        </button>
        <div class={`emoji-panel ${isOpen() ? 'open' : 'close'}`}>
          <emoji-picker></emoji-picker>
        </div>
        <input
          name="name"
          placeholder="Nomad"
          value={name()}
          onChange={(event) => setName(event.target.value)}
        />
        <input type="submit" value="+" onClick={onAdd} />
      </fieldset>

      <ul>
        {(props.options ?? []).map((opt) => (
          <li class="pointer">
            <span onClick={() => props.removeName(opt)}>
              {opt.emoji}&nbsp;{opt.name}
            </span>
            <input
              type="checkbox"
              style="float:right"
              checked={opt.enabled}
              onChange={(ev) => props.enableName(opt.id, ev.target.checked)}
            />
          </li>
        ))}
      </ul>
    </form>
  );
};
