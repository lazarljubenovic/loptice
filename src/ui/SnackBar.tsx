import * as React from 'react'
import './SnackBar.scss'

interface Props {

}

interface State {
  isOpen: boolean
  message: string
}

export interface Api extends State {
  open: (message: string) => void
  close: () => void
}

const { Consumer, Provider } = React.createContext<Api>({} as any)

class SnackBar extends React.Component {
  render () {
    return (
      <Consumer>
        {
          ({ open, close, message, isOpen }) => {
            const classNames = ['SnackBar']
            if (isOpen) classNames.push('isOpen')
            return (
              <div className={classNames.join(' ')} onClick={close}>
                <p className="message">{message}</p>
              </div>
            )
          }
        }
      </Consumer>
    )
  }
}

class SnackBarProvider extends React.Component<Props, State> {

  constructor (props: Props) {
    super(props)
    this.state = {
      message: '.',
      isOpen: false,
    }
  }

  private open = (message: string) => {
    this.setState({
      isOpen: true,
      message,
    })
    setTimeout(() => {
      this.close()
    }, 3000)
  }

  private close = () => {
    this.setState({
      isOpen: false,
    })
  }

  render () {
    return (
      <Provider
        value={{
          open: this.open,
          close: this.close,
          isOpen: this.state.isOpen,
          message: this.state.message,
        }}
      >
        <SnackBar/>
        {this.props.children}
      </Provider>
    )
  }

}

export {
  Consumer,
  SnackBarProvider as Provider,
}
