import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import { en, hi, mr } from "./translations";


const resources ={
    en:{
        translation:en,
    },
    mr:{
        translation:mr,
    },
    hi:{
        translation:hi
    }
}

i18next.use(initReactI18next).init({
    debug:true,
    compatibilityJSON: 'v3',
    lng:'en',
    fallbackLng:'en',
    interpolation:{
        escapeValue:false,
    },
    resources,
})

export default i18next;