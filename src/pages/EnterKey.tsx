import * as React from 'react'
import './EnterKey.scss'
import Button from '../ui/Button'
import * as SnackBar from '../ui/SnackBar'

interface Props {

}

interface State {
  isLoading: boolean
}

export default class EnterKey extends React.Component {

  private input: HTMLInputElement | null = null

  state = {
    isLoading: false,
  }

  constructor (props: Props) {
    super(props)
  }

  private onNextClick = async (snackbar: SnackBar.Api) => {
    console.log(snackbar)
    snackbar.open('fuck')
    this.setState({
      isLoading: !this.state.isLoading,
    })
  }

  componentDidMount (): void {
    if (this.input != null) {
      this.input.focus()
    }
  }

  render () {
    return (
      <SnackBar.Consumer>
        {
          (ctx) => (
            <div className="EnterKey page">
              <p>Unesi ključ.</p>

              <input type="text" ref={input => this.input = input}/>

              <Button isLoading={this.state.isLoading} onClick={() => this.onNextClick(ctx)}>Dalje</Button>
            </div>
          )
        }
      </SnackBar.Consumer>
    )
  }
}
