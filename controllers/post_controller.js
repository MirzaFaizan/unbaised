let Post = require('../models/post');
let Profile = require('../models/profile');
let PostState = require('../models/postState');

exports.check = function(req, res) {
  PostState.find(
    {
      username: req.session.user
    },
    function(err, doc) {
      if (err) throw err;

      if (doc.length) {
        res.send(doc);
      }
    }
  );
};

exports.edit = function(req, res) {
  Post.update(
    {
      _id: req.params.id
    },
    {
      body: req.body.text
    },
    function(err, result) {
      if (err) throw err;

      console.log(`[${req.params.id}] post edited!`);
      res.send('success');
    }
  );
};

exports.delete = function(req, res) {
  Post.find({
    _id: req.params.id
  }).remove(function(err, doc) {
    if (err) throw err;

    console.log(`[${req.params.id}] post deleted!`);
    res.send(doc);
  });
};

exports.save = function(req, res) {
  Profile.update(
    {
      username: req.session.user
    },
    {
      $push: {
        saved_posts: req.params.id
      }
    },
    function(err, doc) {
      if (err) throw err;
    }
  );

  let query = {
    username: req.session.user,
    ref: req.params.id
  };
  let update = {
    saved: true
  };
  let options = {
    upsert: true,
    setDefaultsOnInsert: true
  };

  PostState.findOneAndUpdate(query, update, options, function(error, doc) {
    if (error) throw error;

    if (doc) {
      console.log(`[${req.params.id}] post saved!`);
    }
    res.send('success');
  });
};

exports.unsave = function(req, res) {
  let query = {
    username: req.session.user,
    ref: req.params.id
  };
  let update = {
    saved: false
  };
  let options = {
    upsert: true,
    setDefaultsOnInsert: true
  };

  Profile.update(
    {
      username: req.session.user
    },
    {
      $pull: {
        saved_posts: req.params.id
      }
    },
    function(err, doc) {
      if (err) throw err;
    }
  );

  PostState.findOneAndUpdate(query, update, options, function(error, doc) {
    if (error) throw error;

    if (doc) {
      console.log(`[${req.params.id}] post unsaved!`);
    }
    res.send('success');
  });
};

