// Procurando botão e adicionando listener:
document.querySelector("#add-time")
.addEventListener('click', cloneField)

function cloneField() {
    //console.log("Chequei aqui")
    
    // Duplicando nó:
    const newFieldContainer = document.querySelector('.schedule-item').cloneNode(true)    // True inclui filhos.

    // Limpando horários:
    const fields = newFieldContainer.querySelectorAll('input')  // Selecionando nós tipo "input"
    fields.forEach(function(field) {
        field.value = ""
    }
    )

    fields[0].value = ""
    fields[1].value = ""

    document.querySelector('#schedule-items').appendChild(newFieldContainer)


}
