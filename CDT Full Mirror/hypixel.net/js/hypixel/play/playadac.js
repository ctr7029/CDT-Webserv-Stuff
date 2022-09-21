/** @param {jQuery} $ jQuery Object */
!function ($, window, document, _undefined) {
    XF.preloadImages = function (images) {
        for (var i = 0; i < images.length; ++i) {
            var img = new Image();
            img.src = images[i];
        }
    };

    XF.CopyIP = XF.Element.newHandler({
        options: {},

        init: function () {
            var client = new ClipboardJS(this.$target.get(0));
        }
    });

    XF.VideoBackground = XF.Element.newHandler({
        options: {},

        init: function () {
            const $div = this.$target;
            var $video = $div.find('video');

            if (!$video.get(0).canPlayType || !$video.get(0).canPlayType('video/mp4')) {
                $video.remove();
                $div.addClass('tilePlayBackgroundNoVideo');
            } else {
                $video.get(0).onloadedmetadata = function () {
                    $video.animate({
                        opacity: 1
                    });
                };
            }
        }
    });

    XF.GameSelector = XF.Element.newHandler({
        options: {},

        init: function () {
            const $wrapper = this.$target;
            let selected = $wrapper.find('li.active').first().attr('data-game');
            let animating = false;
            let queue = [];
            let bgWrapper = 'section2Bg';

            const selectGame = function (event) {
                var $e = $(event.currentTarget);

                if ($e.attr('data-game') === selected) {
                    return;
                }

                if (animating) {
                    queue.push(event);
                    return;
                }

                animating = true;

                // Animate First Column
                var current = $('#gameInfo .infoPane .dynamicWrapper[data-game="' + selected + '"]');
                var newCurrent = $('#gameInfo .infoPane .dynamicWrapper[data-game="' + $e.attr('data-game') + '"]');

                if (newCurrent.length === 0) {
                    animating = false;
                    return;
                }

                var currentBg = null;
                var newBg = null;

                if (bgWrapper === 'section2Bg') {
                    currentBg = $('.section2Bg');
                    newBg = $('.section2Bg2');

                    bgWrapper = 'section2Bg2';
                }
                else {
                    currentBg = $('.section2Bg2');
                    newBg = $('.section2Bg');

                    bgWrapper = 'section2Bg';
                }

                newBg.css({
                    backgroundImage: 'url(' + $e.attr('data-bg') + ')'
                });

                currentBg.animate({
                    opacity: 0
                });
                newBg.animate({
                    opacity: 0.5
                });

                newCurrent.insertAfter(current);

                newCurrent.addClass('active');
                newCurrent.css({
                    marginTop: 0,
                    opacity: 0
                });
                newCurrent.animate({
                    opacity: 1
                });
                current.animate({
                    marginTop: (- (current.height())) + 'px',
                    opacity: 0
                }, function () {
                    current.removeClass('active');
                });

                // Animate Second Column
                var current2 = $('#gameInfo .artPane .dynamicWrapper[data-game="' + selected + '"]');
                var newCurrent2 = $('#gameInfo .artPane .dynamicWrapper[data-game="' + $e.attr('data-game') + '"]');

                newCurrent2.insertBefore(current2);

                newCurrent2.addClass('active');
                newCurrent2.css({
                    marginTop: (- (current2.height())) + 'px',
                    opacity: 0
                });
                current2.animate({
                    opacity: 0
                });
                newCurrent2.animate({
                    marginTop: 0,
                    opacity: 1
                }, function () {
                    current2.removeClass('active');

                    animating = false;

                    if (queue.length > 0) {
                        selectGame(queue.shift());
                    }
                });

                // End animate

                $wrapper.find('li').removeClass('active');

                $e.addClass('active');

                selected = $e.attr('data-game');
            }

            var images = [];

            $('#games li').each(function () {
                images.push($(this).attr('data-bg'));
            });

            XF.preloadImages(images);

            $wrapper.find('li').tooltipster({
                delay: 10,
                speed: 0
            });

            $wrapper.find('li').on('click', selectGame);
        }
    });

    XF.FeatureSelector = XF.Element.newHandler({
        options: {},

        init: function () {
            let $wrapper = this.$target;
            let selected = $wrapper.find('li.active').first().attr('data-feature');
            let animating = false;
            let queue = [];

            const updateLayout = function () {
                if ($(window).width() < 600) {
                    $('#featureInfo .theInfo').css({
                        width: $(window).width()
                    });
                } else {
                    $('#featureInfo .theInfo').css({
                        width: 450
                    });
                }
            };

            const selectFeature = function (event) {
                var $e = $(event.currentTarget);

                event.preventDefault();

                if ($e.attr('data-feature') === selected) {
                    return;
                }

                if (animating) {
                    queue.push(event);
                    return;
                }

                animating = true;

                // Animate First Column
                var current = $('#featureInfo .theInfo[data-feature="' + selected + '"]');
                var newCurrent = $('#featureInfo .theInfo[data-feature="' + $e.attr('data-feature') + '"]');

                if (newCurrent.length === 0) {
                    animating = false;
                    return;
                }

                newCurrent.insertAfter(current);

                newCurrent.addClass('active');
                newCurrent.css({
                    marginLeft: 0,
                    opacity: 1
                });
                newCurrent.animate({
                    opacity: 1
                }, 250);
                current.animate({
                    marginLeft: (- (current.width())) + 'px',
                    opacity: 1
                }, 250, function () {
                    current.removeClass('active');
                });

                // Animate Art
                var current2 = $('#featureInfo .theArt[data-feature="' + selected + '"]');
                var newCurrent2 = $('#featureInfo .theArt[data-feature="' + $e.attr('data-feature') + '"]');

                newCurrent2.insertBefore(current2);

                newCurrent2.addClass('active');
                newCurrent2.css({
                    marginTop: (- (current2.width())) + 'px',
                    opacity: 0
                });
                newCurrent2.animate({
                    opacity: 1,
                    marginTop: 0
                });
                current2.animate({
                    opacity: 0
                }, function () {
                    current2.removeClass('active');

                    setTimeout(function () {
                        animating = false;
                        if (queue.length > 0) {
                            selectFeature(queue.shift());
                        }
                    }, 50);
                });

                // End animate

                $wrapper.find('li').removeClass('active');

                $e.addClass('active');

                selected = $e.attr('data-feature');
            }

            $wrapper.find('li').on('click', selectFeature);

            updateLayout();

            $(window).bind('resize', updateLayout);
        }
    });

    XF.PlayTrailer = XF.Element.newHandler({
        options: {},

        init: function () {
            const $button = this.$target;
            var tag = document.createElement('script');

            tag.src = "https://www.youtube.com/iframe_api";

            var firstScriptTag = document.getElementsByTagName('script')[0];
            firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

            var clicked = false;

            $button.on('click', function () {
                if (clicked) {
                    return;
                }

                clicked = true;

                $button.addClass('clicked');

                var video = $button.children().attr('data-video');

                $button.children().fadeIn();

                if (!XF.Trailer || typeof XF.Trailer.playVideo != 'function') {
                    setTimeout(function () {
                        XF.Trailer.playVideo();
                    }, 1000);
                    return;
                }

                XF.Trailer.playVideo();
            });
        }
    });

    XF.HowTo = XF.Element.newHandler({
        options: {},

        init: function () {
            const $e = this.$target;
            let visible = false;

            const openBox = function (event) {
                visible = true;

                event.preventDefault();

                $('#howToPlay').fadeIn(400);

                setTimeout(function () {
                    if (visible) {
                        $('#howToPlay').find('video').get(0).currentTime = 0;
                        $('#howToPlay').find('video').get(0).play();
                    }
                }, 1000);
            };

            const closeBox = function (event) {
                visible = false;

                event.preventDefault();

                $('#howToPlay').fadeOut(400);

                $('#howToPlay').find('video').get(0).pause();
                $('#howToPlay').find('video').get(0).currentTime = 0;
            };

            $e.find('.howButton').bind('click', openBox);
            $e.find('#howToPlay .close').bind('click', closeBox);
        }
    });

    XF.preloadImages([
        '/styles/hypixel-uix/hypixel/video-button-hover.png'
    ]);

    XF.Trailer = null;
    XF.onYouTubeFinish = function () {
        XF.trailer = new YT.Player('youtube-trailer', {
            height: '298',
            width: '530',
            playerVars: {
                autohide: 1,
                loop: 1,
                showinfo: false
            },
            videoId: 'bkWHyz1MmaQ',
            events: {
                onReady: function () { },
                onStateChange: function (event) {
                    if (event.data == YT.PlayerState.PLAYING) {
                        var $video = $('.trailerContainer');

                        $video.css({
                            zIndex: 500
                        });

                        $('#cinema').fadeIn();
                    } else {
                        $('#cinema').fadeOut(40);
                    }
                }
            }
        });
    }

    XF.FeaturedVideo = XF.Element.newHandler({
        options: {},

        init: function () {
            const $link = this.$target;
            $link.on('click', function (event) {
                event.preventDefault();

                if (!XF.featuredVideo) {
                    XF.featuredVideo = new YT.Player('featuredVideoPlayer', {
                        height: '100%',
                        width: '100%',
                        playerVars: {
                            autohide: 1,
                            loop: 0,
                            showinfo: false
                        },
                        videoId: $link.data('video-id'),
                        events: {
                            onReady: function () {
                                XF.featuredVideo.playVideo();
                            }
                        }
                    });
                } else {
                    XF.featuredVideo.loadVideoById($link.data('video-id'));
                }

                $('#featuredVideoModal').fadeIn();
            });
        }
    });

    XF.FeaturedVideoModal = XF.Element.newHandler({
        options: {},

        init: function () {
            $modal = this.$target;
            closeVideo = function () {
                $modal.fadeOut();
                XF.featuredVideo.stopVideo();
            };

            $modal.on('click', function (event) {
                if (event.target != this) return;
                closeVideo();
            });

            $modal.find('i.close').on('click', closeVideo);

            $(document).keyup(function (event) {
                if (event.keyCode === 27) {
                    closeVideo();
                }
            });
        }
    });

    XF.Element.register('games', 'XF.GameSelector');
    XF.Element.register('featureSelector', 'XF.FeatureSelector');
    XF.Element.register('playTrailer', 'XF.PlayTrailer');
    XF.Element.register('featuredVideoLink', 'XF.FeaturedVideo');
    XF.Element.register('featuredVideoModal', 'XF.FeaturedVideoModal');
    XF.Element.register('section1', 'XF.HowTo');
}(jQuery, window, document);

var onYouTubeIframeAPIReady = XF.onYouTubeFinish;
