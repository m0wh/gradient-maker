const Twit = require("twit");
const fs = require("fs");
const { sortPixels } = require("./bot");
const { konsole } = require("./utils");

require("dotenv").config();

const T = new Twit({
  consumer_key: process.env.CONSUMER_KEY,
  consumer_secret: process.env.CONSUMER_SECRET,
  access_token: process.env.ACCESS_TOKEN,
  access_token_secret: process.env.ACCESS_TOKEN_SECRET
});


const tweetsFilter = {
  follow: [
    // "2907774137", // archillect
    // "1109859953496518656", // sortmachine
    "2395539148", // mowhtr — for development
  ]
};

const stream = T.stream("statuses/filter", tweetsFilter);
stream.on("tweet", async tweet => {
  if (tweetsFilter.follow.includes(tweet.user.id_str) && tweet.extended_entities) {
    konsole.log(`New tweet from @${ tweet.user.screen_name }. Generating image...`);
    const imageSrc = tweet.extended_entities.media[0].media_url_https;
    const imgPath = await generateImage(tweet);
    tweetImage(`@${ tweet.user.screen_name }`, imgPath, `${ tweet.user.screen_name }'s image remix`, tweet.id_str);
  }
});

const generateImage = tweet => {
  const imgUrl = tweet.extended_entities.media[0].media_url_https;
  return sortPixels(imgUrl, tweet.id);
}

// answer @archillect's tweet with the new media generated
const tweetText = (text, replyID, mediaIdStr = "") => {
  T.post('statuses/update', { in_reply_to_status_id: replyID, status: text, media_ids: [mediaIdStr] }, (err, data, response) => { konsole.log("Tweeted!") });
}

const tweetImage = (text, path, alt, replyID) => {
  const b64content = fs.readFileSync(path, { encoding: 'base64' });
  T.post('media/upload', { media_data: b64content }, (err, data, response) => {
    const mediaIdStr = data.media_id_string
    T.post('media/metadata/create', { media_id: mediaIdStr, alt_text: { text: alt } }, (err, data, response) => {
      if (!err) {
        tweetText(text, replyID, mediaIdStr);
      }
    })
  })
}