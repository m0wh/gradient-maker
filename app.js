const Twit = require("twit");
const fs = require("fs");
const { sortPixels } = require("./bot");

require("dotenv").config();

const T = new Twit({
  consumer_key: process.env.CONSUMER_KEY,
  consumer_secret: process.env.CONSUMER_SECRET,
  access_token: process.env.ACCESS_TOKEN,
  access_token_secret: process.env.ACCESS_TOKEN_SECRET
});

const users = [ "archillect" ];

// // search for new tweets from users
users.forEach(async user => {
  try {
    const search = await T.get("statuses/user_timeline", { screen_name: user, count: 1 });
    console.log("generating image from " + user);
    const img = await generateImage(search.data[0]);
    console.log("generated");
    tweet("", img, "Tweeted from Node");
  } catch (e) {
    console.log(e);
  }
});

const generateImage = tweet => {
  const imgUrl = tweet.extended_entities.media[0].media_url_https;
  return sortPixels(imgUrl, tweet.id);
}

// answer @archillect's tweet with the new media generated

const tweet = (text, src, alt) => {
  const b64content = fs.readFileSync(src, { encoding: 'base64' });
  T.post('media/upload', { media_data: b64content }, (err, data, response) => {
    const mediaIdStr = data.media_id_string  
    T.post('media/metadata/create', { media_id: mediaIdStr, alt_text: { text: alt } }, (err, data, response) => {
      if (!err) {
        T.post('statuses/update', { status: text, media_ids: [mediaIdStr] }, (err, data, response) => { console.log(data) });
      }
    })
  })
}

// tweet("hello", "./output/test.jpg", "lalalala");