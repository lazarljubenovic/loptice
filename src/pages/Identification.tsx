import * as React from 'react'
import './Identification.scss'
import Button from '../ui/Button'
import * as SnackBar from '../ui/SnackBar'
import * as firebase from '../firebase'
import Firebase from '../firebase'

interface Props {
  firebase: Firebase
  onDone: (username: string) => void
}

interface State {
  isListOfUsersVisible: boolean
  isListOfUsersLoading: boolean

  isAddNewUserVisible: boolean
  isAddingNewUserLoading: boolean

  chosenUsername: string | null
  username: string

  users: firebase.User[]
}

export default class EnterKey extends React.Component<Props, State> {

  constructor (props: Props) {
    super(props)
    this.state = {
      isListOfUsersVisible: false,
      isAddNewUserVisible: false,
      isListOfUsersLoading: false,
      isAddingNewUserLoading: false,
      chosenUsername: null,
      username: '',
      users: [],
    }

    this.props.firebase.users().on('value', ss => {
      if (ss == null) return
      const users = ss.val() || []
      this.setState({ users })
    })
  }

  private onExistingUserClick = async (snackbar: SnackBar.Api) => {
    this.setState({
      isListOfUsersVisible: true,
    })
  }

  private onNewUserClick = () => {
    this.setState({
      isAddNewUserVisible: true,
    })
  }

  private onUsernameChange = (event: React.SyntheticEvent) => {
    const target = event.target as HTMLInputElement
    const value = target.value
    this.setState({
      username: value,
    })
  }

  private onAddNewUser = async () => {
    if (this.state.isAddingNewUserLoading) return
    this.setState({
      isAddingNewUserLoading: true,
    })
    await this.props.firebase.addNewUser(this.state.username)
    this.setState({
      isAddingNewUserLoading: false,
    })
    this.props.onDone(this.state.username)
  }

  private goBackToMainScreen = () => {
    if (this.state.isAddingNewUserLoading) return
    this.setState({
      isAddNewUserVisible: false,
      isListOfUsersVisible: false,
    })
  }

  private onUserPick = (username: string) => {
    this.setState({
      chosenUsername: username,
    })
  }

  private onUserAccept = () => {
    this.props.onDone(this.state.chosenUsername!)
  }

  render () {
    const isMainMenuVisible = !this.state.isListOfUsersVisible && !this.state.isAddNewUserVisible

    return (
      <SnackBar.Consumer>
        {
          (ctx) => (
            <div className="page Identification">

              {
                isMainMenuVisible &&
                <div className="subpage Main">
                  <p>Imaš nalog?</p>

                  <Button
                    isLoading={this.state.isListOfUsersLoading}
                    onClick={() => this.onExistingUserClick(ctx)}
                  >
                    Da, ja sam iskusan kockar
                  </Button>

                  <Button onClick={this.onNewUserClick}>Ne, ja sam (još uvek) pičkica</Button>
                </div>
              }

              {
                this.state.isListOfUsersVisible &&
                <div className="subpage ListOfUsers">
                  <p>Nađi se.</p>

                  {
                    this.state.users.map(({ username }) => {
                      const classNames = ['radio']
                      if (username == this.state.chosenUsername) classNames.push('selected')
                      return (
                        <label className={classNames.join(' ')} key={username}>
                          <input name="user" type="radio" onChange={() => this.onUserPick(username)}/>
                          <span>{ username }</span>
                        </label>
                      )
                    })
                  }

                  <div className="buttons">
                    <Button
                      onClick={this.goBackToMainScreen}
                    >
                      Nazad
                    </Button>
                    <Button
                      disabled={this.state.chosenUsername == null}
                      isLoading={false}
                      onClick={this.onUserAccept}
                    >
                      Dalje
                    </Button>
                  </div>

                </div>
              }

              {
                this.state.isAddNewUserVisible &&
                <div className="subpage AddNewUser">
                  <p>Unesi ime.</p>

                  <input type="text" onChange={this.onUsernameChange} value={this.state.username}/>

                  <div className="buttons">
                    <Button onClick={this.goBackToMainScreen}>Nazad</Button>
                    <Button
                      onClick={this.onAddNewUser}
                      disabled={this.state.username.length == 0}
                      isLoading={this.state.isAddingNewUserLoading}
                    >
                      Dalje
                    </Button>
                  </div>
                </div>
              }

            </div>
          )
        }
      </SnackBar.Consumer>
    )
  }
}
