# TODO-list

## v0.x (master)

## v1.x (develop)

* Add support for JSON result (instead of HTML) on success / error
  * Add environement variable `RESPONSE_TYPE` to change default behavior
  * Add form variable `_response_type` to change form behavior
  * Use appropriate response type in success response rendering
  * Use appropriate response type in error response rendering

* Remove external CDN dependencies on runtime
  * Include local bootstrap

## Future

* Remove server-side rendering
  * Add VUE.JS support + webpack/parcel
  * Add API endpoints to manage messages on /admin
  * Add static pages using vueJS to consume the management API
  * Remove pug pages

