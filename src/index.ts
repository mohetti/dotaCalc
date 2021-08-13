import { Loading } from './Components/Loading';
import { Heroes } from './Components/Heroes';

const loading = Loading.getInstance();
const heroes = Heroes.getInstance();
heroes
  .retrieveHeroes()
  .then(() => {
    heroes.render();
  })
  .catch((err) => {
    console.log(err);
  });
