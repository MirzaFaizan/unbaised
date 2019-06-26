$("document").ready(function () {
    autosize($('.comment-text'))

    $(".edit-post").click(function () {
        let query = $(this).closest('article')
        let ref = query.data('ref')

        let body = query.find('.post-body').text()
        let options = query.find('.post-options')
        query.find('.post-body').html(`<textarea class="form-control post-text">${body}</textarea>`)
        query.find('.post-body').append("<br><button class='btn btn-primary mr-1 edit_submit'>Save</button><button class='btn btn-primary edit_cancel'>Cancel</button>");
        autosize(query.find('.post-text'))

        options.hide();

        $("button.edit_cancel").click(function () {
            let text = body;

            query.find(".post-text").remove();
            query.find(".post-body").text(text)

            options.show();
        })

        $("button.edit_submit").click(function () {
            let new_text = query.find('.post-text').val();

            $.ajax({
                type: "put",
                url: `/edit/post/${ref}`,
                data: {
                    text: new_text
                }
            }).done(function (res) {
                query.find(".post-text").remove();
                query.find(".post-body").text(new_text)
                options.show();
            })
        })
        return false;
    });

    $(".delete-post").click(function () {
        let query = $(this).closest('article')
        let ref = query.data('ref')

        if (confirm("Are you sure you want to delete?")) {
            $.ajax({
                type: "delete",
                url: `/delete/post/${ref}`,
            }).done(function (res) {
                query.remove();
            })
        }
        return false;
    });

    $(".save-post").click(function () {
        let query = $(this).closest('article')
        let ref = query.data('ref')
        let that = $(this)

        if ($(this).text() == "save") {
            $.ajax({
                type: "put",
                url: `/save/post/${ref}`
            }).done(function (res) {
                if (res == "success") {
                    that.text('unsave');
                    return false;
                }
            })
        } else if ($(this).text() == "unsave") {
            $.ajax({
                type: "put",
                url: `/unsave/post/${ref}`,
            }).done(function (res) {
                if (res == "success") {
                    that.text('save');
                    return false;
                }
            })
        }
        return false;
    });

    $(".upvote-post").click(function () {
        let query = $(this).closest('article')
        let ref = query.data('ref')
        let votes = query.find('.upvote-post-votes')
        let downvotes = query.find('.downpost-votes')
        let down_arrow = query.find(".downvote-post")
        let post_user = query.find('.post-user').text()
        let neutralarrow = query.find('.neutralvote-post')
        let neutralvotes = query.find('.neutralpost-votes');
        let counter;
        let downcounter;
        let neutralcounter;
        // if upvote is already toggled and user presses it again, 
        // toggle off the upvote button and decrement vote.
        if ($(this).hasClass("up-enabled")) {
            counter = votes.text();
            votes.text(--counter);
            $(this).removeClass("up-enabled");
            $.ajax({
                type: "put",
                url: `/vote/post/${ref}`,
                data: {
                    vote: counter,
                    state: "neutral",
                    action: "upvote-offState-decrement",
                    user: post_user
                },
                success: function (res) { }
            });
            return false;
        }

        if (neutralarrow.hasClass('up-enabled')) {
            neutralarrow.removeClass("up-enabled");
            $(this).addClass("up-enabled");
            neutralcounter = neutralvotes.text();
            neutralvotes.text(--neutralcounter);
            counter = votes.text();
            votes.text(++counter);
            $.ajax({
                type: "put",
                data: {
                    neutralvote: neutralcounter,
                    upvote: counter,
                    state: "up",
                    action: "neutral-decrement-upvote-increment",
                    user: post_user
                },
                url: `/vote/post/${ref}`,
                success: function (res) { }
            });
            return false;
        } 






















        // if downvote is already toggled while upvote is pressed
        // toggle off downvote and increment vote
        if (down_arrow.hasClass('down-enabled')) {
            down_arrow.removeClass("down-enabled");
            $(this).addClass("up-enabled");
            downcounter = downvotes.text();
            downvotes.text(--downcounter);
            counter = votes.text();
            votes.text(++counter);
            $.ajax({
                type: "put",
                data: {
                    downvote: downcounter,
                    vote: counter,
                    state: "up",
                    action: "decrement-downvote-increment-upvote",
                    user: post_user
                },
                url: `/vote/post/${ref}`,
                success: function (res) { }
            });
            return false;
        }

        else if (!$(this).hasClass("up-enabled")) {
            counter = votes.text();
            votes.text(++counter);
            $(this).addClass("up-enabled");

            $.ajax({
                type: "put",
                data: {
                    vote: counter,
                    state: "up",
                    action: "upvote-increment",
                    user: post_user
                },
                url: `/vote/post/${ref}`,
                success: function (res) { }
            });
        }
        return false;
    });


    $(".downvote-post").click(function () {
        let query = $(this).closest('article')
        let ref = query.data('ref')
        let uparrow = query.find(".upvote-post")
        let downvotes = query.find('.downpost-votes');
        let neutralarrow = query.find('.neutralvote-post')
        let neutralvotes = query.find('.neutralpost-votes');
        
        let post_user = query.find('.post-user').text()
        let votes = query.find('.upvote-post-votes');
        let counter;
        let neutralcounter;
        // if downvote is already toggled and user presses it again, 
        // toggle off the downvote button and increment vote.
        if ($(this).hasClass("down-enabled")) {
            counter = 0;
            counter = downvotes.text();
            downvotes.text(--counter);
            $(this).removeClass("down-enabled");

            $.ajax({
                type: "put",
                data: {
                    vote: counter,
                    state: "neutral",
                    action: "downvote-toggle-increment",
                    user: post_user
                },
                url: `/vote/post/${ref}`,
                success: function (res) { }
            });
            return false;
        }


        if (uparrow.hasClass('up-enabled')) {
            uparrow.removeClass("up-enabled");
            $(this).addClass("down-enabled");
            downcounter = downvotes.text();
            downvotes.text(++downcounter);
            counter = votes.text();
            votes.text(--counter);
            $.ajax({
                type: "put",
                data: {
                    downvote: downcounter,
                    vote: counter,
                    state: "down",
                    action: "upvote-decrement-downvote-increment",
                    user: post_user
                },
                url: `/vote/post/${ref}`,
                success: function (res) { }
            });
            return false;
        } 

        
        if (neutralarrow.hasClass('up-enabled')) {
            neutralarrow.removeClass("up-enabled");
            $(this).addClass("down-enabled");
            neutralcounter = neutralvotes.text();
            neutralvotes.text(--neutralcounter);
            counter = downvotes.text();
            downvotes.text(++counter);
            $.ajax({
                type: "put",
                data: {
                    neutralvote: neutralcounter,
                    downvote: counter,
                    state: "down",
                    action: "neutral-decrement-downvote-increment",
                    user: post_user
                },
                url: `/vote/post/${ref}`,
                success: function (res) { }
            });
            return false;
        } 

         if (!$(this).hasClass("down-enabled")) {
            counter = downvotes.text();
            downvotes.text(++counter);
            $(this).addClass("down-enabled");

            $.ajax({
                type: "put",
                data: {
                    vote: counter,
                    state: "down",
                    action: "downvote-increment",
                    user: post_user
                },
                url: `/vote/post/${ref}`,
                success: function (res) { }
            });
        }
        return false;
    });
});



