import VueI18n from 'vue-i18n'
import  messages  from 'src/i18n'
let i18n
export default ({ app, Vue }) => {
  Vue.use(VueI18n)
  app.i18n = new VueI18n({
    locale: 'it',
    fallbackLocale: 'it',
    messages
  })
  i18n = app.i18n
}
export { i18n }