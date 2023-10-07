import {askFileName} from "./interfaces/chatgpt.js";
import {config} from "dotenv"
config()

askFileName(
  "DROELOE - JUMP (ft. Nevve) [Official Audio]", 
  `
  🎧 All DROELOE releases: http://bit.ly/dryt-allreleases
  👀 Episodes of LIFE.: http://bit.ly/ytLIFE
  
  ▼ Follow DROELOE
  Facebook: http://bit.ly/droeloe-facebook
  Twitter: http://bit.ly/droeloe-twitter
  Soundcloud: http://bit.ly/droeloe-soundcloud
  Spotify: http://bit.ly/droeloe-spotify
  Instagram: http://bit.ly/droeloe-instagram
  `
).then((res) => console.log(res))