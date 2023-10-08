
import { OpenAI } from "openai";

let openai;
export function init(apikey){
  return new OpenAI({
    apiKey: apikey,
  });
}

const requestText = `
  A partir du titre et de la description d'une vidéo musicale, je veux que tu me renvoie le le nom de l'artiste et le nom du morceau sous la forme : 
  ARTISTE - MORCEAU
  Si il y a un ou plusieurs featurings, tu dois les mettre sous la forme :
  ARTISTE - MORCEAU (ft. ARTISTE2, ...)
  Du ne dois rien répondre d'autre. Si tu rencontre une erreur ou que tu ne comprends pas la demande, tu dois renvoyer le titre de la vidéo
  Titre de la vidéo : 
  {TITLE}
  Description de la vidéo :
  {DESCRIPTION}
`;

export async function askFileName(title, description) {
  if(!openai){
    openai = init(process.env.OPENAI_API_KEY);
  }
  const res = await openai.chat.completions.create({
    messages: [{ 
      role: "user", 
      content: requestText.replace("{TITLE}", title).replace("{DESCRIPTION}", description) 
    }],
    model: "gpt-3.5-turbo",
  });
  return res.choices[0].message.content;
}