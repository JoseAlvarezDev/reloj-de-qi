const Alexa = require('ask-sdk-core');
const relojData = require('./data/reloj-data.json');

// ============ UTILIDADES ============

// Obtener la hora actual en España (Europe/Madrid)
function obtenerHoraEspana() {
    const ahora = new Date();
    // Convertir a hora de España
    const opciones = { timeZone: 'Europe/Madrid', hour: '2-digit', minute: '2-digit', hour12: false };
    const horaEspana = ahora.toLocaleString('es-ES', opciones);
    const [hora, minutos] = horaEspana.split(':').map(Number);

    // Crear una nueva fecha con la hora de España
    const fechaEspana = new Date();
    fechaEspana.setHours(hora, minutos, 0, 0);

    return { fecha: fechaEspana, hora, minutos, horaFormateada: horaEspana };
}

function obtenerMeridianoActual(fecha = null) {
    const { hora, minutos } = fecha ?
        { hora: fecha.getHours(), minutos: fecha.getMinutes() } :
        obtenerHoraEspana();

    const horaDecimal = hora + (minutos / 60);

    const periodos = [
        { inicio: 3, fin: 5, indice: 0 },   // Pulmón
        { inicio: 5, fin: 7, indice: 1 },   // Intestino Grueso
        { inicio: 7, fin: 9, indice: 2 },   // Estómago
        { inicio: 9, fin: 11, indice: 3 },  // Bazo
        { inicio: 11, fin: 13, indice: 4 }, // Corazón
        { inicio: 13, fin: 15, indice: 5 }, // Intestino Delgado
        { inicio: 15, fin: 17, indice: 6 }, // Vejiga
        { inicio: 17, fin: 19, indice: 7 }, // Riñón
        { inicio: 19, fin: 21, indice: 8 }, // Pericardio
        { inicio: 21, fin: 23, indice: 9 }, // Triple Calentador
        { inicio: 23, fin: 25, indice: 10 }, // Vesícula (23-01)
        { inicio: 1, fin: 3, indice: 11 }   // Hígado
    ];

    let horaAjustada = horaDecimal;
    if (horaDecimal >= 0 && horaDecimal < 1) {
        horaAjustada = horaDecimal + 24;
    }

    for (const periodo of periodos) {
        if (horaAjustada >= periodo.inicio && horaAjustada < periodo.fin) {
            return relojData.meridianos[periodo.indice];
        }
    }

    if (horaDecimal >= 1 && horaDecimal < 3) {
        return relojData.meridianos[11];
    }

    return relojData.meridianos[0];
}

function obtenerProximoMeridiano() {
    const actual = obtenerMeridianoActual();
    const indiceActual = relojData.meridianos.findIndex(m => m.id === actual.id);
    const indiceSiguiente = (indiceActual + 1) % 12;
    return relojData.meridianos[indiceSiguiente];
}

function obtenerMeridianoPorHora(horaStr) {
    const match = horaStr.match(/(\d{1,2}):?(\d{2})?/);
    if (!match) return null;

    const hora = parseInt(match[1]);
    const fecha = new Date();
    fecha.setHours(hora, 0, 0, 0);

    return obtenerMeridianoActual(fecha);
}

function buscarMeridianoPorNombre(nombre) {
    const nombreLower = nombre.toLowerCase();
    return relojData.meridianos.find(m =>
        m.organo.toLowerCase().includes(nombreLower)
    );
}

function obtenerFraseAleatoria() {
    const frases = relojData.frasesMotivacionales;
    return frases[Math.floor(Math.random() * frases.length)];
}

function obtenerConsejoAleatorio(meridiano) {
    const consejos = meridiano.consejos;
    return consejos[Math.floor(Math.random() * consejos.length)];
}

// ============ HANDLERS ============

