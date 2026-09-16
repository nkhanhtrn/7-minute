import { initializeApp } from 'firebase/app'

const firebaseConfig = {
  apiKey: 'AIzaSyD7xhfxskPmmGjDlX8il68e91yQgwnSoe8',
  authDomain: 'nkhanhtrn.github.io',
  projectId: 'nkhanhtrn-chat',
  storageBucket: 'nkhanhtrn-chat.firebasestorage.app',
  messagingSenderId: '755232849374',
  appId: '1:755232849374:web:90883dad132dcb7bb1314f',
}

export const app = initializeApp(firebaseConfig)
