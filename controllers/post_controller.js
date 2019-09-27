let Post = require('../models/post');
let Profile = require('../models/profile');
let PostState = require('../models/postState');

exports.check = function (req, res) {
  PostState.find(
    {
      username: req.session.user
    },
    function (err, doc) {
      if (err) throw err;

      if (doc.length) {
        res.send(doc);
      }
    }
  );
};

exports.edit = function (req, res) {
  Post.update(
    {
      _id: req.params.id
    },
    {
      body: req.body.text
    },
    function (err, result) {
      if (err) throw err;

      console.log(`[${req.params.id}] post edited!`);
      res.send('success');
    }
  );
};

exports.delete = function (req, res) {
  Post.find({
    _id: req.params.id
  }).remove(function (err, doc) {
    if (err) throw err;

    console.log(`[${req.params.id}] post deleted!`);
    res.send(doc);
  });
};

exports.save = function (req, res) {
  Profile.update(
    {
      username: req.session.user
    },
    {
      $push: {
        saved_posts: req.params.id
      }
    },
    function (err, doc) {
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

  PostState.findOneAndUpdate(query, update, options, function (error, doc) {
    if (error) throw error;

    if (doc) {
      console.log(`[${req.params.id}] post saved!`);
    }
    res.send('success');
  });
};

exports.unsave = function (req, res) {
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
    function (err, doc) {
      if (err) throw err;
    }
  );

  PostState.findOneAndUpdate(query, update, options, function (error, doc) {
    if (error) throw error;

    if (doc) {
      console.log(`[${req.params.id}] post unsaved!`);
    }
    res.send('success');
  });
};

exports.vote = function (req, res) {
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
      function (err, result) {
        if (err) throw err;

        if (result) {
          console.log(`[${req.session.user}] Upvote-on-Increment increased!`);
        }
      }
    );
  }


  else if (req.body.action == 'increment-slightarrow-right') {
    console.log('increment-slightarrow-right');
    Post.update(
      {
        _id: req.params.id
      },
      {
        slightupvotes: req.body.vote
      },
      function (err, result) {
        if (err) throw err;

        if (result) {
          console.log(`[${req.session.user}] slightupvotes`);
        }
      }
    );
  }




  else if (req.body.action == 'decrement-downcounter-increment-slight-up-counter') {
    console.log('decrement-downcounter-increment-slight-up-counter');
    Post.update(
      {
        _id: req.params.id
      },
      {
        slightupvotes: req.body.slightupvote,
        downvotes: req.body.downvote

      },
      function (err, result) {
        if (err) throw err;

        if (result) {
          console.log(`[${req.session.user}] decrement-downcounter-increment-slight-up-counter`);
        }
      }
    );
  }
















  else if (req.body.action == 'increment-slightarrow-left') {
    console.log('increment-slightarrow-left');
    Post.update(
      {
        _id: req.params.id
      },
      {
        slightdownvotes: req.body.vote
      },
      function (err, result) {
        if (err) throw err;

        if (result) {
          console.log(`[${req.session.user}] slightdownvotes`);
        }
      }
    );
  }


  else if (req.body.action == 'decrement-slightarrow-left') {
    console.log('decrement-slightarrow-left');
    Post.update(
      {
        _id: req.params.id
      },
      {
        slightdownvotes: req.body.vote
      },
      function (err, result) {
        if (err) throw err;

        if (result) {
          console.log(`[${req.session.user}] decrement-slightarrow-left`);
        }
      }
    );
  }

  else if (req.body.action == 'decrement-offstate-slightarrow-right') {
    console.log('decrement-offstate-slightarrow-right');
    Post.update(
      {
        _id: req.params.id
      },
      {
        slightupvotes: req.body.vote
      },
      function (err, result) {
        if (err) throw err;

        if (result) {
          console.log(`[${req.session.user}] decrement-offstate-slightarrow-right`);
        }
      }
    );
  }


  else if (req.body.action == 'slightupvote-decrement-upvote-incremental') {
    console.log('slightupvote-decrement-upvote-incremental');
    Post.update(
      {
        _id: req.params.id
      },
      {
        upvotes: req.body.upvote,
        slightupvotes: req.body.slightupvote
      },
      function (err, result) {
        if (err) throw err;

        if (result) {
          console.log(`[${req.session.user}] slightupvote-decrement-upvote-incremental`);
        }
      }
    );
  }




  else if (req.body.action == 'slightdownvote-decrement-upvote-increment') {
    console.log('slightdownvote-decrement-upvote-increment');
    Post.update(
      {
        _id: req.params.id
      },
      {
        upvotes: req.body.upvote,
        slightdownvotes: req.body.slightdownvote
      },
      function (err, result) {
        if (err) throw err;

        if (result) {
          console.log(`[${req.session.user}] slightdownvote-decrement-upvote-increment`);
        }
      }
    );
  }















  else if (req.body.action == 'decrement-upvote-increment-slightdownvote') {
    console.log('decrement-upvote-increment-slightdownvote');
    Post.update(
      {
        _id: req.params.id
      },
      {
        upvotes: req.body.upvotecounter,
        slightdownvotes: req.body.downvotecounter
      },
      function (err, result) {
        if (err) throw err;

        if (result) {
          console.log(`[${req.session.user}] decrement-upvote-increment-slightdownvote`);
        }
      }
    );
  }


  else if (req.body.action == 'neutral-decrement-slightdownvote-increment') {
    console.log('neutral-decrement-slightdownvote-increment');
    Post.update(
      {
        _id: req.params.id
      },
      {
        neutralvotes: req.body.neutralvotes,
        slightdownvotes: req.body.downvotes
      },
      function (err, result) {
        if (err) throw err;

        if (result) {
          console.log(`[${req.session.user}] neutral-decrement-slightdownvote-increment`);
        }
      }
    );
  }

  else if (req.body.action == 'slightdownvote-decrement-neutralvote-increment') {
    console.log('slightdownvote-decrement-neutralvote-increment');
    Post.update(
      {
        _id: req.params.id
      },
      {
        neutralvotes: req.body.neutralvote,
        slightdownvotes: req.body.slightdownvote
      },
      function (err, result) {
        if (err) throw err;

        if (result) {
          console.log(`[${req.session.user}] slightdownvote-decrement-neutralvote-increment`);
        }
      }
    );
  }

  else if (req.body.action == 'slightarrowright-decrement-neutral-increment') {
    console.log('slightarrowright-decrement-neutral-increment');
    Post.update(
      {
        _id: req.params.id
      },
      {
        neutralvotes: req.body.neutralvote,
        slightupvotes: req.body.slightupvote
      },
      function (err, result) {
        if (err) throw err;

        if (result) {
          console.log(`[${req.session.user}] slightarrowright-decrement-neutral-increment`);
        }
      }
    );
  }


  else if (req.body.action == 'increment-slightdownvote-decrement-slight-upvote') {
    console.log('increment-slightdownvote-decrement-slight-upvote');
    Post.update(
      {
        _id: req.params.id
      },
      {
        slightupvotes: req.body.slightupvote,
        slightdownvotes: req.body.slightdownvote
      },
      function (err, result) {
        if (err) throw err;

        if (result) {
          console.log(`[${req.session.user}] increment-slightdownvote-decrement-slight-upvote`);
        }
      }
    );
  }


  else if (req.body.action == 'decrement-downvote-increment-slight-down-vote') {
    console.log('decrement-downvote-increment-slight-down-vote');
    Post.update(
      {
        _id: req.params.id
      },
      {
        downvotes: req.body.downvote,
        slightdownvotes: req.body.slightdownvote
      },
      function (err, result) {
        if (err) throw err;

        if (result) {
          console.log(`[${req.session.user}]decrement-downvote-increment-slight-down-vote`);
        }
      }
    );
  }

  else if (req.body.action == 'decrement-slightdownvote-increment-downvote') {
    console.log('decrement-slightdownvote-increment-downvote');
    Post.update(
      {
        _id: req.params.id
      },
      {
        downvotes: req.body.downvote,
        slightdownvotes: req.body.slightdownvote
      },
      function (err, result) {
        if (err) throw err;

        if (result) {
          console.log(`[${req.session.user}]decrement-slightdownvote-increment-downvote`);
        }
      }
    );
  }


  else if (req.body.action == 'slightarrow-decrement-downvote-increment') {
    console.log('slightarrow-decrement-downvote-increment');
    Post.update(
      {
        _id: req.params.id
      },
      {
        downvotes: req.body.downvote,
        slightupvotes: req.body.slightupvote
      },
      function (err, result) {
        if (err) throw err;

        if (result) {
          console.log(`[${req.session.user}] slightarrow-decrement-downvote-increment`);
        }
      }
    );
  }







  else if (req.body.action == 'decrement-Strong-increment-slight') {
    console.log('decrement-Strong-increment-slight');
    Post.update(
      {
        _id: req.params.id
      },
      {
        slightupvotes: req.body.slightvote,
        upvotes: req.body.vote
      },
      function (err, result) {
        if (err) throw err;

        if (result) {
          console.log(`[${req.session.user}] decrement-Strong-increment-slight`);
        }
      }
    );
  }

  else if (req.body.action == 'neutral-decrement-slightvote-increment') {
    console.log('neutral-decrement-slightvote-increment');
    Post.update(
      {
        _id: req.params.id
      },
      {
        neutralvotes: req.body.neutralvote,
        slightupvotes: req.body.slightvote
      },
      function (err, result) {
        if (err) throw err;

        if (result) {
          console.log(`[${req.session.user}] neutral-decrement-slightvote-increment`);
        }
      }
    );
  }


  else if (req.body.action == 'slightdownvote-decrement-slightupvote-increment') {
    console.log('slightdownvote-decrement-slightupvote-increment');
    Post.update(
      {
        _id: req.params.id
      },
      {
        slightdownvotes: req.body.slightdownvote,
        slightupvotes: req.body.slightupvote
      },
      function (err, result) {
        if (err) throw err;

        if (result) {
          console.log(`[${req.session.user}] slightdownvote-decrement-slightupvote-increment`);
        }
      }
    );
  }



  else if (req.body.action == 'upvote-offState-decrement') {
    console.log('upvote-offState-decrement');
    Post.update(
      {
        _id: req.params.id
      },
      {
        upvotes: req.body.vote
      },
      function (err, result) {
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
      function (err, result) {
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
      function (err, result) {
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
      function (err, result) {
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
      function (err, result) {
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
      function (err, result) {
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
      function (err, result) {
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
      function (err, result) {
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
      function (err, result) {
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
      function (err, result) {
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
      function (err, result) {
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


  PostState.findOneAndUpdate(query, update, options, function (err, result) {
    if (err) throw err;

    if (result) {
      console.log(`[${req.params.id}] post vote count changed!`);
      res.send('OK');
    }
  });
};
