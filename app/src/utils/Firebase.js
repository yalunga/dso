import app from 'firebase/app';
import 'firebase/storage';
const config = {
  apiKey: "AIzaSyBKzI3emzq3MCUkpo2YlQlxCV-QHcGIE0w",
  authDomain: "dso462-6cea8.firebaseapp.com",
  databaseURL: "https://dso462-6cea8.firebaseio.com",
  projectId: "dso462-6cea8",
  storageBucket: "dso462-6cea8.appspot.com",
  messagingSenderId: "605624622046",
  appId: "1:605624622046:web:a272846124fa6b3f70db4f",
  measurementId: "G-936PNDF26R"
};
class Firebase {
  constructor() {
    app.initializeApp(config);
    this.storage = app.storage();
  }
}
export default Firebase;