// Neutral Button.
$(".neutralvote-post").click(function () {
    let query = $(this).closest('article');
    let ref = query.data('ref')
    let uparrow = query.find(".upvote-post");
    let down_arrow = query.find(".downvote-post");
    let neutralvotes = query.find('.neutralpost-votes')
    let post_user = query.find('.post-user').text()
    let downvotes = query.find('.downpost-votes');
    let upvotes = query.find('.upvote-post-votes');
    let counter;
    // if downvote is already toggled and user presses it again, 
    // toggle off the downvote button and increment vote.
    if ($(this).hasClass("up-enabled")) {
        counter = 0;
        counter = neutralvotes.text();
        neutralvotes.text(--counter);
        $(this).removeClass("up-enabled");
        $.ajax({
            type: "put",
            data: {
                vote: counter,
                state: "neutral",
                action: "neutral-downvote-toggle-increment",
                user: post_user
            },
            url: `/vote/post/${ref}`,
            success: function (res) { }
        });
        return false;
    }

    if (uparrow.hasClass('up-enabled')) {
        uparrow.removeClass("up-enabled");
        $(this).addClass("up-enabled");
        neutralcounter = neutralvotes.text();
        neutralvotes.text(++neutralcounter);
        counter = upvotes.text();
        upvotes.text(--counter);
        $.ajax({
            type: "put",
            data: {
                neutralvote: neutralcounter,
                vote: counter,
                state: "down-neutral",
                action: "upvote-decrement-neutral-increment",
                user: post_user
            },
            url: `/vote/post/${ref}`,
            success: function (res) { }
        });
        return false;
    } 

    if (down_arrow.hasClass('down-enabled')) {
        down_arrow.removeClass("down-enabled");
        $(this).addClass("up-enabled");
        neutralcounter = neutralvotes.text();
        neutralvotes.text(++neutralcounter);
        counter = downvotes.text();
        downvotes.text(--counter);
        $.ajax({
            type: "put",
            data: {
                neutralvote: neutralcounter,
                vote: counter,
                state: "down-neutral",
                action: "downvote-decrement-neutral-increment",
                user: post_user
            },
            url: `/vote/post/${ref}`,
            success: function (res) { }
        });
        return false;
    } 
    // if upvote is already toggled while downvote is pressed
    // toggle off upvote and decrement vote
     if (!$(this).hasClass("up-enabled")) {
        counter = neutralvotes.text();
        neutralvotes.text(++counter);
        $(this).addClass("up-enabled");

        $.ajax({
            type: "put",
            data: {
                vote: counter,
                state: "down-neutral",
                action: "neutral-downvote-increment",
                user: post_user
            },
            url: `/vote/post/${ref}`,
            success: function (res) { }
        });
    }
    return false;
});
