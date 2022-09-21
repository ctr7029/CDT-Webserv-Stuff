/** @param {jQuery} $ jQuery Object */
!function ($, window, document, _undefined) {

    XF.JoinAnimation = XF.Element.newHandler({
        options: {},

        init: function () {
            const $container = this.$target;
            var ip = $container.attr('data-ip');
            var $ipContainer = $container.find('.join-ip');
            var $ip = $container.find('.ip-value');
            var $joinButton = $container.find('.join-button');

            var copyClient = new ClipboardJS($ipContainer.get(0));
            var original = $('.join-tooltip').text();

            copyClient.on('success', function (event) {
                $('.join-tooltip').text('Copied!');

                setTimeout(function () {
                    $('.join-tooltip').text(original);
                }, 3000);
            });

            $ipContainer.on('mouseenter', function (event) {
                $ipContainer.addClass('state-hover');
            }).on('mouseleave', function (event) {
                $ipContainer.removeClass('state-hover');
            });

            function writeIp(ip, cb) {
                var ipState = '';

                for (var i = 0; i < ip.length; ++i) {
                    (function (i) {
                        setTimeout(function () {
                            ipState += ip[i];
                            $ip.text(ipState);
                            $joinButton.removeClass('state-disabled');

                            if (i + 1 >= ip.length) {
                                cb();
                            }
                        }, 150 * i);
                    })(i);
                }
            }

            function start() {
                $ip.html(' ');

                $joinButton.removeClass('state-hover');
                $joinButton.addClass('state-disabled');

                setTimeout(function () {
                    writeIp(ip, function () {
                        setTimeout(function () { $joinButton.addClass('state-hover'); }, 500);
                        setTimeout(function () { $joinButton.removeClass('state-hover'); }, 1000);
                        setTimeout(function () { $joinButton.addClass('state-hover'); }, 1500);
                        setTimeout(function () { $joinButton.removeClass('state-hover'); }, 2000);
                        setTimeout(function () { $joinButton.addClass('state-hover'); }, 2500);
                        setTimeout(function () { $joinButton.removeClass('state-hover'); }, 3000);
                        setTimeout(function () { $joinButton.addClass('state-hover'); }, 3500);
                        setTimeout(function () { start(); }, 5000);
                    });
                }, 1000);
            }

            start();
        }
    });

    XF.Element.register('joinInstructions', 'XF.JoinAnimation');

}(jQuery, window, document);
