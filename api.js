// Get all tweets
const express = require('express');
const axios = require('axios');

const router = express.Router();



// Read JSON file function (using axios to fetch JSON from the URL)
const readJSONFile = async () => {
  try {
    const response = await axios.get('https://foyzulhassan.github.io/files/favs.json');
    return response.data;
  } catch (error) {
    console.error('Error fetching JSON:', error.message);
    throw error;
  }
};


//get all tweets with date created at, description, and, ID
router.get('/tweets', async (req, res) => {
  try {
    const jsonData = await readJSONFile();
    console.log('jsonData:', jsonData);
    const tweets = jsonData.map(tweet => ({
      created_at: tweet.created_at,
      id: tweet.id_str,
      description : tweet.text,
    }));
    res.json(tweets);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Get external links grouped by tweet ids
router.get('/external-links', async (req, res) => {
  try {
    const jsonData = await readJSONFile();
    const linksByTweetId = {};
    
    // Regular expression to match URLs in a tweet text
    const urlRegex = /(https?:\/\/[^\s]+)/g;

    jsonData.forEach(tweet => {
      const tweetId = tweet.id_str;
      const tweetText = tweet.text;

      // Extract links using the regular expression
      const links = tweetText.match(urlRegex);

      if (links) {
        // Group links based on tweet ids
        linksByTweetId[tweetId] = links;
      }
    });

    res.json(linksByTweetId);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Get details of a given tweet by id
router.get('/tweet/:tweetId', async (req, res) => {
  try {
    const jsonData = await readJSONFile();
    const tweetId = req.params.tweetId;
    const tweet = jsonData.find(t => t.id_str === tweetId);
    if (tweet) {
      const tweetDetails = {
        created_at: tweet.created_at,
        text: tweet.text,
        user_screen_name: tweet.user.screen_name,
      };
      res.json(tweetDetails);
    } else {
      res.status(404).json({ error: 'Tweet not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Get detailed profile information about a given user by screen name
router.get('/user/:screenName', async (req, res) => {
  try {
    const jsonData = await readJSONFile();
    const screenName = req.params.screenName;
    const user = jsonData.find(tweet => tweet.user.screen_name === screenName);
    if (user) {
      const userProfile = {
        location: user.user.location,
        description: user.user.description,
        followers_count: user.user.followers_count,
        friends_count: user.user.friends_count,
      };
      res.json(userProfile);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