exports.vote = function(req, res) {
  console.log(req.params.id);

  if (req.body.action == 'upvote-increment') {
    console.log('increment');
    Post.update(
      {
        _id: req.params.id
      },
      {
        upvotes: req.body.vote
      },
      function(err, result) {
        if (err) throw err;

        if (result) {
          console.log(`[${req.session.user}] Upvote-on-Increment increased!`);
        }
      }
    );
  } else if (req.body.action == 'upvote-offState-decrement') {
    console.log('upvote-offState-decrement');
    Post.update(
      {
        _id: req.params.id
      },
      {
        upvotes: req.body.vote
      },
      function(err, result) {
        if (err) throw err;

        if (result) {
          console.log(
            `[${req.session.user}] Upvote-offState-Decrement increased!`
          );
        }
      }
    );
  } else if (req.body.action == 'decrement-downvote-increment-upvote') {
    console.log(req.body);
    Post.findOneAndUpdate(
      {
        _id: req.params.id
      },
      {
        $set: {
          upvotes: req.body.vote,
          downvotes: req.body.downvote
        }
      },
      function(err, result) {
        if (err) throw err;

        if (result) {
          console.log(
            `[${req.session.user}] decrement-downvote-increment-upvote!`
          );
        }
      }
    );
  } else if (req.body.action == 'downvote-increment') {
    console.log('downvote-increment');

    Post.update(
      {
        _id: req.params.id
      },
      {
        downvotes: req.body.vote
      },
      function(err, result) {
        if (err) throw err;

        if (result) {
          console.log(`[${req.session.user}] Downvote-increment-State!`);
        }
      }
    );
  } else if (req.body.action == 'downvote-toggle-increment') {
    console.log('downvote-toggle-increment');

    Post.findOneAndUpdate(
      {
        _id: req.params.id
      },
      {
        downvotes: req.body.vote
      },
      function(err, result) {
        if (err) throw err;

        if (result) {
          console.log(
            `[${req.session.user}] Downvote-toggle-increment decreased!`
          );
        }
      }
    );
  } else if (req.body.action == 'upvote-decrement-downvote-increment') {
    console.log(req.body);
    Post.findOneAndUpdate(
      {
        _id: req.params.id
      },
      {
        $set: {
          upvotes: req.body.vote,
          downvotes: req.body.downvote
        }
      },
      function(err, result) {
        if (err) throw err;

        if (result) {
          console.log(
            `[${req.session.user}] upvote-decrement-downvote-increment`
          );
        }
      }
    );
  } else if (req.body.action == 'neutral-downvote-toggle-increment') {
    console.log('neutral-downvote-toggle-increment');
    Post.update(
      {
        _id: req.params.id
      },
      {
        neutralvotes: req.body.vote
      },
      function(err, result) {
        if (err) throw err;

        if (result) {
          console.log(
            `[${req.session.user}] neutral-downvote-toggle-increment!`
          );
        }
      }
    );
  } else if (req.body.action == 'neutral-downvote-increment') {
    console.log('neutral-downvote-increment');
    Post.update(
      {
        _id: req.params.id
      },
      {
        neutralvotes: req.body.vote
      },
      function(err, result) {
        if (err) throw err;

        if (result) {
          console.log(`[${req.session.user}] neutral-downvote-increment!`);
        }
      }
    );
  } else if (req.body.action == 'upvote-decrement-neutral-increment') {
    console.log(req.body);
    Post.findOneAndUpdate(
      {
        _id: req.params.id
      },
      {
        $set: {
          upvotes: req.body.vote,
          neutralvotes: req.body.neutralvote
        }
      },
      function(err, result) {
        if (err) throw err;

        if (result) {
          console.log(
            `[${req.session.user}] upvote-decrement-downvote-increment`
          );
        }
      }
    );
  } else if (req.body.action == 'downvote-decrement-neutral-increment') {
    console.log(req.body);
    Post.findOneAndUpdate(
      {
        _id: req.params.id
      },
      {
        $set: {
          downvotes: req.body.vote,
          neutralvotes: req.body.neutralvote
        }
      },
      function(err, result) {
        if (err) throw err;

        if (result) {
          console.log(
            `[${req.session.user}] downvote-decrement-neutral-increment`
          );
        }
      }
    );
  } else if (req.body.action == 'neutral-decrement-downvote-increment') {
    console.log(req.body);
    Post.findOneAndUpdate(
      {
        _id: req.params.id
      },
      {
        $set: {
          downvotes: req.body.downvote,
          neutralvotes: req.body.neutralvote
        }
      },
      function(err, result) {
        if (err) throw err;

        if (result) {
          console.log(
            `[${req.session.user}] neutral-decrement-downvote-increment`
          );
        }
      }
    );
  } else if (req.body.action == 'neutral-decrement-upvote-increment') {
    console.log(req.body);
    Post.findOneAndUpdate(
      {
        _id: req.params.id
      },
      {
        $set: {
          upvotes: req.body.upvote,
          neutralvotes: req.body.neutralvote
        }
      },
      function(err, result) {
        if (err) throw err;

        if (result) {
          console.log(
            `[${req.session.user}] neutral-decrement-downvote-increment`
          );
        }
      }
    );
  }

  let query = {
    username: req.session.user,
    ref: req.params.id
  };
  let update = {
    vote: req.body.state
  };
  let options = {
    upsert: true,
    setDefaultsOnInsert: true
  };


  PostState.findOneAndUpdate(query, update, options, function(err, result) {
    if (err) throw err;

    if (result) {
      console.log(`[${req.params.id}] post vote count changed!`);
      res.send('OK');
    }
  });
};
