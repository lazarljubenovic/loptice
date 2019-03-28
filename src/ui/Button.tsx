import * as React from 'react'
import { CSSProperties } from 'react'
import './Button.scss'

interface Props {
  disabled?: boolean
  isLoading?: boolean
  onClick?: () => void
  secondary?: boolean
  style?: CSSProperties
}

export default class Button extends React.Component<Props> {

  onClick = () => {
    if (this.props.onClick != null) {
      this.props.onClick()
    }
  }

  render () {
    const classNames = ['Button']
    if (this.props.isLoading) classNames.push('Button-isLoading')
    if (this.props.secondary) classNames.push('Button-secondary')

    return (
      <button
        className={classNames.join(' ')}
        onClick={this.onClick}
        disabled={this.props.disabled}
        style={this.props.style}
      >
        <span className="Button-content">
          {this.props.children}
        </span>
        <span className="Button-spinner">
          <img src="./loading.png" alt=""/>
        </span>
      </button>
    )
  }
}
