import { prologue } from './prologue.js'
import {
  chapter1, ch1_classroom, ch1_computer, ch1_rooftop, ch1_library,
  ch1_afternoon, ch1_noon_yoshino, ch1_noon_ayase, ch1_noon_kanna, ch1_noon_nene,
  ch1_evening, ch1_eve_yoshino, ch1_eve_ayase, ch1_eve_kanna, ch1_eve_nene,
  ch1_night, ch1_knock_murasame, ch1_night_leave, ch1_night_end
} from './chapter1.js'
import {
  chapter2, ch2_classroom, ch2_computer, ch2_rooftop, ch2_library,
  ch2_afternoon,
  ch2_noon_yoshino, ch2_noon_ayase, ch2_noon_kanna, ch2_noon_nene,
  ch2_evening, ch2_competition, ch2_night,
  ch2_eve_yoshino, ch2_eve_ayase, ch2_eve_kanna, ch2_eve_nene
} from './chapter2.js'
import {
  chapter3, ch3_classroom, ch3_computer, ch3_rooftop, ch3_library,
  ch3_afternoon,
  ch3_noon_yoshino, ch3_noon_ayase, ch3_noon_kanna, ch3_noon_nene,
  ch3_evening, ch3_eve_yoshino, ch3_eve_ayase, ch3_eve_kanna, ch3_eve_nene,
  ch3_festival, ch3_murasame_encounter, ch3_firework,
  ch3_firework_nene, ch3_firework_yoshino, ch3_firework_ayase, ch3_firework_kanna
} from './chapter3.js'
import { routeNene, routeNeneGood, routeNeneNormal } from './routes/nene.js'
import { routeYoshino, routeYoshinoGood, routeYoshinoNormal } from './routes/yoshino.js'
import { routeAyase, routeAyaseGood, routeAyaseNormal } from './routes/ayase.js'
import { routeKanna, routeKannaGood, routeKannaNormal } from './routes/kanna.js'
import { routeMurasame, routeMurasameGood, routeMurasameNormal, routeMurasameTrue } from './routes/murasame.js'

export const scriptIndex = {
  prologue,

  chapter1,
  ch1_classroom, ch1_computer, ch1_rooftop, ch1_library,
  ch1_afternoon,
  ch1_noon_yoshino, ch1_noon_ayase, ch1_noon_kanna, ch1_noon_nene,
  ch1_evening,
  ch1_eve_yoshino, ch1_eve_ayase, ch1_eve_kanna, ch1_eve_nene,
  ch1_night, ch1_knock_murasame, ch1_night_leave, ch1_night_end,

  chapter2,
  ch2_classroom, ch2_computer, ch2_rooftop, ch2_library,
  ch2_afternoon,
  ch2_noon_yoshino, ch2_noon_ayase, ch2_noon_kanna, ch2_noon_nene,
  ch2_evening, ch2_competition, ch2_night,
  ch2_eve_yoshino, ch2_eve_ayase, ch2_eve_kanna, ch2_eve_nene,

  chapter3,
  ch3_classroom, ch3_computer, ch3_rooftop, ch3_library,
  ch3_afternoon,
  ch3_noon_yoshino, ch3_noon_ayase, ch3_noon_kanna, ch3_noon_nene,
  ch3_evening, ch3_eve_yoshino, ch3_eve_ayase, ch3_eve_kanna, ch3_eve_nene,
  ch3_festival, ch3_murasame_encounter, ch3_firework,
  ch3_firework_nene, ch3_firework_yoshino, ch3_firework_ayase, ch3_firework_kanna,

  route_nene: routeNene,
  route_yoshino: routeYoshino,
  route_ayase: routeAyase,
  route_kanna: routeKanna,
  route_murasame: routeMurasame,

  nene_good_path: routeNeneGood,
  nene_normal_path: routeNeneNormal,
  yoshino_good_path: routeYoshinoGood,
  yoshino_normal_path: routeYoshinoNormal,
  ayase_good_path: routeAyaseGood,
  ayase_normal_path: routeAyaseNormal,
  kanna_good_path: routeKannaGood,
  kanna_normal_path: routeKannaNormal,
  murasame_good_path: routeMurasameGood,
  murasame_normal_path: routeMurasameNormal,
  murasame_true_path: routeMurasameTrue
}
