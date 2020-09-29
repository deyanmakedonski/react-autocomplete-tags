import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import styles from "./theme.css";

export default class Suggestions extends PureComponent {
  static propTypes = {
    className: PropTypes.string,
    suggestions: PropTypes.arrayOf(
      PropTypes.shape({
        label: PropTypes.string.isRequired,
        value: PropTypes.string.isRequired
      })
    ),
    onClick: PropTypes.func,
    focused: PropTypes.number,
    maxWidth: PropTypes.number,
    inputRef: PropTypes.oneOfType([
      // Either a function
      PropTypes.func,
      // Or the instance of a DOM native element (see the note about SSR)
      PropTypes.shape({ current: PropTypes.instanceOf(Element) })
    ])
  };

  static defaultProps = {
    className: "",
    suggestions: [],
    onClick: () => {}
  };

  constructor(props) {
    super(props);
    this.keyDown = this.keyDown.bind(this);
    this.state = {
      left: null
    };
  }

  keyDown(event) {
    if (event.keyCode === 38) {
      event.preventDefault();
    }
    return false;
  }

  componentDidUpdate(prevProps) {
    if (prevProps.suggestions !== this.props.suggestions) {
      console.log(this.props.inputRef.offsetLeft);
      let newLeft = this.props.inputRef.getBoundingClientRect().left;
      this.setLeft(this.props.inputRef.offsetLeft - 4);
    }
  }

  componentDidMount() {
    window.addEventListener("keydown", this.keyDown);
  }

  componentWillUnmount() {
    window.removeEventListener("keydown", this.keyDown);
  }

  setLeft(left) {
    this.setState({ left: `${left}px` });
    // this.ref.style.left = ;
  }

  render() {
    const { className, suggestions } = this.props;

    //Loader?
    if (!suggestions || !suggestions.length) return null;
    console.log(this.state);
    return (
      <div
        className={`${styles.dropdown} ${className}`}
        style={Object.assign(
          {},
          this.props.maxWidth ? { maxWidth: `${this.props.maxWidth}px` } : {},
          this.state.left ? { left: this.state.left } : {}
        )}
      >
        <ul className={styles.suggestions}>
          {this._renderSuggestions(suggestions)}
        </ul>
      </div>
    );
  }

  _renderSuggestions = suggestions => {
    return suggestions.map(({ label }, idx) => {
      return (
        <li
          key={idx}
          onClick={this._onClick.bind(this, idx)}
          className={this.props.focused === idx ? styles.focused : null}
        >
          {label}
        </li>
      );
    });
  };

  _onClick = idx => {
    this.setState({ suggestions: [] });
    this.props.onClick(idx);
  };
}
