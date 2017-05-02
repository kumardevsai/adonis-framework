'use strict'

/*
 * adonis-framework
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
*/

const { ServiceProvider } = require('@adonisjs/fold')

class ViewProvider extends ServiceProvider {
  /**
   * Register method called by the Ioc container
   * to register the provider
   *
   * @method register
   *
   * @return {void}
   */
  register () {
    this.app.singleton('Adonis/Src/View', (app) => {
      const Helpers = app.use('Adonis/Src/Helpers')
      const Config = app.use('Adonis/Src/Config')

      const View = require('../src/View')
      return new View(Helpers, Config.get('app.views.cache'))
    })
  }

  /**
   * Boot method called by the Ioc container to
   * boot the provider
   *
   * @method boot
   *
   * @return {void}
   */
  boot () {
    const Context = this.app.use('Adonis/Src/Context')

    /**
     * Registers an isolated instance of view on the
     * response object. Each view has access to
     * the request object.
     */
    Context.getter('view', function () {
      const View = use('Adonis/Src/View')
      const requestLocals = {
        request: this.request,
        url: this.request.url(),
        is: function (matchWith) {
          return this.url().replace(/^\/|\/$/) === matchWith.replace(/^\/|\/$/)
        }
      }
      return View.share(requestLocals)
    }, true)
  }
}

module.exports = ViewProvider
