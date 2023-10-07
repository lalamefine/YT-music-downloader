# Features
Expose a server that fetch the audiofile of a youtube video and convert it to mp4 (audio) in a predefined directory
Can use OpenAI API to generate formated filename
# How to use
## Requirements
- Node.js OR Docker
- OPENAI API key (optional)
## Option 1 : with node
1. Get the project file and cd into it
Exemple using wget and unzip: 
```bash
wget https://github.com/lalamefine/YT-music-downloader/archive/refs/heads/master.zip && \
unzip master.zip && \
cd YT-music-downloader-master \
```
2. Install dependencies with:
```bash
npm install
```
3. Configure .env according to your needs manually or with command:
```bash
cp .env.exemple .env && \
nano .env
```
3. Run the server with: 
```bash
npm start
```

## Option 2 : with docker-compose
1. Get and edit config file
Manually from manually [here](https://raw.githubusercontent.com/lalamefine/YT-music-downloader/master/docker-compose.yml.exemple) or the folowing command :
```bash
wget https://raw.githubusercontent.com/lalamefine/YT-music-downloader/master/docker-compose.yml.exemple 
```
2. Rename and edit the config file
Change YOUR_API_KEY and OUTPUT_DIR according to your needs
Manually or with nano
```bash
cp docker-compose.yml.exemple docker-compose.yml && \
nano docker-compose.yml
```
3. Run in detached mode (remove -d for interactive mode):
```bash
sudo docker compose up --build -d 
```

4. (Optionnal) Show logs with:
```bash
sudo docker compose logs -f
```