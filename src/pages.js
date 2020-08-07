const Database = require('./database/db')
const { subjects, weekdays, getSubject, convertHoursToMinutes } = require('./utils/format') // const {} desestrutura dados. Ou seja, importa variáveis e funções com seus próprios nomes.

// When get requisiton is made, returns function with (requisition and response) parameters.
function pageLanding(req, res) {
    return res.render("index.html")
}

async function pageStudy(req, res) {
    const filters = req.query

    // Se algum campo está vazio, só retorna a página.
    if ( !filters.subject || !filters.weekday || !filters.time ) {
        return res.render("study.html", { filters, subjects, weekdays})
    }

    // Convertendo horas em minutos:
    const timeToMinutes = convertHoursToMinutes(filters.time)

    const query = `
        SELECT classes.*, proffys.*
        FROM proffys
        JOIN classes ON classes.proffy_id = proffys.id
        WHERE EXISTS(
            SELECT class_schedule.*
            FROM class_schedule
            WHERE class_schedule.class_id = classes.id
            AND class_schedule.weekday = ${filters.weekday}
            AND class_schedule.time_from <= ${timeToMinutes}
            AND class_schedule.time_to > ${timeToMinutes}
        )
        AND classes.subject = '${filters.subject}'
        `

        // Caso haja erro na consuta do DB:
        try {
            const db = await Database
            const proffys = await db.all(query)

            // Pegando nome da matéria:
            proffys.map( (proffy) => {
                proffy.subject = getSubject(proffy.subject)
            } )

            return res.render(
                // Which html file to render:
                "study.html",               
                // Sending vars to html:
                {
                    proffys,
                    filters,
                    subjects,
                    weekdays
                }
                )   
        }
        catch (error) {
            console.log(error)
        }
}
function pageGiveClasses(req, res) {
    return res.render(
        "give-classes.html",
        {
            subjects,
            weekdays
        }
        )
}

async function saveClasses(req, res) {

        const createProffy = require('./database/createProffy')

        // const data = req.query   // Informações aparecem na url.

        // Usando body, informações ficam escondidas.
        const proffyValue = {
            name: req.body.name,
            avatar: req.body.avatar,
            whatsapp: req.body.whatsapp,
            bio: req.body.bio
        }

        const classValue = {
            subject: req.body.subject,
            cost: req.body.cost,
        }

        const classScheduleValues = req.body.weekday.map((weekday, index) => {
                return {
                    weekday, // Equivalente a weekday: weekday
                    time_from: convertHoursToMinutes(req.body.time_from[index]),
                    time_to: convertHoursToMinutes(req.body.time_to[index])
                }
        })

        try {
            const db = await Database
            await createProffy(db, { proffyValue,  classValue, classScheduleValues})
        
            let queryString = "?subject=" + req.body.subject
            queryString += "&weekday=" + req.body.weekday[0]
            queryString += "&time=" + req.body.time_from[0]
        
            return res.redirect("/study" + queryString)
        }
        catch (error) {
            console.log(error)
        }

}

module.exports = {
    pageLanding,
    pageStudy,
    pageGiveClasses, 
    saveClasses
}