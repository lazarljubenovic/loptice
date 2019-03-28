import app from 'firebase/app'
import 'firebase/database'
import * as firebase from 'firebase'


const config = {
  apiKey: "AIzaSyCsspsFCdr8hvdnyJrkNI2ezRWqqkPfQKs",
  authDomain: "loptice-9c87b.firebaseapp.com",
  databaseURL: "https://loptice-9c87b.firebaseio.com",
  projectId: "loptice-9c87b",
  storageBucket: "loptice-9c87b.appspot.com",
  messagingSenderId: "613785681705"
}

export interface User {
  username: string
  history: number[]
}

export interface Game {
  date: string
  ticket: number[]
  correct: number[]
  moneyLost: number
  moneyGain: number
}

export interface Data {
  users: User[]
  games: Game[]
}

export default class Firebase {

  private db: firebase.database.Database

  public users = () => this.db.ref('users')
  public games = () => this.db.ref('games')

  public data!: Data

  constructor() {
    app.initializeApp(config)
    this.db = app.database()

    this.db.ref('/').on('value', snapshot => {
      if (snapshot == null) return
      this.data = snapshot.val()
    })
  }

  public async addNewUser (username: string) {
    const snapshot = await this.db.ref('users/').once('value')
    const users = snapshot.val() || []
    console.log('users')

    const newUser: User = {
      username,
      history: [],
    }
    const newUsers = [...users, newUser]

    this.db.ref('users/').set(newUsers)
  }

  public async saveGame (game: Game) {
    let username = localStorage.getItem('username')
    if (username == null) {
      username = 'Unknown'
    }

    const gamesSnapshot = await this.db.ref('games/').once('value')
    const games: Game[] = gamesSnapshot.val() || []

    const usersSnapshot = await this.db.ref('users/').once('value')
    const users: User[] = usersSnapshot.val() || []
    console.log(users)

    const user = users.find(u => u.username == username)
    user!.history = [...user!.history || [], games.length]

    const newGames = [...games, game]
    this.db.ref('games/').set(newGames)
    this.db.ref('users/').set(users)
  }

}
