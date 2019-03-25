const Twit = require("twit");
const { sortPixels } = require("./bot");

require("dotenv").config();

const T = new Twit({
  consumer_key: process.env.CONSUMER_KEY,
  consumer_secret: process.env.CONSUMER_SECRET,
  access_token: process.env.ACCESS_TOKEN,
  access_token_secret: process.env.ACCESS_TOKEN_SECRET
});

const users = [ "archillect" ];

// search for new tweets from users
users.forEach(async user => {
  try {
    const search = await T.get("statuses/user_timeline", { screen_name: user, count: 1 });
    const imgUrl = search.data[0].extended_entities.media[0].media_url_https;
    sortPixels(imgUrl).then(() => { console.log("done!") });
  } catch (e) {
    console.log(e);
  }
});


// call handleTweet from bot.js module

// answer @archillect's tweet with the new media generated




/* useful content :

  https://www.npmjs.com/package/twit
  https://www.npmjs.com/package/jimp
  https://medium.com/@rossbulat/image-processing-in-nodejs-with-jimp-174f39336153

*/