import { Element, BoxElement, TextElement } from './types';

const HORIZONTAL_SEPARATOR = ' | ';
const VERTICAL_SEPARATOR = '------------------------------';

const renderBox = (box: BoxElement): void => {
  box.children.forEach((child) => {
    if (child.type === 'text') {
      renderText(child);
    } else {
      renderBox(child);
    }
    if (box.props.separator) {
      if (box.props.orientation === 'column') {
        println('');
        println(VERTICAL_SEPARATOR);
      } else {
        print(HORIZONTAL_SEPARATOR);
      }
    }
  });
};

const renderText = (text: TextElement) => {
  print(text.props.text);
};

export const render = (container: {
  type: 'root';
  children: Element[];
}): void => {
  container.children.forEach((child) => {
    if (child.type === 'text') {
      renderText(child);
    } else {
      renderBox(child);
    }
  });
};
