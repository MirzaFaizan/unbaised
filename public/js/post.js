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
        let down_arrow = query.find(".fa-chevron-left")
        let post_user = query.find('.post-user').text()
        let neutralarrow = query.find('.fa-chevron-up');
        let neutralvotes = query.find('.neutralpost-votes');
        let rightarrow = query.find('.fa-chevron-right');
        let counter;
        let downcounter;
        let neutralcounter;

        let strongrightvotes = query.find('.upvote-post-votes');
        let slightupvotes = query.find('.slight-post-upvotes');
        let slightdownvotes = query.find('.slight-post-downvotes');
        let slightarrowright = query.find('.fa-chevron-circle-right');

        let slightarrowleft = query.find('.fa-chevron-circle-left');



        if (slightarrowright.hasClass('red')) {
            slightarrowright.removeClass('red');
            $(rightarrow).addClass("red");
            slightupvotecounter = slightupvotes.text();
            slightupvotes.text(--slightupvotecounter);
            counter = votes.text();
            votes.text(++counter);
            $.ajax({
                type: "put",
                data: {
                    slightupvote: slightupvotecounter,
                    upvote: counter,
                    state: "up",
                    action: "slightupvote-decrement-upvote-incremental",
                    user: post_user
                },
                url: `/vote/post/${ref}`,
                success: function (res) { }
            });
            return false;
        }


        if (slightarrowleft.hasClass('down-enabled')) {
            slightarrowleft.removeClass('down-enabled');
            $(rightarrow).addClass('red');
            slightdownvotecounter = slightdownvotes.text();
            slightdownvotes.text(--slightdownvotecounter);
            counter = votes.text();
            votes.text(++counter);
            $.ajax({
                type: "put",
                data: {
                    slightdownvote: slightdownvotecounter,
                    upvote: counter,
                    state: "up",
                    action: "slightdownvote-decrement-upvote-increment",
                    user: post_user
                },
                url: `/vote/post/${ref}`,
                success: function (res) { }
            });
            return false;
        }



















        // if upvote is already toggled and user presses it again, 
        // toggle off the upvote button and decrement vote.
        if ($(rightarrow).hasClass("red")) {
            counter = votes.text();
            votes.text(--counter);
            $(rightarrow).removeClass("red");
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
            $(rightarrow).addClass("red");
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
            $(rightarrow).addClass("red");
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

        else if (!$(rightarrow).hasClass("up-enabled")) {
            counter = votes.text();
            votes.text(++counter);
            $(rightarrow).addClass("red");

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






    $(".slightupvote-post").click(function () {
        let query = $(this).closest('article')
        let ref = query.data('ref')


        let down_arrow = query.find(".fa-chevron-left")
        let post_user = query.find('.post-user').text()
        let neutralarrow = query.find('.fa-chevron-up');

        let rightarrow = query.find('.fa-chevron-right');

        let strongrightvotes = query.find('.upvote-post-votes');
        let neutralvotes = query.find('.neutralpost-votes');
        let slightupvotes = query.find('.slight-post-upvotes');
        let downvotes = query.find('.downpost-votes');
        let slightdownvotes = query.find('.slight-post-downvotes');

        let slightarrowright = query.find('.fa-chevron-circle-right');


        let leftarrow = query.find('.fa-chevron-left');


        let slightarrowleft = query.find('.fa-chevron-circle-left');




        if (down_arrow.hasClass('down-enabled')) {
            console.log('tada')
            down_arrow.removeClass("down-enabled");
            $(slightarrowright).addClass("red");
            downcounter = downvotes.text();
            downvotes.text(--downcounter);
            slightupcounter = slightupvotes.text();
            slightupvotes.text(++slightupcounter);
            $.ajax({
                type: "put",
                data: {
                    slightupvote: slightupcounter,
                    downvote: downcounter,
                    state: "up-slight",
                    action: "decrement-downcounter-increment-slight-up-counter",
                    user: post_user
                },
                url: `/vote/post/${ref}`,
                success: function (res) { }
            });
            return false;
        }




        if ($(slightarrowleft).hasClass("down-enabled")) {
            slightarrowleft.removeClass("down-enabled");
            $(slightarrowright).addClass("red");
            slightupvotecounter = slightupvotes.text();
            slightupvotes.text(++slightupvotecounter);
            slightdownvotecounter = slightdownvotes.text();
            slightdownvotes.text(--slightdownvotecounter);
            $.ajax({
                type: "put",
                data: {
                    slightdownvote: slightdownvotecounter,
                    slightupvote: slightupvotecounter,
                    state: "up-slight",
                    action: "slightdownvote-decrement-slightupvote-increment",
                    user: post_user
                },
                url: `/vote/post/${ref}`,
                success: function (res) { }
            });
            return false;
        }




















        if ($(neutralarrow).hasClass("up-enabled")) {

            neutralarrow.removeClass("up-enabled");
            $(slightarrowright).addClass("red");
            neutralcounter = neutralvotes.text();
            neutralvotes.text(--neutralcounter);
            slightupvotecounter = slightupvotes.text();
            slightupvotes.text(++slightupvotecounter);
            $.ajax({
                type: "put",
                data: {
                    neutralvote: neutralcounter,
                    slightvote: slightupvotecounter,
                    state: "up-slight",
                    action: "neutral-decrement-slightvote-increment",
                    user: post_user
                },
                url: `/vote/post/${ref}`,
                success: function (res) { }
            });
            return false;
        }

        // if upvote is already toggled and user presses it again, 
        // toggle off the upvote button and decrement vote.
        if ($(rightarrow).hasClass("red")) {
            upvotecounter = strongrightvotes.text();
            strongrightvotes.text(--upvotecounter);
            slightupvotecounter = slightupvotes.text();
            slightupvotes.text(++slightupvotecounter)
            $(rightarrow).removeClass("red");
            $(slightarrowright).addClass("red");
            $.ajax({
                type: "put",
                url: `/vote/post/${ref}`,
                data: {
                    vote: upvotecounter,
                    slightvote: slightupvotecounter,
                    state: "up-slight",
                    action: "decrement-Strong-increment-slight",
                    user: post_user
                },
                success: function (res) { }
            });
            return false;
        }



        if (!$(slightarrowright).hasClass("red")) {
            counter = slightupvotes.text();
            slightupvotes.text(++counter);
            $(slightarrowright).addClass("red");
            $.ajax({
                type: "put",
                url: `/vote/post/${ref}`,
                data: {
                    vote: counter,
                    state: "up-slight",
                    action: "increment-slightarrow-right",
                    user: post_user
                },
                success: function (res) { }
            });
            return false;
        }


        if ($(slightarrowright).hasClass("red")) {
            counter = slightupvotes.text();
            slightupvotes.text(--counter);
            $(slightarrowright).removeClass("red");
            $.ajax({
                type: "put",
                url: `/vote/post/${ref}`,
                data: {
                    vote: counter,
                    state: "neutral",
                    action: "decrement-offstate-slightarrow-right",
                    user: post_user
                },
                success: function (res) { }
            });
            return false;
        }











    });





    $(".slightdownvote-post").click(function () {
        let query = $(this).closest('article')
        let ref = query.data('ref')
        let post_user = query.find('.post-user').text()
        let down_arrow = query.find(".fa-chevron-left");

        let neutralarrow = query.find('.fa-chevron-up');

        let rightarrow = query.find('.fa-chevron-right');

        let strongrightvotes = query.find('.upvote-post-votes');
        let neutralvotes = query.find('.neutralpost-votes');
        let slightupvotes = query.find('.slight-post-upvotes');
        let downvotes = query.find('.downpost-votes');
        let slightdownvotes = query.find('.slight-post-downvotes');

        let slightarrowright = query.find('.fa-chevron-circle-right');
        let slightarrowleft = query.find('.fa-chevron-circle-left');


        if (down_arrow.hasClass('down-enabled')) {
            down_arrow.removeClass("down-enabled");
            $(slightarrowleft).addClass("down-enabled");
            downcounter = downvotes.text();
            downvotes.text(--downcounter);
            slightdowncounter = slightdownvotes.text();
            slightdownvotes.text(++slightdowncounter);
            $.ajax({
                type: "put",
                data: {
                    downvote: downcounter,
                    slightdownvote: slightdowncounter,
                    state: "down-slight",
                    action: "decrement-downvote-increment-slight-down-vote",
                    user: post_user
                },
                url: `/vote/post/${ref}`,
                success: function (res) { }
            });
            return false;
        }



        if ($(slightarrowright).hasClass("red")) {
            slightarrowright.removeClass("red");
            $(slightarrowleft).addClass("down-enabled");
            slightupvotecounter = slightupvotes.text();
            slightupvotes.text(--slightupvotecounter);
            slightdownvotecounter = slightdownvotes.text();
            slightdownvotes.text(++slightdownvotecounter);
            $.ajax({
                type: "put",
                data: {
                    slightupvote: slightupvotecounter,
                    slightdownvote: slightdownvotecounter,
                    state: "down-slight",
                    action: "increment-slightdownvote-decrement-slight-upvote",
                    user: post_user
                },
                url: `/vote/post/${ref}`,
                success: function (res) { }
            });
            return false;
        }

















        if ($(neutralarrow).hasClass("up-enabled")) {
            neutralarrow.removeClass("up-enabled");
            $(slightarrowleft).addClass("down-enabled");
            neutralcounter = neutralvotes.text();
            neutralvotes.text(--neutralcounter);
            slightdownvotecounter = slightdownvotes.text();
            slightdownvotes.text(++slightdownvotecounter);
            $.ajax({
                type: "put",
                data: {
                    neutralvotes: neutralcounter,
                    downvotes: slightdownvotecounter,
                    state: "down-slight",
                    action: "neutral-decrement-slightdownvote-increment",
                    user: post_user
                },
                url: `/vote/post/${ref}`,
                success: function (res) { }
            });
            return false;
        }


        if ($(rightarrow).hasClass("red")) {
            upvotecounter = strongrightvotes.text();
            strongrightvotes.text(--upvotecounter);
            slightdownvotecounter = slightdownvotes.text();
            slightdownvotes.text(++slightdownvotecounter)
            $(rightarrow).removeClass("red");
            $(slightarrowleft).addClass("down-enabled");
            $.ajax({
                type: "put",
                url: `/vote/post/${ref}`,
                data: {
                    upvotecounter: upvotecounter,
                    downvotecounter: slightdownvotecounter,
                    state: "down-slight",
                    action: "decrement-upvote-increment-slightdownvote",
                    user: post_user
                },
                success: function (res) { }
            });
            return false;
        }



        if (!$(slightarrowleft).hasClass("down-enabled")) {
            console.log('object')
            counter = slightdownvotes.text();
            slightdownvotes.text(++counter);
            $(slightarrowleft).addClass("down-enabled");
            console.log(counter)
            $.ajax({
                type: "put",
                url: `/vote/post/${ref}`,
                data: {
                    vote: counter,
                    state: "down-slight",
                    action: "increment-slightarrow-left",
                    user: post_user
                },
                success: function (res) { }
            });
            return false;
        }


        if ($(slightarrowleft).hasClass("down-enabled")) {
            counter = slightdownvotes.text();
            slightdownvotes.text(--counter);
            $(slightarrowleft).removeClass("down-enabled");
            $.ajax({
                type: "put",
                url: `/vote/post/${ref}`,
                data: {
                    vote: counter,
                    state: "neutral",
                    action: "decrement-slightarrow-left",
                    user: post_user
                },
                success: function (res) { }
            });
            return false;
        }
    });



































    $(".downvote-post").click(function () {
        let query = $(this).closest('article')
        let ref = query.data('ref')
        let uparrow = query.find(".fa-chevron-right")
        let downvotes = query.find('.downpost-votes');
        let neutralarrow = query.find('.fa-chevron-up')
        let neutralvotes = query.find('.neutralpost-votes');
        let leftarrow = query.find('.fa-chevron-left');

        let post_user = query.find('.post-user').text()
        let votes = query.find('.upvote-post-votes');
        let counter;
        let neutralcounter;

        let slightupvotes = query.find('.slight-post-upvotes');
        let slightdownvotes = query.find('.slight-post-downvotes');
        let slightarrowright = query.find('.fa-chevron-circle-right');

        let slightarrowleft = query.find('.fa-chevron-circle-left');





        if (slightarrowleft.hasClass('down-enabled')) {
            slightarrowleft.removeClass("down-enabled");
            $(leftarrow).addClass("down-enabled");
            console.log('object')
            slightdownvotecounter = slightdownvotes.text();
            slightdownvotes.text(--slightdownvotecounter);
            counter = downvotes.text();
            downvotes.text(++counter);
            $.ajax({
                type: "put",
                data: {
                    slightdownvote: slightdownvotecounter,
                    downvote: counter,
                    state: "down",
                    action: "decrement-slightdownvote-increment-downvote",
                    user: post_user
                },
                url: `/vote/post/${ref}`,
                success: function (res) { }
            });
            return false;
        }


        if (slightarrowright.hasClass('red')) {
            console.log('object')
            slightarrowright.removeClass('red');
            $(leftarrow).addClass("down-enabled");
            slightupvotecounter = slightupvotes.text();
            slightupvotes.text(--slightupvotecounter);
            counter = downvotes.text();
            downvotes.text(++counter);
            $.ajax({
                type: "put",
                data: {
                    slightupvote: slightupvotecounter,
                    downvote: counter,
                    state: "down",
                    action: "slightarrow-decrement-downvote-increment",
                    user: post_user
                },
                url: `/vote/post/${ref}`,
                success: function (res) { }
            });
            return false;
        }













        if ($(leftarrow).hasClass("down-enabled")) {
            counter = 0;
            counter = downvotes.text();
            downvotes.text(--counter);
            $(leftarrow).removeClass("down-enabled");

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


        if (uparrow.hasClass('red')) {
            uparrow.removeClass("red");
            $(leftarrow).addClass("down-enabled");
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
            $(leftarrow).addClass("down-enabled");
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

        if (!$(leftarrow).hasClass("down-enabled")) {
            counter = downvotes.text();
            downvotes.text(++counter);
            $(leftarrow).addClass("down-enabled");

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



if ($('#auth').text() == 'true') {
    $(".neutralvote-post").click(function () {
        let query = $(this).closest('article');
        let ref = query.data('ref')
        let uparrow = query.find(".fa-chevron-right");
        let down_arrow = query.find(".fa-chevron-left");
        let neutralvotes = query.find('.neutralpost-votes')
        let post_user = query.find('.post-user').text()
        let downvotes = query.find('.downpost-votes');
        let upvotes = query.find('.upvote-post-votes');
        let neutralarrow = query.find('.fa-chevron-up');
        let counter;

        let strongrightvotes = query.find('.upvote-post-votes');

        let slightupvotes = query.find('.slight-post-upvotes');

        let slightdownvotes = query.find('.slight-post-downvotes');



        let slightarrowright = query.find('.fa-chevron-circle-right');
        let slightarrowleft = query.find('.fa-chevron-circle-left');




        if ($(slightarrowleft).hasClass("down-enabled")) {
            $(slightarrowleft).removeClass("down-enabled");


            slightdownvotescounter = slightdownvotes.text();
            slightdownvotes.text(--slightdownvotescounter);

            neutralvotecounter = neutralvotes.text();
            neutralvotes.text(++neutralvotecounter);


            $(neutralarrow).addClass("up-enabled");
            $.ajax({
                type: "put",
                data: {
                    neutralvote: neutralvotecounter,
                    slightdownvote: slightdownvotescounter,
                    state: "down-neutral",
                    action: "slightdownvote-decrement-neutralvote-increment",
                    user: post_user
                },
                url: `/vote/post/${ref}`,
                success: function (res) { }
            });
            return false;
        }





        if ($(slightarrowright).hasClass("red")) {
            $(slightarrowright).removeClass("red");


            slightupvotescounter = slightupvotes.text();
            slightupvotes.text(--slightupvotescounter);

            neutralvotecounter = neutralvotes.text();
            neutralvotes.text(++neutralvotecounter);


            $(neutralarrow).addClass("up-enabled");
            $.ajax({
                type: "put",
                data: {
                    slightupvote: slightupvotescounter,
                    neutralvote: neutralvotecounter,
                    state: "down-neutral",
                    action: "slightarrowright-decrement-neutral-increment",
                    user: post_user
                },
                url: `/vote/post/${ref}`,
                success: function (res) { }
            });
            return false;
        }










        if ($(neutralarrow).hasClass("up-enabled")) {
            counter = 0;
            counter = neutralvotes.text();
            neutralvotes.text(--counter);
            $(neutralarrow).removeClass("up-enabled");
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

        if (uparrow.hasClass('red')) {
            uparrow.removeClass("red");
            $(neutralarrow).addClass("up-enabled");
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
            $(neutralarrow).addClass("up-enabled");
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
        if (!$(neutralarrow).hasClass("up-enabled")) {
            counter = neutralvotes.text();
            neutralvotes.text(++counter);
            $(neutralarrow).addClass("up-enabled");

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
}

