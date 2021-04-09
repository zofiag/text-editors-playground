// @ts-nocheck
import React, { useImperativeHandle } from "react";
import { useEffect, useState, FC, forwardRef } from "react";
// import "./MentionList.scss";
import { SuggestionProps } from "@tiptap/suggestion";
import { NodeViewWrapper } from "@tiptap/react";

interface CommandFnArgs {
  id: string;
}
const initialState = {
  selectedIndex: 0,
};

export const MentionList = forwardRef<HTMLDivElement, SuggestionProps>(
  ({ command, items }, ref) => {
    const [state, setState] = useState(initialState);

    useImperativeHandle(ref, () => ({
      onKeyDown: ({ event }: { event: KeyboardEvent }) => {
        if (event.key === "ArrowUp") {
          upHandler();
          return true;
        }

        if (event.key === "ArrowDown") {
          downHandler();
          return true;
        }

        if (event.key === "Enter") {
          enterHandler();
          return true;
        }

        return false;
      },
    }));

    const upHandler = () => {
      setState({
        selectedIndex: (state.selectedIndex + items.length - 1) % items.length,
      });
    };

    const downHandler = () => {
      setState({
        selectedIndex: (state.selectedIndex + 1) % items.length,
      });
    };

    const enterHandler = () => {
      selectItem(state.selectedIndex);
    };

    const selectItem = (index: number) => {
      const item = items[index];

      if (item) {
        command({ id: item });
      }
    };

    useEffect(() => setState(initialState), [items]);

    useEffect(() => {
      console.log("ref", ref);
    }, [ref]);

    return (
      <NodeViewWrapper className="react-component">
        <div className="items">
          {items.map((item, index) => (
            <button
              className={`item ${
                index === state.selectedIndex ? "is-selected" : ""
              }`}
              key={index}
              onClick={() => selectItem(index)}
            >
              {item}
            </button>
          ))}
        </div>
      </NodeViewWrapper>
    );
  }
);
export class MentionListClass extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedIndex: 0,
    };
  }

  componentDidUpdate(oldProps) {
    if (this.props.items !== oldProps.items) {
      this.setState({
        selectedIndex: 0,
      });
    }
  }

  onKeyDown({ event }) {
    if (event.key === "ArrowUp") {
      this.upHandler();
      return true;
    }

    if (event.key === "ArrowDown") {
      this.downHandler();
      return true;
    }

    if (event.key === "Enter") {
      this.enterHandler();
      return true;
    }

    return false;
  }

  upHandler() {
    this.setState({
      selectedIndex:
        (this.state.selectedIndex + this.props.items.length - 1) %
        this.props.items.length,
    });
  }

  downHandler() {
    this.setState({
      selectedIndex: (this.state.selectedIndex + 1) % this.props.items.length,
    });
  }

  enterHandler() {
    this.selectItem(this.state.selectedIndex);
  }

  selectItem(index) {
    const item = this.props.items[index];

    if (item) {
      this.props.command({ id: item });
    }
  }

  render() {
    return (
      <div className="items">
        {this.props.items.map((item, index) => (
          <button
            className={`item ${
              index === this.state.selectedIndex ? "is-selected" : ""
            }`}
            key={index}
            onClick={() => this.selectItem(index)}
          >
            {item}
          </button>
        ))}
      </div>
    );
  }
}