const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
    },
    handle(handlerInput) {
        const meridiano = obtenerMeridianoActual();

        const speakOutput = `<speak>
            <amazon:emotion name="excited" intensity="medium">¡Bienvenido al Reloj de Qi!</amazon:emotion>
            <break time="300ms"/>
            
            Soy tu guía del Reloj Orgánico Chino, un sistema milenario de la Medicina Tradicional China 
            que revela cómo la energía vital, el Qi, fluye por tu cuerpo en ciclos de 2 horas.
            <break time="500ms"/>
            
            Según esta sabiduría ancestral, cada uno de los 12 órganos principales tiene un momento 
            del día en el que está en su máximo poder.
            <break time="500ms"/>
            
            Ahora mismo, entre las ${meridiano.horaInicio} y las ${meridiano.horaFin}, 
            el meridiano del ${meridiano.organo} está en su punto máximo de energía, 
            asociado al elemento ${meridiano.elemento}.
            <break time="500ms"/>
            
            <amazon:emotion name="excited" intensity="low">¿Qué puedes preguntarme?</amazon:emotion>
            <break time="200ms"/>
            
            Dime: ¿qué órgano está activo?, dame un consejo, ¿qué debería comer?, 
            guíame en una meditación, dame un ejercicio de Qi Gong, 
            o si te despiertas siempre a la misma hora, dime: me despierto a las 3 de la mañana, 
            y te explicaré qué órgano puede necesitar atención.
            <break time="300ms"/>
            
            ¿Qué te gustaría saber?
        </speak>`;

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt('Puedes preguntarme qué órgano está activo, pedir un consejo, o decirme que te guíe en una meditación. ¿Qué te gustaría?')
            .getResponse();
    }
};

const OrganoActualIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'OrganoActualIntent';
    },
    handle(handlerInput) {
        const meridiano = obtenerMeridianoActual();
        const speakOutput = `Ahora mismo, entre las ${meridiano.horaInicio} y las ${meridiano.horaFin}, ` +
            `el meridiano del ${meridiano.organo} está en su punto máximo de energía. ` +
            `En chino se llama ${meridiano.organoChino}. ` +
            `Pertenece al elemento ${meridiano.elemento} y su función principal es: ${meridiano.funcion} ` +
            `¿Te gustaría un consejo para este momento?`;

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt('¿Quieres un consejo o más información?')
            .getResponse();
    }
};

const ProximoPeriodoIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'ProximoPeriodoIntent';
    },
    handle(handlerInput) {
        const proximo = obtenerProximoMeridiano();
        const speakOutput = `El próximo período será el del ${proximo.organo}, ` +
            `que comenzará a las ${proximo.horaInicio} y durará hasta las ${proximo.horaFin}. ` +
            `Este meridiano está asociado al elemento ${proximo.elemento}. ` +
            `Te recomiendo: ${obtenerConsejoAleatorio(proximo)}`;

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt('¿Hay algo más que quieras saber?')
            .getResponse();
    }
};

const ConsejoActualIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'ConsejoActualIntent';
    },
    handle(handlerInput) {
        const meridiano = obtenerMeridianoActual();
        const consejo = obtenerConsejoAleatorio(meridiano);
        const speakOutput = `Para este momento del ${meridiano.organo}, te recomiendo: ${consejo}. ` +
            `Recuerda que estás en el período del elemento ${meridiano.elemento}. ` +
            `${obtenerFraseAleatoria()}`;

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt('¿Quieres otro consejo o alguna información adicional?')
            .getResponse();
    }
};

const AlimentosIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AlimentosIntent';
    },
    handle(handlerInput) {
        const meridiano = obtenerMeridianoActual();
        const alimentos = meridiano.alimentos.slice(0, 4).join(', ');
        const speakOutput = `Para el período del ${meridiano.organo}, los alimentos recomendados son: ${alimentos}. ` +
            `El sabor asociado a este meridiano es el ${meridiano.sabor}. ` +
            `Recuerda que el ${meridiano.organo} pertenece al elemento ${meridiano.elemento}.`;

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt('¿Quieres saber algo más?')
            .getResponse();
    }
};

const SintomaHoraIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'SintomaHoraIntent';
    },
    handle(handlerInput) {
        const slots = handlerInput.requestEnvelope.request.intent.slots;
        const horaSlot = slots.hora ? slots.hora.value : null;

        if (!horaSlot) {
            return handlerInput.responseBuilder
                .speak('No entendí la hora. ¿A qué hora sueles despertarte?')
                .reprompt('Dime a qué hora te despiertas, por ejemplo, a las 3 de la mañana.')
                .getResponse();
        }

        const meridiano = obtenerMeridianoPorHora(horaSlot);
        if (!meridiano) {
            return handlerInput.responseBuilder
                .speak('No pude procesar esa hora. ¿Podrías repetirla?')
                .reprompt('Dime la hora en formato simple, como las 3 de la mañana.')
                .getResponse();
        }

        const sintomas = meridiano.sintomas.slice(0, 2).join('. ');
        const speakOutput = `Despertarte entre las ${meridiano.horaInicio} y las ${meridiano.horaFin} ` +
            `está relacionado con el meridiano del ${meridiano.organo}. ` +
            `Esto puede indicar: ${sintomas}. ` +
            `La emoción asociada es: ${meridiano.emocion}. ` +
            `Te sugiero: ${obtenerConsejoAleatorio(meridiano)}`;

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt('¿Hay algo más que quieras saber?')
            .getResponse();
    }
};

const DesperteAhoraIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'DesperteAhoraIntent';
    },
    handle(handlerInput) {
        const meridiano = obtenerMeridianoActual();
        const { horaFormateada } = obtenerHoraEspana();

        const sintomas = meridiano.sintomas.slice(0, 2).join('. ');
        const speakOutput = `<speak>
            Interesante que te hayas despertado ahora, a las ${horaFormateada}.
            <break time="300ms"/>
            
            En este momento, el meridiano del ${meridiano.organo} está en su máximo de actividad.
            Según la Medicina Tradicional China, despertar durante este período puede indicar:
            <break time="300ms"/>
            ${sintomas}.
            <break time="500ms"/>
            
            La emoción asociada a este órgano es: ${meridiano.emocion}.
            Pero cuando está en equilibrio, representa: ${meridiano.emocionPositiva}.
            <break time="500ms"/>
            
            Mi consejo para ti ahora: ${obtenerConsejoAleatorio(meridiano)}
            <break time="300ms"/>
            
            ¿Te gustaría un ejercicio de respiración o una meditación para volver a dormir?
        </speak>`;

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt('¿Quieres que te guíe en una meditación para relajarte?')
            .getResponse();
    }
};


const EjercicioQiGongIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'EjercicioQiGongIntent';
    },
    handle(handlerInput) {
        const meridiano = obtenerMeridianoActual();
        const speakOutput = `<speak>Aquí tienes un ejercicio de Qi Gong para el ${meridiano.organo}. ` +
            `<break time="500ms"/> Ponte cómodo y respira profundamente. ` +
            `<break time="1s"/> ${meridiano.ejercicioQiGong} ` +
            `<break time="500ms"/> Repite este ejercicio de 3 a 5 veces. ` +
            `${obtenerFraseAleatoria()}</speak>`;

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt('¿Te gustaría una meditación guiada o más información?')
            .getResponse();
    }
};

const MeditacionIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'MeditacionIntent';
    },
    handle(handlerInput) {
        const meridiano = obtenerMeridianoActual();
        const speakOutput = `<speak>Vamos a hacer una breve meditación para el ${meridiano.organo}. ` +
            `<break time="500ms"/> Cierra los ojos y respira profundamente. ` +
            `<break time="2s"/> Inhala... <break time="2s"/> Exhala... ` +
            `<break time="2s"/> ${meridiano.meditacion} ` +
            `<break time="2s"/> Mantén esta visualización durante unos momentos. ` +
            `<break time="3s"/> Cuando estés listo, abre suavemente los ojos. ` +
            `Que tu energía fluya en armonía.</speak>`;

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt('¿Hay algo más en lo que pueda ayudarte?')
            .getResponse();
    }
};

const ExplicaOrganoIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'ExplicaOrganoIntent';
    },
    handle(handlerInput) {
        const slots = handlerInput.requestEnvelope.request.intent.slots;
        const organoSlot = slots.organo ? slots.organo.value : null;

        if (!organoSlot) {
            return handlerInput.responseBuilder
                .speak('¿Sobre qué órgano te gustaría saber? Por ejemplo, hígado, corazón o pulmón.')
                .reprompt('Dime el nombre de un órgano.')
                .getResponse();
        }

        const meridiano = buscarMeridianoPorNombre(organoSlot);
        if (!meridiano) {
            return handlerInput.responseBuilder
                .speak(`No encontré información sobre ${organoSlot}. Prueba con otro órgano como corazón, hígado o riñón.`)
                .reprompt('¿Sobre qué órgano quieres saber?')
                .getResponse();
        }

        const speakOutput = `El meridiano del ${meridiano.organo}, en chino ${meridiano.organoChino}, ` +
            `está activo entre las ${meridiano.horaInicio} y las ${meridiano.horaFin}. ` +
            `Pertenece al elemento ${meridiano.elemento} y la estación ${meridiano.estacion}. ` +
            `Su función es: ${meridiano.funcion} ` +
            `La emoción asociada es ${meridiano.emocion}, pero en equilibrio representa ${meridiano.emocionPositiva}.`;

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt('¿Quieres saber sobre otro órgano?')
            .getResponse();
    }
};

const FraseMotivacionalIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'FraseMotivacionalIntent';
    },
    handle(handlerInput) {
        const frase = obtenerFraseAleatoria();
        const speakOutput = `<speak><prosody rate="slow">${frase}</prosody></speak>`;

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt('¿Te gustaría otra frase de sabiduría?')
            .getResponse();
    }
};

const HelpIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
        const speakOutput = 'Soy tu guía del Reloj Orgánico Chino. Puedes preguntarme: ' +
            '¿Qué órgano está activo ahora? Dame un consejo. ¿Qué debería comer? ' +
            'Dame un ejercicio de Qi Gong. Guíame en una meditación. ' +
            'O cuéntame sobre un órgano específico como el hígado o el corazón. ' +
            '¿Qué te gustaría saber?';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt('¿Qué te gustaría saber?')
            .getResponse();
    }
};

const CancelAndStopIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && (Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.CancelIntent'
                || Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.StopIntent');
    },
    handle(handlerInput) {
        const speakOutput = 'Que tu Qi fluya en armonía. ¡Hasta pronto!';
        return handlerInput.responseBuilder.speak(speakOutput).getResponse();
    }
};

const FallbackIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.FallbackIntent';
    },
    handle(handlerInput) {
        const speakOutput = 'Lo siento, no entendí eso. Puedes preguntarme qué órgano está activo, ' +
            'pedir un consejo, un ejercicio de Qi Gong o una meditación. ¿Qué te gustaría?';
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt('¿En qué puedo ayudarte?')
            .getResponse();
    }
};

const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'SessionEndedRequest';
    },
    handle(handlerInput) {
        console.log(`Sesión terminada: ${JSON.stringify(handlerInput.requestEnvelope)}`);
        return handlerInput.responseBuilder.getResponse();
    }
};

const ErrorHandler = {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) {
        console.log(`Error: ${error.message}`);
        const speakOutput = 'Hubo un problema procesando tu solicitud. Por favor, inténtalo de nuevo.';
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt('¿Puedo ayudarte con algo más?')
            .getResponse();
    }
};

// ============ EXPORT ============

exports.handler = Alexa.SkillBuilders.custom()
    .addRequestHandlers(
        LaunchRequestHandler,
        OrganoActualIntentHandler,
        ProximoPeriodoIntentHandler,
        ConsejoActualIntentHandler,
        AlimentosIntentHandler,
        SintomaHoraIntentHandler,
        DesperteAhoraIntentHandler,
        EjercicioQiGongIntentHandler,
        MeditacionIntentHandler,
        ExplicaOrganoIntentHandler,
        FraseMotivacionalIntentHandler,
        HelpIntentHandler,
        CancelAndStopIntentHandler,
        FallbackIntentHandler,
        SessionEndedRequestHandler
    )
    .addErrorHandlers(ErrorHandler)
    .lambda();
