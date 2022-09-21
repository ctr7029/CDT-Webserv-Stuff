/** @param {jQuery} $ jQuery Object */
!function ($, window, document, _undefined) {
    XF.romanize = function (num) {
        if (!+num){
            return false;
        }

        var digits = String(+num).split(""),
            key = ["","C","CC","CCC","CD","D","DC","DCC","DCCC","CM",
                "","X","XX","XXX","XL","L","LX","LXX","LXXX","XC",
                "","I","II","III","IV","V","VI","VII","VIII","IX"],
            roman = "",
            i = 3;

        while (i--)
        {
            roman = (key[+digits.pop() + (i * 10)] || "") + roman;
        }

        return Array(+digits.join("") + 1).join("M") + roman;
    };

    XF.isCanvasSupported = function ()
    {
        var elem = document.createElement('canvas');
        return !!(elem.getContext && elem.getContext('2d'));
    };

    XF.LevelChart = XF.Element.newHandler({
        options: {},

        init: function () {
            const $e = this.$target;
            if (XF.isCanvasSupported()) {
                $e.each(function (e) {
                    new EasyPieChart(this, {
                        barColor: '#e9be59',
                        trackColor: '#3d372c',
                        lineWidth: 3,
                        scaleColor: false,
                        size: 35
                    });
                });

                $e.tooltipster();
            } else {
                $e.hide();

                $('.level').show();
                $('.level').tooltipster();
            }
        }
    });

    XF.GameInfo = XF.Element.newHandler({
        options: {},

        init: function () {
            const $e = this.$target;

            const resize = function() {
                $('.gameInfo').css({
                    width: ($('.gameStatWrapper').width() - 75) + 'px',
                    marginLeft: (- $('.gameStatWrapper').width() - 75) + 'px'
                });

                $('.gameStatPanes').css({
                    width: ($('.gameStatWrapper').width()) + 'px'
                });
            };

            const close = function(event) {

                if (event)
                {
                    event.preventDefault();
                }

                $('.gameInfo').animate({
                    marginLeft: (- $('.gameStatWrapper').width() - 75) + 'px'
                }, 300);

                $('.gameStatPanes').animate({
                    opacity: 1
                }, 400);
            };

            const sideClose = function(event) {
                event.preventDefault();

                if ($('.gameStatPanes').css('opacity') != 1)
                {
                    close();
                }
            };

            const open = function(event) {
                event.preventDefault();

                var $content = $($(this).attr('data-content')).html();

                $('.gameInfo').html($content);

                $('.gameInfo').animate({
                    marginLeft: 0
                }, 400);

                $('.gameStatPanes').animate({
                    opacity: 0.5
                }, 400);

                if ($(document).scrollTop() > $('.gameInfo').offset().top)
                {
                    $("html, body").animate({scrollTop: $('.gameInfo').offset().top});
                }
            };

            $('.gameInfo').show();

            resize();

            $(window).bind('resize', resize);
            $e.on('click', '.back', close);
            $e.find('a.showGameStats').bind('click', open);
            $e.find('.gameStatPanes').on('click', sideClose);

            $('.guildInfo').tooltipster({
                delay: 150
            });
        }
    });

    XF.AchievementsSelect = XF.Element.newHandler({
        options: {},

        init: function () {
            const $parent = this.$target;

            function setSelectionTo(gameKey) {
                var item = $parent.find('ul li[data-key=' + gameKey + ']').first();
                $parent.find('button').text(item.data('name'));

                $('.player-achievements .panel.selected').removeClass('selected');
                $('.player-achievements .panel.game-' + gameKey).addClass('selected');
            }

            if (window.location.hash) {
                setSelectionTo(window.location.hash.substr(1));
            }

            var closeTimeout;

            $parent.find('button').click(function () {
                var ul = $parent.find('ul');

                ul.toggleClass('open');

                if (ul.hasClass('open')) {
                    if (closeTimeout) clearTimeout(closeTimeout);

                    ul.focus();
                }
            });

            $parent.find('ul').focusout(function () {
                closeTimeout = setTimeout(function () {
                    $parent.find('ul').removeClass('open');
                }, 250);
            });

            $parent.find('ul li a').click(function (e) {
                setSelectionTo(e.target.href.split("#")[1]);
                $parent.find('ul').removeClass('open');
            });
        }
    });

    XF.Achievements = XF.Element.newHandler({
        options: {},

        init: function () {
            const $parent = this.$target;

            $parent.find('li').each(function () {

                var $li = $(this);

                var name = $li.attr('data-name');
                var description = $li.attr('data-description');
                var amount = $li.attr('data-amount');
                var tier = $li.attr('data-tier');
                var title = $li.attr('data-title');

                if (amount) {
                    description = description.replace('%s', (!title || title === '') ? amount : title);
                }

                if (tier) {
                    name += ' ' + XF.romanize(tier);
                }

                var $content = $('<div><b>' + name + '</b><div class="achievementDescription">' + description + '</div><div class="state"></div></div>');

                if ($li.hasClass('completed')) {
                    $content.children('.state').html('Completed!').addClass('completed');
                } else {
                    if (amount) {
                        var progress = $li.attr('data-progress');

                        $content.children('.state').html(progress + ' / ' + amount).addClass('notCompletedProgress');
                    } else {
                        $content.children('.state').html('Not Completed').addClass('notCompleted');
                    }
                }

                $li.tooltipster({
                    content: $content,
                    position: 'top',
                    positionTracker: false,
                    delay: 0,
                    animation: 'fade',
                    speed: 0
                });

                var $icon = $li.children('.achievementIcon');

                var icon = new Image();
                icon.onload = function () {
                    $icon.css('backgroundImage', 'url(' + $icon.attr('data-icon') + ')');
                };
                icon.src = $icon.attr('data-icon');
            });
        }
    });

    XF.NewPlayers = XF.Element.newHandler({
        options: {},

        init: function () {
            const $e = this.$target;
            $e.find('li').tooltipster({
                speed: 0,
                delay: 0,
                offsetY: -12,
                offsetX: -4
            });
        }
    });

    XF.PlayerSearch = XF.Element.newHandler({
        options: {},

        init: function () {
            const $form = this.$target;

            $form.on('submit', function (event) {

                event.preventDefault();

                if ($form.find('input[name=q]').val().trim() == '') {
                    return;
                }

                $.ajax({
                    url: $form.attr('action'),
                    type: $form.attr('method'),
                    data: $form.serializeArray(),
                    success: function (data, textStatus, jqXHR) {
                        XF.redirect(this.url);
                    },
                    error: function (error) {
                        XF.alert('Player with that username not found!');
                    },
                    complete: function () {
                    }
                });
            });
        }
    });

    XF.Element.register('levelChart', 'XF.LevelChart');
    XF.Element.register('gameStatWrapper', 'XF.GameInfo');
    XF.Element.register('playerAchievementsSelect', 'XF.AchievementsSelect');
    XF.Element.register('achievements', 'XF.Achievements');
    XF.Element.register('playerWall', 'XF.NewPlayers');
    XF.Element.register('playerSearch', 'XF.PlayerSearch');
}(jQuery, window, document);